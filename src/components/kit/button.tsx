/**
 * Wrapper component around button -- currently does nothing but here to ease
 * styling and refactoring later.
 */
import React from 'react';
import { DataProps } from './data-attrs';

export interface Props
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		DataProps {}

export function Button(props: Props) {
	return <button type="button" {...props} />;
}
