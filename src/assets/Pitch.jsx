import React from 'react';

function Pitch({ model }) {
  return (
    <div className="pitch"> 
       <div className="bloc---detail">
         <div className="content-fragment">
                {Array.isArray(model) ? model : <div id="p-1" dangerouslySetInnerHTML={{ __html: model.p1 }} />}
                {Array.isArray(model) ? model : <div id="p-2" dangerouslySetInnerHTML={{ __html: model.p2 }} />}
                <div className="reach-us">
                       <span className="content-p">have a needs ?</span>
                       <img className="vectors-wrapper-5" alt="" loading="lazy" />
                       <span className="content-p">reach us</span>
                </div> 
                <div className="vector-path"></div>  
                {Array.isArray(model) ? model : <div id="p-3" dangerouslySetInnerHTML={{ __html: model.p3}} />}     
                <a href="#" target="_blank" className="button-2"> DISCOVER</a>
         </div>
       </div>
      </div>
  );
}

export default Pitch;
