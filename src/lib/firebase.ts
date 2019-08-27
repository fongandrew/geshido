import firebaseNamespace from 'firebase/app';

// Firebase stored on global scipe via script tags
export const firebase: typeof firebaseNamespace = (window as any).firebase;

export const auth = firebase.auth();
export const db = firebase.firestore();
