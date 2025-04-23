// Hero.jsx
import React from 'react';

export default function Hero({ showSkip = false, onSkip = () => {} }) {
  return (
    <div className="hero-stack relative">
      <div className="small-container">
        <div className="title-section">
          <div className="content">
            <div className="copyright-byphine">
              ©byphine creative speaking
            </div>

            <div className="big-title-byphine">BYPHINE</div>
            <div className="subtitle-byphine">for modern brand</div>

            <div className="desc-byphine">
              WE CRAFT UNIQUE, INNOVATIVE AND MEMORABLE DIGITAL EXPERIENCES
              THAT STRIVE TO PUSH THE BOUNDARIES AND LEAVE A LASTING IMPACT
              THROUGH DESIGN AND INTERACTIVITY
            </div>
          </div>
        </div>
      </div>

      {/* ───────── Skip button (visible only if App says so) ───────── */}
      {showSkip && (
        <button
          onClick={onSkip}
          className="secondary-button skip-intro"
        >
          Skip intro
        </button>
      )}
    </div>
  );
}
