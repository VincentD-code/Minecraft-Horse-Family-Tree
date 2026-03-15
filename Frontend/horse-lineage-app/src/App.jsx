import React, { useState, useEffect } from 'react';
import CreatePlotlyComponent from 'react-plotly.js/factory';
import Plotly from 'plotly.js-dist-min';

const Plot = CreatePlotlyComponent(Plotly);
import './App.css';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stats');
  const [isBinderOpen, setIsBinderOpen] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8000/api/horse-data')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  if (loading) return <div className="loading">Loading Horse Lineage...</div>;

  return (
    <div className="main-wrapper">
      {/* UI Controls */}
      <div id="mode-ui" onClick={() => console.log("Toggle Mode")}>Change View Mode</div>
      
      {/* Plotly Graph */}
      <Plot
        data={data.graph.data}
        layout={data.graph.layout}
        useResizeHandler={true}
        style={{ width: "100%", height: "100%" }}
        config={{ displayModeBar: false }}
      />

      {/* Binder Side Panel */}
      <div id="binder-container" className={isBinderOpen ? 'active' : ''}>
        <div className="tab-stack">
          <div 
            className={`binder-tab ${activeTab === 'stats' ? 'active-tab' : ''}`}
            onClick={() => { setActiveTab('stats'); setIsBinderOpen(true); }}
          >📊</div>
          <div 
            className={`binder-tab ${activeTab === 'leaderboard' ? 'active-tab' : ''}`}
            onClick={() => { setActiveTab('leaderboard'); setIsBinderOpen(true); }}
          >🏆</div>
          <div 
            className="binder-tab" 
            style={{color: '#ff4444'}}
            onClick={() => setIsBinderOpen(!isBinderOpen)}
          >✖</div>
        </div>

        <div className={`binder-page ${activeTab === 'stats' ? 'active-page' : ''}`}>
          <h2 className="page-header">GENETIC STATS</h2>
          <p>Global Bloodline Distribution:</p>
          <ul>
            {Object.entries(data.stats.blood_all).map(([name, pct]) => (
              <li key={name}>{name}: {pct}%</li>
            ))}
          </ul>
        </div>

        <div className={`binder-page ${activeTab === 'leaderboard' ? 'active-page' : ''}`}>
          <h2 className="page-header">TOP SPEED (ALIVE)</h2>
          <table>
            <tbody>
              {data.stats.top_16_speed.map((horse, i) => (
                <tr key={i}>
                  <td>{i + 1}. {horse.Name}</td>
                  <td>{horse.Speed.toFixed(2)} bps</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;