import React, { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import Model from "./Model";

const modelsData = [
  { name: "Da", url: "http://localhost:5173/models/da-transformed.glb" },
  { name: "Consulting", url: "http://localhost:5173/models/consulting-transformed.glb" },
  { name: "Event", url: "http://localhost:5173/models/event-transformed.glb" },
  { name: "Management", url: "http://localhost:5173/models/management-transformed.glb" },
];

function Objectbyphine({ currentModel }) {
  const containerRef = useRef();
  const modelRefs = useRef([]);

  useEffect(() => {
    // Animation de flottement
    modelRefs.current.forEach((ref, index) => {
      if (ref) {
        gsap.to(ref.position, {
          y: "+=0.3",
          duration: 2,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          delay: index * 0.2,
        });
      }
    });
  }, []);

  useFrame(({ clock, camera }) => {
    const elapsedTime = clock.getElapsedTime();
    const mainModel = modelRefs.current[currentModel];
    if (mainModel) {
      mainModel.rotation.y += 0.01;
      gsap.to(camera.position, {
        z: 5 + Math.sin(elapsedTime) * 2,
        duration: 0.1,
      });
    }
  });

  return (
    <group ref={containerRef}>
      {modelsData.map((model, index) => (
        <Model
          key={model.name}
          url={model.url}
          position={[index * 3 - 5, 0, 0]}
          isVisible={index === currentModel}
          ref={(el) => (modelRefs.current[index] = el)}
        />
      ))}
    </group>
  );
}

export default Objectbyphine;
