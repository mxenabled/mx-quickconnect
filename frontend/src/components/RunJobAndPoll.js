
import { useEffect, useRef, useState } from 'react';
import MXConnectWidget from './MXConnectWidget';


const JOBS = {
  balances: '/api/balances',
  holdings: '/api/holdings',
  identity: '/api/identity/:member_guid'
}

function RunJobAndPoll({jobType, userGuid, memberGuid, setResponse}) {
  let controller = useRef();
  let signal = useRef();
  let url = useRef();
  const [isChallenged, setIsChallenged] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [connectWidgetUrl, setConnectWidgetUrl] = useState("");

  const pollMemberStatus = async () => {
    await fetch(`/api/${memberGuid}/status`, { signal })
      .then(response => response.json())
      .then((response) => {
        console.log('poll member status', response);
        if (response.member.connection_status === 'CHALLENGED') {
          setIsChallenged(true);
          controller.abort();
        } else if (response.member.connection_status === 'CONNECTED') {
          setIsConnected(true);
          controller.abort();
          // Give it time to load data
          console.log('member status is connected, waiting 5 secs before retrieving data')
          setTimeout(getFinalData, 5000);
        } else if (response.member.connection_status === 'RESUMED') {
          // Pool member status every 3 seconds
          setTimeout(pollMemberStatus, 3000);
        } else {
          console.log("Recieved an expected status", response)
        }
    });
  }

  useEffect(() => {
    controller = new AbortController();
    signal = controller.signal;
    url = JOBS[jobType].replace(':member_guid', memberGuid);

    async function fetchData() {
      console.log(`post request to ${jobType}`)
      await fetch(url, { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            user_guid: userGuid,
            member_guid: memberGuid 
          }) 
        })
        .then(response => response.json())
        .then((response) => {
            pollMemberStatus();
          })
        .catch((error) => {
          console.error('Error:', error);
        });;
    }

    fetchData();

    return () => {
      controller.abort();
      console.log('unmount');
    }
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
      async function fetchData() {
        await fetch(`/api/get_mxconnect_widget_url`, requestOptions)
          .then(res => res.json())
          .then((res) => {
            setConnectWidgetUrl(res?.widget_url?.url)
            console.log('chall widget', res?.widget_url?.url);
            console.log(res)
          });
      }

      fetchData();
    }
  }, [isChallenged, userGuid, memberGuid])

  const getFinalData = async () => {
    console.log('done waiting');
    await fetch(url)
      .then(response => response.json())
      .then((response) => {
        console.log('response in final', response);
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
