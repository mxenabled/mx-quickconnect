import { useState, useEffect } from 'react';
import RunJobAndPoll from "./RunJobAndPoll";

function Balances({memberGuid, userGuid}) {
  const [isLoading, setIsLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    if (response !== null) {
      console.log('got response holdings', response)
      setAccounts(response.accounts)
      setIsLoading(false)
    }
  }, [response])

  const loadAccounts = async () => {
    setIsLoading(true);
  }

  return (
    <div className="endpoint">
      <button onClick={loadAccounts} disabled={accounts.length > 0}>
        <h2>Balances /balances</h2>
      </button>
      <table className="table">
        <tbody>
          <tr>
            <th>Name</th>
            <th>Balance</th>
            <th>Subtype</th>
            <th>Mask</th>
          </tr>
          {accounts.map(account => {
            return (
              <tr key={account.guid}>
                <td>{account.name}</td>
                <td>{account.available_balance}</td>
                <td>{account.subtype}</td>
                <td>{account.account_number.slice(-4)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {isLoading && (
        <div>
          <span>Loading...</span>
          <RunJobAndPoll
            jobType='balances'
            userGuid={userGuid}
            setResponse={setResponse}
            memberGuid={memberGuid}
          />
        </div>
       )}
    </div>
  );
}

export default Balances;
