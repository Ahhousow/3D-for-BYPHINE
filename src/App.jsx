import React, { useState, useRef, useLayoutEffect, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import Model from './assets/Model';
import Navigation from "./assets/Navigation";
import FallbackLoader from './assets/FallbackLoader';
import Camera from './assets/Camera';
import Hero from './assets/Hero';
import Pitch from './assets/Pitch';
import Timeline from './assets/Timeline';
import "./styles.css";
import gsap from "gsap";
import modelsData from './data/modelsData';
import SplitType from 'split-type';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const cameraRef = useRef();
  const controlsRef = useRef();
  const [floatEnabled, setFloatEnabled] = useState(true);
  const sceneGroupRef = useRef();
  const [isSceneGroupReady, setIsSceneGroupReady] = useState(false);

  // On stocke les références des modèles dans un ref
  const timelineRefs = useRef([]);
  // Flag pour signaler que toutes les refs attendues sont disponibles (ici, 4 modèles)
  const [areTimelineRefsReady, setAreTimelineRefsReady] = useState(false);

  const groupCount = 5; // Nombre de groupes/modèles

  // Fonction de rappel pour enregistrer les références d'un modèle
  const registerTimelineRefs = (index, refs) => {
    timelineRefs.current[index] = refs;
    // Vérifier si toutes les références ont été enregistrées
    if (timelineRefs.current.filter(r => !!r).length === groupCount) {
      setAreTimelineRefsReady(true);
    }
  };

  // Suivi du responsive
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const isMobile = windowWidth < 768;

  const basePositions = [
    [0, -60, 0],
    [-130, 0, -10],
    [40, 60, -30],
    [130, 0, 10],
    [-40, 60, 10],

  ];
  const responsivePositions = basePositions.map(([x, y, z]) => {
  const responsiveX = isMobile ? x / 2 : x;
    let responsiveY = y;
    if (isMobile) {
      if (y === 60) responsiveY = 50;
      else if (y === -60) responsiveY = -50;
    }
    return [responsiveX, responsiveY, z];
  });
  const scales = [
    [2, 2, 2],
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ];

  // L'ordre détermine quel modèle est assigné à quel groupe
  const [groupModels, setGroupModels] = useState([
    modelsData[0],
    modelsData[1],
    modelsData[2],
    modelsData[3],
    modelsData[4],

  ]);
  const activeModel = groupModels[0];

  const changeModel = (direction) => {
    setGroupModels(prev => {
      const newArr = [...prev];
      if (direction < 0) {
        const first = newArr.shift();
        newArr.push(first);
      } else {
        const last = newArr.pop();
        newArr.unshift(last);
      }
      return newArr;
    });
  
    // Lancer l'animation de scale pour le modèle actif (celui à l'indice 0)
    const activeModelRef = timelineRefs.current[0]?.groupRef?.current;
    if (activeModelRef) {
      // On anime de 0.8x à la scale d'origine pour un effet de "pop"
      gsap.fromTo(
        activeModelRef.scale,
        { 
          x: activeModelRef.scale.x * 0.8, 
          y: activeModelRef.scale.y * 0.8, 
          z: activeModelRef.scale.z * 0.8 
        },
        { 
          x: activeModelRef.scale.x, 
          y: activeModelRef.scale.y, 
          z: activeModelRef.scale.z, 
          duration: 0.5, 
          ease: 'power2.out' 
        }
      );
    }
  };
  

  const preventScroll = (event) => {
    event.preventDefault();
    event.stopPropagation();
    return false;
  };

  // Animation d'intro avec gsap et SplitType (inchangée)
  useLayoutEffect(() => {
    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });

    const heroTitle = new SplitType(".big-title-byphine");
    const heroSubTitle = new SplitType(".subtitle-byphine");
    const copyrightTitle = new SplitType(".copyright-byphine");
    const heroDescTitle = new SplitType(".desc-byphine", { types: "words, chars" });

    const introTL = gsap.timeline({
      onComplete: () => {
        window.removeEventListener('wheel', preventScroll);
        window.removeEventListener('touchmove', preventScroll);
      },
    });
   // Les animations d'intro sont laissées en commentaire comme dans la version d'origine
    introTL
      .from(heroTitle.chars, { duration: 0.2, ease: "back", filter: "blur(0.3em)", opacity: 0, scale: 1.5, stagger: 0.2 })
      .from(heroSubTitle.chars, { duration: 0.2, delay: 0.25, ease: "back", filter: "blur(0.3em)", opacity: 0, scale: 0.5, stagger: 0.02, xPercent: -25 })
      .from(heroDescTitle.chars, { duration: 0.5, filter: "blur(0.3em)", opacity: 0, y: 10, stagger: 0.02 })
      .from(copyrightTitle.chars, { duration: 0.5, filter: "blur(0.3em)", opacity: 0, y: 10, stagger: 0.02 }, "<")
      .from(".logo-header, .menu-open", { opacity: 0, y: -30, duration: 0.75 })
      .from(".scene3d", { opacity: 0, y: -30, duration: 0.75 });
  }, []);

  return (
    <div className="app">
      <Hero />
      <div
        className="scene-3d-wrapper"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 10
        }}
      >
        <Canvas className="scene3d">
          <OrbitControls ref={controlsRef} enableZoom={false} enableRotate={false} target={[0, 0, 0]} />
          <Camera ref={cameraRef} />
          <group ref={node => { 
            sceneGroupRef.current = node; 
            if (node && !isSceneGroupReady) setIsSceneGroupReady(true);
          }}>
            <ambientLight intensity={0.1} />
            {groupModels.map((model, index) => (
              <Suspense fallback={<FallbackLoader />} key={index}>
                <Model 
                  groupIndex={index}
                  modelData={model}
                  position={responsivePositions[index]}
                  scale={scales[index]}
                  isActive={index === 0}
                  cameraRef={cameraRef}
                  controlsRef={controlsRef}
                  setFloatEnabled={setFloatEnabled}
                  sceneGroupRef={sceneGroupRef}
                  registerTimelineRefs={registerTimelineRefs}
                />
              </Suspense>
            ))}
            <Environment files="https://master--bejewelled-bunny-c31012.netlify.app/models/machine_shop_02_1k.hdr" />
          </group>
        </Canvas>
      </div>
      <div className="spacex-scroll"></div>
      <Navigation
        model={activeModel}
        onNext={() => changeModel(-1)}
        onPrev={() => changeModel(1)}
      />
      <Pitch model={activeModel} />
      {/* On n'affiche la Timeline qu'une fois que toutes les références sont prêtes */}
      {areTimelineRefsReady && (
        <Timeline 
          timelineRefs={timelineRefs.current} 
          cameraRef={cameraRef} 
          controlsRef={controlsRef} 
          sceneGroupRef={sceneGroupRef} 
          setFloatEnabled={setFloatEnabled} 
        />
      )}
      <div className="footer"></div>
    </div>
  );
}
