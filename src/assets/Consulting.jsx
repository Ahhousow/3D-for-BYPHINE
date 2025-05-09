/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.2 public/models/consulting.glb -T 
Files: public/models/consulting.glb [2.3MB] > D:\Melostud - InWork\Freelance\BYPHINE\Website\Dev\3D-for-BYPHINE\consulting-transformed.glb [156.31KB] (93%)
*/

import React from 'react'
import { useGLTF, Float } from '@react-three/drei'

export function Model(props) {
  const { nodes, materials } = useGLTF('https://master--bejewelled-bunny-c31012.netlify.app/models/consulting-transformed.glb')
  return (
    <Float speed={1} rotationIntensity={2} floatIntensity={5} floatingRange={[0,1]}>
      <group {...props} dispose={null}>
        <mesh castShadow receiveShadow geometry={nodes.Pupille002.geometry} material={materials['Material_0.002']} position={[-0.974, 5.534, 1.883]} scale={0.069} />
        <mesh castShadow receiveShadow geometry={nodes.Sphere002.geometry} material={materials['Material_1.002']} position={[0, 3.592, 2.508]} scale={[0.069, 0.069, 0.006]} />
        <mesh castShadow receiveShadow geometry={nodes.Mesh_0005.geometry} material={materials['Green-Ceramic']} scale={202.431} >
          <meshStandardMaterial color="#0AC900" metalness={0} roughness={0.2} opacity={1} transparent={false}/>
        </mesh>
      </group>
    </Float>

  )
}

useGLTF.preload('https://master--bejewelled-bunny-c31012.netlify.app/models/consulting-transformed.glb')
