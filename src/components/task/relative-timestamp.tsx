import React from 'react';
import { firestore } from 'firebase/app';
import { formatDate, relativeDaysAgo } from '~/lib/date-format';

export interface Props {
	timestamp?: firestore.Timestamp;
}

/**
 * Component for displaying a relative date and time for tasks
 */
export function RelativeTimestamp({ timestamp }: Props) {
	if (!timestamp) return <span>Never</span>;
	const date = timestamp.toDate();
	return <span title={formatDate(date)}>{relativeDaysAgo(date)}</span>;
}
