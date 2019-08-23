// https://github.com/cypress-io/cypress/issues/413
beforeEach(() => {
	cy.window().then(win => {
		win.sessionStorage.clear();
	});
});
