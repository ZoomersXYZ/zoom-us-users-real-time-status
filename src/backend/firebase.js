const admin = require( 'firebase-admin' );

admin.initializeApp( {
  credential: admin.credential.applicationDefault()
} );
// const serviceAccount = require('./firebaseServiceAccount.json' );
// admin.initializeApp( {
//   credential: admin.credential.cert( serviceAccount )
// } );

const db = admin.firestore();

module.exports = db;
