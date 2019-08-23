export function signOut() {
	cy.window().should('have.property', 'firebase');
	return cy.window().then(win => win.firebase.auth().signOut());
}

export function signIn() {
	signOut();
	cy.window().should('have.property', 'firebase');
	return cy.window().then(win => win.firebase.auth().signInAnonymously());
}
