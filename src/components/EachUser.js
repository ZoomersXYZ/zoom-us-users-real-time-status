import React from 'react';

import { formatRelative } from 'date-fns';

const EachUser = ( aUser ) => (
  <li>        
    { aUser.user_name }, { formatRelative( aUser.timestamp, new Date() ) } 
  </li>
);

export default EachUser;
