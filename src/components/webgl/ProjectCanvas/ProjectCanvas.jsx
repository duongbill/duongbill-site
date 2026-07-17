'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { Suspense, useMemo, useState } from 'react';
import * as THREE from 'three';

const vertexShader = `
  uniform float uTime;
  uniform float uHover;
  uniform float uVelocity;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;

    float wave = sin((pos.x + uTime * 0.8) * 3.5) * 0.08;
    float ripple = sin((pos.y + uTime) * 4.0) * 0.04;

    pos.z += (wave + ripple) * (0.2 + uHover * 0.8);
    pos.z += uVelocity * 0.4;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uHover;
  uniform float uVelocity;
  varying vec2 vUv;

  void main() {
    float shift = 0.002 + uHover * 0.006 + abs(uVelocity) * 0.003;
    vec2 uv = vUv;

    vec4 texR = texture2D(uTexture, uv + vec2(shift, 0.0));
    vec4 texG = texture2D(uTexture, uv);
    vec4 texB = texture2D(uTexture, uv - vec2(shift, 0.0));

    vec3 color = vec3(texR.r, texG.g, texB.b);
    float vignette = smoothstep(0.9, 0.2, distance(uv, vec2(0.5)));
    color *= 0.9 + vignette * 0.2;

    gl_FragColor = vec4(color, 1.0);
  }
`;

function ProjectPlane({ image }) {
  const texture = useTexture(image);
  const [hovered, setHovered] = useState(false);
  const { viewport } = useThree();

  texture.colorSpace = THREE.SRGBColorSpace;

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uTime: { value: 0 },
      uHover: { value: 0 },
      uVelocity: { value: 0 },
    }),
    [texture]
  );

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
      }),
    [uniforms]
  );

  useFrame((state, delta) => {
    uniforms.uTime.value += delta;
    const velocity = Math.min(1.5, Math.abs(window.__lenisVelocity || 0) * 0.02);
    uniforms.uVelocity.value = THREE.MathUtils.lerp(uniforms.uVelocity.value, velocity, 0.12);
    uniforms.uHover.value = THREE.MathUtils.lerp(uniforms.uHover.value, hovered ? 1 : 0, 0.08);
  });

  return (
    <mesh
      scale={[viewport.width, viewport.height, 1]}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <planeGeometry args={[1, 1, 40, 40]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

export default function ProjectCanvas({ image, className }) {
  return (
    <Canvas
      className={className}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 2], fov: 45 }}
    >
      <Suspense fallback={null}>
        <ProjectPlane image={image} />
      </Suspense>
    </Canvas>
  );
}
