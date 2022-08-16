import { useState } from 'react';

import LaunchButton from "./components/LaunchButton";
import UserEndpoints from "./components/UserEndpoints";


function App() {
  const [userGuid, setUserGuid] = useState(null);
  const [memberGuid, setMemberGuid] = useState(null);


  return (
    <div className="App">
      <div className="body">
        {userGuid === null && memberGuid === null ? (
          <LaunchButton setUserGuid={setUserGuid} setMemberGuid={setMemberGuid} />
        ) :
          (
            <UserEndpoints userGuid={userGuid} memberGuid={memberGuid} />
          )
        }
      </div>
    </div>
  );
}

export default App;
