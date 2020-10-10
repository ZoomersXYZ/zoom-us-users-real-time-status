import React from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { sub } from 'date-fns';

import db from '../config/firebase';
import EachUser from './EachUser';

const List = () => {
    const oneDayAgo = sub( new Date(), {
      days: 1 
    } ).getTime();
    const [ value, loading, error ] = useDocumentData(
      db.collectionGroup( 'rt_log' )
        .where( 'timestamp', '>', oneDayAgo )
        .where( 'dupe', '==', false )
        .orderBy( 'timestamp', 'desc' )
    );

  return (
    <div>
      { loading 
        && <span>Loading...</span> 
      }
      { error && 
          <span>{ error }</span> 
      }

      <h3 className="online-count">
        Online user count: { loading ? '0' : ( value && value.filter( han => han.online ).length ) } 
      </h3>

      <div>
        <ul className="user-list">
          { !!value && value.map( ( aUser, index ) => 
            <EachUser 
              key={ `auser-${ index }` } 
              aUser={ aUser } 
            />
          ) }
        </ul>
      </div>
    </div>
  );
};

export default List;
