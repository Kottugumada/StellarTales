import React from 'react';

const WebApp = () => {
  return (
    <div className="app-container dark-theme">
      <nav>
        <div className="logo">Stellar Tales</div>
        <div className="modes">
          <button>Live Sky View</button>
          <button>Search</button>
          <button>Stories</button>
        </div>
      </nav>
      
      <main>
        {/* Webcam AR View */}
        <div className="sky-view">
          <video id="webcam" autoPlay />
          <canvas id="overlay" />  {/* For constellation overlays */}
        </div>

        {/* Constellation Info Panel */}
        <div className="info-panel">
          <input type="text" placeholder="Search constellations..." />
          <div className="constellation-details">
            <h2>Current View</h2>
            <div className="stats">
              <span>Visible Stars: 0</span>
              <span>Time: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WebApp; 