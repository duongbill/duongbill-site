'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import * as THREE from 'three';

const vertexShader = `
  uniform float uTime;
  uniform float uVelocity;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;

    float wave = sin((pos.x + uTime * 0.4) * 3.0) * 0.02;
    pos.z += wave * (0.3 + uVelocity);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture1;
  uniform sampler2D uTexture2;
  uniform float uProgress;
  uniform float uTime;
  uniform float uVelocity;
  varying vec2 vUv;

  float noise(vec2 uv) {
    return sin(uv.x * 6.0 + uTime * 0.6) * sin(uv.y * 5.0 + uTime * 0.4);
  }

  void main() {
    float n = noise(vUv) * 0.02;
    float prog = smoothstep(0.0, 1.0, uProgress);

    vec2 uv1 = vUv + n * (1.0 - prog);
    vec2 uv2 = vUv - n * prog;

    uv1.x += uVelocity * 0.01;
    uv2.x -= uVelocity * 0.01;

    vec4 tex1 = texture2D(uTexture1, uv1);
    vec4 tex2 = texture2D(uTexture2, uv2);

    gl_FragColor = mix(tex1, tex2, prog);
  }
`;

function TransitionPlane({ images, activeIndex }) {
  const textures = useTexture(images);
  const { viewport } = useThree();
  const previousIndex = useRef(0);

  textures.forEach((texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
  });

  const uniforms = useMemo(
    () => ({
      uTexture1: { value: textures[0] },
      uTexture2: { value: textures[0] },
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uVelocity: { value: 0 },
    }),
    [textures]
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

  useEffect(() => {
    if (!textures[activeIndex]) return;

    uniforms.uTexture1.value = textures[previousIndex.current];
    uniforms.uTexture2.value = textures[activeIndex];
    uniforms.uProgress.value = 0;

    gsap.to(uniforms.uProgress, {
      value: 1,
      duration: 1.2,
      ease: 'power3.out',
    });

    previousIndex.current = activeIndex;
  }, [activeIndex, textures, uniforms]);

  useFrame((state, delta) => {
    uniforms.uTime.value += delta;
    const velocity = Math.min(1.5, Math.abs(window.__lenisVelocity || 0) * 0.02);
    uniforms.uVelocity.value = THREE.MathUtils.lerp(uniforms.uVelocity.value, velocity, 0.1);
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 40, 40]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

export default function GalleryCanvas({ images, activeIndex, className }) {
  return (
    <Canvas
      className={className}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 2], fov: 45 }}
    >
      <Suspense fallback={null}>
        <TransitionPlane images={images} activeIndex={activeIndex} />
      </Suspense>
    </Canvas>
  );
}
