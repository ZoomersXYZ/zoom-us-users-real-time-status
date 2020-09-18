const checkStartAndEndOfString = ( str, start, end ) => (
  str.slice( 0, 1 ) === start 
  && 
  str.slice( -1 ) === end 
);

const personQueryRef = async ( ref, name ) => {
  const personRef = ref 
    .where( 'name', '==', name ) 
    .limit( 1 );
  return await personRef.get();
};

const personLogCollectionRef = ( ref, docId ) => 
    ref
      .doc( docId )
      .collection( 'rt_log' );

const manageDbData = async ( 
  db, 
  key, 
  value, 
  handle, 
  toKeep = true 
) => {
  // for logs
  const currFunc = 'manageDbData()';

  console.log( 'key, value, handle', `${ currFunc }: ${ key }, ${ value }, ${ handle }` );

  // Blank ids are the main reason for this
  if ( !value ) {
    console.warn( `${ currFunc }: value is falsey. RETURNING. ` )
    return false;
  };

  // Not including users based on regex blocklist
  const regexArr = [
    /squad\+/, 
    /hackathon/, 
    /workathon/, 
    /zoomathon/, 
    /^chat:.+/, 
    /[\s]chat/, 
    /.\(chat\)/ 
  ];
  
  const regexResult = regexArr.find( solo => 
    ( new RegExp( solo, 'i' ) ).test( handle ) 
   );
   if ( regexResult ) {
     console.warn( `${ currFunc }: blocklist regex is truthy. RETURNING. ` )
     return false;
   };

  // Adjustments for some users.
  // The initial name for some are too generic or incorrect
  const adjustmentRegex = [
    // @TODO is colin and monika exactly like i have it?
	  { argot: 'Colin and Monika', proper: 'Stephanie' }, 
    { argot: 'M L', proper: 'Michelle L' } 
  ];

  let adjustedValue = adjustmentRegex.find( solo => 
    ( solo.argot === handle )
  );
  if ( adjustedValue ) {
    handle = adjustedValue.proper;
  } else {
    adjustedValue = { argot: null };
  };

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


  ////
  // Firestore work
  ////

  // Grabbing the name if it is already in the collection as a document
  const ref = db
    .collection( 'people' );

  // const personRef = ref 
  //   .where( 'name', '==', finalFormName ) 
  //   .limit( 1 );
  // const personSnapshot = await personRef.get();
  const personSnapshot = await personQueryRef( ref, finalFormName );

  if ( personSnapshot.empty ) {
    await ref.doc().set( {
      name: finalFormName, 
      created_at: Date.now(), 
      userId: key === 'userId' ? value : null 
    } );
  };
  
  const personSnapshotDeux = await personQueryRef( ref, finalFormName );
  // this should alwyas be true
  // Made above if not already true
  let personFireId = '';
  let keep = true;
  if ( !personSnapshotDeux.empty && personSnapshotDeux.size === 1 ) {
    const personDoc = personSnapshotDeux.docs[ 0 ];

    // Trying to grab value from db.
    // In 2020-09, it is either id or user_id
    personFireId = personDoc.id;
    const nestedCollectionRef = personLogCollectionRef( ref, personFireId );      
    const subCollectionQueryRef = await nestedCollectionRef
      .where( key, '==', value )
      .where( 'online', '==', true )
      .limit( 1 );
  
    const subCollectionQuerySnapshot = await subCollectionQueryRef.get();

    if ( !subCollectionQuerySnapshot.empty && subCollectionQuerySnapshot.size === 1 ) {
      const queryDoc = subCollectionQuerySnapshot.docs[ 0 ];
  
      // Change online status to offline if not removing
      // If removing, whole doc is deleted or given some other designation
      console.warn( `${ currFunc }: queryRef exists. one of two possible returns happening next. ` );
      if ( toKeep ) {
        console.warn( `${ currFunc }: toKeep is truthy. Setting online to false. ` );
        queryDoc.ref.update( {
          online: false 
        } );
        keep = true;
      } else {
        // If removing, whole doc is deleted or given some other designation
        console.warn( `${ currFunc }: toKeep is falsey. Setting new doc online to false + dupe to true.` );
        keep = false;
      };
    } else { 
      console.warn( `${ currFunc }: ${ key } == ${ value } -- where query not found` );
    };
  };


  console.warn( `${ currFunc }: Returning: handle: ${ finalFormName }, argot:${ adjustedValue.argot }` );
  return { 
    nestedRefId: personFireId, 
    handle: finalFormName, 
    argot: adjustedValue.argot, 
    keep 
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
  const result = await falsifyOnlineStatus( 
    db, 
    userId, 
    justId, 
    userName, 
    false 
  );
  if ( !result ) return false;
  const { handle, argot, nestedRefId, keep } = result;

  // Add new fields to user
  const newUser = { 
    userId, 
    justId, 
    handle, 
    argot, 
    timestamp: Date.now(), 
    online: !!keep, 
    dupe: !keep 
  };
  console.log( `pushPerstonToDB(): newUser obj: ${ JSON.stringify( newUser ) }` );

  const ref = db
    .collection( 'people' );
  const logRef = personLogCollectionRef( ref, nestedRefId );

  logRef
    .doc()
    .set( 
      { ...newUser } 
    );
  console.log( 'pushPerstonToDB(): ref set - not checking tho. what does it return?' );
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
    return await manageDbData( 
      db, 
      'userId', 
      userId, 
      handle, 
      toKeep 
    );
  } else if ( justId ) {
    return await manageDbData( 
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
