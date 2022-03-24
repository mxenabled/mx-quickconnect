import { useState } from 'react';

function Identity({memberGuid}) {
  const [isLoading, setIsLoading] = useState(false);
  const [accountOwners, setAccountOwners] = useState([]);

  const loadAccountOwners = async () => {
    setIsLoading(true);
    const response = await fetch(`/api/identity/${memberGuid}`)
    .then(res => res.json())
    .then((res) => {
      console.log('response', res);
      setAccountOwners(res.account_owners);
      setIsLoading(false);
    });
  }

  return (
    <div className="endpoint">
      <button onClick={loadAccountOwners} disabled={accountOwners.length > 0}>
        <h2>Identity /identity</h2>
      </button>
      <table>
        <tbody>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
          </tr>
          {accountOwners.map(accountOwner => {
            return (
              <tr key={accountOwner.guid}>
                <td>{accountOwner.owner_name}</td>
                <td>{accountOwner.email}</td>
                <td>{accountOwner.phone}</td>
                <td>{accountOwner.address}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {isLoading && (<h3>Loading Account owners</h3>)}
    </div>
  );
}

export default Identity;
