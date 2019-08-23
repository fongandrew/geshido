import { isExternal } from './navigation';

describe('isExternal', () => {
	beforeEach(() => {
		jest.spyOn(window, 'location', 'get').mockReturnValue({
			href: 'https://www.home.com/current/path',
			origin: 'https://www.home.com',
		} as any);
	});

	it('returns false if same origin', () => {
		expect(isExternal('https://www.home.com/path')).toBe(false);
	});

	it('returns true if different origin', () => {
		expect(isExternal('https://www.visitor.com/path')).toBe(true);
	});

	it('returns false if relative path', () => {
		expect(isExternal('/path')).toBe(false);
	});

	it('handles protocol-relative URLs', () => {
		expect(isExternal('//www.home.com/path')).toBe(false);
		expect(isExternal('//www.visitor.com/path')).toBe(true);
	});
});
