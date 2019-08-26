import React from 'react';
import { last, times } from 'lodash';
import { act, render } from '@testing-library/react';
import { db } from './firebase';
import { useSelector } from './firestore-selector';
import { useDocument, useQuery } from './firestore-sub';

jest.mock('./firebase', () => {
	const mockDoc = jest.fn();
	const mockWhere = jest.fn();
	return {
		db: {
			collection: () => ({
				doc: mockDoc,
				where: mockWhere,
			}),
		},
	};
});

const getMockDoc = () => db.collection('test').doc as jest.Mock;
const getMockWhere = () => db.collection('test').where as jest.Mock;

describe('Firestore document subscription hook', () => {
	function useTestDoc(a: string, b: string) {
		const docRef = useSelector(
			(aStr, bStr) => db.collection('test').doc(`${aStr}-${bStr}`),
			[a, b]
		);
		return useDocument<string>(docRef);
	}

	function TestComponent({ a, b }: { a: string; b: string }) {
		const { error, pending, data } = useTestDoc(a, b);
		if (pending) return <div>Pending</div>;
		if (error) return <div>{String(error)}</div>;
		return <div>{data}</div>;
	}

	// Mock firebase doc ref's onSnapshot
	const onSnapshot = jest.fn();
	const unsubscribe = jest.fn();

	const simulateSnapshot = (snapshot: any) => {
		const callback = last(onSnapshot.mock.calls)[0];
		act(() => callback(snapshot));
	};

	const simulateError = (err: Error) => {
		const onError = last(onSnapshot.mock.calls)[1];
		act(() => {
			onError(err);
			jest.runAllTimers();
		});
	};

	beforeEach(() => {
		// Use extra closure because we're simulating the Firestore behavior of
		// not returning reference equal document references ever
		onSnapshot.mockImplementation(() => () => unsubscribe());
		getMockDoc().mockImplementation(id => ({ id, onSnapshot }));
	});

	it('subscribes on render', () => {
		render(<TestComponent a="a" b="b" />);
		expect(onSnapshot).toHaveBeenCalledTimes(1);
		expect(unsubscribe).not.toHaveBeenCalled();
	});

	it('unsubscribes on unmount', () => {
		const { unmount } = render(<TestComponent a="a" b="b" />);
		unmount();
		expect(unsubscribe).toHaveBeenCalled();
	});

	it('resubscribes if props change query', () => {
		const { rerender } = render(<TestComponent a="a" b="b" />);
		rerender(<TestComponent a="a" b="c" />);
		expect(onSnapshot).toHaveBeenCalledTimes(2);
		expect(unsubscribe).toHaveBeenCalledTimes(1);
	});

	it("does not resubscribe if props don't change query", () => {
		const { rerender } = render(<TestComponent a="a" b="b" />);
		rerender(<TestComponent a="a" b="b" />);
		expect(onSnapshot).toHaveBeenCalledTimes(1);
		expect(unsubscribe).not.toHaveBeenCalled();
	});

	it('starts out as pending', () => {
		const { container } = render(<TestComponent a="a" b="b" />);
		expect(container).toHaveTextContent('Pending');
	});

	it('updates on snapshot', () => {
		const { container } = render(<TestComponent a="a" b="b" />);
		const callback = onSnapshot.mock.calls[0][0];
		act(() =>
			callback({
				exists: true,
				data: () => 'Hello firestore-sub',
			})
		);
		expect(container).toHaveTextContent('Hello firestore-sub');
	});

	it('handles non-existent state', () => {
		const { container } = render(<TestComponent a="a" b="b" />);
		simulateSnapshot({
			exists: false,
			data: () => null,
		});
		expect(container).toHaveTextContent('Error: DOCUMENT_DOES_NOT_EXIST');
	});

	it('retries subscription for permission errors', () => {
		const { container } = render(<TestComponent a="a" b="b" />);
		simulateError(new Error('Missing or insufficient permissions.'));

		expect(container).toHaveTextContent('Pending');
		expect(onSnapshot).toHaveBeenCalledTimes(2);

		simulateSnapshot({
			exists: true,
			data: () => 'Hello firestore-sub',
		});
		expect(container).toHaveTextContent('Hello firestore-sub');
	});

	it('sets error state for not permissable error', () => {
		jest.spyOn(console, 'error').mockImplementation(() => {});
		const { container } = render(<TestComponent a="a" b="b" />);
		simulateError(new Error('Is broken'));

		expect(container).toHaveTextContent('Is broken');
		expect(onSnapshot).toHaveBeenCalledTimes(1);
	});

	it('sets error state after retries exhausted', () => {
		jest.spyOn(console, 'error').mockImplementation(() => {});
		const { container } = render(<TestComponent a="a" b="b" />);

		// Exhaust initial retries
		times(4, () => {
			simulateError(new Error('Missing or insufficient permissions.'));
			expect(container).toHaveTextContent('Pending');
		});
		expect(onSnapshot).toHaveBeenCalledTimes(5);

		// Last retry
		simulateError(new Error('Missing or insufficient permissions.'));
		expect(container).toHaveTextContent(
			'Missing or insufficient permissions.'
		);
		expect(onSnapshot).toHaveBeenCalledTimes(5);
	});

	it('resets error state after successful subscription', () => {
		const { container } = render(<TestComponent a="a" b="b" />);

		// Don't cross max number of retries
		times(3, () => {
			simulateError(new Error('Missing or insufficient permissions.'));
			expect(container).toHaveTextContent('Pending');
		});
		expect(onSnapshot).toHaveBeenCalledTimes(4);

		// Success
		simulateSnapshot({
			exists: true,
			data: () => 'Hello firestore-sub',
		});
		expect(container).toHaveTextContent('Hello firestore-sub');

		// Retry again, last value remains unchanged
		times(3, () => {
			simulateError(new Error('Missing or insufficient permissions.'));
			expect(container).toHaveTextContent('Hello firestore-sub');
		});
		expect(onSnapshot).toHaveBeenCalledTimes(7);
	});
});

