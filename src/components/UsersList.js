import React from 'react';
import EachUser from './EachUser';

const UsersList = ( users ) => (
  <div>
    <ul>
      { users.map( ( aUser, index ) => 
      <EachUser 
        key={ `auser-${ index }` } 
        aUser={ aUser } 
      />
      ) }
    </ul>
  </div>
);

export default UsersList;
