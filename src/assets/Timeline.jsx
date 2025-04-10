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

        gsap.timeline({
          scrollTrigger: {
            id: "3d-actif-pitch",
            trigger: ".pitch",
            start: 'top-=80px center',
            endTrigger: '.reach-us',
            end: 'top center',
            scrub: 1,
            invalidateOnRefresh: false,
            onEnter: () => setFloatEnabled(false),
            onLeaveBack: () => setFloatEnabled(true)
          }
        })
        .to(groupRef.current.rotation, { x: "+=3.14159", y: "+=3.14159", ease: "none" }, 0)
        .to(groupRef.current.position, { x: "+=100", ease: "none" }, 0)
        .to(groupRef.current.scale, { x: scale[0] * 1.5, y: scale[1] * 1.5, z: scale[2] * 1.5, ease: "none" }, 0)
        .to(cameraRef.current.position, { x: 0, y: 0, z: 200 }, 0);
        
        gsap.timeline({
          scrollTrigger: {
            id: "3d-actif-reach-us",
            trigger: ".reach-us",
            start: 'top center',
            endTrigger: '#p-3',
            end: 'bottom bottom',
            scrub: 1,
            invalidateOnRefresh: true,
          }
        })
        .to(groupRef.current.rotation, { x: "+=2.9", y: "+=3.5", z: "-=5.9", ease: "none" }, 0)
        .to(groupRef.current.scale, { x: scale[0] * 0.7, y: scale[1] * 0.7, z: scale[2] * 0.7 }, 0)
        .to(groupRef.current.position, { x: "-=100", y: "-=20", ease: "none" }, 0);

        gsap.timeline({
          scrollTrigger: {
            id: "3d-actif-vector-path",
            trigger: ".vector-path",
            start: 'center center',
            scrub: 1,
            invalidateOnRefresh: true,
        //    markers:true,
            onEnter: () => {
              const textMaterials = [];
              if (modelContainerRef.current) {
                modelContainerRef.current.traverse(child => {
                  if (child.name.includes("Text-")) {
                    textMaterials.push(child.material);
                  }
                });
                gsap.to(textMaterials, {
                  duration: 0.3,
                  opacity: 1,
                  ease: "power2.out",
                  stagger: 0.3
                });
              }
            },
            onToggle: () => {
              const textMaterials = [];
              if (modelContainerRef.current) {
                modelContainerRef.current.traverse(child => {
                  if (child.name.includes("Text-")) {
                    textMaterials.push(child.material);
                  }
                });
                gsap.to(textMaterials, {
                  duration: 0.3,
                  opacity: 0,
                  ease: "power2.out",
                  stagger: 0.3
                });
              }
            },
          }
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
        .to(groupRef.current.position, {  y: "+=90", ease: "none" }, 0);

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
       // markers: true,
      }
    })
      .fromTo(".img-portal-wrap.right", { x: "-50%", ease: "power2.out" },
                                        { x: "50%", ease: "power2.out" }, 0)
      .fromTo(".img-portal-wrap.left", { x: "50%", ease: "power2.out" },
                                       { x: "-50%", ease: "power2.out" }, 0);

    timelinesCreated.current = true;
  }, [timelineRefs, cameraRef, controlsRef, sceneGroupRef, setFloatEnabled]);



  return null;
};

export default Timeline;