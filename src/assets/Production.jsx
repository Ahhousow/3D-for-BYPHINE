/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.2 public/models/production.glb --transform 
Files: public/models/production.glb [3.54MB] > D:\Melostud - InWork\Freelance\BYPHINE\Website\Dev\3D-for-BYPHINE\production-transformed.glb [192.74KB] (95%)
*/

import React from 'react'
import { useGLTF } from '@react-three/drei'

export function Model(props) {
  const { nodes, materials } = useGLTF('https://master--bejewelled-bunny-c31012.netlify.app/models/production-transformed.glb')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Pupille005.geometry}  material={materials['Material_0.002']} position={[1.229, -1.947, 2.007]} rotation={[0, 0, -0.08]} scale={0.057} />
      <mesh geometry={nodes.Sphere005.geometry} material={materials['Material_1.002']} position={[2.593, -3.663, 2.275]} rotation={[0, 0, -0.08]} scale={[0.057, 0.057, 0.005]} />
      <mesh geometry={nodes.Mesh_0008.geometry} material={materials['Green-Ceramic']} rotation={[0, 0, 0.395]} scale={152.257}>
      <meshStandardMaterial color="#FF5400" metalness={0} roughness={0.2} opacity={1} transparent={false}/>
        </mesh>
    </group>
  )
}

useGLTF.preload('https://master--bejewelled-bunny-c31012.netlify.app/models/production-transformed.glb')
