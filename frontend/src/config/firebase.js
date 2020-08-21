import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY, 
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN, 
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL, 
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID, 
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET, 
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID, 
  appId: process.env.REACT_APP_APP_ID, 
  measurementId: process.env.REACT_APP_MEASREMENT_ID  
};
firebase.initializeApp( firebaseConfig );

const db = firebase.firestore();

export { firebase, db as default };
