import React from 'react';

function Navigation({ model, onPrev, onNext }) {
  // Utiliser model.color ou une couleur par défaut
  const cursorColor = model && model.color ? model.color : "#000000";
  
  // Création du SVG représentant un cercle de 15x15 pixels avec la couleur dynamique.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30">
                 <circle cx="15" cy="15" r="15" fill="${cursorColor}" />
               </svg>`;
  
  // Encodage du SVG et création de la data URL pour le curseur.
  // Les coordonnées du hotspot sont définies à "1515" pour centrer le curseur.
  const customCursor = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}") 15 15, auto`;

  return (
    <div className="navigation">
      <div className="nav-contener">
        <div className="nav-item">
          <button id="left-arrow" onClick={onPrev} className="nav-arrow"></button>
        </div>
        <a href={model.link} rel="noopener noreferrer">
          {/* Application du curseur personnalisé sur le titre en hover */}
          <h1 className="nav-title" style={{ cursor: customCursor }}>
            {model && model.name ? model.name : 'Model Name'}
          </h1>
        </a>
        <div className="nav-item">
          <button id="right-arrow" onClick={onNext} className="nav-arrow"></button>
        </div>
      </div>
    </div>
  );
}

export default Navigation;
