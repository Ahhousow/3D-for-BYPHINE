import React, { forwardRef } from 'react';
import { PerspectiveCamera } from '@react-three/drei'

const Camera = forwardRef((props, ref) => {
  return (
    <PerspectiveCamera
      ref={ref}
      name="Camera"
      makeDefault={true}
      far={1000}
      near={0.1}
      fov={27}
      position={[0, 0, 350]}
    />
  );
});

export default Camera;