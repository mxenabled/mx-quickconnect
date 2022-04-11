import { useState, useEffect } from 'react';
import RunJobAndPoll from "./RunJobAndPoll";
import MXEndpoint from './MXEndpoint';

function Balances({memberGuid, userGuid}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
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
    <div style={{marginTop: '24px'}}>
      <MXEndpoint
        title="Check Balances"
        requestType="POST"
        requestUrl="/users/{user_guid}/members/{member_guid}/check_balance"
        isLoading={isLoading}
        subText="This gathers the latest account balance information; it does not gather any transaction data."
        onAction={loadAccounts}
        error={error}
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
          setResponse={setResponse}
          memberGuid={memberGuid}
          setError={setError}
        />
       )}
    </div>
  );
}

export default Balances;
