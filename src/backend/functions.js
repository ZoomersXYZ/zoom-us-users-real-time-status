require( 'firebase-functions/lib/logger/compat' );
const express = require( 'express' );
const functions = require( 'firebase-functions' );

const db = require( './firebase' );
const config = require( './config' );
const { pushPersonToDb, 
        falsifyOnlineStatus   
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
    console.info( 'yes for 2nd JSON.parse' );
  } catch { 
    console.info( 'nope for 2nd JSON.parse' );
  };

  if ( req.headers.authorization === config.VERIFICATION_TOKEN ) {
    res.status( 200 );
    console.log( 'Meeting/Webinar webhook sending back 200.' );
    res.send();
  } else {
    console.error( 'Authorization no good' );
    return;
  };

  const zoomEvent = event.event;
  const parent = event.payload && event.payload.object;
  const meetingId = parent && parent.hasOwnProperty( 'id' ) && parent.id;
  const userInfo = parent && parent.hasOwnProperty( 'participant' ) && parent.participant;
  
  // For logs
  console.log( 'parent', parent );
  console.log( 'meeting ID + zoom event', `${ meetingId } + ${ zoomEvent }` );

  if ( meetingId !== config.ROOM_ID ) {
    console.error( 'incorrect meeting id' );
    return;
  };

  // Add or remove from firebase
  if ( zoomEvent === 'meeting.participant_joined' ) {
    pushPersonToDb( db, userInfo.user_id, userInfo.id, userInfo.user_name, false );
  } else if ( zoomEvent === 'meeting.participant_left' ) {
    falsifyOnlineStatus( db, userInfo.user_id, userInfo.id, userInfo.user_name, true );
  };
} );

exports.app = functions.https.onRequest( app );
