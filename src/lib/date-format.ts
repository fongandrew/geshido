/**
 * Utilities for formatting dates.
 */
import dayjs from 'dayjs';

// Memoize an Intl object here for perf. Used to print dates only.
let intl: Intl.DateTimeFormat;

/**
 * Sets the current date-formatting localelocale
 * @param locale Locale to use for date-time formatting
 */
export function setLocale(locale = 'default') {
	intl = Intl.DateTimeFormat(locale, {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
	if (locale !== 'default') dayjs.locale(locale);
}
setLocale();

/**
 * Formats date object to standard string representation
 * @param date - Date to format
 * @returns - Formatted date
 */
export function formatDate(date: Date) {
	return intl.format(date);
}

/**
 * Returns a string indicating relative time in past
 * @param date - Date relative to get
 * @param getNow - Optional callback to get the current date (for testing)
 * @returns - Something like "2 days ago" or "5 minutes ago"
 */
export function relativeDaysAgo(date: Date, now?: Date) {
	const wrappedDate = dayjs(date);
	const wrappedNow = dayjs(now);
	const daysDiff = wrappedNow.diff(wrappedDate, 'day');

	// If diffs < 0, if it's not programming error, it's probably a
	// user clock issue so assume it's recent
	if (daysDiff < 1) {
		const minutesDiff = wrappedNow.diff(wrappedDate, 'minute');
		if (minutesDiff < 5) {
			return 'Just now';
		}

		if (minutesDiff < 60) {
			return `${minutesDiff} minutes ago`;
		}

		// Singular
		const hoursDiff = wrappedNow.diff(wrappedDate, 'hour');
		if (hoursDiff === 1) {
			return '1 hour ago';
		}

		// Plural
		return `${hoursDiff} hours ago`;
	}

	if (daysDiff === 1) {
		return 'Yesterday';
	}

	return `${daysDiff} days ago`;
}
