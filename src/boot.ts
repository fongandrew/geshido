/**
 * Initial boot operations -- any stuff that has to go before everything
 * else can go here
 */
import 'regenerator-runtime/runtime';
import firebase from 'firebase/app';

async function boot() {
	// Initialize Firebase
	const resp = await fetch('/__/firebase/init.json');
	firebase.initializeApp(await resp.json());

	// Launch main application
	await import('./app');
}
boot();
