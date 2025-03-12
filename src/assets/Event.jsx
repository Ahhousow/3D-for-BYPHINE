/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.2 public/models/event.glb -T 
Files: public/models/event.glb [2.3MB] > D:\Melostud - InWork\Freelance\BYPHINE\Website\Dev\3D-for-BYPHINE\event-transformed.glb [156.31KB] (93%)
*/

import React from 'react'
import { useGLTF, Float } from '@react-three/drei'

export function Model(props) {
  const { nodes, materials } = useGLTF('http://localhost:5173/models/event-transformed.glb')
  return (
    <Float speed={1} rotationIntensity={2} floatIntensity={5} floatingRange={[0,1]}>
      <group {...props} dispose={null}>
        <mesh castShadow receiveShadow geometry={nodes.Pupille004.geometry} material={materials['Material_0.002']} position={[3.993, -3.608, 1.575]} rotation={[0, 0, -0.092]} scale={0.055} />
        <mesh castShadow receiveShadow geometry={nodes.Sphere004.geometry} material={materials['Material_1.002']} position={[5.292, -5.282, 1.834]} rotation={[0, 0, -0.092]} scale={[0.055, 0.055, 0.005]} />
        <mesh castShadow receiveShadow geometry={nodes.Mesh_0009.geometry} material={materials['Green-Ceramic']} scale={152.257}>
        <meshStandardMaterial color="#004AFF" metalness={0} roughness={0.2} opacity={1} transparent={false}/>
        </mesh>
      </group>
    </Float>

  )
}

useGLTF.preload('http://localhost:5173/models/event-transformed.glb')
