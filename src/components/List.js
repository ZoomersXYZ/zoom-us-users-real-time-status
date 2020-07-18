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
          setLoading( false );
          if ( doc.data() && doc.data().list && Array.isArray( doc.data().list ) ) {
            const tmpArr = doc.data().list;
            if ( Array.isArray( tmpArr ) ) {
              setList( 
                arrByBasicSort( 
                  tmpArr, 
                  'timestamp' 
                ) 
              );
            };
          };
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
      <div>
        Online user count: { list && list.length } 
      </div>
      <div>
        <UsersList 
          list={ list }
        />
      </div>
    </div>
  );
};

export default List;
