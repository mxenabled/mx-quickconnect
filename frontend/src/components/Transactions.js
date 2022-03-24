import { useState } from 'react';

function Transactions({memberGuid}) {
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const loadTransactions = async () => {
    setIsLoading(true);
    const response = await fetch(`http://localhost:8000/api/transactions/${memberGuid}`)
    .then(res => res.json())
    .then((res) => {
      console.log('response', res);
      setTransactions(res.transactions);
      setIsLoading(false);
    });
  }

  return (
    <div className="endpoint">
      <button onClick={loadTransactions} disabled={transactions.length > 0}>
        <h2>Transactions /transactions</h2>
      </button>
      <table>
        <tbody>
          <tr>
            <th>Description</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
          {transactions.slice(0,10).map(transaction => {
            return (
              <tr key={transaction.guid}>
                <td>{transaction.description}</td>
                <td>{transaction.category}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.date}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {isLoading && (<h3>Loading Transactions</h3>)}
    </div>
  );
}

export default Transactions;
