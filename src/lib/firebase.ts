import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

// NB: Firebase initialization happens lazily in boot.ts

export const auth = firebase.auth();
export const db = firebase.firestore();
