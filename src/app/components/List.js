import React, { useEffect, useState } from 'react';

import db from '../config/firebase';
import EachUser from './EachUser';
import { sub } from 'date-fns'

const List = () => {
  const [ error, setError ] = useState( false );
  const [ loading, setLoading ] = useState( true );
  const [ list, setList ] = useState( [] );
  
  useEffect( () => {
    // Core
    const oneDayAgo = sub( new Date(), {
      days: 1 
    } ).getTime();
    const stream = db.collectionGroup( 'rt_log' )
      .where( 'timestamp', '>', oneDayAgo ) 
      .where( 'dupe', '==', false ) 
      .orderBy( 'timestamp', 'asc' ) 
      .onSnapshot( 
        doc => {
          doc.docChanges().forEach( ( change ) => {
            if ( change.type === 'added' ) {
              setList( prevState => 
                [ change.doc.data(), ...prevState ] 
              );
            } else if ( change.type === 'modified' ) {
              setList( prevState => {
                const updated = change.doc.data();
                const prevIndex = prevState.findIndex( solo => 
                  solo.userId === change.doc.data().userId 
                );
                return [ 
                  ...prevState.slice( 0, prevIndex ), 
                  updated, 
                  ...prevState.slice( prevIndex + 1 ) 
                ];
              } );
            } else if ( change.type === 'removed' ) {
              setList( prevState => {
                const prevIndex = prevState.findIndex( solo => 
                  solo.userId === change.doc.data().userId 
                );
                return [ 
                  ...prevState.slice( 0, prevIndex ), 
                  ...prevState.slice( prevIndex + 1 ) 
                ];
              } );
            };
          } );
          setLoading( false );
        },
        err => {
          console.log( error );
          setError( error );
        } 
      );
      return () => stream();
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [] );

  return (
    <div>
      { loading && 
        <span>Loading...</span> 
      }
      { error && 
        <span>{ error }</span> 
      }
      <h3 className="online-count">
        Online user count: { list && list.filter( han => han.online ).length } 
      </h3>
      <div>
        <ul className="user-list">
          { !!list && list.map( ( aUser, index ) => 
            <EachUser 
              key={ `aUser-${ index }` } 
              aUser={ aUser } 
            />
          ) }
        </ul>
      </div>
    </div>
  );
};

export default List;
