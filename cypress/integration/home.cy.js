/// <reference types="Cypress" />

describe('Home page', () => {
	it('renders default logged out state correctly', () => {
		cy.visit('/');

		// Also button in nav header
		cy.get('nav')
			.should('be.visible')
			.find('[data-testid="signin-btn"]')
			.should('be.visible')
			.should('not.be.disabled');

		// Button in main element
		cy.get('main')
			.should('be.visible')
			.find('[data-testid="signin-btn"]')
			.should('be.visible')
			.should('not.be.disabled');

		// Verify we're hiding UI elements that don't work if logged out
		cy.get('main')
			.find('[data-testid="create-checklist-form"]')
			.should('not.be.visible');
	});
});
