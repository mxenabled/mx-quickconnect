import { useEffect, useState } from 'react';
import MXConnectWidget from './MXConnectWidget';
import { List } from '@kyper/list'
import { Button } from '@kyper/button'
import { ChevronRight } from '@kyper/icon/ChevronRight'
import Header from "./Header";
import { Table } from '@kyper/table'
import { Dots } from '@kyper/progressindicators';

function LaunchButton({ isLoading, setIsLoading, setUserGuid, setMemberGuid, memberGuid }) {
  const [connectWidgetUrl, setConnectWidgetUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [latestUser, setLatestUser] = useState(null);

  useEffect(() => {
    async function getLatestUser() {
      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      };
      await fetch(`/api/users`, requestOptions)
        .then(res => {
          if (res.ok) {
            return res.json();
          }
          throw new Error('Something went wrong')
        })
        .then((res) => {
          setErrorMessage(null);
            setLatestUser(res?.users[0])
        })
        .catch((error) => {
          setIsLoading(false);
          console.log('error', error);
          setErrorMessage(error.message);
        });
    }
    getLatestUser();
  }, [])

  const loadWidget = async (user_guid) => {
    setIsLoading(true);
    let body = {
      user_id: "",
      ...(user_guid != null && {user_guid: user_guid})
    }
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
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
      {!isLoading && connectWidgetUrl === "" && (
        <div>
          <Header />
          <div className='mb-44'>
            <List
              items={[
                'Run through MXconnect widget to add a new User and Member.',
                'Make API endpoint requests and view results'
              ]}
              listType="ol"
            />
          </div>
          <div className='flex-align'>
            <Button onClick={loadWidget} variant="primary">
              Launch with new user
              <ChevronRight
                color="currentColor"
                height={12}
                style={{
                  marginLeft: 8
                }}
                width={12}
              />
            </Button>
            {
              latestUser != null && (
                <div className='ml-8'>
                  <Button onClick={() => loadWidget(latestUser?.guid)} variant="primary">
                    Launch with previous user
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
              )
            }
          </div>
        </div>
      )}
      {connectWidgetUrl && (
        <div>
          <Table className='guid-table mb-48' >
            <tbody>
              <tr>
                <td>
                  Test Bank
                </td>
                <td>
                  MX Bank, MX Bank (OAuth)
                </td>
              </tr>
              <tr>
                <td>
                  Username
                </td>
                <td>
                  mxuser
                </td>
              </tr>
              <tr>
                <td>
                  password
                </td>
                <td>
                  correct, challenge, options, image, <a href="https://docs.mx.com/api/guides/testing#test_credentials" target="_blank" rel="noreferrer">see docs for more scenarios</a>
                </td>
              </tr>
            </tbody>
          </Table>
          <MXConnectWidget
            memberGuid={memberGuid}
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
        </div>
      )}
      {isLoading && (
        <div className="loading">
          <Dots fgColor="#2F73DA" size={32} />
        </div>
      )}
    </div>
  );
}

export default LaunchButton;
