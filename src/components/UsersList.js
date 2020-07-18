import React from 'react';
import EachUser from './EachUser';

const UsersList = ( { list } ) => (
  <ul>
    { !!list && list.map( ( aUser, index ) => 
    <EachUser 
      key={ `auser-${ index }` } 
      aUser={ aUser } 
    />
    ) }
  </ul>
);

export default UsersList;
