import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import ChatInterface from './components/ChatInterface';
import './index.css';

function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'app'

  if (view === 'landing') {
    return <LandingPage onLaunch={() => setView('app')} />;
  }

  return (
    <>
      {/* Fixed background — stays put, never scrolls, glows don't cause scrollbars */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        background: 'radial-gradient(ellipse at top, #14100d 0%, #0c0908 55%, #050404 100%)',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-160px', left: '-160px', width: '600px', height: '600px', borderRadius: '50%', background: 'rgba(245,158,11,0.12)', filter: 'blur(120px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-160px', right: '-160px', width: '600px', height: '600px', borderRadius: '50%', background: 'rgba(244,63,94,0.06)', filter: 'blur(120px)', pointerEvents: 'none' }} />
      </div>

      {/* Scrollable centering wrapper — no overflow:hidden so card is never clipped */}
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 16px',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Card: always calc(100vh - 80px) so it ALWAYS fits inside the viewport */}
        <div style={{
          width: '100%',
          maxWidth: '1024px',
          height: 'calc(100vh - 80px)',
          minHeight: '480px',
          maxHeight: '800px',
        }}>
          <ChatInterface onBackToHome={() => setView('landing')} />
        </div>
      </div>
    </>
  );
}

export default App;
