/// <reference types="Cypress" />

import { signIn } from '../support/auth';

describe('Tasks', () => {
	it('can be created from a checklist', () => {
		cy.visit('/');

		// Create and navigate to checklist page
		signIn();
		cy.get('[data-testid="create-checklist__form"]')
			.find('input')
			.type('Test 1{enter}');
		cy.contains('a', 'Test 1').click();

		// Make sure we're on the right page
		cy.contains('[data-testid="checklist__heading"]', 'Test 1').should(
			'be.visible'
		);

		// Helpers for inspecting / manipulating form
		const getForm = () => cy.get('[data-testid="create-task__form"]');
		const getItem = text => cy.contains('[data-testid="list__item"]', text);

		// Create using KB
		getForm()
			.find('input')
			.type('Task 1{enter}');
		getItem('Task 1').should('be.visible');

		// Create using mouse
		getForm()
			.find('input')
			.type('Task 2');
		getForm()
			.contains('Submit')
			.click();
		getItem('Task 2').should('be.visible');
		getItem('Task 1').should('be.visible');

		// Tasks persist on reload
		cy.location(location => location.reload());
		getItem('Task 1').should('be.visible');
		getItem('Task 2').should('be.visible');
	});
});
