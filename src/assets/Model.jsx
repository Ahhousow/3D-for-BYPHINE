// Model.jsx
import React, { forwardRef, useRef, useLayoutEffect, useImperativeHandle } from 'react';
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
  setFloatEnabled
}, ref) => {
  const { scene: objectbyphine } = useGLTF(modelData.file);
  
  const modelRef = useRef();

  // Références pour regrouper les timelines et leurs ScrollTriggers
  const timelinesRef = useRef([]);
  const scrollTriggersRef = useRef([]);
  const positionAnimRef = useRef();
  const scaleAnimRef = useRef();

  useImperativeHandle(ref, () => modelRef.current);

  useLayoutEffect(() => {
    if (!objectbyphine) return;

    modelRef.current = objectbyphine;

    // Initialiser la position et l'échelle
    gsap.set(objectbyphine.position, { x: position[0], y: position[1], z: position[2] });
    gsap.set(objectbyphine.scale, { x: scale[0], y: scale[1], z: scale[2] });

    // Configurer les matériaux
    objectbyphine.traverse(child => {
      if (child.isMesh) {
        if (child.name === modelData.targetMesh && modelData.color) {
          child.material.color.set(modelData.color);
        }
        // Pour les meshes de texte, initialiser l'opacité à 0
        if (child.name.includes("Text-")) {
          child.material.opacity = 0;
        } else {
          // Pour les autres meshes, conserver une opacité de 1
          child.material.opacity = 1;
        }
        child.material.transparent = true;
        child.material.metalness = 0;
        child.material.roughness = 0.2;
      }
    });

    // Si le modèle n'est pas actif, on supprime les ScrollTriggers existants
    if (!isActive) {
      scrollTriggersRef.current.forEach(st => st?.kill());
      scrollTriggersRef.current = [];
    }

    // Création des timelines pour le modèle actif
    if (isActive && scrollTriggersRef.current.length === 0) {
      const createTimeline = (triggerConfig, animationCallback) => {
        const tl = gsap.timeline({ scrollTrigger: triggerConfig });
        animationCallback(tl);
        scrollTriggersRef.current.push(tl.scrollTrigger);
        timelinesRef.current.push(tl);
      };
      const targetObj = { y: controlsRef.current.target.y };

      createTimeline(
        {
          id: "3d-actif-start",
          trigger: ".hero-stack",
          start: 'bottom bottom',
          end: '+=900px',
          scrub: 1,
          invalidateOnRefresh: false,
         // markers: { startColor: "blue", endColor: "blue" },

        },
        tl => {
          tl.to(objectbyphine.rotation, { x: "+=3.14159", y: "+=3.14159", ease: "none" }, 0.5)
            .to(objectbyphine.scale, { x: scale[0] * 1.5, y: scale[1] * 1.5, z: scale[2] * 1.5}, 0)
            .to(targetObj, {
              y: -80,
              ease: "none",
              immediateRender: false,
              onUpdate: function() {
                controlsRef.current.target.y = this.targets()[0].y;
                controlsRef.current.update();
              }
            }, 0)
            .to(cameraRef.current.position, { x: 0, y: -300, z: 300 }, 0);
        }
      );

      createTimeline(
        {
          id: "3d-actif-nav",
          trigger: ".navigation",
          start: 'top center',
          end: '+=650px',
          pin: true,
          invalidateOnRefresh: false,
          markers: { startColor: "blue", endColor: "blue" },
          toggleActions: "play none reverse none",
        },
        tl => {
          tl.from("#nav-link-wrapper", {width: 50,ease: 'none'}, 0)
          .from("#left-arrow", {right: -20,opacity: 0,ease: 'none'}, 0.6)
          .from("#right-arrow", {left: -20, opacity: 0,ease: 'none'}, 0.6)
          .to(".nav-title", {top: -20, padding: '70px', height: 'auto', ease: 'none'}, 0.3)
          .from(".nav-link", {opacity: 0,ease: 'none'}, 0.3)
          .from(".pitch",{opacity: 0,ease: 'none'}, 0.5)

        }
      );

      createTimeline(
        {
          id: "3d-actif-pitch",
          trigger: ".pitch",
          start: 'top+=140 bottom',
          end:'+=440px',
          scrub: 1,
          invalidateOnRefresh: false,
         // markers: { startColor: "green", endColor: "green" },
          onEnter: () => setFloatEnabled(false),
          onLeaveBack: () => setFloatEnabled(true),
        },
        tl => {
          tl.to(objectbyphine.rotation, { x: "+=3.14159", y: "+=3.14159", ease: "none" }, 0)
            .to(objectbyphine.position, { x: "+=100", ease: "none" }, 0)
            .to(objectbyphine.scale, { x: scale[0] * 1.5, y: scale[1] * 1.5, z: scale[2] * 1.5, duration: 1, ease: "none" }, 0)
            .to(".nav-contener", { opacity: 0, ease: "none" }, 0)
            .to(".pitch", { paddingTop: 50, ease: "none" }, 0)
            .to(cameraRef.current.position, { x: 0, y: 0, z: 200 }, 0);
        }
      );

      createTimeline(
        {
          id: "3d-actif-reach-us",
          trigger: ".reach-us",
          start: 'top-=100 center',
          end: '+=600px',

          scrub: 1,
          invalidateOnRefresh: false,
        //  markers: { startColor: "purple", endColor: "purple" },
        },
        tl => {
          tl.to(objectbyphine.rotation, { x: "+=2.9", y: "3.5", z: "-=5.9", ease: "none" }, 0)
          .to(objectbyphine.scale, { x: scale[0] * 0.8, y: scale[1] * 0.8, z: scale[2] * 0.8 }, 0)
          .to(objectbyphine.position, { x: "-=100", y: "-=10", ease: "none" }, 0);
        }
      );
      createTimeline(
        {
          id: "3d-actif-vector-path",
          trigger: ".vector-path",
          start: 'top center',
          end: '+=370px',
          scrub: 1,
          invalidateOnRefresh: false,
          onLeave: () => {
            // Récupérer les matériaux des meshes de texte
            const textMaterials = [];
            objectbyphine.traverse(child => {
              if (child.name.includes("Text-")) {
                textMaterials.push(child.material);
              }
            });
            // Animation de fade-in avec stagger
            gsap.to(textMaterials, {
              duration: 0.3,
              opacity: 1,
              ease: "power2.out",
              stagger: 0.2
            });
          },
          onEnterBack: () => {
            // Réinitialiser l'opacité à 0, avec un stagger inversé si besoin
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
          // markers: { startColor: "purple", endColor: "purple" },
        },
        tl => {
          // D'autres animations éventuelles dans la timeline...
        }
      );
      
    }

    // Nettoyer les animations de position et d'échelle précédentes
    positionAnimRef.current?.kill();
    scaleAnimRef.current?.kill();

    // Animation des changements de position et d'échelle
    positionAnimRef.current = gsap.to(objectbyphine.position, {
      x: position[0],
      y: position[1],
      z: position[2],
      duration: 3,
      ease: "Power2.easeOut",
    });

    scaleAnimRef.current = gsap.to(objectbyphine.scale, {
      x: scale[0],
      y: scale[1],
      z: scale[2],
      duration: 3,
      ease: "Power2.easeOut",
    });

    return () => {
      // Nettoyage lors du démontage du composant
      positionAnimRef.current?.kill();
      scaleAnimRef.current?.kill();
      timelinesRef.current.forEach(tl => tl.kill());
      scrollTriggersRef.current.forEach(st => st.kill());
      timelinesRef.current = [];
      scrollTriggersRef.current = [];
      // Nettoyer manuellement les éléments pin-spacer associés à .navigation
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
    setFloatEnabled
  ]);

  return <primitive object={objectbyphine} ref={modelRef} />;
});

export default Model;
