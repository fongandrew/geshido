export function signOut() {
	cy.log('Signing out');
	cy.window().should('have.property', 'firebase');
	return cy.window().then(win => win.firebase.auth().signOut());
}

export function signIn(persist = false) {
	cy.log('Signing in as new anonymous user');
	cy.window().should('have.property', 'firebase');
	return cy.window().then(win => {
		const auth = win.firebase.auth();

		// Sign out first if existing login
		let promise = auth.currentUser ? auth.signOut() : Promise.resolve();

		// By default, we don't persist sessions to isolate tests
		if (!persist) {
			promise = promise.then(() =>
				auth.setPersistence(win.firebase.auth.Auth.Persistence.NONE)
			);
		}

		return promise.then(() => win.firebase.auth().signInAnonymously());
	});
}
