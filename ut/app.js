import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  const [units, setUnits] = useState(Array(10).fill(''));
  const [times, setTimes] = useState(Array(10).fill(''));
  const [timeUnit, setTimeUnit] = useState('years'); 

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('calculatorData'));
    if (storedData) {
      setUnits(storedData.units);
      setTimes(storedData.times);
      setTimeUnit(storedData.timeUnit);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('calculatorData', JSON.stringify({ units, times, timeUnit }));
  }, [units, times, timeUnit]);

  const handleUnitChange = (index, value) => {
    const newUnits = [...units];
    newUnits[index] = value;
    setUnits(newUnits);
  };

  const handleTimeChange = (index, value) => {
    const newTimes = [...times];
    newTimes[index] = value;
    setTimes(newTimes);
  };

  // You'll likely add calculation logic here based on units and times

  return (
    <div className="container">
      <h1>Unit-Time Calculator</h1>
      <div>
        <label>
          <input 
            type="radio" 
            value="years" 
            checked={timeUnit === 'years'} 
            onChange={() => setTimeUnit('years')} 
          /> Years
        </label>
        <label>
          <input 
            type="radio" 
            value="months" 
            checked={timeUnit === 'months'} 
            onChange={() => setTimeUnit('months')} 
          /> Months
        </label>
      </div>

      {units.map((unit, index) => (
        <div key={index} className="input-group mb-3">
          <input 
            type="text" 
            className="form-control" 
            placeholder={`Unit ${index + 1}`} 
            value={unit}
            onChange={(e) => handleUnitChange(index, e.target.value)} 
          />
          <input 
            type="number" 
            className="form-control" 
            placeholder={`Time ${index + 1} (${timeUnit})`} 
            value={times[index]}
            onChange={(e) => handleTimeChange(index, e.target.value)} 
          />
        </div>
      ))}

      {/* ... display results or other calculations */}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
