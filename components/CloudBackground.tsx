"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Cloud({
  count = 3000,
  radius = 2,
  position = [0, 0, 0] as [number, number, number],
}) {
  // Generate random positions in a sphere
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = radius * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, [count, radius]);

  const groupRef = useRef<THREE.Group>(null!);

  return (
    <group ref={groupRef} position={position} rotation={[0, 0, Math.PI / 4]}>
      <InteractivePoints positions={positions} />
    </group>
  );
}

const InteractivePoints = ({ positions }: { positions: Float32Array }) => {
  const pointsRef = useRef<THREE.Points>(null!);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector3(100, 100, 100) }, // Start far away
        uColor: { value: new THREE.Color("#9b6bff") }, // Secondary base
        uPixelRatio: {
          value: typeof window !== "undefined" ? window.devicePixelRatio : 2,
        },
      },
      vertexShader: `
        uniform float uTime;
        uniform vec3 uMouse;
        uniform float uPixelRatio;
        
        varying vec3 vColor;
        
        void main() {
            vec3 pos = position;
            
            // Simple interaction: wave effect based on distance
            // Mouse is in local space
            
            float dist = distance(pos, uMouse);
            // Influence radius
            float radius = 1.2;
            float influence = smoothstep(radius, 0.0, dist); 
            
            // Push away
            vec3 dir = normalize(pos - uMouse);
            // Add some noise or simple push
            pos += dir * influence * 0.5;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            
            // Size attenuation
            gl_PointSize = 10.0 * uPixelRatio * (1.0 / -mvPosition.z);
        }
    `,
      fragmentShader: `
        uniform vec3 uColor;
        void main() {
            // Circular particle
            if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.5) discard;
            gl_FragColor = vec4(uColor, 1.0);
        }
    `,
      transparent: true,
      depthWrite: false,
    });
  }, []);

  useFrame((state) => {
    if (pointsRef.current && shaderMaterial) {
      shaderMaterial.uniforms.uTime.value = state.clock.elapsedTime;

      // Get mouse position in world space at z=0 plane relative to camera direction
      const { pointer, camera } = state;

      // We want to intersect the cloud which is at 0,0,0 (but rotated).
      // A simple approximation is to project mouse to a plane at distance matching the cloud center.
      // Since we have multiple clouds now at different Z, this approx might be slightly off for deep clouds,
      // but "project to plane at depth of object" is tricky if object is large.
      // Let's stick to projecting to z=0 or a general interaction plane.
      // Or better: Unproject mouse to a ray, then find point on ray closest to the point?
      // No, that's per-point.

      // Let's project mouse to the z=0 plane for now, which is where the "main" cloud content is roughly.
      const vector = new THREE.Vector3(pointer.x, pointer.y, 0.5);
      vector.unproject(camera);

      const dir = vector.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      const worldMouse = camera.position
        .clone()
        .add(dir.multiplyScalar(distance));

      // Now transform this world mouse position into the local space of the points
      const localMouse = worldMouse.clone();
      pointsRef.current.worldToLocal(localMouse);

      shaderMaterial.uniforms.uMouse.value.copy(localMouse);
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      {/* Using primitive to attach the material instance created in useMemo */}
      <primitive object={shaderMaterial} attach="material" />
    </points>
  );
};

export default function CloudBackground() {
  return (
    <div className="absolute top-0 left-0 w-full h-full -z-10 bg-grey-darkest pointer-events-none">
      {/* 
        pointer-events-none on container ensures clicks pass through to content.
        Canvas needs to receive events? 
        If container is pointer-events-none, Canvas children won't get events.
        BUT we used eventSource={document.body} on Canvas, so Fiber listens to body events 
        and raycasts against the scene. This works even if the canvas is non-interactive via CSS.
      */}
      <Canvas
        camera={{ position: [0, 0, 4], fov: 60 }}
        eventSource={
          typeof document !== "undefined" ? document.body : undefined
        }
        eventPrefix="client"
      >
        <Cloud position={[-3, 1, -1]} radius={2.2} count={2500} />
        <Cloud position={[3, -1, 0]} radius={2.8} count={3500} />
        <Cloud position={[-2, -3, -2]} radius={2} count={2000} />
        <Cloud position={[2, 3, -2]} radius={2} count={2000} />
        <Cloud position={[0, 0, -3]} radius={3} count={4000} />
      </Canvas>
    </div>
  );
}
