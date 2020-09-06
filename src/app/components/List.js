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
    // Lowest numbers on top
    // const arrByBasicSort = ( arr, field ) => 
    //   arr.sort( ( a, b ) => a[ field ] - b[ field ] );

    // Core
    const d = new Date();
    const oneDayAgo = d.setDate( d.getDate() - 1000 * 60 * 60 * 24 );
    const stream = db.collection( 'log' ) 
      .where( 'timestamp', '>', oneDayAgo ) 
      .orderBy( 'timestamp', 'desc' ) 
      .onSnapshot( 
        doc => {
          setLoading( false );
          // console.log( 'hi first count', doc.forEach( solo => arr.push( solo.data() ) ); );
          // console.log( 'hi first length', doc.data().length );
          
          console.log( 'hi second length' );

          const arr = [];
          doc.forEach( solo => arr.push( solo.data() ) );
          setList( arr );
          // if ( doc.data() && doc.data().list && Array.isArray( doc.data().list ) ) {
            // const tmpArr = doc.data().list;
            // if ( Array.isArray( tmpArr ) ) {
              // setList( 
              //   arrByBasicSort( 
              //     tmpArr, 
              //     'timestamp' 
              //   ) 
              // );
            // };
          // };
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
