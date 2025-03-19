// Model.jsx
import React, { forwardRef, useRef, useLayoutEffect, useEffect, useImperativeHandle } from 'react';
import { useGLTF } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Power2 } from 'gsap';

gsap.registerPlugin(ScrollTrigger);

const Model = forwardRef(({
  modelData,
  position = [0, 0, 0],
  scale = [1, 1, 1],
  isActive,
  cameraRef,
  controlsRef,
  setFloatEnabled,
  groupRef  // <-- New prop for the parent group reference
}, ref) => {
  const { scene: objectbyphine } = useGLTF(modelData.file);
  const modelRef = useRef();

  // References for timelines and ScrollTriggers
  const timelinesRef = useRef([]);
  const scrollTriggersRef = useRef([]);
  const positionAnimRef = useRef();
  const scaleAnimRef = useRef();

  useImperativeHandle(ref, () => modelRef.current);

  useLayoutEffect(() => {
    // Compute responsive factor only for scrolltrigger tweens
    const isMobile = window.innerWidth < 768;
    const offsetXFactor = isMobile ? 0.5 : 1;

    const initModel = () => {
      if (!objectbyphine) return;

      modelRef.current = objectbyphine;

      // Initialize position and scale (parameters remain unchanged)
      gsap.set(objectbyphine.position, { x: position[0], y: position[1], z: position[2] });
      gsap.set(objectbyphine.scale, { x: scale[0], y: scale[1], z: scale[2] });

      // Configure materials
      objectbyphine.traverse(child => {
        if (child.isMesh) {
          //Body material
          if (child.name === modelData.targetMesh && modelData.color) {
            child.material.color.set(modelData.color);
          }
           // Eye material
          // if (
          //   child.material &&
          //   child.material.name &&
          //   child.material.name.startsWith("Material_1") &&
          //   modelData.color
          // ) {
          //   child.material.color.set(modelData.coloreye);
          //   child.material.transparent = true;
          //   child.material.metalness = 0;
          //   child.material.roughness = 0.2;
          // }
          //Text material
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

      // Kill any previous ScrollTriggers and timelines
      timelinesRef.current.forEach(tl => tl.kill());
      scrollTriggersRef.current.forEach(st => st.kill());
      timelinesRef.current = [];
      scrollTriggersRef.current = [];

      // Helper to build timelines with scroll triggers
      const createTimeline = (triggerConfig, animationCallback) => {
        const tl = gsap.timeline({ 
          scrollTrigger: {
            ...triggerConfig,
            toggleActions: "play reverse play reverse",
          }
        });
        animationCallback(tl);
        scrollTriggersRef.current.push(tl.scrollTrigger);
        timelinesRef.current.push(tl);
      };

      if (isActive) {
        // Use a persistent object variable for tweening its 'y' property
        const initialTargetY = 0;
        const targetObj = { y: initialTargetY };

        const addGroupTween = () => {
          if (groupRef && groupRef.current) {
        // Single timeline for active model & group rotation ("3d-actif-start")
        createTimeline(
          {
            id: "3d-actif-start",
            trigger: ".hero-stack",
            start: 'bottom bottom',
            end: '+=1505px',
            scrub: 1,
            invalidateOnRefresh: false,
           // markers: { startColor: "blue", endColor: "red", indent: 0 },
          },
          tl => {
            tl.to(objectbyphine.rotation, { x: "+=3.14159", y: "+=3.14159", ease: "none" }, 0.2)
              .to(objectbyphine.scale, { x: scale[0] * 1.5, y: scale[1] * 1.5, z: scale[2] * 1.5 }, 0)
              .fromTo(
                targetObj,
                { y: initialTargetY },
                { 
                  y: -80,
                  ease: "none",
                  immediateRender: false,
                  onUpdate: function() {
                    controlsRef.current.target.y = targetObj.y;
                    controlsRef.current.update();
                  }
                },0
              )
              .to(cameraRef.current.position, { x: 0, y: -350, z: 300 }, 0)
               .to(groupRef.current.rotation, { y: "+=3.14159", z:"+=3.14159", ease: "none" },0.1)
               .to(groupRef.current.rotation, { y: "+=3.14159", z:"+=3.14159", ease: "none" },0.6);


          }
        );
      }else {
        // Wait until groupRef.current is available
        requestAnimationFrame(addGroupTween);
      }
    };
    addGroupTween();
        // Timeline for navigation ("3d-actif-nav")
        createTimeline(
          {
            id: "3d-actif-nav",
            trigger: ".navigation",
            start: 'top center',
            end: '+=255px',
            pin: true,
            invalidateOnRefresh: false,
            //markers: { startColor: "blue", endColor: "blue", indent: 5 },
            onLeave: () => {
              gsap.to(".nav-item", { display: "none", ease: 'none' }, 0);
            },
            onEnterBack: () => {
              gsap.to(".nav-item", { display: "flex", ease: 'none' }, 0);
            }
          },
          tl => {
            // Navigation animations (if needed)
          }
        );

        // Timeline for the pitch section ("3d-actif-pitch")
        createTimeline(
          {
            id: "3d-actif-pitch",
            trigger: ".pitch",
            start: 'top-=80px center',
            end: '+=350px',
            scrub: 1,
            invalidateOnRefresh: false,
           // markers: { startColor: "green", endColor: "green", indent: 15 },
            onEnter: () => setFloatEnabled(false),
            onLeaveBack: () => setFloatEnabled(true)
          },
          tl => {
            tl.to(objectbyphine.rotation, { x: "+=3.14159", y: "+=3.14159", ease: "none" }, 0)
              // Only update the x tween responsively; the parameter remains unchanged
              .to(objectbyphine.position, { x: `+=${100 * offsetXFactor}`, ease: "none" }, 0)
              .to(objectbyphine.scale, { x: scale[0] * 1.5, y: scale[1] * 1.5, z: scale[2] * 1.5, ease: "none" }, 0)
              .to(cameraRef.current.position, { x: 0, y: 0, z: 200 }, 0);
          }
        );

        // Timeline for the "reach-us" section ("3d-actif-reach-us")
        createTimeline(
          {
            id: "3d-actif-reach-us",
            trigger: ".reach-us",
            start: 'top center',
            end: '+=450px',
            scrub: 1,
            invalidateOnRefresh: true,
           // markers: { startColor: "purple", endColor: "purple", indent: 30 },
          },
          tl => {
            tl.to(objectbyphine.rotation, { x: "+=2.9", y: "3.5", z: "-=5.9", ease: "none" }, 0)
              .to(objectbyphine.scale, { x: scale[0] * 0.8, y: scale[1] * 0.8, z: scale[2] * 0.8 }, 0)
              // Update the x tween responsively
              .to(objectbyphine.position, { x: `-=${100 * offsetXFactor}`, y: "-=10", ease: "none" }, 0);
          }
        );

        // Timeline for the vector path ("3d-actif-vector-path")
        createTimeline(
          {
            id: "3d-actif-vector-path",
            trigger: ".vector-path",
            start: 'top center',
            end: '+=230px',
            scrub: 1,
            invalidateOnRefresh: false,
            //markers: true,
            onLeave: () => {
              const textMaterials = [];
              objectbyphine.traverse(child => {
                if (child.name.includes("Text-")) {
                  textMaterials.push(child.material);
                }
              });
              gsap.to(textMaterials, {
                duration: 0.3,
                opacity: 1,
                ease: "power2.out",
                stagger: 0.2
              });
            },
            onEnterBack: () => {
              const textMaterials = [];
              objectbyphine.traverse(child => {
                if (child.name.includes("Text-")) {
                  textMaterials.push(child.material);
                }
              });
              gsap.to(textMaterials, {
                duration: 0.3,
                opacity: 0,
                ease: "power2.out",
                stagger: 0.2
              });
            },
          },
          tl => {
            // Additional vector path animations if needed
          }
        );
      } else {

          // Non-active models get a unique rotation tween based on their positionIndex.
          // Here we use a switch to set different rotation properties.
          const rotationTween = (() => {
            switch(modelData.positionIndex) {
              case 1:
                // For model with positionIndex 1, rotate slightly on x and y.
                return { x: "+=0.7854", y: "+=1.5708", ease: "none" };
              case 2:
                // For model with positionIndex 2, rotate on y and z.
                return { y: "-=1.5708", z: "-=0.7854", ease: "none" };
              case 3:
                // For model with positionIndex 3, rotate on x and z.
                return { x: "-=6.28318", z: "-=6.28318", ease: "none" };
              default:
                // Default tween (if needed)
                return { y: "+=1.5708", ease: "none" };
            }
          })();
        createTimeline(
          {
            id: "3d-actif-start", // using the same trigger so the scroll progress is identical
            trigger: ".hero-stack",
            start: 'bottom bottom',
            end: '+=1505px',
            scrub: 1,
            invalidateOnRefresh: false,
           // markers: { startColor: "blue", endColor: "red", indent: 0 },
          },
          tl => {
        tl.to(objectbyphine.rotation, rotationTween, 0);       }
        );
      }

      // Kill any previous position and scale animations before starting new ones
      positionAnimRef.current?.kill();
      scaleAnimRef.current?.kill();

      // Animate changes in position and scale (parameters remain unchanged)
      positionAnimRef.current = gsap.to(objectbyphine.position, {
        x: position[0],
        y: position[1],
        z: position[2],
        duration: 3,
        ease: Power2.easeOut,
      });

      scaleAnimRef.current = gsap.to(objectbyphine.scale, {
        x: scale[0],
        y: scale[1],
        z: scale[2],
        duration: 3,
        ease: Power2.easeOut,
      });
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initModel);
    } else {
      initModel();
    }

    return () => {
      document.removeEventListener("DOMContentLoaded", initModel);
      positionAnimRef.current?.kill();
      scaleAnimRef.current?.kill();
      timelinesRef.current.forEach(tl => tl.kill());
      scrollTriggersRef.current.forEach(st => st.kill());
      timelinesRef.current = [];
      scrollTriggersRef.current = [];
      const navEl = document.querySelector('.navigation');
      if (navEl) {
        navEl.querySelectorAll('.pin-spacer').forEach(spacer => spacer.remove());
      }
    };
  }, [
    JSON.stringify(position),
    JSON.stringify(scale),
    isActive,
    objectbyphine,
    modelData,
    controlsRef,
    cameraRef,
    setFloatEnabled,
    groupRef  // include groupRef in the dependency list
  ]);

  return <primitive object={objectbyphine} ref={modelRef} />;
});

export default Model;