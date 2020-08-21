require( 'firebase-functions/lib/logger/compat' );
const express = require( 'express' );
const functions = require( 'firebase-functions' );

const db = require( './firebase' );
const config = require( './config' );
const { quickObjEmptyCheck, 
        pushToDb, 
        removeFromDb  
      } = require( './dbUtilities' );

const app = express();
app.use( express.static( 'public' ) );

app.get( '/', ( request, response ) => {
  response.send( 'Power your app with Webhooks!' );
} );

// Main function
app.post( '/', ( req, res ) => {
  const data = JSON.stringify( req.body );  
  let event = JSON.parse( data );
  try {
    event = JSON.parse( event );
    console.log( 'yes for 2nd JSON.parse' );
  } catch { 
    console.log( 'nope for 2nd JSON.parse' );
  };

  if ( req.headers.authorization === config.VERIFICATION_TOKEN ) {
    res.status( 200 );
    console.log( 'Meeting/Webinar webhook sending back 200.' );
    res.send();
  } else {
    console.warn( 'Authorization no good' );
    return;
  };

  const zoomEvent = event.event;
  const parent = event.payload && event.payload.object;
  const userInfo = parent && parent.hasOwnProperty( 'participant' ) && parent.participant;
  
  // For logs
  console.log( 'parent', parent );
  console.log( 'zoom event', zoomEvent );
  console.log( 'userInfo', userInfo );

  // Add or remove from firebase
  if ( zoomEvent === 'meeting.participant_joined' ) {
    console.log( 'meeting.participant_joined' );
    pushToDb( db, userInfo, userInfo.id );
  } else if ( zoomEvent === 'meeting.participant_left' ) {
    console.log( 'meeting.participant_left' );
    removeFromDb( db, userInfo.user_id, userInfo.id );
  };
} );

exports.app = functions.https.onRequest( app );
