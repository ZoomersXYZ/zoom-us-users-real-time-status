// Utilities -- JS weaknesses, eh
const quickObjEmptyCheck = ( obj ) => {
  for ( var key in obj ) {
    if( obj.hasOwnProperty( key ) )
      return false;
  };
  return true;
};
o
const prepData = async ( db ) => {
  const doc = db.collection( 'online' ).doc( 'now' );
  const fbData = await doc.get();
  let data = fbData.data().list;
  return { doc, data };
};

const removeSameValueFromDb = async ( doc, data, key, value, remove = false ) => {
  // Blank ids are the main reason for this
  if ( !!value ) return;
  console.log( "removeSameValueFromDb(): ${ key }, remove: ${ remove }" );
  const removalIndex = data.findIndex( han => han[ key ] === value );
  // Not found
  if ( removalIndex === -1 ) {
    if ( key === 'id' ) {
      console.log( 'removeSameValueFromDb(): id -- no removal index' );
    } else if ( key === 'user_id' ) {
      console.log( 'removeSameValueFromDb(): user_id -- no removal index' );
    };
    return;
  } else {
    console.log( 'removeSameValueFromDb(): removalIndex', removalIndex );
  };
  
  // Changing field vs actually deleting
  if ( remove ) {
    const minusRemoval = data.splice( removalIndex, 1 );
    if ( quickObjEmptyCheck( minusRemoval ) ) return;
    console.log( 'removeSameValueFromDb(): deleting the value ${ removalindex }' );
  } else {
    const tmp = data[ removalIndex ];
    console.log( 'tmp1', tmp );
    tmp.online = false;
    console.log( 'tmp2', tmp );
    data[ removalIndex ] = tmp;
    console.log( 'removeSameValueFromDb(): online status changed for ${ removalindex }' );
  };
  console.log( 'hi3', data[ removalIndex ] );
  doc.set( { list: data } );
};

// Firebase functions
const pushToDb = async ( db, newUser, justId ) => {
  let { doc, data } = await prepData( db );
  if ( !data || quickObjEmptyCheck( data ) ) { data = [] };  
  newUser.timestamp = Date.now();
  newUser.online = true;
  console.log( 'pushToDb(): got close to end' );
  doc.set( { list: [ newUser, ...data ] } );
};

const removeFromDb = async ( db, userId, justId ) => {
  let { doc, data } = await prepData( db );
  if ( !data || quickObjEmptyCheck( data ) ) return;
  await removeSameValueFromDb( doc, data, 'id', justId, true );
  await removeSameValueFromDb( doc, data, 'user_id', userId, true );
};

module.exports = {
  quickObjEmptyCheck, 
  pushToDb, 
  removeFromDb 
};
