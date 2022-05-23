import { useState, useEffect } from 'react';
import RunJobAndPoll from "./RunJobAndPoll";
import MXEndpoint from './MXEndpoint';

function Balances({memberGuid, userGuid}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [response, setResponse] = useState(null);
  const [status, setStatus] = useState(0);

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
    <div style={{marginTop: '24px'}}>
      <MXEndpoint
        docsLink="https://docs.mx.com/api#core_resources_members_check_balances"
        title="Check Balances"
        finalDataUrl="/users/{user_guid}/accounts"
        jobType="Balance"
        status={status}
        requestType="POST"
        requestUrl="/users/{user_guid}/members/{member_guid}/check_balance"
        isLoading={isLoading}
        subText="This gathers the latest account balance information; it does not gather any transaction data."
        onAction={loadAccounts}
        error={error}
        jsonData={response}
        tableData={{
          headers: ['Name', 'Balance', 'Subtype', 'Mask'],
          rowData: accounts.map(account => {
            return ({
              id: account.guid,
              cols: [
                account.name,
                account.available_balance,
                account.subtype,
                account.account_number.slice(-4),
              ]
            })
          })
        }}
      />
      {isLoading && (
        <RunJobAndPoll
          jobType='balances'
          userGuid={userGuid}
          endpoint={`/users/${userGuid}/members/${memberGuid}/check_balance`}
          setResponse={setResponse}
          memberGuid={memberGuid}
          setStatus={setStatus}
          setError={setError}
        />
       )}
    </div>
  );
}

export default Balances;
