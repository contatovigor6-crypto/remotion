import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import React, { useMemo } from "react";
import {
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BackSide, DoubleSide, Vector3 } from "three";
import { INTRO, OUTRO_START, REGIONS, regionStart } from "../timeline";
import { getCamera } from "./camera";
import {
  CHIMNEYS,
  Diorama,
  buildAmbrosia,
  buildGrassrivers,
  buildKalaga,
  buildKeys,
  buildPortGellhorn,
  buildViceCity,
} from "./dioramas";
import { PAD_HEIGHT, buildTerrain } from "./terrain";

// Low sun over the gulf, to the west
const SUN = new Vector3(-1, 0.13, 0.22).normalize();

const SKY_VERTEX = `
varying vec3 vDir;
void main() {
  vDir = normalize(position);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const SKY_FRAGMENT = `
varying vec3 vDir;
uniform vec3 sunDir;
void main() {
  vec3 d = normalize(vDir);
  float h = d.y;
  vec3 col = mix(vec3(1.0, 0.72, 0.42), vec3(1.0, 0.36, 0.45), smoothstep(-0.02, 0.1, h));
  col = mix(col, vec3(0.55, 0.17, 0.58), smoothstep(0.06, 0.3, h));
  col = mix(col, vec3(0.1, 0.04, 0.26), smoothstep(0.25, 0.75, h));
  float s = dot(d, sunDir);
  col += vec3(1.0, 0.5, 0.25) * pow(max(s, 0.0), 10.0) * 0.55;
  float disc = smoothstep(0.9925, 0.9935, s);
  // Retro sun: horizontal cuts that get thicker toward the horizon
  float rel = (d.y - sunDir.y) / 0.12;
  float cut = step(0.0, -rel) * step(fract(rel * 5.0), 0.18 + 0.45 * clamp(-rel, 0.0, 1.0));
  vec3 sunCol = mix(vec3(1.0, 0.3, 0.55), vec3(1.0, 0.92, 0.55), smoothstep(-1.0, 0.8, rel));
  col = mix(col, sunCol, disc * (1.0 - cut));
  gl_FragColor = vec4(col, 1.0);
}`;

const CameraRig: React.FC = () => {
  const frame = useCurrentFrame();
  const camera = useThree((s) => s.camera);
  // The scene camera mirrors the shared, frame-driven camera
  camera.copy(getCamera(frame));
  return null;
};

const Sky: React.FC = () => {
  const frame = useCurrentFrame();
  const uniforms = useMemo(() => ({ sunDir: { value: SUN } }), []);
  return (
    <mesh position={getCamera(frame).position.clone()}>
      <sphereGeometry args={[2500, 48, 24]} />
      <shaderMaterial
        vertexShader={SKY_VERTEX}
        fragmentShader={SKY_FRAGMENT}
        uniforms={uniforms}
        side={BackSide}
        depthWrite={false}
        fog={false}
      />
    </mesh>
  );
};

const Clouds: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <group>
      {new Array(16).fill(0).map((_, i) => {
        const x =
          -150 + random(`cx-${i}`) * 300 + frame * 0.012 * (1 + (i % 3));
        const z = -150 + random(`cz-${i}`) * 300;
        const s = 5 + random(`cs-${i}`) * 7;
        return (
          <group
            key={i}
            position={[x, 48 + random(`cy-${i}`) * 22, z]}
            scale={[s, s * 0.32, s * 0.7]}
          >
            <mesh>
              <icosahedronGeometry args={[1, 1]} />
              <meshStandardMaterial
                color="#ffd0e0"
                emissive="#c0507a"
                emissiveIntensity={0.55}
                flatShading
                transparent
                opacity={0.85}
              />
            </mesh>
            <mesh position={[1, -0.1, 0.3]} scale={0.7}>
              <icosahedronGeometry args={[1, 1]} />
              <meshStandardMaterial
                color="#ffb8d4"
                emissive="#c0507a"
                emissiveIntensity={0.55}
                flatShading
                transparent
                opacity={0.85}
              />
            </mesh>
            <mesh position={[-0.9, -0.15, -0.2]} scale={0.6}>
              <icosahedronGeometry args={[1, 1]} />
              <meshStandardMaterial
                color="#ffc4dc"
                emissive="#c0507a"
                emissiveIntensity={0.55}
                flatShading
                transparent
                opacity={0.85}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

// A region's model rises out of the map when the camera arrives
const PopUp: React.FC<{
  readonly index: number;
  readonly diorama: Diorama;
  readonly children: React.ReactNode | null;
}> = ({ index, diorama, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = spring({
    frame: frame - regionStart(index) - 4,
    fps,
    config: { damping: 13, mass: 0.9 },
  });
  if (rise < 0.001) return null;
  return (
    <group scale={[1, rise, 1]}>
      <mesh geometry={diorama.solid}>
        <meshStandardMaterial vertexColors flatShading roughness={0.85} />
      </mesh>
      <mesh geometry={diorama.glow}>
        <meshBasicMaterial vertexColors toneMapped={false} />
      </mesh>
      {children}
    </group>
  );
};

const Pin: React.FC<{ readonly index: number }> = ({ index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const region = REGIONS[index];
  const appear = spring({
    frame: frame - INTRO - 8 - index * 7,
    fps,
    config: { damping: 12 },
  });
  const visited = interpolate(
    frame,
    [regionStart(index) - 6, regionStart(index) + 10],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const back = interpolate(
    frame,
    [OUTRO_START + 10, OUTRO_START + 40],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const show = appear * Math.max(visited, back);
  if (show < 0.001) return null;
  const pulse = (frame % 45) / 45;
  const y = Math.max(0.3, region.pos[1] - 1.5);
  return (
    <group position={[region.pos[0], y, region.pos[2]]}>
      <mesh position={[0, 9 * show, 0]} scale={[1, show, 1]}>
        <cylinderGeometry args={[0.28, 0.28, 18, 8]} />
        <meshBasicMaterial
          color={region.accent}
          transparent
          opacity={0.85}
          toneMapped={false}
          fog={false}
        />
      </mesh>
      <mesh position={[0, 18 * show, 0]} scale={show}>
        <octahedronGeometry args={[1.5, 0]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} fog={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} scale={2 + pulse * 7}>
        <ringGeometry args={[0.86, 1, 40]} />
        <meshBasicMaterial
          color={region.accent}
          transparent
          opacity={(1 - pulse) * show}
          side={DoubleSide}
          toneMapped={false}
          fog={false}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

const Smoke: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <group>
      {CHIMNEYS.flatMap(([ox, oz, h], c) =>
        new Array(7).fill(0).map((_, i) => {
          const t = ((frame + i * 13 + c * 5) % 91) / 91;
          return (
            <mesh
              key={`${c}-${i}`}
              position={[
                2 + ox + t * t * 3.5,
                PAD_HEIGHT + h + 0.2 + t * 5,
                -8 + oz + t * 0.8,
              ]}
              scale={0.3 + t * 1.3}
            >
              <icosahedronGeometry args={[1, 1]} />
              <meshStandardMaterial
                color="#f3e6ee"
                flatShading
                transparent
                opacity={0.75 * (1 - t)}
                depthWrite={false}
              />
            </mesh>
          );
        }),
      )}
    </group>
  );
};

const Airboat: React.FC = () => {
  const frame = useCurrentFrame();
  const a = 2.2 - (frame - regionStart(2)) * 0.011;
  return (
    <group
      position={[-7 + Math.cos(a) * 6.5, 0.22, 36 + Math.sin(a) * 5]}
      rotation={[0, -a + Math.PI, 0]}
    >
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[0.7, 0.16, 1.5]} />
        <meshStandardMaterial color="#e8e4dc" flatShading />
      </mesh>
      <mesh position={[0, 0.3, -0.1]}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color="#d9483b" flatShading />
      </mesh>
      <mesh position={[0, 0.62, -0.6]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.42, 0.04, 6, 16]} />
        <meshStandardMaterial color="#3b3644" flatShading />
      </mesh>
      <mesh position={[0, 0.62, -0.6]} rotation={[0, 0, frame * 1.3]}>
        <boxGeometry args={[0.78, 0.09, 0.03]} />
        <meshStandardMaterial color="#1c1a22" />
      </mesh>
      {/* Wake */}
      <mesh position={[0, -0.2, -1.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.5, 1.8]} />
        <meshBasicMaterial
          color="#d8fff0"
          transparent
          opacity={0.45}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

const CargoShip: React.FC = () => {
  const frame = useCurrentFrame();
  const t = interpolate(
    frame,
    [regionStart(3) - 20, regionStart(3) + 240],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const eased = 1 - (1 - t) ** 3;
  return (
    <group position={[-30 - eased * 12.5, 0, -41.2]}>
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[7, 0.9, 1.5]} />
        <meshStandardMaterial color="#2a3350" flatShading />
      </mesh>
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[7.02, 0.3, 1.52]} />
        <meshStandardMaterial color="#b0352f" flatShading />
      </mesh>
      <mesh position={[2.6, 1.2, 0]}>
        <boxGeometry args={[1, 1.2, 1.2]} />
        <meshStandardMaterial color="#e8e4dc" flatShading />
      </mesh>
      <mesh position={[2.6, 1.45, 0]}>
        <boxGeometry args={[1.02, 0.2, 1.22]} />
        <meshBasicMaterial color="#ffd27a" toneMapped={false} />
      </mesh>
      {[
        "#d9483b",
        "#2f7fd1",
        "#f09a2e",
        "#3aa66a",
        "#e8d44a",
        "#8a5bd1",
        "#d9483b",
        "#2f7fd1",
      ].map((color, i) => (
        <mesh
          key={i}
          position={[
            -2.9 + (i % 4) * 1.2,
            0.92 + Math.floor(i / 4) * 0.52,
            i % 2 ? 0.3 : -0.3,
          ]}
        >
          <boxGeometry args={[1.12, 0.5, 0.56]} />
          <meshStandardMaterial color={color} flatShading />
        </mesh>
      ))}
    </group>
  );
};

export const World: React.FC = () => {
  const { width, height } = useVideoConfig();
  const terrain = useMemo(() => buildTerrain(), []);
  const dioramas = useMemo(
    () => [
      buildViceCity(),
      buildKeys(),
      buildGrassrivers(),
      buildPortGellhorn(),
      buildAmbrosia(),
      buildKalaga(),
    ],
    [],
  );

  return (
    <ThreeCanvas width={width} height={height} gl={{ antialias: true }}>
      <CameraRig />
      <fog attach="fog" args={["#c4567f", 90, 900]} />
      <hemisphereLight args={["#ffc2dc", "#3a2466", 1.5]} />
      <directionalLight
        position={SUN.clone().multiplyScalar(200)}
        color="#ffb27a"
        intensity={3.2}
      />
      <directionalLight
        position={[120, 80, 60]}
        color="#8f7dff"
        intensity={0.5}
      />
      <Sky />
      <Clouds />
      <mesh geometry={terrain}>
        <meshStandardMaterial vertexColors flatShading roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6000, 6000]} />
        <meshPhongMaterial
          color="#1f6f9c"
          specular="#ff9fb0"
          shininess={90}
          transparent
          opacity={0.8}
        />
      </mesh>
      {/* Deep seabed so the open ocean matches the water around the map */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.9, 0]}>
        <planeGeometry args={[6000, 6000]} />
        <meshBasicMaterial color="#0a3350" />
      </mesh>
      {dioramas.map((diorama, i) => (
        <PopUp key={REGIONS[i].id} index={i} diorama={diorama}>
          {i === 2 ? (
            <Airboat />
          ) : i === 3 ? (
            <CargoShip />
          ) : i === 4 ? (
            <Smoke />
          ) : null}
        </PopUp>
      ))}
      {REGIONS.map((region, i) => (
        <Pin key={region.id} index={i} />
      ))}
    </ThreeCanvas>
  );
};
