// import './App.css';
import { useState } from 'react';
import MXConnectWidget from './MXConnectWidget';

function LaunchButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [connectWidgetUrl, setConnectWidgetUrl] = useState("");

  const loadWidget = async () => {
    console.log('hit')
    setIsLoading(true);
    const response = await fetch(`http://localhost:8000/api/get_mxconnect_widget_url`)
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
          }}
        />
      )}
      {isLoading && (<h3>Loading</h3>)}
    </div>
  );
}

export default LaunchButton;
