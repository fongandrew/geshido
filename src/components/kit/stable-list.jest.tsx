import React from 'react';
import { render } from '@testing-library/react';
import { StableList } from './stable-list';

describe('StableList', () => {
	const renderItem = ({ name }: { id: string; name: string }) => name;
	const listFromItems = (items: { id: string; name: string }[]) => (
		<StableList
			items={items}
			renderItem={renderItem}
			data-testid="stable-list"
		/>
	);

	let renderResult: ReturnType<typeof render>;
	const renderList = (items: { id: string; name: string }[]) => {
		renderResult = render(listFromItems(items));
		return renderResult;
	};
	const rerenderItems = (items: { id: string; name: string }[]) => {
		renderResult.rerender(listFromItems(items));
	};
	const assertText = (text: string) =>
		expect(renderResult.getByTestId('stable-list')).toHaveTextContent(text);

	beforeEach(() => {
		renderList([
			{ id: 'A', name: 'A' },
			{ id: 'B', name: 'B' },
			{ id: 'C', name: 'C' },
		]);
	});

	it('renders a list on initial render', () => {
		assertText('ABC');
	});

	it('updates item content but preserves order on re-render', () => {
		// Re-order
		rerenderItems([
			{ id: 'B', name: 'B' },
			{ id: 'C', name: 'C' },
			{ id: 'A', name: 'A' },
		]);
		assertText('ABC');

		// Update value -- do a second re-render because previous tests
		// weren't catching a bug with multiple re-renders
		rerenderItems([
			{ id: 'B', name: 'Bb' },
			{ id: 'C', name: 'C' },
			{ id: 'A', name: 'A' },
		]);
		assertText('ABbC');
	});

	it('appends new additions on re-render', () => {
		rerenderItems([
			{ id: 'A', name: 'A' },
			{ id: 'D', name: 'D' },
			{ id: 'B', name: 'B' },
			{ id: 'C', name: 'C' },
		]);
		assertText('ABCD');
	});

	it('removes items on deletion', () => {
		rerenderItems([{ id: 'A', name: 'A' }, { id: 'C', name: 'C' }]);
		assertText('AC');
	});
});
