import React, { useState, useRef, useLayoutEffect, useEffect, Suspense } from 'react';
import { Bloom, DepthOfField, EffectComposer, Noise, Vignette } from '@react-three/postprocessing';
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

function ScrollTriggersInitializer() {
  useEffect(() => {
    const refreshTriggers = () => {
      ScrollTrigger.refresh();
    };

    if (document.readyState === 'complete') {
      refreshTriggers();
    } else {
      window.addEventListener('load', refreshTriggers);
    }

    const timeoutId = setTimeout(() => {
      refreshTriggers();
    }, 1000);

    return () => {
      window.removeEventListener('load', refreshTriggers);
      clearTimeout(timeoutId);
    };
  }, []);

  return null;
}

export default function App() {
  const cameraRef = useRef();
  const controlsRef = useRef();
  const sceneGroupRef = useRef();
  const [isSceneGroupReady, setIsSceneGroupReady] = useState(false);
  const [floatEnabled, setFloatEnabled] = useState(true);
  const [isPitchReady, setIsPitchReady] = useState(false);

  // Add a state to track window width
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Listen to window resize events
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Define mobile threshold; here, mobile is considered < 768px wide
  const isMobile = windowWidth < 768;

  // Original positions array (x, y, z)
  const basePositions = [
    [0, -50, 0],    // Active model position
    [-110, 0, -10],
    [0, 50, 0],
    [100, 0, 10],
  ];

  // Compute responsive positions: only adjust the x-axis value on mobile.
  const responsivePositions = basePositions.map(([x, y, z]) => [
    isMobile ? x / 2 : x, // Divide x by 2 if mobile
    y,
    z,
  ]);

  // Carousel state management
  const [carouselModels, setCarouselModels] = useState([
    { ...modelsData[0], positionIndex: 0 },
    { ...modelsData[1], positionIndex: 1 },
    { ...modelsData[2], positionIndex: 2 },
    { ...modelsData[3], positionIndex: 3 },
  ]);
  const activeModel = carouselModels.find(model => model.positionIndex === 0);

  const scales = [
    [1.5, 1.5, 1.5],
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ];

  const preventScroll = (event) => {
    event.preventDefault();
    event.stopPropagation();
    return false;
  };

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

    // Example animations (uncomment and adjust as needed):
    // introTL.from(heroTitle.chars, { duration: 0.2, ease: "back", filter: "blur(0.3em)", opacity: 0, scale: 1.5, stagger: 0.2 })
    //        .from(heroSubTitle.chars, { duration: 0.2, delay: 0.25, ease: "back", filter: "blur(0.3em)", opacity: 0, scale: 0.5, stagger: 0.02, xPercent: -25 })
    //        .from(heroDescTitle.chars, { duration: 0.5, filter: "blur(0.3em)", opacity: 0, y: 10, stagger: 0.02 })
    //        .from(copyrightTitle.chars, { duration: 0.5, filter: "blur(0.3em)", opacity: 0, y: 10, stagger: 0.02 }, "<")
    //        .to(".logo-header, .menu-open", { opacity: 0, y: -30, duration: 0.75 })
    //        .from(".scene3d", { opacity: 0, y: -30, duration: 0.75 });
  }, []);

  useEffect(() => {
    if (!isSceneGroupReady) return;
    // Optionally add ScrollTrigger animations for the scene here.
    return () => {
      // Cleanup if needed.
    };
  }, [isSceneGroupReady]);

  const changeModel = (direction) => {
    ScrollTrigger.getAll().forEach(st => {
      if (st.vars.id && st.vars.id.startsWith("3d-actif")) {
        st.kill();
      }
    });

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

    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  };

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
          <group ref={node => { 
            sceneGroupRef.current = node; 
            if (node && !isSceneGroupReady) setIsSceneGroupReady(true);
          }}>
            <ambientLight intensity={0.1} />
            <Camera ref={cameraRef} />
            {carouselModels.map((model) => (
              <Suspense fallback={<FallbackLoader />} key={model.id}>
                <Float
                  speed={floatEnabled ? 1 : 0}
                  rotationIntensity={floatEnabled ? 1.5 : 0}
                  floatIntensity={floatEnabled ? 2.5 : 0}
                >
                  <Model
                    modelData={model}
                    position={responsivePositions[model.positionIndex]}  // Use responsive x-axis position here
                    scale={scales[model.positionIndex]}
                    isActive={model.positionIndex === 0}
                    cameraRef={cameraRef}
                    controlsRef={controlsRef}
                    setFloatEnabled={setFloatEnabled}
                  />
                </Float>
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
      <Pitch model={activeModel}/>
      {/* <div className="footer"></div> */}
    </div>
  );
}
