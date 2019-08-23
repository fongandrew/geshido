module.exports = {
	/** Always reset */
	clearMocks: true,
	resetMocks: true,
	restoreMocks: true,

	/** If you need real timers for something, probably use Cypress */
	timers: 'fake',

	/** Use *.jest.* pattern in case we add multiple unit test frameworks */
	testMatch: ['**/?(*.)jest.[jt]s?(x)'],

	/** Parcel alias */
	moduleNameMapper: {
		'~(.*)$': '<rootDir>/src/$1',
	},

	setupFilesAfterEnv: [
		'<rootDir>/src/test-utils/testing-library-imports.ts',
		'<rootDir>/src/test-utils/console-errors.ts',
	],
};
