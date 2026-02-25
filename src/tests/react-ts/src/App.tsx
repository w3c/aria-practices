import { useState } from 'react';

function Tabs() {
  const [active, setActive] = useState(0);
  const panels = ['Overview', 'Details', 'Settings'];

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid #ccc' }}>
        {panels.map((label, i) => (
          <div
            key={i}
            onClick={() => setActive(i)}
            style={{
              padding: '12px 16px',
              cursor: 'pointer',
              background: active === i ? '#e0e0e0' : 'transparent',
            }}
          >
            {label}
          </div>
        ))}
      </div>
      <div style={{ padding: 16 }}>
        Content for {panels[active]}
      </div>
    </div>
  );
}

function App() {
  const [muted, setMuted] = useState(false);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: 16, borderBottom: '1px solid #ccc' }}>
        <span>Dashboard</span>
        <div
          onClick={() => setMuted(!muted)}
          style={{ padding: '8px 16px', background: '#333', color: 'white', cursor: 'pointer', borderRadius: 4 }}
        >
          {muted ? 'Unmute' : 'Mute'}
        </div>
      </div>

      <div style={{ padding: 24 }}>
        <img src="https://placehold.co/400x150" />
        <h2>Welcome</h2>
        <p>Use the tabs below to navigate.</p>
        <Tabs />

        <form
          onSubmit={(e) => e.preventDefault()}
          style={{ marginTop: 24, maxWidth: 300 }}
        >
          <input type="text" placeholder="Search..." style={{ width: '100%', padding: 8 }} />
          <div
            onClick={() => {}}
            style={{
              marginTop: 8,
              padding: '10px 20px',
              background: '#0066cc',
              color: 'white',
              cursor: 'pointer',
              borderRadius: 4,
              display: 'inline-block',
            }}
          >
            Search
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
