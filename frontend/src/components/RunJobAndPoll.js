
import { useEffect, useState } from 'react';
import MXConnectWidget from './MXConnectWidget';


const LINKS = {
  balances: 'https://docs.mx.com/api#core_resources_members_check_balances',
  holdings: 'https://docs.mx.com/api#investments_holdings',
  identity: 'https://docs.mx.com/api#identification_identity'
}

function RunJobAndPoll({
    jobType,
    userGuid,
    memberGuid,
    setResponse,
    setStatus,
    setError,
    endpoint
  }) {
  const controller = new AbortController();
  const signal = controller.signal;
  const [isChallenged, setIsChallenged] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [connectWidgetUrl, setConnectWidgetUrl] = useState("");

  const pollMemberStatus = async () => {
    await fetch(`/users/${userGuid}/members/${memberGuid}/status`, { signal })
      .then(response => response.json())
      .then((response) => {
        console.log('poll member status', response);
        if (response.member.connection_status === 'CHALLENGED') {
          setIsChallenged(true);
          controller.abort();
        } else if (response.member.connection_status === 'CONNECTED') {
          setStatus(2);
          setIsConnected(true);
          controller.abort();
          // Give it time to load data
          console.log('member status is connected, waiting 2 secs before retrieving data')
          setTimeout(getFinalData, 2000);
        } else if (response.member.connection_status === 'RESUMED') {
          // Poll member status every 3 seconds
          setTimeout(pollMemberStatus, 3000);
        } else {
          console.log("Recieved an expected status", response)
        }
    });
  }

  useEffect(() => {
    async function initiatePremiumJob() {
      console.log(`post request to ${jobType}`)
      await fetch(endpoint, { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            user_guid: userGuid,
            member_guid: memberGuid 
          }) 
        })
        .then(response => {
          if (response.ok) {
            setStatus(1);
            return response.json();
          }
          throw new Error()
        })
        .then((_response) => {
            setTimeout(pollMemberStatus, 3000);
          })
        .catch((_error) => {
          setError({
            code: '400',
            type: 'Bad Request',
            message: 'You dont have access to this premium feature. Or the endpoint is throttled.',
            link: LINKS[jobType]
          })
        });
    }

    initiatePremiumJob();

    return () => {
      controller.abort();
      console.log('unmount');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isChallenged) {
      const requestOptions = {
        method: 'POST',
        body: JSON.stringify({ 
          user_guid: userGuid,
          member_guid: memberGuid
         })
      };
      console.log('open challenged widget')
      async function getWidgetUrl() {
        await fetch(`/api/get_mxconnect_widget_url`, requestOptions)
          .then(res => res.json())
          .then((res) => {
            setConnectWidgetUrl(res?.widget_url?.url)
            console.log('chall widget', res?.widget_url?.url);
            console.log(res)
          });
      }

      getWidgetUrl();
    }
  }, [isChallenged, userGuid, memberGuid])

  const getFinalData = async () => {
    await fetch(endpoint)
      .then(response => response.json())
      .then((response) => {
        console.log('response in final', response);
        setStatus(3);
        setResponse(response);
      });
  }

  return (
    <div>
      {!isConnected && isChallenged && (
        <div className="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">Modal title</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
              {connectWidgetUrl && (
                <MXConnectWidget
                  widgetUrl={connectWidgetUrl}
                  onEvent={(event) => {
                    console.log('MX PostMessage: ', event)
                    if (event.type === 'mx/connect/memberConnected') {
                      console.log('finished answering mfa in modal')
                    }
                  }}
                />
              )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary">Save changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RunJobAndPoll;
