import { useState } from 'react';

function Holdings() {
  const [isLoading, setIsLoading] = useState(false);
  const [holdings, setHoldings] = useState([]);

  const loadHoldings = async () => {
    setIsLoading(true);
    await fetch(`/api/holdings`)
      .then(res => res.json())
      .then((res) => {
        console.log('response', res);
        setHoldings(res.holdings);
        setIsLoading(false);
      });
  }

  return (
    <div className="endpoint">
      <button onClick={loadHoldings} disabled={holdings.length > 0}>
        <h2>Holdings /holdings</h2>
      </button>
      <table>
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
      {isLoading && (<h3>Loading Investment Holdings</h3>)}
    </div>
  );
}

export default Holdings;
