import LaunchButton from "./components/LaunchButton";
import UserEndpoints from "./components/UserEndpoints";
import posthog from 'posthog-js';

import { useEffect, useState } from 'react';

function App() {
  const [userGuid, setUserGuid] = useState(null);
  const [memberGuid, setMemberGuid] = useState(null);

  useEffect(() => {
    posthog.init('phc_kequjnByvXoLjRawiaNEMoai4tcBWsi9iLlIWPYB7JS', { api_host: 'https://app.posthog.com', autocapture: false })
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
