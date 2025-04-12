import React, { useState,useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Power2 } from 'gsap';

gsap.registerPlugin(ScrollTrigger);

const Timeline = ({ timelineRefs, cameraRef, controlsRef, sceneGroupRef, setFloatEnabled }) => {
  const timelinesCreated = useRef(false);

  useLayoutEffect(() => {
    if (timelinesCreated.current) return;

    // Vérifier que toutes les références sont prêtes
    if (
      !timelineRefs ||
      timelineRefs.length === 0 ||
      !timelineRefs.every(refData => refData && refData.groupRef && refData.groupRef.current)
    ) {
      return;
    }

    timelineRefs.forEach(refData => {
      const { groupRef, modelContainerRef, groupIndex, position, scale, isActive } = refData;

      // Initialisation de la position et de l'échelle
      gsap.set(groupRef.current.position, { x: position[0], y: position[1], z: position[2] });
      gsap.set(groupRef.current.scale, { x: scale[0], y: scale[1], z: scale[2], duration:0.3, ease: 'power2.out' });

      if (isActive) {
        const initialTargetY = 0;
        const targetObj = { y: initialTargetY };

        gsap.timeline({
          scrollTrigger: {
            id: "3d-actif-start",
            trigger: ".hero-stack",
            start: 'bottom bottom',
            endTrigger: '.navigation',
            end: 'top center',
            scrub: 1,
          }
        })
          .to(groupRef.current.rotation, { y: "+=6.28318", z: "+=4.08318", ease: "none" }, 0)
          .to(groupRef.current.scale, { x: scale[0] * 1.5, y: scale[1] * 1.5, z: scale[2] * 1.5, ease: "none" }, 0)
          .fromTo(targetObj,{ y: initialTargetY },{ y: -80, ease: "none", immediateRender: false,
                onUpdate: function() {
                controlsRef.current.target.y = targetObj.y;
                controlsRef.current.update();
              }
            },0
          )
          .to(cameraRef.current.position, { x: 0, y: -350, z: 100 }, 0)
          //.to(cameraRef.current.position, { z: 300 }, 0.5)
          .to(cameraRef.current.position, { z: 550 }, 0.5)
          .to(sceneGroupRef.current.rotation, { y: "+=6.28318", z:"+=6.28318", ease: "none" }, 0);

        gsap.timeline({
          scrollTrigger: {
            id: "3d-actif-nav",
            trigger: ".navigation",
            start: 'top center',
            end: '+=300px',
            pin: true,
            invalidateOnRefresh: false,
            onLeave: () => {
              gsap.to(".nav-item", { display: "none", ease: 'none' }, 0);
            },
            onEnterBack: () => {
              gsap.to(".nav-item", { display: "flex", ease: 'none' }, 0);
            }
          }
        });

        // Création de la timeline maîtresse avec un unique ScrollTrigger
        const masterTimeline = gsap.timeline({
          scrollTrigger: {
            id: "merged-3d-animation",
            trigger: ".pitch",
            start: 'top-=80px center',
            // On récupère ici l’élément de fin de la timeline "reach-us"
            endTrigger: ".vector-path",
            end: "center center",
            scrub: 1,
            invalidateOnRefresh: false,
            onEnter: () => setFloatEnabled(false),
            onLeaveBack: () => setFloatEnabled(true),
          }
        });

        // Ajout de labels pour délimiter les deux segments de l’animation
        masterTimeline.addLabel("pitch", 0);
        masterTimeline.addLabel("reachUs", 1);

        // --- Segment "3d-actif-pitch" (identique au comportement actuel) ---
        masterTimeline
          .to(groupRef.current.rotation, { x: "+=3.14159", y: "+=3.14159", ease: "none" }, "pitch")
          .to(groupRef.current.position, { x: "+=100", ease: "none" }, "pitch")
          .to(
            groupRef.current.scale,
            { x: scale[0] * 1.5, y: scale[1] * 1.5, z: scale[2] * 1.5, ease: "none" },
            "pitch"
          )
          .to(cameraRef.current.position, { x: 0, y: 0, z: 200, ease: "none" }, "pitch");

        // --- Fonction pour ajouter le segment "3d-actif-reach-us" ---
        // Ce segment s’insère après le label "reachUs", garantissant ainsi l’ordre souhaité.
        const addReachUsAnimations = (scaleFactor) => {
          masterTimeline
            .to(groupRef.current.rotation, { x: "+=2.9", y: "+=3.5", z: "-=5.9", ease: "none" }, "reachUs")
            .to(
              groupRef.current.scale,
              {
                x: scale[0] * scaleFactor,
                y: scale[1] * scaleFactor,
                z: scale[2] * scaleFactor,
                ease: "none",
              },
              "reachUs"
            )
            .to(cameraRef.current.position, { x: 0, y: 0, z: 200, ease: "none" }, "reachUs")
            .to(groupRef.current.position, { x: "-=100", y: "-=20", ease: "none" }, "reachUs");
        };

        // --- Application du scaleFactor en fonction du media query ---
        const mm = gsap.matchMedia();

        mm.add("(max-width: 768px)", () => {
          // Pour mobile, on applique un scaleFactor de 0.7
          addReachUsAnimations(0.7);
          
          // Optionnel : retour pour nettoyer si le media query change
          return () => {
            // Par exemple : masterTimeline.clear(); si besoin
          };
        });

        mm.add("(min-width: 768px)", () => {
          // Pour desktop/tablette, on utilise un scaleFactor de 1.2
          addReachUsAnimations(1.2);
          
          return () => {
            // Nettoyage optionnel si nécessaire
          };
        });



        // Récupération des matériaux des meshes textes
        const textMaterials = [];
        if (modelContainerRef.current) {
          modelContainerRef.current.traverse(child => {
            if (child.name.includes("Text-")) {
              textMaterials.push(child.material);
            }
          });
        }

        // Création d'une timeline scrubbable qui inclut l'animation d'opacité et l'effet pulse sur le scale
        const tltext = gsap.timeline({
          scrollTrigger: {
            id: "3d-actif-vector-path",
            trigger: ".vector-path",
            start: 'center+=50px center',
            scrub: 1,
            pin: true,
            pinSpacing: true,
            end: '+=800px',
            invalidateOnRefresh: true,
          }
        });

        // Pour chaque matériau (et donc pour chaque mesh), on anime son opacité et on déclenche en parallèle
        // un effet pulse sur groupRef.current.scale
        textMaterials.forEach((material, i) => {
          // Tween pour l'opacité
          tltext.to(material, {
            opacity: 1,
            ease: "power2.out",
            duration: 0.6
          }, i * 0.6);

          // Tween pour l'effet pulse (scale) – en incrémentant par rapport à la valeur dynamique actuelle
          tltext.to(groupRef.current.scale, {
            x: "+=0.2",
            y: "+=0.2",
            z: "+=0.2",
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            ease: "power1.inOut"
          }, i * 0.6);
        });

        

        gsap.timeline({
          scrollTrigger: {
            id: "3d-actif-end-scroll",
            trigger: "#p-3",
            start: 'top-=200px center',
            end: 'bottom center', 
            scrub: 1,
            invalidateOnRefresh: true,
           // markers:true,
          }
        })
        .to(groupRef.current.scale, { x: scale[0] * 1.4, y: scale[1] * 1.4, z: scale[2] * 1.4 }, 0)
        .to(groupRef.current.position, {  y: "+=130", ease: "none" }, 0);

      } else {
        // Pour tous les groupes (actifs ou inactifs), on synchronise via le même ScrollTrigger "3d-actif-start"
        gsap.timeline({
          scrollTrigger: {
            id: "3d-actif-start",
            trigger: ".hero-stack",
            start: 'bottom bottom',
            endTrigger: '.navigation',
            end: 'top center',
            scrub: 1,
            invalidateOnRefresh: false,
          }
        })
          .to(groupRef.current.rotation, {
            // Exemple de variation selon le groupIndex
            x: groupIndex === 1 ? "+=13.42478" : groupIndex === 2 ? "+=3.5708" : groupIndex === 3 ? "-=13.42478" : "-=3.5708",
            y: groupIndex === 1 ? "+=13.42478" : groupIndex === 2 ? "+=3.5708" : groupIndex === 3 ? "-=13.42478" : "-=3.5708",
            z: groupIndex === 1 ? "+=13.42478" : groupIndex === 2 ? "+=3.5708" : groupIndex === 3 ? "-=13.42478" : "-=3.5708",
            ease: "none"
          }, 0);
      }

      // Animations communes pour la position et l'échelle
      gsap.to(groupRef.current.position, {
        x: position[0],
        y: position[1],
        z: position[2],
        duration: 3,
        ease: Power2.easeOut,
      });
      gsap.to(groupRef.current.scale, {
        x: scale[0],
        y: scale[1],
        z: scale[2],
        duration: 3,
        ease: Power2.easeOut,
      });
    });

    // Animation pour le portal de fin
    gsap.timeline({
      scrollTrigger: {
        id: "portal",
        trigger: ".discover-portal",
        start: 'top+=100px bottom',
        scrub: 1,
        invalidateOnRefresh: true,
        endTrigger: '.footer',
        end: 'top bottom',
       // markers: true,
      }
    })
      .fromTo(".img-portal-wrap.right", { x: "-30%", ease: "power2.out" },
                                        { x: "90%", ease: "power2.out" }, 0)
      .fromTo(".img-portal-wrap.left", { x: "30%", ease: "power2.out" },
                                       { x: "-90%", ease: "power2.out" }, 0);

    timelinesCreated.current = true;
  }, [timelineRefs, cameraRef, controlsRef, sceneGroupRef, setFloatEnabled]);



  return null;
};

export default Timeline;