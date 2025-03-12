// FallbackLoader.jsx
import React from 'react';

function FallbackLoader() {
  return (
    <mesh>
      <boxGeometry />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

export default FallbackLoader;
