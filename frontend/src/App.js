import { useState } from 'react';

import LaunchButton from "./components/LaunchButton";
import UserEndpoints from "./components/UserEndpoints";


function App() {
  // const [userGuid, setUserGuid] = useState('USR-65d96384-627d-4c41-935b-7e48f390a443');
  // const [memberGuid, setMemberGuid] = useState('MBR-b5c60467-e589-4076-b002-7d66d946f1e0');
  const [userGuid, setUserGuid] = useState(null);
  const [memberGuid, setMemberGuid] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  return (
    <div className="App">
      <div className="body">
        {userGuid === null && memberGuid === null ? (
          <LaunchButton isLoading={isLoading} setIsLoading={setIsLoading} setUserGuid={setUserGuid} setMemberGuid={setMemberGuid} memberGuid={memberGuid} />
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
