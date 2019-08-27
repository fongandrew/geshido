/**
 * Wrapper component around text input -- currently does nothing but here to
 * ease styling and refactoring later.
 */
import React from 'react';
import { DataProps } from './data-attrs';

export interface Props
	extends React.InputHTMLAttributes<HTMLInputElement>,
		DataProps {
	/** Optional data- attributes */
	data?: Record<string, string>;
}

export function Text(props: Props) {
	return <input type="text" {...props} />;
}
