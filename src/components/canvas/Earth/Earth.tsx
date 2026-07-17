"use client";
import CanvasLoader from "@/components/Loader";
import { OrbitControls, Preload, Text, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import type * as THREE from "three";

const Earth = () => {
	const earth = useGLTF("/planet/scene.gltf");

	return (
		<primitive object={earth.scene} scale={2.5} position-y={0} rotation-y={0} />
	);
};

const FloatingText = ({ angle, x, z, index }: { angle: number; x: number; z: number; index: number }) => {
	const groupRef = useRef<THREE.Group>(null);
	const phase = index * 0.8;

	useFrame((state) => {
		if (groupRef.current) {
			const t = state.clock.elapsedTime;
			// Gentle bobbing on Y axis — each instance has a unique phase
			groupRef.current.position.y = Math.sin(t * 0.6 + phase) * 0.15;
			// Subtle breathing opacity via scale pulse
			const pulse = 0.97 + Math.sin(t * 0.4 + phase) * 0.03;
			groupRef.current.scale.setScalar(pulse);
		}
	});

	return (
		<group ref={groupRef} position={[x, 0, z]} rotation={[0, -angle + Math.PI / 2, 0]}>
			<Text
				fontSize={0.3}
				letterSpacing={0.22}
				color="#c4b5fd"
				anchorX="center"
				anchorY="middle"
				fillOpacity={0.85}
			>
				DuongBill
			</Text>
		</group>
	);
};

const OrbitingText = () => {
	const ringRef = useRef<THREE.Group>(null);

	useFrame((_, delta) => {
		if (ringRef.current) {
			ringRef.current.rotation.y += delta * 0.12;
		}
	});

	const repeats = 8;
	const radius = 3.6;

	const items = useMemo(() => {
		return Array.from({ length: repeats }).map((_, i) => {
			const angle = (i / repeats) * Math.PI * 2;
			return { angle, x: Math.cos(angle) * radius, z: Math.sin(angle) * radius };
		});
	}, []);

	return (
		<group ref={ringRef} rotation={[0.35, 0, 0.15]}>
			{items.map(({ angle, x, z }, i) => (
				<FloatingText key={i} angle={angle} x={x} z={z} index={i} />
			))}
		</group>
	);
};

const EarthCanvas = () => {
	return (
		<Canvas
			shadows
			frameloop="always"
			dpr={[1, 2]}
			gl={{ preserveDrawingBuffer: true }}
			camera={{
				fov: 45,
				near: 0.1,
				far: 200,
				position: [-4, 3, 6],
			}}
		>
			<Suspense fallback={<CanvasLoader />}>
				<ambientLight intensity={0.4} />
				<directionalLight position={[5, 3, 5]} intensity={1} />
				<OrbitControls
					autoRotate
					enableZoom={false}
					maxPolarAngle={Math.PI / 2}
					minPolarAngle={Math.PI / 2}
				/>
				<OrbitingText />
				<Earth />
				<Preload all />
			</Suspense>
		</Canvas>
	);
};

export default EarthCanvas;
