import { useState } from 'react';
import MXEndpoint from "./MXEndpoint";

function Verification({memberGuid}) {
  const [isLoading, setIsLoading] = useState(false);
  const [accountNumbers, setAccountNumbers] = useState([]);

  const loadAccountNumbers = async () => {
    setIsLoading(true);
    await fetch(`/api/auth/${memberGuid}`)
      .then(res => res.json())
      .then((res) => {
        console.log('response', res);
        setAccountNumbers(res.account_numbers);
        setIsLoading(false);
      });
  }

  return (
    <MXEndpoint
        title="Account Verification"
        requestType="POST"
        requestUrl="/users/{user_guid}/members/{member_guid}/verify"
        isLoading={isLoading}
        subText="Account verification allows you to access account and routing numbers for demand deposit accounts associated with a particular member."
        onAction={loadAccountNumbers}
        tableData={{
          headers: ['Account Number', 'Routing Number'],
          rowData: accountNumbers.map(accountNumber => {
            return ({
              id: accountNumber.guid,
              cols: [
                accountNumber.account_number,
                accountNumber.routing_number,
              ]
            })
          })
        }}
      />
  );
}

export default Verification;
