import { useState } from 'react';

import './App.css';
import LaunchButton from "./components/LaunchButton";
import UserEndpoints from "./components/UserEndpoints";

function App() {
  // const [userGuid, setUserGuid] = useState('USR-a236b5f9-5e4b-4520-949f-a64702de2aa7');
  // const [memberGuid, setMemberGuid] = useState('MBR-308badb0-2f71-438e-bfc6-3da976bf3655');
  const [userGuid, setUserGuid] = useState(null);
  const [memberGuid, setMemberGuid] = useState(null);

  return (
    <div className="App">
      <header className="App-header">
        <p>MX quickstart app</p>
      </header>
      <div className="body">
        {/* <UsersList /> */}
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
