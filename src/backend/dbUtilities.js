const checkStartAndEndOfString = ( str, start, end ) => (
  str.slice( 0, 1 ) === start 
  && 
  str.slice( -1 ) === end 
);

const manageDbData = async ( 
  db, 
  key, 
  value, 
  handle, 
  toKeep = true 
) => {
  // Blank ids are the main reason for this
  console.log( 'key', key );
  console.log( 'value', value );

  if ( !!value ) return false;
  // for logs
  const currFunc = 'manageDbData()';

  // Not including users based on regex blocklist
  const regexArr = [
    /squad\+/, 
    /hackathon/, 
    /^chat:.+/, 
    /[\s]chat/, 
    /.\(chat\)/ 
  ];
  
  regexArr.map( solo => {
    if ( ( new RegExp( solo, 'i' ) ).test( handle ) ) {
      return false;
    };
  } );

  // Adjustments for some users.
  // The initial name for some are too generic or incorrect
  const adjustmentRegex = [
    // @TODO is colin and monika exactly like i have it?
	  { og: 'Colin and Monika', adjustment: 'Stephanie' }, 
	  { og: 'M L', adjustment: 'Michelle L' } 
  ];

  adjustmentRegex.map( solo => {
    if ( solo.og === handle ) handle = solo.adjustment;
  } );

  // Limiting personal info
  // First name + any other parts of name with only first letter
  const handlingArr = handle.split( ' ' );

  handlingArr.map( ( individualWords, index ) => {
    // Skip first name + skip cropping last word if in parenthesis
    // Many times parenthesis is for pronouns
    if ( 
      ( index === 0 ) 
      || 
      ( 
        index === handlingArr.length - 1 
        && 
        ( 
          checkStartAndEndOfString( individualWords,'(', ')' )
          || 
          checkStartAndEndOfString( individualWords,'[', ']' )
          ||
          checkStartAndEndOfString( individualWords,'-', '-' )
        )
      )
    ) {
      return individualWords;
    };
    // Otherwise only keep first character of word
    return individualWords.slice( 0, 1 );
  } );

  const finalFormName = handlingArr.join( ' ' );

  // Grabbing the name if it is already in the collection as a document
  const ref = db
    .collection( 'log' );

  // Trying to grab value from db.
  // In 2020-09, it is either id or user_id
  const queryRef = await ref
    .where( key, '==', finalFormName )
    .where( 'online', '==', true )
    .limit( 1 );

  // Change online status to offline if not removing
  // If removing, whole doc is deleted or given some other designation
  if ( queryRef.exists ) {
    if ( toKeep ) {
      return queryRef.update( {
        online: false 
      } );
    } else {
      // If removing, whole doc is deleted or given some other designation
      return queryRef.update( {
        online: false, 
        dupe: true 
       } );
    };
    // No found value
  } else if ( !queryRef.exists ) { 
    console.log( `${ currFunc }: ${ key } -- no where query found` );
  };
};

// @@called 1x in Functions.js
const pushPersonToDb = async ( 
  db, 
  userId, 
  justId, 
  userName 
) => {
  // Remove id or user_id that are online. User is going online now. How can there be another instance of them online, fam?
  await falsifyOnlineStatus( 
    db, 
    userId, 
    justId, 
    userName,  
    false 
  );
  
  // Add new fields to user
  newUser = { 
    userId, 
    justId, 
    handle: userName, 
    timestamp: Date.now(), 
    online: true, 
    dupe: false 
  };

  const ref = db
    .collection( 'log' );

  ref
    .doc()
    .set( 
      { ...newUser } 
    );
};

// @@called 1x in Functions.js
const falsifyOnlineStatus = async ( 
  db, 
  userId, 
  justId, 
  handle, 
  toKeep = true 
) => { 
  if ( userId ) {
    await manageDbData( 
      db, 
      'userId', 
      userId, 
      handle, 
      toKeep 
    );
  };
  
  if ( justId ) {
    await manageDbData( 
      db, 
      'justId', 
      justId, 
      handle, 
      toKeep 
    );
  };
};

module.exports = {
  pushPersonToDb, 
  falsifyOnlineStatus 
};
