const { useState } = React; 

function App() {
    const [revenue, setRevenue] = useState(0);
    const [costOfGoodsSold, setCostOfGoodsSold] = useState(0);
    const [operatingExpenses, setOperatingExpenses] = useState(0);

    const calculate = () => {
        const grossProfit = revenue - costOfGoodsSold;
        const operatingIncome = grossProfit - operatingExpenses;
        const netIncome = operatingIncome; 

        alert(`
            Gross Profit: ${grossProfit}
            Operating Income: ${operatingIncome}
            Net Income: ${netIncome}
        `);
    };

    return (
        <div className="container">
            <h1>Financial Statement Calculator</h1>
            <div className="form-group">
                <label htmlFor="revenue">Revenue:</label>
                <input 
                    type="number" 
                    className="form-control" 
                    id="revenue" 
                    value={revenue} 
                    onChange={(e) => setRevenue(parseFloat(e.target.value))} 
                />
            </div>
            <div className="form-group">
                <label htmlFor="costOfGoodsSold">Cost of Goods Sold:</label>
                <input 
                    type="number" 
                    className="form-control" 
                    id="costOfGoodsSold" 
                    value={costOfGoodsSold} 
                    onChange={(e) => setCostOfGoodsSold(parseFloat(e.target.value))} 
                />
            </div>
            <div className="form-group">
                <label htmlFor="operatingExpenses">Operating Expenses:</label>
                <input 
                    type="number" 
                    className="form-control" 
                    id="operatingExpenses" 
                    value={operatingExpenses} 
                    onChange={(e) => setOperatingExpenses(parseFloat(e.target.value))} 
                />
            </div>
            <button className="btn btn-primary" onClick={calculate}>Calculate</button>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
