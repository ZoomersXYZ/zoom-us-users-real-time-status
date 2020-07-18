import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const EachUser = ( { aUser } ) => (
  <li>        
    { aUser.user_name }, { } 
    { formatDistanceToNow( Number( aUser.timestamp ), { includeSeconds: true } ) } 
    { } ago
  </li>
);

export default EachUser;
