'use client'

import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage, useGLTF } from '@react-three/drei'

function Model() {
  const { scene } = useGLTF('/models/gaming_pc.glb')
  return <primitive object={scene} />
}

export default function PCModel3D() {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '400px' }}>
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }} gl={{ alpha: true }}>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6} contactShadow={false}>
            <Model />
          </Stage>
        </Suspense>
        <OrbitControls enablePan={false} enableZoom={true} />
      </Canvas>
    </div>
  )
}
