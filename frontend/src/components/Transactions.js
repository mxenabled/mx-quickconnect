import { useState } from 'react';
import MXEndpoint from "./MXEndpoint";

function Transactions({memberGuid}) {
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const loadTransactions = async () => {
    setIsLoading(true);
    await fetch(`/api/transactions/${memberGuid}`)
      .then(res => res.json())
      .then((res) => {
        setTransactions(res.transactions);
        setIsLoading(false);
      });
  }

  return (
    <div style={{marginTop: '24px'}}>
      <MXEndpoint
        title="List Transactions"
        requestType="Get"
        requestUrl="/users/{user_guid}/members/{member_guid}/transactions"
        isLoading={isLoading}
        subText="Requests to this endpoint return a list of transactions associated with the specified member, across all accounts associated with that member."
        onAction={loadTransactions}
        tableData={{
          headers: ['Description', 'Category', 'Amount', 'Date'],
          rowData: transactions.slice(0,10).map(transaction => {
            return ({
              id: transaction.guid,
              cols: [
                transaction.description,
                transaction.category,
                transaction.amount,
                transaction.date,
              ]
            })
          })
        }}
      />
    </div>
  );
}

export default Transactions;
