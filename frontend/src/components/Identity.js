import { useState, useEffect } from 'react';
import RunJobAndPoll from "./RunJobAndPoll";


function Identity({memberGuid, userGuid}) {
  const [isLoading, setIsLoading] = useState(false);
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
    <div className="endpoint">
      <button onClick={loadAccountOwners} disabled={accountOwners.length > 0}>
        <h2>Identity /identity</h2>
      </button>
      <table className='table'>
        <tbody>
          <tr>
            <th>Account GUID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
          </tr>
          {accountOwners.map(accountOwner => {
            return (
              <tr key={accountOwner.guid}>
                <td>{accountOwner.account_guid}</td>
                <td>{accountOwner.owner_name}</td>
                <td>{accountOwner.email}</td>
                <td>{accountOwner.phone}</td>
                <td>{accountOwner.address}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {isLoading && (
        <div>
          <span>Loading...</span>
          <RunJobAndPoll
            jobType='identity'
            userGuid={userGuid}
            setResponse={setResponse}
            memberGuid={memberGuid} />
        </div>
      )}
    </div>
  );
}

export default Identity;
