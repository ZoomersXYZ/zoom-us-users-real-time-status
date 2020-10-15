import React, { useEffect, useState } from 'react';

import db from '../config/firebase';
import EachUser from './EachUser';
import { sub } from 'date-fns';
import uniqBy from 'lodash/uniqBy';

const List = () => {
  const [ error, setError ] = useState( false );
  const [ loading, setLoading ] = useState( true );
  const [ list, setList ] = useState( [] );
  
  useEffect( () => {
    // Core
    const oneDayAgo = sub( new Date(), {
      days: 1 
    } ).getTime();
    
    // const streamOne = db.collectionGroup( 'rt_log' )
    //   .where( 'timestamp', '>', oneDayAgo ) 
    //   .where( 'dupe', '==', false ) 
    //   .orderBy( 'timestamp', 'asc' ) 
    //   .get().then( doc => { console.log( 'lol' ) } );

    const stream = db.collectionGroup( 'rt_log' )
      .where( 'timestamp', '>', oneDayAgo ) 
      .where( 'dupe', '==', false ) 
      .orderBy( 'timestamp', 'asc' ) 
      .onSnapshot( 
        doc => {
          doc.docChanges().forEach( ( change ) => {
            if ( change.type === 'added' ) {
              // console.log( 'added', change.doc.data() );
              setList( prevState => 
                [ change.doc.data(), ...prevState ] 
              );
            } else if ( change.type === 'modified' ) {
              // console.log( 'modified', change.doc.data() );
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
              console.log( 'removed', change.doc.data() );
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
          console.log( 'Err:', error );
          setError( error );
        } 
      );
      return () => stream();
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [] );

  const totalCount = list && list.length;
  const totalUniqueCount = list && uniqBy( list, 'justId' ).length;

  const offlineArr = list.filter( han => !han.online );
  const offlineCount = list && offlineArr.length;
  const offlineUniqueCount = offlineCount && uniqBy( offlineArr, 'justId' ).length;

  const onlineArr = list.filter( han => han.online );
  const onlineCount = list && onlineArr.length;
  const onlineUniqueCount = onlineCount && uniqBy( onlineArr, 'justId' ).length;

  return (
    <div>
      { loading && 
        <span>Loading...</span> 
      }
      { error && 
        <span>{ error }</span> 
      }
      <h3 className="count-header">
        Real-Time and Past 24 Hours Counts
      </h3>
      <h4 className="online-count">
        Total: { totalCount }, Unique: { totalUniqueCount } 
      </h4>
      <h4 className="online-count">
        Online (incorrect): { onlineCount }, Unique online people (actual value): { onlineUniqueCount } 
      </h4>
      <h4 className="online-count">
        Total offline: { offlineCount }, Total unique offline: { offlineUniqueCount } 
      </h4>
      
      <h3 className="list-header">
        Users List
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
