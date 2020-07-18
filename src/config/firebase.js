import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY, 
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN, 
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL, 
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID, 
  storageBucket: REACT_APP_STORAGE_BUCKET, 
  messagingSenderId: REACT_APP_MESSAGING_SENDER_ID, 
  appId: REACT_APP_APP_ID, 
  measurementId: REACT_APP_MEASREMENT_ID  
};
firebase.initializeApp( firebaseConfig );

const db = firebase.firestore();

firebase.firestore().enablePersistence()
  .catch( function( err ) {
      if ( err.code === 'failed-precondition' ) {
          // Multiple tabs open, persistence can only be enabled in one tab at a a time.
      } else if ( err.code === 'unimplemented' ) {
          // The current browser does not support all of the features required to enable persistence
      };
  } );

export { firebase, db as default };
