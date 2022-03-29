import Identity from "./Identity";
import Auth from "./Auth";
import Balances from "./Balances";
import Transactions from "./Transactions";
import Holdings from "./Holdings";

function UserEndpoints({userGuid, memberGuid}) {
  return (
    <div>
      <div>
        <h4>userGuid: {userGuid}</h4>
        <h4>memberGuid: {memberGuid}</h4>
      </div>
      <Auth memberGuid={memberGuid} />
      <Identity userGuid={userGuid} memberGuid={memberGuid} />
      <Balances userGuid={userGuid} memberGuid={memberGuid} />
      <Transactions memberGuid={memberGuid} />
      <Holdings userGuid={userGuid} memberGuid={memberGuid} />
    </div>
  );
}

export default UserEndpoints;
