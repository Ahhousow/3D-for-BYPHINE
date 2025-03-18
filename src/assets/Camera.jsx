import React, { forwardRef, useState, useEffect } from 'react';
import { PerspectiveCamera } from '@react-three/drei';

const Camera = forwardRef((props, ref) => {
  const [cameraZ, setCameraZ] = useState(350);

  useEffect(() => {
    // Function to update cameraZ based on window width
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCameraZ(750);
      } else {
        setCameraZ(350);
      }
    };

    // Check on mount
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <PerspectiveCamera
      ref={ref}
      name="Camera"
      makeDefault={true}
      far={1000}
      near={0.1}
      fov={27}
      position={[0, 0, cameraZ]}
    />
  );
});

export default Camera;
