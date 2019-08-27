/**
 * Wrapper component around form -- currently does nothing but here to ease
 * styling and refactoring later.
 */
import React from 'react';
import { DataProps } from './data-attrs';

export interface Props
	extends React.FormHTMLAttributes<HTMLFormElement>,
		DataProps {
	/** Optional data- attributes */
	data?: Record<string, string>;
}

export function Form(props: Props) {
	return <form {...props} />;
}
