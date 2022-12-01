import LaunchButton from "./components/LaunchButton";
import UserEndpoints from "./components/UserEndpoints";
import posthog from 'posthog-js';

import { useEffect, useState } from 'react';

function App() {
  const [userGuid, setUserGuid] = useState(null);
  const [memberGuid, setMemberGuid] = useState(null);

  useEffect(() => {
    posthog.init(process.env.REACT_APP_POST_HOG_API_KEY, { api_host: 'https://app.posthog.com', autocapture: true })
  }, [])


  return (
    <div className="App">
      <div className="body">
        {userGuid === null && memberGuid === null ? (
          <LaunchButton setUserGuid={setUserGuid} setMemberGuid={setMemberGuid} posthog={posthog} />
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
