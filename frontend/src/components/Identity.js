import { useState, useEffect } from 'react';
import RunJobAndPoll from "./RunJobAndPoll";
import MXEndpoint from "./MXEndpoint";


function Identity({memberGuid, userGuid}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accountOwners, setAccountOwners] = useState([]);
  const [response, setResponse] = useState(null);
  const [status, setStatus] = useState(0);

  useEffect(() => {
    if (response !== null) {
      console.log('identity response:', response)
      setAccountOwners(response.account_owners)
      setIsLoading(false)
    }
  }, [response])

  const loadAccountOwners = async () => {
    setIsLoading(true);
  }

  return (
    <div style={{marginTop: '24px'}}>
      <MXEndpoint
        docsLink="https://docs.mx.com/api#identification_identity"
        title="Identify Member"
        finalDataUrl="/users/{user_guid}/members/{member_guid}/account_owners"
        jobType="Identity"
        status={status}
        requestType="POST"
        requestUrl="/users/{user_guid}/members/{member_guid}/identify"
        isLoading={isLoading}
        subText="Retrieve data such as the name, street address, phone number, and email address for all the accounts associated with a particular member."
        onAction={loadAccountOwners}
        error={error}
        jsonData={response}
        tableData={{
          headers: ['Account Guid', 'Name', 'Email', 'Phone'],
          rowData: accountOwners.map(owner => {
            return ({
              id: owner.guid,
              cols: [
                owner.account_guid,
                owner.owner_name,
                owner.email,
                owner.phone,
              ]
            })
          })
        }}
      />
      {isLoading && (
        <RunJobAndPoll
          jobType='identity'
          endpoint={`/users/${userGuid}/members/${memberGuid}/identify`}
          userGuid={userGuid}
          setResponse={setResponse}
          setError={setError}
          setStatus={setStatus}
          memberGuid={memberGuid} />
      )}
    </div>
  );
}

export default Identity;
