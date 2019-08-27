/// <reference types="Cypress" />

import { last } from 'lodash';
import { signIn, signOut } from '../support/auth';
import { waitForDocument } from '../support/firestore-wait';

describe('Permissions', () => {
	// Helper that asserts we can't read or write a given document ref
	// via the Firebase console with a random user
	const assertNoReadWrite = getRef => {
		// Wait for it to be written to Firestore
		cy.window().then(win => waitForDocument(getRef(win)));

		// Sign out and sign in as different user
		signOut();
		signIn();

		// No read -- use nested promises because Cypress does weird things
		// with promises
		cy.window().then(win =>
			getRef(win)
				.get()
				.then(
					() => {
						throw new Error('Read should not have resolved');
					},
					err =>
						expect(err.message).to.equal(
							'Missing or insufficient permissions.'
						)
				)
		);

		// No write
		cy.window().then(win =>
			// Object instance from Cypress doesn't match the Object inside
			// the window itself, so Firebase complains if we use an object
			// literal. To get around this, we directly reference the Object
			// inside the window under test.
			getRef(win)
				.set(win.Object.assign(new win.Object(), { name: 'Bad' }))
				.then(
					() => {
						throw new Error('Write should not have resolved');
					},
					err =>
						expect(err.message).to.equal(
							'Missing or insufficient permissions.'
						)
				)
		);
	};

	it('prevents read / writes to other user checklists', () => {
		cy.visit('/');

		// Create checklist for a uesr
		signIn();
		cy.get('[data-testid="create-checklist__form"]')
			.find('input')
			.type('Checklist 1{enter}');

		// Get checklist ID from href
		let checklistId;
		cy.contains('[data-testid="checklists-list"] a', 'Checklist 1').then(
			elm => {
				checklistId = last(elm.attr('href').split('/'));
			}
		);

		// Callback to get document ref
		assertNoReadWrite(win =>
			win.firebase
				.firestore()
				.collection('checklists')
				.doc(checklistId)
		);
	});

	it('prevents read / writes to other tasks', () => {
		cy.visit('/');

		// Create checklist for a user
		signIn();
		cy.get('[data-testid="create-checklist__form"]')
			.find('input')
			.type('Checklist 2{enter}');

		// Go to checklist page
		cy.contains('[data-testid="checklists-list"] a', 'Checklist 2').click();

		// Create a task
		cy.get('[data-testid="create-task__form"]')
			.find('input')
			.type('Task 1{enter}');

		// Extrapolate checklist ID from URL
		let checklistId;
		cy.location().then(location => {
			checklistId = last(location.href.split('/'));
		});

		// Extrapolate task ID from data attrs
		let taskId;
		cy.contains(
			'[data-testid="tasks-list"] [data-testid="list__item"]',
			'Task 1'
		).then(elm => {
			taskId = elm.data('itemid');
		});

		// Callback to get document ref
		assertNoReadWrite(win =>
			win.firebase
				.firestore()
				.collection('checklists')
				.doc(checklistId)
				.collection('tasks')
				.doc(taskId)
		);
	});
});