describe('Firestore query subscription hook', () => {
	function useTestQuery(a: string, b: string) {
		const query = useSelector(
			(aStr, bStr) => db.collection('test').where(aStr, '==', bStr),
			[a, b]
		);
		return useQuery<string>(query);
	}

	function TestComponent({ a, b }: { a: string; b: string }) {
		const { pending, error, data } = useTestQuery(a, b);
		if (pending) return <div>Pending</div>;
		if (error) return <div>{String(error)}</div>;
		if (!data || !data.length) return <div>Empty</div>;
		return <div>{data.map(d => d.data).join(' ')}</div>;
	}

	// Mock firebase doc ref's onSnapshot
	const onSnapshot = jest.fn();
	const unsubscribe = jest.fn();

	const simulateSnapshot = (snapshot: any) => {
		const callback = last(onSnapshot.mock.calls)[0];
		act(() => callback(snapshot));
	};

	const simulateError = (err: Error) => {
		const onError = last(onSnapshot.mock.calls)[1];
		act(() => {
			onError(err);
			jest.runAllTimers();
		});
	};

	beforeEach(() => {
		// Use extra closure because we're simulating the Firestore behavior of
		// not returning reference equal document references ever
		onSnapshot.mockImplementation(() => () => unsubscribe());
		getMockWhere().mockImplementation(() => ({ onSnapshot }));
	});

	it('subscribes on render', () => {
		render(<TestComponent a="a" b="b" />);
		expect(onSnapshot).toHaveBeenCalledTimes(1);
		expect(unsubscribe).not.toHaveBeenCalled();
	});

	it('unsubscribes on unmount', () => {
		const { unmount } = render(<TestComponent a="a" b="b" />);
		unmount();
		expect(unsubscribe).toHaveBeenCalled();
	});

	it('resubscribes if props change query', () => {
		const { rerender } = render(<TestComponent a="a" b="b" />);
		rerender(<TestComponent a="a" b="c" />);
		expect(onSnapshot).toHaveBeenCalledTimes(2);
		expect(unsubscribe).toHaveBeenCalledTimes(1);
	});

	it("does not resubscribe if props don't change query", () => {
		const { rerender } = render(<TestComponent a="a" b="b" />);
		rerender(<TestComponent a="a" b="b" />);
		expect(onSnapshot).toHaveBeenCalledTimes(1);
		expect(unsubscribe).not.toHaveBeenCalled();
	});

	it('starts out as pending', () => {
		const { container } = render(<TestComponent a="a" b="b" />);
		expect(container).toHaveTextContent('Pending');
	});

	it('updates incrementally on snapshot', () => {
		const { container } = render(<TestComponent a="a" b="b" />);

		// Initial ordering
		const docA = { id: 'a', exists: true, data: () => 'A' };
		const docB = { id: 'b', exists: true, data: () => 'B' };
		const docC = { id: 'c', exists: true, data: () => 'C' };
		simulateSnapshot({
			empty: false,
			docs: [docA, docB, docC],
			docChanges: () => [
				{ type: 'added', oldIndex: -1, newIndex: 0, doc: docA },
				{ type: 'added', oldIndex: -1, newIndex: 1, doc: docB },
				{ type: 'added', oldIndex: -1, newIndex: 2, doc: docC },
			],
		});
		expect(container).toHaveTextContent('A B C');

		// Test how doc changes update query
		const docD = { id: 'd', exists: true, data: () => 'D' };
		const docC2 = { id: 'c', exists: true, data: () => 'c' };
		simulateSnapshot({
			empty: false,
			docs: [docC2, docA, docD],
			docChanges: () => [
				{ type: 'modified', oldIndex: 2, newIndex: 0, doc: docC2 },
				{ type: 'removed', oldIndex: 2, newIndex: -1, doc: docB },
				{ type: 'added', oldIndex: -1, newIndex: 2, doc: docD },
			],
		});
		expect(container).toHaveTextContent('c A D');
	});

	it('handles empty state correctly', () => {
		const { container } = render(<TestComponent a="a" b="b" />);
		simulateSnapshot({
			empty: true,
			docs: [],
			docChanges: () => [],
		});
		expect(container).toHaveTextContent('Empty');
	});

	it('retries subscription for permission errors', () => {
		const { container } = render(<TestComponent a="a" b="b" />);
		simulateError(new Error('Missing or insufficient permissions.'));

		expect(container).toHaveTextContent('Pending');
		expect(onSnapshot).toHaveBeenCalledTimes(2);

		simulateSnapshot({
			empty: true,
			docs: [],
			docChanges: () => [],
		});
		expect(container).toHaveTextContent('Empty');
	});

	it('sets error state for not permissable error', () => {
		jest.spyOn(console, 'error').mockImplementation(() => {});
		const { container } = render(<TestComponent a="a" b="b" />);
		simulateError(new Error('Is broken'));

		expect(container).toHaveTextContent('Is broken');
		expect(onSnapshot).toHaveBeenCalledTimes(1);
	});

	it('sets error state after retries exhausted', () => {
		jest.spyOn(console, 'error').mockImplementation(() => {});
		const { container } = render(<TestComponent a="a" b="b" />);

		// Exhaust initial retries
		times(4, () => {
			simulateError(new Error('Missing or insufficient permissions.'));
			expect(container).toHaveTextContent('Pending');
		});
		expect(onSnapshot).toHaveBeenCalledTimes(5);

		// Last retry
		simulateError(new Error('Missing or insufficient permissions.'));
		expect(container).toHaveTextContent(
			'Missing or insufficient permissions.'
		);
		expect(onSnapshot).toHaveBeenCalledTimes(5);
	});

	it('resets error state after successful subscription', () => {
		const { container } = render(<TestComponent a="a" b="b" />);

		// Don't cross max number of retries
		times(3, () => {
			simulateError(new Error('Missing or insufficient permissions.'));
			expect(container).toHaveTextContent('Pending');
		});
		expect(onSnapshot).toHaveBeenCalledTimes(4);

		// Success
		simulateSnapshot({
			empty: true,
			docs: [],
			docChanges: () => [],
		});
		expect(container).toHaveTextContent('Empty');

		// Retry again, last value remains unchanged
		times(3, () => {
			simulateError(new Error('Missing or insufficient permissions.'));
			expect(container).toHaveTextContent('Empty');
		});
		expect(onSnapshot).toHaveBeenCalledTimes(7);
	});
});
