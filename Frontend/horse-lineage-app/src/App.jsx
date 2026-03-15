import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // The path './horse_data.json' works because Vite serves 
    // everything in the 'public' folder at the root level.
    fetch('horse_data.json')
      .then((res) => {
        if (!res.ok) throw new Error("JSON file not found. Run Python script!");
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);C
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{padding: '50px', textAlign: 'center'}}><h2>Loading Horse Genetics...</h2></div>;
  if (!data) return <div style={{padding: '50px', color: 'red'}}>Error: horse_data.json missing in public folder.</div>;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '20px', textAlign: 'center', borderBottom: '1px solid #222' }}>
        <h1 style={{ color: '#FFD700', textTransform: 'uppercase', letterSpacing: '2px' }}>
          Minecraft Horse Family Tree
        </h1>
      </div>

      {/* Main Graph Area */}
      <div style={{ flex: 1, width: '100%', height: '70vh' }}>
        <Plot
          data={data.graph.data}
          layout={{
            ...data.graph.layout,
            autosize: true,
            font: { family: 'monospace', color: '#fff' },
          }}
          useResizeHandler={true}
          style={{ width: '100%', height: '100%' }}
          config={{ responsive: true, displayModeBar: true }}
        />
      </div>

      {/* Stats Dashboard */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', padding: '30px', background: '#0a0a0a' }}>
        
        {/* Top Speed Card */}
        <div style={{ background: '#111', padding: '20px', border: '1px solid #333', borderRadius: '4px' }}>
          <h3 style={{ color: '#00FF7F', borderBottom: '1px solid #222' }}>⚡ FASTEST HORSES</h3>
          {data.stats.top_16_speed.slice(0, 8).map((h, i) => (
            <div key={i} style={{ padding: '4px 0', fontSize: '14px' }}>
              <span style={{color: '#666'}}>{i+1}.</span> {h.Name} — <span style={{color: '#00D4FF'}}>{h.Speed} bps</span>
            </div>
          ))}
        </div>

        {/* Bloodline Breakdown Card */}
        <div style={{ background: '#111', padding: '20px', border: '1px solid #333', borderRadius: '4px' }}>
          <h3 style={{ color: '#FF004F', borderBottom: '1px solid #222' }}>🧬 LIVING BLOODLINES</h3>
          {Object.entries(data.stats.blood_alive)
            .sort(([,a], [,b]) => b - a)
            .map(([name, pct]) => (
              <div key={name} style={{ padding: '4px 0', fontSize: '14px' }}>
                {name}: <span style={{color: '#FFD700'}}>{pct}%</span>
              </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default App;