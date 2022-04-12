import { useState, useEffect } from 'react';
import RunJobAndPoll from "./RunJobAndPoll";
import MXEndpoint from "./MXEndpoint";


function Identity({memberGuid, userGuid}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accountOwners, setAccountOwners] = useState([]);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    if (response !== null) {
      console.log('got response identity', response)
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
        title="Identify Member"
        requestType="POST"
        requestUrl="/users/{user_guid}/members/{member_guid}/identify"
        isLoading={isLoading}
        subText="Retrieve data such as the name, street address, phone number, and email address for all the accounts associated with a particular member."
        onAction={loadAccountOwners}
        error={error}
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
          memberGuid={memberGuid} />
      )}
    </div>
  );
}

export default Identity;
