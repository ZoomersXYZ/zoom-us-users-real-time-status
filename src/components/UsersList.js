import React from 'react';
import EachUser from './EachUser';

const currTime = new Date();

const UsersList = ( { list } ) => (
  <ul>
    { !!list && list.map( ( aUser, index ) => 
    <EachUser 
      key={ `auser-${ index }` } 
      aUser={ aUser } 
      currTime={ currTime } 
    />
    ) }
  </ul>
);

export default UsersList;
