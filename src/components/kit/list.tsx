/**
 * Wrapper around a list element -- can be use later for virtualized
 * scrolling, etc.
 */
import React from 'react';
import { DataProps } from './data-attrs';

export interface Props<T extends { id: string }> extends DataProps {
	className?: string;
	items: T[];
	renderItem: (item: T) => React.ReactNode;
}

export function List<T extends { id: string }>(props: Props<T>) {
	const { items, renderItem, ...rest } = props;
	return (
		<ul {...rest}>
			{items.map(item => (
				<li
					key={item.id}
					data-testid="list__item"
					data-itemid={item.id}
				>
					{renderItem(item)}
				</li>
			))}
		</ul>
	);
}
