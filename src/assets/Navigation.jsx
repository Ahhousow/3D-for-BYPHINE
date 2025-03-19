import React from 'react';

function Navigation({ model, onPrev, onNext }) {
  return (
    <div className="navigation">
            <div  className="nav-contener">
                <div className="nav-item">
                    <button id="left-arrow" onClick={onPrev} className="nav-arrow"></button>
                </div>
                <a href={model.link} target="_blank" className="button-primary"> 
                     <h1 className="nav-title">{model && model.name ? model.name : 'Model Name'}</h1>
                </a>
                <div className="nav-item">
                    <button id="right-arrow" onClick={onNext} className="nav-arrow"></button>
                </div>
            </div>
    </div>
   
  );
}

export default Navigation;
