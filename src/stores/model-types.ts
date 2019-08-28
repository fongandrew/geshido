/**
 * Shared type definitions we can pass around without creating a circular
 * dependency
 */
import { firestore } from 'firebase/app';
import { HasPermissions } from '~/lib/permissions';

/**
 * A checkin is what
 */
export interface Checkin {
	/** ID of the user checking in */
	uid: string;
	/** Timestamp for the checkin */
	createdOn: firestore.Timestamp;
}

/**
 * A task is a thing a user can do (and check into)
 */
export interface Task {
	/** Name of the task */
	name: string;
	/** If the task is archived / complete */
	archived?: boolean;
	/** When the checklist originally created? */
	createdOn: firestore.Timestamp;
	/** Copy of last checkin */
	lastCheckin?: Checkin;
	/**
	 * Last modified date (based on createdOn and last checkin, copied here
	 * because sorting on possibly undefined value doesn't work
	 */
	lastModified: firestore.Timestamp;
}

/**
 * A checklist is a collection of tasks
 */
export interface Checklist extends HasPermissions {
	/** User-assigned name for checklist */
	name: string;
	/** When the checklist originally created? */
	createdOn: firestore.Timestamp;
	/** Copy of last checkin */
	lastCheckin?: Checkin;
	/**
	 * Last modified date (based on createdOn and last checkin, copied here
	 * because sorting on possibly undefined value doesn't work
	 */
	lastModified: firestore.Timestamp;
}
