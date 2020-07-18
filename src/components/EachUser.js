import React from 'react';
import { formatDistance } from 'date-fns';

const EachUser = ( { aUser, currTime } ) => (
  <li>        
    { aUser.user_name }, { formatDistance( aUser.timestamp, currTime ) } ago
  </li>
);

export default EachUser;
