import React, { useState } from 'react';
import { List, Props as ListProps } from './list';

/**
 * A StableList is the same as a List component, except that it keeps elements
 * in the same order as each re-render. New elements are appended to the end.
 *
 * Why? Having stuff jump around when you're trying to click is pretty annoying.
 * We still want the indvidual elements to update, so a re-render is good
 * but no items jumping around until un-mount / re-mount.
 */
export function StableList<T extends { id: string }>(props: ListProps<T>) {
	// Memo-ized item set from previous render in the order they were rendered
	const [orderedItems, setOrderedItems] = useState<T[]>(props.items);

	// Reference to items from previous set -- this is used only to compare
	// to previous props to see if we need to update ordering
	const [items, setItems] = useState<T[]>(props.items);

	// Items have changed, reconcile order as applicable
	if (items !== props.items) {
		// Map from existing items
		const itemMap = new Map<string, T>();
		orderedItems.forEach(item => {
			itemMap.set(item.id, item);
		});

		// Generate set from new items to track deletes below.
		// Add to current item map too to append any new keys.
		const keysInProps = new Set<string>();
		props.items.forEach(item => {
			const { id } = item;
			itemMap.set(id, item);
			keysInProps.add(id);
		});

		// Remove keys not in current props
		orderedItems.forEach(item => {
			if (!keysInProps.has(item.id)) {
				itemMap.delete(item.id);
			}
		});

		// Memoize new set of items to pass to list. It is OK to call setState
		// from within a render function with hooks (this is the hooks
		// equivalent of getDerivedStateFromProps).
		// https://reactjs.org/docs/hooks-faq.html#how-do-i-implement-getderivedstatefromprops
		setItems(props.items);
		setOrderedItems(Array.from(itemMap.values()));
	}

	return <List {...props} items={orderedItems} />;
}
