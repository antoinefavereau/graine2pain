"use client";

import { Group } from "three";
import { useGLTF, Environment, Lightformer } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

const mouse = { x: 0, y: 0 };
const CAMERA = { position: [0, 0, 7] as [number, number, number], fov: 30 };

function Model() {
  const { scene } = useGLTF("/orb.glb");
  const mouseRef = useRef<Group>(null);
  const spinRef = useRef<Group>(null);

  useFrame((_, delta) => {
    const spin = spinRef.current;
    const m = mouseRef.current;

    if (spin) spin.rotation.x += delta * 0.1;

    if (m) {
      m.rotation.y = mouse.x * 0.1;
      m.rotation.x = -mouse.y * 0.05;
    }
  });

  return (
    <group ref={mouseRef}>
      <group
        ref={spinRef}
        position={[0, -3, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      >
        <primitive object={scene} scale={0.9} />
      </group>
    </group>
  );
}

export default function Orb() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      <div
        aria-hidden="true"
        className="absolute inset-1/6 rounded-full bg-[#7b3fc830] blur-3xl"
      />
      <Canvas camera={CAMERA}>
        {/* On crée un environnement "noir" mais avec une source de lumière centrale qui se reflète */}
        <Environment resolution={256}>
          <group rotation={[-Math.PI / 2, 0, 0]}>
            <Lightformer
              form="circle"
              intensity={20}
              scale={3}
              color="#7b3fc8"
              position={[0, 0, -1]}
            />
            <Lightformer
              form="circle"
              intensity={0.5}
              scale={2.4}
              color="#ffffff"
              position={[-2.2, 2.4, -1]}
            />
            <Lightformer
              form="circle"
              intensity={0.5}
              scale={2.4}
              color="#ffffff"
              position={[2.2, 2.4, -1]}
            />
          </group>
        </Environment>

        <Suspense fallback={null}>
          <Model />
        </Suspense>

        {/* Effet de Bloom pour le halo lumineux */}
        <EffectComposer>
          <Bloom
            luminanceThreshold={1}
            mipmapBlur
            intensity={1.0}
            radius={0.4}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
