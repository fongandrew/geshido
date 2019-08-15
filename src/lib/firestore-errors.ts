/**
 * Common, standard errors
 */

/**
 * Used when querying a document that doesn't exist
 */
export class DocumentDoesNotExistError extends Error {
	constructor() {
		super('DOCUMENT_DOES_NOT_EXIST');
	}
}

/**
 * Used when user is not logged in (or we somehow don't have access
 * to the current user auth)
 */
export class UserNotLoggedInError extends Error {
	constructor() {
		super('USER_NOT_LOGGED_IN');
	}
}
