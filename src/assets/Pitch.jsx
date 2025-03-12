import React from 'react';

function Pitch({ model }) {
  return (
    <div className="pitch"> 
      {Array.isArray(model) ? model : <div dangerouslySetInnerHTML={{ __html: model.pitch }} />}
      </div>
  );
}

export default Pitch;
