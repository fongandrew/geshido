/**
 * Some standard permission strings to avoid typos
 */
import firebase from 'firebase/app';

export type READ = 'read';
export const READ: READ = 'read';

export type WRITE = 'write';
export const WRITE: WRITE = 'write';

/**
 * Should include all known permission strings
 */
export type Permission = READ | WRITE;

/**
 * Handy for assigning "everything" to a given user
 */
export const ALL_PERMISSIONS = [READ, WRITE];

/**
 * Interface for a model object with basic permissions interface
 */
export interface HasPermissions<P extends Permission = READ | WRITE> {
	permissions: {
		[userId: string]: P[] | undefined;
	};
}

/**
 * Returns a tuple of args we can pass to a `.where` condition on a
 * Firestore query
 * @param userId
 * @param permission
 */
export function firestorePermissionQuery(
	userId: string,
	permission: Permission
): [string, firebase.firestore.WhereFilterOp, string] {
	return [`permissions.${userId}`, 'array-contains', permission];
}
