import React, { useCallback, useState } from 'react';
import { useCurrentUser, signInWithGoogle, signOut } from '../lib/auth';
import { error } from '../lib/logger';

/**
 * React component for button to sign in with Google or sign out
 */
export function SigninSignoutButton() {
	const { data: user, pending } = useCurrentUser();

	const [inProgress, setInProgress] = useState(false);
	const handleClick = useCallback(() => {
		setInProgress(true);

		const action = user ? signOut : signInWithGoogle;
		action()
			.catch(error)
			.finally(() => setInProgress(false));
	}, [user]);

	return (
		<button
			type="button"
			disabled={pending || inProgress}
			onClick={handleClick}
		>
			{user ? 'Sign out' : 'Sign in with Google'}
		</button>
	);
}
