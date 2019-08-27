export function signOut() {
	cy.log('Signing out');
	cy.window().should('have.property', 'firebase');
	return cy.window().then(win => win.firebase.auth().signOut());
}

export function signIn() {
	cy.log('Signing in as new anonymous user');
	signOut();
	cy.window().should('have.property', 'firebase');
	return cy.window().then(win => win.firebase.auth().signInAnonymously());
}

// On first visit, remember to reset login state to preserve test isolation
let resetAuth = true;
beforeEach(() => {
	resetAuth = true;
});

Cypress.Commands.overwrite('visit', (originalFn, url, options = {}) => {
	originalFn(url, options);
	if (resetAuth) {
		resetAuth = false;
		signOut();
	}
});
