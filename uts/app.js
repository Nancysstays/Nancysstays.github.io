import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import Chart from 'chart.js/auto'; 

function App() {
  const [units, setUnits] = useState(Array(10).fill(0));
  const [time, setTime] = useState(Array(10).fill(0));
  const [timeUnit, setTimeUnit] = useState('years'); 
  const chartRef = useRef(null); 

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('chartData'));
    if (storedData) {
      setUnits(storedData.units);
      setTime(storedData.time);
      setTimeUnit(storedData.timeUnit);
    }
  }, []);

  useEffect(() => {
    const chartData = {
      units,
      time,
      timeUnit,
    };
    localStorage.setItem('chartData', JSON.stringify(chartData));

    // Update the chart whenever data changes
    if (chartRef.current) {
      createChart();
    }
  }, [units, time, timeUnit]);

  const handleUnitChange = (index, value) => {
    setUnits(prevUnits => {
      const newUnits = [...prevUnits];
      newUnits[index] = parseFloat(value); 
      return newUnits;
    });
  };

  const handleTimeChange = (index, value) => {
    setTime(prevTime => {
      const newTime = [...prevTime];
      newTime[index] = parseFloat(value); 
      return newTime;
    });
  };

  const createChart = () => {
    const ctx = chartRef.current.getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: time.map((_, i) => (timeUnit === 'years' ? `${i + 1} yr` : `${i + 1} mo`)),
        datasets: [{
          label: 'Units Over Time',
          data: units, 
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      }
    });
  };

  return (
    <div className="container">
      <h1>Unit Chart</h1>

      {/* Input Fields */}
      <div className="row">
        <div className="col-md-6">
          <h2>Units</h2>
          {units.map((unit, index) => (
            <div className="input-group mb-3" key={index}>
              <span className="input-group-text">{index + 1}</span>
              <input 
                type="number" 
                className="form-control" 
                value={unit} 
                onChange={(e) => handleUnitChange(index, e.target.value)} 
              />
            </div>
          ))}
        </div>
        <div className="col-md-6">
          <h2>Time</h2>
          {time.map((timeValue, index) => (
            <div className="input-group mb-3" key={index}>
              <span className="input-group-text">{index + 1}</span>
              <input 
                type="number" 
                className="form-control" 
                value={timeValue} 
                onChange={(e) => handleTimeChange(index, e.target.value)} 
              />
            </div>
          ))}
        </div>
      </div>

      {/* Time Unit Selection */}
      <div className="form-check form-check-inline">
        <input 
          className="form-check-input" 
          type="radio" 
          name="timeUnit" 
          id="years" 
          value="years" 
          checked={timeUnit === 'years'} 
          onChange={(e) => setTimeUnit(e.target.value)} 
        />
        <label className="form-check-label" htmlFor="years">Years</label>
      </div>
      <div className="form-check form-check-inline">
        <input 
          className="form-check-input" 
          type="radio" 
          name="timeUnit" 
          id="months" 
          value="months" 
          checked={timeUnit === 'months'} 
          onChange={(e) => setTimeUnit(e.target.value)} 
        />
        <label className="form-check-label" htmlFor="months">Months</label>
      </div>

      {/* Chart */}
      <canvas ref={chartRef}></canvas> 
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
