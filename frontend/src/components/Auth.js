import { useState } from 'react';

function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [accountNumbers, setAccountNumbers] = useState([]);

  const loadAccountNumbers = async () => {
    setIsLoading(true);
    const response = await fetch(`http://localhost:8000/api/auth`)
    .then(res => res.json())
    .then((res) => {
      console.log('response', res);
      setAccountNumbers(res.account_numbers);
      setIsLoading(false);
    });
  }

  return (
    <div className="endpoint">
      <button onClick={loadAccountNumbers} disabled={accountNumbers.length > 0}>
        <h2>Account Numbers /auth</h2>
      </button>
      <table>
        <tbody>
          <tr>
            <th>Account Number</th>
            <th>Routing Number</th>
          </tr>
          {accountNumbers.map(accountNumber => {
            return (
              <tr key={accountNumber.guid}>
                <td>{accountNumber.account_number}</td>
                <td>{accountNumber.routing_number}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {isLoading && (<h3>Loading Account Numbers</h3>)}
    </div>
  );
}

export default Auth;
