export function signOut() {
	cy.window().should('have.property', 'firebase');
	return cy.window().then(win => win.firebase.auth().signOut());
}

export function signIn() {
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
