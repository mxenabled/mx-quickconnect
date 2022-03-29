import { useState, useEffect } from 'react';
import RunJobAndPoll from "./RunJobAndPoll";

function Holdings({ memberGuid, userGuid }) {
  const [isLoading, setIsLoading] = useState(false);
  const [holdings, setHoldings] = useState([]);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    if (response !== null) {
      console.log('got response holdings', response)
      setHoldings(response.holdings)
      setIsLoading(false)
    }
  }, [response])

  const loadHoldings = async () => {
    setIsLoading(true);
  }

  return (
    <div className="endpoint">
      <button onClick={loadHoldings} disabled={holdings.length > 0}>
        <h2>Holdings /holdings</h2>
      </button>
      <table className="table">
        <tbody>
          <tr>
            <th>Name</th>
            <th>Shares</th>
            <th>Market Value</th>
            <th>Purchase Price</th>
          </tr>
          { holdings.map(holding => {
            return (
              <tr key={holding.guid}>
                <td>{holding.description}</td>
                <td>{holding.shares}</td>
                <td>{holding.market_value}</td>
                <td>{holding.purchase_price}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {isLoading && (
        <div>
          <span>Loading...</span>
          <RunJobAndPoll
            jobType='holdings'
            userGuid={userGuid}
            setResponse={setResponse}
            memberGuid={memberGuid} />
        </div>
      )}
    </div>
  );
}

export default Holdings;
