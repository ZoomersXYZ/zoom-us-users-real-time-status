import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const EachUser = ( { aUser } ) => (
  <li className={ aUser.online ? 'active' : 'inactive' }>
    <span className="handle">{ aUser.handle }</span>, { } 
    <span className="time-on">{ formatDistanceToNow( Number( aUser.timestamp ), { includeSeconds: true } ) }</span> 
    { } ago
  </li>
);

export default EachUser;
