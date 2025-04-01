import React, { useRef, useEffect } from 'react';
import { useGLTF, Float } from '@react-three/drei';

const Model = ({
  groupIndex,
  modelData,
  position = [0, 0, 0],
  scale = [1, 1, 1],
  isActive,
  cameraRef,
  controlsRef,
  setFloatEnabled,
  sceneGroupRef,
  registerTimelineRefs
}) => {
  const { scene: gltfScene } = useGLTF(modelData.file);
  const groupRef = useRef();
  const modelContainerRef = useRef();

  // Mise à jour du container 3D lors du changement de modelData
  useEffect(() => {
    if (modelContainerRef.current) {
      modelContainerRef.current.clear();
      const object = gltfScene.clone();
      object.traverse(child => {
        if (child.isMesh) {
          if (child.name === modelData.targetMesh && modelData.color) {
            child.material.color.set(modelData.color);
          }
          if (child.name.includes("Text-")) {
            child.material.opacity = 0;
          } else {
            child.material.opacity = 1;
          }
          child.material.transparent = true;
          child.material.metalness = 0;
          child.material.roughness = 0.2;
        }
      });
      modelContainerRef.current.add(object);
    }
  }, [modelData, gltfScene]);

  // Enregistrement des références pour les timelines
  useEffect(() => {
    if (registerTimelineRefs) {
      registerTimelineRefs(groupIndex, {
        groupRef,
        modelContainerRef,
        groupIndex,
        position,
        scale,
        isActive
      });
    }
  }, [registerTimelineRefs, groupIndex, position, scale, isActive]);

  return (
    <group ref={groupRef}>
      <Float speed={2.5} rotationIntensity={1.5} floatIntensity={4.5}>
        <group ref={modelContainerRef} />
      </Float>
    </group>
  );
};

export default Model;