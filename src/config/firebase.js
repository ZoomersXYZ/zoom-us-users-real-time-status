import firebase from 'firebase-admin';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
};

firebase.initializeApp( firebaseConfig );
const db = firebase.firestore();

// firebase.firestore().enablePersistence()
//   .catch( function( err ) {
//       if ( err.code === 'failed-precondition' ) {
//           // Multiple tabs open, persistence can only be enabled
//           // in one tab at a a time.
//           // ...
//       } else if ( err.code === 'unimplemented' ) {
//           // The current browser does not support all of the
//           // features required to enable persistence
//           // ...
//       }
//   } );
// Subsequent queries will use persistence, if it was enabled successfully

export { firebase, db as default };
