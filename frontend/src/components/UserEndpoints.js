import { useState, useEffect } from 'react';

import Identity from "./Identity";
import Auth from "./Auth";
import Balances from "./Balances";
import Transactions from "./Transactions";

function UserEndpoints({userGuid, memberGuid}) {
  useEffect(() => {
    console.log('load endp', userGuid, memberGuid)
  }, [])

  return (
    <div>
      <div>
        <h4>userGuid: {userGuid}</h4>
        <h4>memberGuid: {memberGuid}</h4>
      </div>
      <Auth memberGuid={memberGuid} />
      <Identity memberGuid={memberGuid} />
      <Balances />
      <Transactions memberGuid={memberGuid} />
    </div>
  );
}

export default UserEndpoints;
