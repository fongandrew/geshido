import { useLocation } from './navigation';

export interface BaseRoute {
	type: string;
}
export interface HomeRoute extends BaseRoute {
	type: 'home';
}
export interface ChecklistRoute extends BaseRoute {
	type: 'checklist';
	id: string;
}
export type Route = ChecklistRoute | HomeRoute;

/**
 * React hook to subscribe to path changes and normalize it to a standard
 * route type.
 * @returns Current route
 */
export function useRoute(): Route {
	const location = useLocation();
	const parts = location.pathname.split('/');

	// Ignore leading slash
	if (parts[0] === '') {
		parts.splice(0, 1);
	}

	// Route for individual list
	if (parts[0] === 'checklist' && typeof parts[1] === 'string') {
		return { type: 'checklist', id: parts[1] };
	}

	// Default route
	return { type: 'home' };
}

/**
 * Translates route object to path string
 * @param route - Route object
 * @returns - Path string
 */
export function pathForRoute(route: Route) {
	switch (route.type) {
		case 'checklist':
			return `/checklist/${route.id}`;
		default:
			return `/`;
	}
}
