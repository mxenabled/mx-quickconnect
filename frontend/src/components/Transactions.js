import { useState } from 'react';
import MXEndpoint from "./MXEndpoint";

function Transactions({userGuid, memberGuid}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [jsonData, setJsonData] = useState(null);
  const [status, setStatus] = useState(2)

  const loadTransactions = async () => {
    setIsLoading(true);
    await fetch(`/users/${userGuid}/members/${memberGuid}/transactions`)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        throw new Error()
      })
      .then((res) => {
        setTransactions(res.transactions);
        setStatus(3)
        setJsonData(res)
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        setError({
          code: '400',
          type: 'Bad Request',
          message: 'Something happend and you were unable to get transactions',
          link: 'https://docs.mx.com/api#core_resources_transactions_list_transactions_by_member'
        })
      });
  }

  return (
    <div style={{marginTop: '24px'}}>
      <MXEndpoint
        docsLink="https://docs.mx.com/api#core_resources_transactions_list_transactions_by_member"
        title="List Transactions"
        finalDataUrl="/users/{user_guid}/members/{member_guid}/transactions"
        jobType="Transactions"
        status={status}
        showNotice={true}
        requestType="Post"
        requestUrl="/users/{user_guid}/members/{member_guid}/aggregate"
        isLoading={isLoading}
        subText="Requests to this endpoint return a list of transactions associated with the specified member, across all accounts associated with that member."
        onAction={loadTransactions}
        error={error}
        jsonData={jsonData}
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
