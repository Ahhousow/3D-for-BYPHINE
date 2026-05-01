// Hero.jsx
import React from 'react';

export default function Hero({ showSkip = false, onSkip = () => {} }) {
  return (
    <div className="hero-stack relative">
      <div className="small-container">
        <div className="title-section">
          <div className="content">
            <div className="copyright-byphine">
              ©byphine - creative agency - paris - seoul
            </div>

            <div className="big-title-byphine">BYPHINE</div>
            <div className="subtitle-byphine"><span class="quote">"</span>INSPIRED BY WHAT WE SAW, CREATED TO BE SEEN<span class="quote">"</span></div>

            <div className="desc-byphine">
              HYBRID CREATIVE - AGENCY FOUR DIVISIONS, ONE CREATIVE OBSESSION.
              WE BUILD IMAGE, STRATEGY AND EXPERIENCES FOR FASHION, MUSIC AND LIFESTYLE BRANDS -
            </div>
          </div>
        </div>
      </div>

      {/* ───────── Skip button (visible only if App says so) ───────── */}
      {showSkip && (
        <button onClick={onSkip} className="button-primary skip-intro">Skip intro</button>
      )}
    </div>
  );
}
