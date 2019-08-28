import { formatDate, setLocale, relativeDaysAgo } from './date-format';

describe('formatDate', () => {
	beforeEach(() => {
		setLocale('en-US');
	});

	it('formats dates correctly', () => {
		expect(formatDate(new Date(2019, 0, 12))).toEqual('Jan 12, 2019');
	});
});

describe('relativeDaysAgo', () => {
	// Helper to generate relative times
	const minutesAgo = (minutes: number) =>
		new Date(Date.now() - minutes * 60 * 1000);

	it('handles recent times correctly', () => {
		expect(relativeDaysAgo(minutesAgo(1))).toEqual('Just now');
	});

	it('handles times < 1 hour ago correctly', () => {
		expect(relativeDaysAgo(minutesAgo(10))).toEqual('10 minutes ago');
	});

	it('handles ~1 hour ago correctly', () => {
		expect(relativeDaysAgo(minutesAgo(61))).toEqual('1 hour ago');
	});

	it('handles times from today correctly', () => {
		expect(relativeDaysAgo(minutesAgo(60 * 3 + 10))).toEqual('3 hours ago');
	});

	it('handles yesterday correctly', () => {
		expect(relativeDaysAgo(minutesAgo(60 * 30))).toEqual('Yesterday');
	});

	it('handles DST boundary correctly', () => {
		// November 3, 2019 is fall back for US DST
		expect(
			relativeDaysAgo(
				new Date(2019, 10, 3),
				new Date(2019, 10, 3, 23, 59)
			)
		).toEqual('24 hours ago');
	});

	it('handles older times correctly', () => {
		expect(relativeDaysAgo(minutesAgo(60 * 24 * 5))).toEqual('5 days ago');
	});

	it('handles near future times gracefully', () => {
		expect(relativeDaysAgo(minutesAgo(-1))).toEqual('Just now');
	});
});
