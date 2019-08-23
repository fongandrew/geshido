import { useEffect, useState } from 'react';
import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

/**
 * React hook to subscribe to current location
 * @returns - The current route, or null if none
 */
export function useLocation() {
	const [location, setLocation] = useState(history.location);

	useEffect(() =>
		// history.listen returns a function to unsubscribe, which useEffect
		// takes advantange of
		history.listen(newLocation => setLocation(newLocation))
	);

	return location;
}

/**
 * Is a given path an internal SPA path or an external URL
 * @param path - The path or URL we're looking at
 * @returns True if external
 */
export function isExternal(path: string) {
	const pathToTest = path.startsWith('//') ? `https:${path}` : path;
	let url: URL;
	try {
		url = new URL(pathToTest);
	} catch (err) {
		// If we can't construct a URL here, assume it's not a valid URL
		// and therefore an internal path
		return false;
	}
	return url.origin !== window.location.origin;
}

/**
 * Navigate to a complete URL, updating history if this is
 * @param path - The path or URL we're looking at
 */
export function navigateTo(path: string) {
	if (isExternal(path)) {
		window.location.href = path;
		return;
	}
	history.push(path);
}
