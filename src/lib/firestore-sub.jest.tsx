import { act, render } from '@testing-library/react';
import React from 'react';
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
		const callback = onSnapshot.mock.calls[0][0];
		act(() =>
			callback({
				exists: false,
				data: () => null,
			})
		);
		expect(container).toHaveTextContent('Error: DOCUMENT_DOES_NOT_EXIST');
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
		const { pending, data } = useTestQuery(a, b);
		if (pending) return <div>Pending</div>;
		if (!data || !data.length) return <div>Empty</div>;
		return <div>{data.map(d => d.data).join(' ')}</div>;
	}

	// Mock firebase doc ref's onSnapshot
	const onSnapshot = jest.fn();
	const unsubscribe = jest.fn();
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
		const callback = onSnapshot.mock.calls[0][0];

		// Initial ordering
		const docA = { id: 'a', exists: true, data: () => 'A' };
		const docB = { id: 'b', exists: true, data: () => 'B' };
		const docC = { id: 'c', exists: true, data: () => 'C' };
		act(() =>
			callback({
				empty: false,
				docs: [docA, docB, docC],
				docChanges: () => [
					{ type: 'added', oldIndex: -1, newIndex: 0, doc: docA },
					{ type: 'added', oldIndex: -1, newIndex: 1, doc: docB },
					{ type: 'added', oldIndex: -1, newIndex: 2, doc: docC },
				],
			})
		);
		expect(container).toHaveTextContent('A B C');

		// Test how doc changes update query
		const docD = { id: 'd', exists: true, data: () => 'D' };
		const docC2 = { id: 'c', exists: true, data: () => 'c' };
		act(() =>
			callback({
				empty: false,
				docs: [docC2, docA, docD],
				docChanges: () => [
					{ type: 'modified', oldIndex: 2, newIndex: 0, doc: docC2 },
					{ type: 'removed', oldIndex: 2, newIndex: -1, doc: docB },
					{ type: 'added', oldIndex: -1, newIndex: 2, doc: docD },
				],
			})
		);
		expect(container).toHaveTextContent('c A D');
	});

	it('handles empty state correctly', () => {
		const { container } = render(<TestComponent a="a" b="b" />);
		const callback = onSnapshot.mock.calls[0][0];

		act(() =>
			callback({
				empty: true,
				docs: [],
				docChanges: () => [],
			})
		);
		expect(container).toHaveTextContent('Empty');
	});
});
