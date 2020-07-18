import React, { useEffect, useState } from 'react';

import db from '../config/firebase';
import UsersList from './UsersList';

const List = () => {
  const [ err, setErr ] = useState( false );
  const [ loading, setLoading ] = useState( true );
  const [ list, setList ] = useState( null );
  
  useEffect( () => {
    // lowest numbers on top
    const arrByBasicSort = ( arr, field ) => 
      arr.sort( ( a, b ) => a[ field ] - b[ field ] );

    const stream = db.collection( 'online' )
      .doc( 'users' )
      .onSnapshot( 
        doc => {
          setList( arrByBasicSort( doc.data().list, 'timestamp' ) )
          setLoading( false );
        },
        err => {
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
      <div>
        Currently online user count: ${ list.length }
        <UsersList 
          list={ list }
        />
      </div>
    </div>
  );
};

export default List;
