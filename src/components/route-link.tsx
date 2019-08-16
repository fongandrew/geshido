import { isEqual } from 'lodash';
import React from 'react';
import { Route, pathForRoute } from '~/lib/routes';
import { Link } from './kit/link';

export interface Props
	extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
	route: Route;
}

export const RouteLink = React.memo(({ route, ...rest }: Props) => {
	const href = pathForRoute(route);
	return <Link href={href} {...rest} />;
}, isEqual); // Deep equal because route is an object
