import { useState } from 'react';
import MXEndpoint from "./MXEndpoint";

function Verification({userGuid, memberGuid}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accountNumbers, setAccountNumbers] = useState([]);
  const [jsonData, setJsonData] = useState(null);
  const [status, setStatus] = useState(2);

  const loadAccountNumbers = async () => {
    setIsLoading(true);
    await fetch(`/users/${userGuid}/members/${memberGuid}/verify`)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        throw new Error()
      })
      .then((res) => {
        console.log('verification response', res);
        setAccountNumbers(res.account_numbers);
        setStatus(status + 1);
        setJsonData(res);
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        setError({
          code: '400',
          type: 'Bad Request',
          message: 'You dont have access to this premium feature.',
          link: 'https://docs.mx.com/api#verification_mx_widgets'
        })
      });
  }

  return (
    <MXEndpoint
        docsLink="https://docs.mx.com/api#verification_mx_widgets"
        error={error}
        finalDataUrl="/users/{user_guid}/members/{member_guid}/account_numbers"
        jobType="Verification"
        status={status}
        showNotice={true}
        title="Account Verification"
        requestType="POST"
        requestUrl="/users/{user_guid}/members/{member_guid}/verify"
        isLoading={isLoading}
        subText="Account verification allows you to access account and routing numbers for demand deposit accounts associated with a particular member."
        onAction={loadAccountNumbers}
        jsonData={jsonData}
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
