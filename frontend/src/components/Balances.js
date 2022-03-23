import { useState, useEffect } from 'react';

function Balances() {
  const [isLoading, setIsLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);

  const loadAccounts = async () => {
    setIsLoading(true);
    const response = await fetch(`http://localhost:8000/api/balances`)
    .then(res => res.json())
    .then((res) => {
      console.log('response', res);
      setAccounts(res.accounts);
      setIsLoading(false);
    });
  }

  return (
    <div className="endpoint">
      <button onClick={loadAccounts} disabled={accounts.length > 0}>
        <h2>Balances /balances</h2>
      </button>
      <table>
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
      {isLoading && (<h3>Loading Balances</h3>)}
    </div>
  );
}

export default Balances;
