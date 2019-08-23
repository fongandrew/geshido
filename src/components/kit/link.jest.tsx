import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { history } from '~/lib/navigation';
import { Link } from './link';

describe('Link', () => {
	const originalHref = 'https://www.home.com/current/path';
	const originalOrigin = 'https://www.home.com';

	beforeEach(() => {
		jest.spyOn(history, 'push').mockImplementation(() => {});
		jest.spyOn(window, 'location', 'get').mockReturnValue({
			href: originalHref,
			origin: originalOrigin,
		} as any);
	});

	describe('internal path', () => {
		const newPath = '/new/path';
		let element: Element;

		beforeEach(() => {
			const { getByTestId } = render(
				<Link href={newPath} data-testid="test-link">
					Link
				</Link>
			);
			element = getByTestId('test-link');
		});

		it('assigns the correct attributes', () => {
			expect(element).not.toHaveAttribute('rel');
			expect(element).not.toHaveAttribute('target');
		});

		it('adds to history and prevents default', () => {
			fireEvent.click(element);
			expect(history.push).toHaveBeenCalledWith(newPath);
			expect(window.location.href).toEqual(originalHref);
		});
	});

	describe('external path', () => {
		const newPath = 'https://external-site.com/new/path';
		let element: Element;

		beforeEach(() => {
			const { getByTestId } = render(
				<Link href={newPath} data-testid="test-link">
					Link
				</Link>
			);
			element = getByTestId('test-link');
		});

		it('assigns the correct attributes', () => {
			expect(element).toHaveAttribute(
				'rel',
				expect.stringMatching(/\bnoopener\b/)
			);
			expect(element).toHaveAttribute(
				'rel',
				expect.stringMatching(/\bnofollow\b/)
			);
			expect(element).toHaveAttribute(
				'rel',
				expect.stringMatching(/\bnoreferrer\b/)
			);
			expect(element).toHaveAttribute('target', '_blank');
		});

		it('opens via location.href', () => {
			fireEvent.click(element);
			expect(window.location.href).toEqual(newPath);
		});
	});
});
