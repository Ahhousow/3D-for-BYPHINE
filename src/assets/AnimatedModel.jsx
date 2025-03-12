// AnimatedModel.jsx
import React, { useRef, useLayoutEffect, forwardRef, useImperativeHandle } from 'react';
import { useGLTF } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AnimatedModel = forwardRef(({ modelData }, ref) => {
  const { objectbyphine } = useGLTF(modelData.file);
  const modelRef = useRef();
  const tlRef = useRef(); // Référence pour la timeline
  const scrollTriggerRef = useRef(); // Référence pour le ScrollTrigger

  useLayoutEffect(() => {
    if (!objectbyphine) return;

    modelRef.current = objectbyphine;

    // Vérifier que l'élément déclencheur existe
    const triggerElement = document.querySelector('.navigation');
    if (!triggerElement) {
      console.warn("L'élément avec la classe '.navigation' est introuvable dans le DOM.");
      return;
    }

    // Initialiser les propriétés du modèle
    objectbyphine.rotation.set(0, 0, 0);
    objectbyphine.scale.set(1, 1, 1);
    objectbyphine.position.set(0, -20, 0);

    // Définir les propriétés du matériau
    objectbyphine.traverse((child) => {
      if (child.isMesh) {
        if (child.name === modelData.targetMesh && modelData.color) {
          child.material.color.set(modelData.color);
        }
        child.material.transparent = true;
        child.material.metalness = 0;
        child.material.roughness = 0.2;
        child.material.opacity = 1;
      }
    });

    // Si le ScrollTrigger n'a pas encore été créé
    if (!scrollTriggerRef.current) {
      // Créer la timeline avec ScrollTrigger une seule fois
      tlRef.current = gsap.timeline({
        scrollTrigger: {
          trigger: ".navigation",
          start: '100px 80%',
          end: '+=500px',
          scrub: 1,
          invalidateOnRefresh: false,
          markers: {
            startColor: "purple",
            endColor: "purple",
            fontSize: "18px",
            fontWeight: "bold",
            indent: 20,
          },
        },
      });

      scrollTriggerRef.current = tlRef.current.scrollTrigger;
    }

    // Nettoyer les animations précédentes de la timeline
    tlRef.current.clear();

    // Ajouter les animations à la timeline
    tlRef.current.to(objectbyphine.rotation, {
      x: "+=3.14159", // π radians
      y: "+=3.14159",
      duration: 1,
    }, 0);

    tlRef.current.to(objectbyphine.scale, {
      x: 2,
      y: 2,
      z: 2,
      duration: 1,
    }, 0);

    // Mettre à jour le ScrollTrigger
    scrollTriggerRef.current.refresh();

    // Nettoyage lors du démontage du composant
    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
    };
  }, [objectbyphine, modelData]);

  // Utiliser useImperativeHandle pour exposer le modèle principal via la référence
  useImperativeHandle(ref, () => ({
    objectbyphine,
  }));

  return <primitive object={objectbyphine} />;
});

export default AnimatedModel;
