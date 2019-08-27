/**
 * Helper to wait for Firestore document ref to commit
 * @param {firebase.firestore.DocumentReference} ref - Firestore document ref
 * @param {Number} [retries] - Number of times to try (Firestore permissions
 * can be weird when we're subscribing to a given object).
 * @returns {Bluebird} when all is said and done
 */
export function waitForDocument(ref, retries = 3) {
	return new Cypress.Promise((resolve, reject) => {
		const unsubscribe = ref.onSnapshot(
			{ includeMetadataChanges: true },
			snapshot => {
				if (!snapshot.metadata.hasPendingWrites) {
					unsubscribe();
					resolve(snapshot.data());
				}
			},
			err => {
				if (
					err &&
					err.message === 'Missing or insufficient permissions.' &&
					retries > 0
				) {
					setTimeout(
						() => waitForDocument(ref, retries - 1).then(resolve),
						100
					);
					return;
				}
				reject(err);
			}
		);
	});
}
