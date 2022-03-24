// import './App.css';
import { useState } from 'react';
import MXConnectWidget from './MXConnectWidget';

function LaunchButton(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [connectWidgetUrl, setConnectWidgetUrl] = useState("");

  const loadWidget = async () => {
    setIsLoading(true);
    const requestOptions = {
      method: 'POST',
      // headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ user_id: userId })
    };
    await fetch(`/api/get_mxconnect_widget_url`, requestOptions)
      .then(res => res.json())
      .then((res) => {
        setIsLoading(false);
        setConnectWidgetUrl(res?.widget_url?.url)
        console.log('conn widg url', res?.widget_url?.url);
      });
    // const data = await response.json();
    // console.log('data', data)
  }

  return (
    <div >
      <label>User_id (optional)</label>
      <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} />
      <br />
      <button onClick={loadWidget}>Launch MX Connect</button>
      {connectWidgetUrl && (
        <MXConnectWidget
          widgetUrl={connectWidgetUrl}
          onEvent={(event) => {
            console.log('MX message: ', event)
            if (event.type === 'mx/connect/memberConnected') {
              props.setUserGuid(event.metadata.user_guid)
              props.setMemberGuid(event.metadata.member_guid)
            }
          }}
        />
      )}
      {isLoading && (<h3>Loading</h3>)}
    </div>
  );
}

export default LaunchButton;
