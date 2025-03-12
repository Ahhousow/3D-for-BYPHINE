import React, { useState, useRef, useLayoutEffect, useEffect, Suspense } from 'react';
import { Bloom, DepthOfField, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float } from '@react-three/drei';
import Model from './assets/Model';
import Navigation from "./assets/Navigation";
import FallbackLoader from './assets/FallbackLoader';
import Camera from './assets/Camera';
import Hero from './assets/Hero';
import Pitch from './assets/Pitch';
import "./styles.css";
import gsap from "gsap";
import modelsData from './data/modelsData';
import SplitType from 'split-type';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const cameraRef = useRef(); // Référence pour la camera
  const controlsRef = useRef(); // Référence pour OrbitControls
  const floatRef = useRef(); // Référence pour OrbitControls
  const [isSceneGroupReady, setIsSceneGroupReady] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sceneGroupRef = useRef(); // Référence pour la scène entière
  const [floatEnabled, setFloatEnabled] = useState(true); // Nouvel état pour contrôler le flottement

  // Fonction pour empêcher le scroll
  const preventScroll = (event) => {
    event.preventDefault();
    event.stopPropagation();
    return false;
  };

  // Animation HERO
    useLayoutEffect(() => {
        // Bloquer complètement le scroll en ajoutant un écouteur

        window.addEventListener('wheel', preventScroll, { passive: false });
        window.addEventListener('touchmove', preventScroll, { passive: false });

        const heroTitle = new SplitType(".big-title-byphine");
        const heroSubTitle = new SplitType(".subtitle-byphine");
        const copyrightTitle = new SplitType(".copyright-byphine");
        const heroDescTitle = new SplitType(".desc-byphine", { types: "words, chars" });

        const introTL = gsap.timeline({
          onComplete: () => {
            // Retirer le blocage du scroll à la fin de la timeline
            window.removeEventListener('wheel', preventScroll);
            window.removeEventListener('touchmove', preventScroll);

          },
        });

        // introTL.from(heroTitle.chars, 0.2, { ease: "back", filter: "blur(0.3em)", opacity: 0, scale: 1.5, stagger: 0.5})
        //       .from(heroSubTitle.chars, 0.2, { delay: 0.25, filter: "blur(0.3em)", opacity: 0, scale: 0.5, stagger: 0.02,xPercent: -25})
        //       .from(heroDescTitle.chars, { duration: 0.5, filter: "blur(0.3em)", opacity: 0, y: 10, stagger: 0.02})
        //       .from(copyrightTitle.chars,{ duration: 0.5, filter: "blur(0.3em)", opacity: 0, y: 10, stagger: 0.02}, "<")
        //       .from(".logo, .menu", { opacity: 0,y: -30,duration: 0.75,})
        //       .from(".scene3d", { opacity: 0,y: -30,duration: 0.75,});

  }, []); 
 

  // Animation SCROLL (tlMargin) avec rotation de la scène
  useEffect(() => {
    if (!isSceneGroupReady) {
      return;
    }
  
 
    return () => {
      ctx.revert();
    };
  }, [isSceneGroupReady]); // Déclenche le useEffect lorsque la référence est prête

  // Navigation entre les modèles 3d

  const [carouselModels, setCarouselModels] = useState([
    { ...modelsData[0], positionIndex: 0 },
    { ...modelsData[1], positionIndex: 1 },
    { ...modelsData[2], positionIndex: 2 },
    { ...modelsData[3], positionIndex: 3 },
  ]);
  const activeModel = carouselModels.find(model => model.positionIndex === 0);

  const positions = [
    [0, -50, 0],    // Position 0 (active)
    [-110, 0, -10],    // Position 1
    [0, 50, 0],     // Position 2
    [100, 0, 10],     // Position 3
  ];

  const scales = [
    [1.5, 1.5, 1.5], // Échelle pour le modèle actif
    [1, 1, 1],       // Échelle pour les autres modèles
    [1, 1, 1],
    [1, 1, 1],
  ];

const changeModel = (direction) => {

  // Nettoyer uniquement les ScrollTriggers liés à vos animations 3D
  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.id && st.vars.id.startsWith("3d-actif")) {
      st.kill();
    }
  });
  
  // Supprimer les éléments pin-spacer dans le conteneur .navigation
  const navEl = document.querySelector('.navigation');
  if (navEl) {
    navEl.querySelectorAll('.pin-spacer').forEach(spacer => spacer.remove());
  }
  
  setCarouselModels((prevModels) => {
    return prevModels.map((model) => {
      let newPositionIndex = (model.positionIndex + direction + 4) % 4;
      return { ...model, positionIndex: newPositionIndex };
    });
  });

    // Optionnel : forcer un rafraîchissement de ScrollTrigger
    ScrollTrigger.refresh();
};

 
return (
  <div className="app">
    <div className="scene-3d-wrapper" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 10 }}>
      <Canvas className="scene3d">
        <OrbitControls ref={controlsRef} enableZoom={false} enableRotate={false} target={[0, 0, 0]} />
        <group ref={node => { sceneGroupRef.current = node; if (node && !isSceneGroupReady) setIsSceneGroupReady(true); }}>
          <ambientLight intensity={0.1} />
          <Camera ref={cameraRef} />
          {carouselModels.map((model) => (
            <Suspense fallback={<FallbackLoader />} key={model.id}>
              <Float speed={floatEnabled ? 1 : 0} rotationIntensity={floatEnabled ? 1.5 : 0} floatIntensity={floatEnabled ? 2.5 : 0}>
              <Model
                          modelData={model}
                          position={positions[model.positionIndex]}
                          scale={scales[model.positionIndex]}
                          isActive={model.positionIndex === 0}
                          cameraRef={cameraRef} // Passer la référence de la caméra
                          controlsRef={controlsRef} // Passer la référence des contrôles
                          setFloatEnabled={setFloatEnabled} // Passer setFloatEnabled ici
                          />
              </Float>
            </Suspense>
          ))}
          <Environment files="https://master--bejewelled-bunny-c31012.netlify.app/public/models/machine_shop_02_1k.hdr" />
        </group>
      </Canvas>
    </div>
    <Hero />
    <div className="spacex-scroll"></div>
    <Navigation
      model={activeModel}
      onNext={() => changeModel(-1)}
      onPrev={() => changeModel(1)}
    />
       {/* Contenu associé au modèle */}
       <Pitch model={activeModel} />
  </div>
);
}