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
         </div>
       </div>
       <div className="discover-portal"> 
           <div className="img-portal-wrap left"> 
           <img src="https://cdn.prod.website-files.com/66fd5fb3c8ead7df2e10f477/67bc3d56f0aeab61e1f991e9_FINAL.10MEN0373%201%201.jpeg"
           loading="lazy" sizes="(max-width: 864px) 100vw, 864px"
           alt="" id="img-portal-left" className="img-portal"/>
           </div>
           <div className="content-portal">
              <h1 className="heading-2 center">{model && model.name ? model.name : 'Model Name'}</h1>
              <a href={model.link} target="_blank" className="button-primary"> DISCOVER</a>
           </div>
           <div className="img-portal-wrap right"> 
               <img src="https://cdn.prod.website-files.com/66fd5fb3c8ead7df2e10f477/67bc3d556bfcf86fbbd3b5a6_FINAL.10MEN0370%201%201.jpeg"
               loading="lazy" sizes="(max-width: 864px) 100vw, 864px" 
               alt="" id="img-portal-right" className="img-portal"/>
           </div>
       </div>
      </div>
  );
}

export default Pitch;
