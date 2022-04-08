import { useState } from 'react';
import MXConnectWidget from './MXConnectWidget';
import { List } from '@kyper/list'
import { Button } from '@kyper/button'
import { ChevronRight } from '@kyper/icon/ChevronRight'
import Header from "./Header";
import { Dots } from '@kyper/progressindicators';

function LaunchButton({ isLoading, setIsLoading, setUserGuid, setMemberGuid }) {
  const [connectWidgetUrl, setConnectWidgetUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const loadWidget = async () => {
    setIsLoading(true);
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify({ user_id: "" })
    };
    await fetch(`/api/get_mxconnect_widget_url`, requestOptions)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('Something went wrong')
      })
      .then((res) => {
        setErrorMessage(null);
        setConnectWidgetUrl(res?.widget_url?.url)
        console.log('Getting connect widget URL', res?.widget_url?.url);
        console.log(res)
      })
      .catch((error) => {
        setIsLoading(false);
        console.log('error', error);
        setErrorMessage(error.message);
      });
  }

  return (
    <div>
      { errorMessage && (
        <div className="alert alert-danger">
          <strong>Error!</strong> { errorMessage }
        </div>
      )}
      {isLoading && (
        <div className="loading">
          <Dots fgColor="#2F73DA" size={32} />
        </div>
      )}

      {!isLoading && connectWidgetUrl === "" && (
        <div>
          <Header />
          <div className='mb-44'>
            <List
              items={[
                'Run through MXconnect to add a new User and Member.',
                'Make API endpoint requests and view results'
              ]}
              listType="ol"
            />
          </div>
          <Button onClick={loadWidget} variant="primary">
            Launch
            <ChevronRight
              color="currentColor"
              height={12}
              style={{
                marginLeft: 8
              }}
              width={12}
            />
          </Button>
        </div>
      )}
      {connectWidgetUrl && (
        <MXConnectWidget
          widgetUrl={connectWidgetUrl}
          onEvent={(event) => {
            console.log('MX PostMessage: ', event)
            if (event.type === 'mx/connect/memberConnected') {
              setUserGuid(event.metadata.user_guid)
              setMemberGuid(event.metadata.member_guid)
            } else if (event.type === 'mx/connect/loaded') {
              setIsLoading(false);
            }
          }}
        />
      )}
    </div>
  );
}

export default LaunchButton;
