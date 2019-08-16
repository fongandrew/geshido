/**
 * Wrapper component for anchor link to handle navigation stuff
 */
import React, { useCallback } from 'react';
import { isExternal, navigateTo } from '../../lib/navigation';

export interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
	/** Make href required for link */
	href: string;
}

export const Link = React.memo((props: Props) => {
	let rel = props.rel;
	let target = props.target;
	if (isExternal(props.href)) {
		rel = 'noopener noreferrer nofollow';
		target = '_blank';
	}

	const handleClick = useCallback(
		(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
			e.preventDefault();
			navigateTo(props.href);
			return props.onClick && props.onClick(e);
		},
		[props.href]
	);

	// Explicit props.href needed to make jsx-a11y linter happy
	return (
		<a
			{...props}
			href={props.href}
			onClick={handleClick}
			rel={rel}
			target={target}
		>
			{props.children}
		</a>
	);
});
