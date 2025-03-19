import React from 'react';

function Pitch({ model }) {
  return (
    <div className="pitch"> 
       <div className="bloc---detail">
         <div className="content-fragment">
                {Array.isArray(model) ? model : <div id="p-1" className="content-p" dangerouslySetInnerHTML={{ __html: model.p1 }} />}
                {Array.isArray(model) ? model : <div id="p-2" className="content-p" dangerouslySetInnerHTML={{ __html: model.p2 }} />}
                <div className="reach-us">
                       <span className="content-p">have a needs ?</span>
                       <div id="icon-reach-us" alt="" loading="lazy"/>
                       <span className="content-p"><a href="https://byphine-creative.webflow.io/reach-us">reach us</a></span>
                </div> 
                <div className="vector-path"></div>  
                {Array.isArray(model) ? model : <div id="p-3" className="content-p" dangerouslySetInnerHTML={{ __html: model.p3}} />}     
                <a href={model.link} target="_blank" className="button-primary"> DISCOVER</a>
         </div>
       </div>
      </div>
  );
}

export default Pitch;
