import React from 'react';

import UsersList from './UsersList';

const List = () => {
  return (
    <div>
      <div>
        Currently online user count: ${ count }
      </div>
      <UsersList 
        users={ users }
      />
    </div>
  );
};

export default List;
