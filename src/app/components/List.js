import React, { useEffect, useState } from 'react';

import db from '../config/firebase';
import UsersList from './UsersList';

// import { useDocuments } from 'react-firebase-hooks/firestore';

// const dreamy = async () => {
//   let data = [];
//   db.collection( 'groups' ).doc( nspName ).collection( 'log' ).orderBy( 'timestamp', 'desc' ).limit( 30 ).get().then( snap => {
//     snap.forEach( doc => data.push( doc.data() ) );
//   }, reason => {
//     l.gen.error( '#error pullLogFromDb() async -> db.collection post then -- -> rejection' + reason );
//   } );
//   return data;
// };

const List = () => {
  const [ err, setErr ] = useState( false );
  const [ loading, setLoading ] = useState( true );
  const [ list, setList ] = useState( null );
  
  useEffect( () => {
    // Core
    const d = new Date();
    const oneDayAgo = d.setDate( d.getDate() - 1000 * 60 * 60 * 24 );
    // .where('type', '==', 'museum');
    // const stream = db.collection( 'log' ) 
    const stream = db.collectionGroup( 'rt_log' )
      .where( 'timestamp', '>', oneDayAgo ) 
      .where( 'dupe', '==', false ) 
      .orderBy( 'timestamp', 'desc' ) 
      .onSnapshot( 
        doc => {
          doc.docChanges().forEach( ( change ) => {
            if ( change.type === 'added' ) {
              console.log( 'New city: ', change.doc.data() );
            } else if ( change.type === 'modified' ) {
              console.log( 'Modified city: ', change.doc.data() );
            } else if ( change.type === 'removed' ) {
              console.log( 'Removed city: ', change.doc.data() );
            };
          } );
          setLoading( false );
          const arr = [];
          doc.forEach( solo => arr.push( solo.data() ) );
          setList( arr );
        },
        err => {
          console.log( err );
          setErr( err );
        } 
      );
      return () => stream();
  }, [] );

  if ( loading ) {
    return <div>Loading</div>
  };
  return (
    <div>
      { err && 
        <span>{ err }</span> 
      }
      <h3 className="online-count">
        Online user count: { list && list.filter( han => han.online ).length } 
      </h3>
      <div>
        <UsersList 
          list={ list }
        />
      </div>
    </div>
  );
};

export default List;
