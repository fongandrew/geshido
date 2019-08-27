/// <reference types="Cypress" />

import { signIn } from '../support/auth';

describe('Checklists', () => {
	it('can be listed and created', () => {
		cy.visit('/');
		signIn();

		// Verify empty state
		cy.get('[data-testid="checklists-list"]')
			.contains('No checklists found')
			.should('be.visible');

		// Helpers for inspecting / manipulating form
		const getForm = () => cy.get('[data-testid="create-checklist__form"]');
		const getItem = text => cy.contains('[data-testid="list__item"]', text);

		// Create using KB
		getForm()
			.find('input')
			.type('Test 1{enter}');
		getItem('Test 1').should('be.visible');

		// Create using mouse
		getForm()
			.find('input')
			.type('Test 2');
		getForm()
			.contains('Submit')
			.click();
		getItem('Test 2').should('be.visible');
		getItem('Test 1').should('be.visible');
	});
});
