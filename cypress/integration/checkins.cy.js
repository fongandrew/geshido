/// <reference types="Cypress" />

import { signIn } from '../support/auth';

describe('Checkins', () => {
	// Helpers for inspecting / manipulating form
	const getItem = text => cy.contains('[data-testid="list__item"]', text);
	const assertItems = (subselector, expected) => {
		cy.get(`[data-testid="list__item"] ${subselector}`).should(items => {
			const actual = [];
			items.each((index, elm) => {
				actual.push(elm.innerText);
			});
			expect(actual).to.deep.equal(expected);
		});
	};

	it('updates date and ordering', () => {
		cy.visit('/');

		// Create two checklists (update affects ordering);
		signIn();
		cy.get('[data-testid="create-checklist__form"]')
			.find('input')
			.type('Test 1{enter}')
			.type('Test 2{enter}');
		getItem('Test 2').should('be.visible');
		assertItems('a', ['Test 1', 'Test 2']);

		// Go to test 1 (so update makes it drop)
		cy.contains('a', 'Test 1').click();

		// Create a bunch of tasks we can check into
		cy.get('[data-testid="create-task__form"]')
			.find('input')
			.type('Task 1{enter}')
			.type('Task 2{enter}')
			.type('Task 3{enter}');
		getItem('Task 3').should('be.visible');
		assertItems('[data-testid="tasks-list__task-name"]', [
			'Task 1',
			'Task 2',
			'Task 3',
		]);
		assertItems('[data-testid="relative-timestamp"]', [
			'Never',
			'Never',
			'Never',
		]);

		// Check into second task
		cy.get('[data-testid="checkin-button"]')
			.eq(1)
			.click();

		// Timestamp updates but order does not change
		assertItems('[data-testid="tasks-list__task-name"]', [
			'Task 1',
			'Task 2',
			'Task 3',
		]);
		assertItems('[data-testid="relative-timestamp"]', [
			'Never',
			'Just now',
			'Never',
		]);

		// Go back to home
		cy.get('[data-testid="nav__home"]').click();
		assertItems('a', ['Test 2', 'Test 1']);

		// Go back to checklist to assert order has changed
		cy.contains('a', 'Test 1').click();
		assertItems('[data-testid="tasks-list__task-name"]', [
			'Task 1',
			'Task 3',
			'Task 2',
		]);
		assertItems('[data-testid="relative-timestamp"]', [
			'Never',
			'Never',
			'Just now',
		]);
	});
});
