import firebase from 'firebase/app';
import { useState, useEffect } from 'react';
import { createAction } from './actions';
import { DataObject } from './data';
import { auth } from './firebase';

// Set default for auth language
auth.useDeviceLanguage();

/**
 * React hook to subscribe to Firebase auth changes
 * @returns data wrapper around current user, if any
 */
export function useCurrentUser() {
	const currentUser = auth.currentUser;
	const initialState: DataObject<firebase.User | null> = currentUser
		? {
				data: currentUser,
		  }
		: { pending: true };
	const [state, setState] = useState(initialState);

	useEffect(
		() =>
			// onAuthStateChanged returns an unsubscribe function that
			// useEffect takes advantage of when unmounting
			auth.onAuthStateChanged(user => setState({ data: user })),
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
