import firebase from 'firebase/app';
import { useState, useEffect } from 'react';
import { createAction } from './actions';
import { DataObject } from './data';
import { auth } from './firebase';

// Set default for auth language
auth.useDeviceLanguage();

// Wrapper around auth.currentUser since Firestore doesn't reliably
// update this right away sometimes
let currentUser = auth.currentUser;
export function getCurrentUser() {
	return currentUser;
}

/**
 * React hook to subscribe to Firebase auth changes
 * @returns data wrapper around current user, if any
 */
export function useCurrentUser() {
	const [state, setState] = useState<DataObject<firebase.User | null>>({
		pending: true,
	});

	useEffect(
		() =>
			// onAuthStateChanged returns an unsubscribe function that
			// useEffect takes advantage of when unmounting
			auth.onAuthStateChanged(user => {
				setState({ data: user });
				if (currentUser !== user) {
					currentUser = user;
				}
			}),
		[] // Empty array so we don't re-subscribe on each render
	);

	return state;
}

/**
 * Action to open popup to auth with Google
 * @returns Promise when auth complete
 */
export const signInWithGoogle = createAction('Sign in with Google', () => {
	const provider = new firebase.auth.GoogleAuthProvider();
	return auth.signInWithPopup(provider);
});

/**
 * Action to sign out
 * @returns Promise when sign out complete
 */
export const signOut = createAction('Sign out', () => auth.signOut());
