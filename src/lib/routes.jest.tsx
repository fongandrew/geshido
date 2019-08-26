import React from 'react';
import { History } from 'history';
import { act, render } from '@testing-library/react';
import { history } from './navigation';
import { pathForRoute, useRoute, Route } from './routes';

describe('Routes', () => {
	let lastListener: History.LocationListener | null = null;
	beforeEach(() => {
		jest.spyOn(history, 'listen').mockImplementation(listener => {
			lastListener = listener;
			return () => {};
		});
	});

	let lastRenderedRoute: Route | null = null;
	function RouteTester() {
		lastRenderedRoute = useRoute();
		return null;
	}

	function testRoute(pathname: string) {
		render(<RouteTester />);
		act(() => {
			if (!lastListener) throw new Error('lastListener not assigned');
			lastListener(
				{
					href: `https://example.com${pathname}`,
					origin: 'https://example.com',
					host: 'example.com',
					hostname: 'example.com',
					protocol: 'https',
					pathname,
				} as any,
				{} as any
			);
		});
		return lastRenderedRoute;
	}

	// Generates tests for path string to Route and bakc
	function assertRoutes(pathname: string, route: Route) {
		it('is routed by pathname', () => {
			expect(testRoute(pathname)).toEqual(route);
		});

		it('is generated with by pathForRoute', () => {
			expect(pathForRoute(route)).toEqual(pathname);
		});
	}

	describe('home', () => {
		assertRoutes('/', { type: 'home' });
	});

	describe('checklist', () => {
		assertRoutes('/checklist/C12345678', {
			type: 'checklist',
			id: 'C12345678',
		});
	});
});
