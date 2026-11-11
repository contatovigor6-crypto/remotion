import { ThreeCanvas } from "@remotion/three";
import React, { useMemo } from "react";
import {
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Color, ExtrudeGeometry, Shape } from "three";
import { RATING, SCENES, SHORT_DURATION } from "./timeline";

const GREY = new Color("#3d3557");
const GOLD = new Color("#ffc526");
const RED = new Color("#ff3b4e");
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const buildStar = () => {
  const shape = new Shape();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? 0.62 : 0.27;
    const a = (i / 10) * Math.PI * 2 + Math.PI / 2;
    if (i === 0) shape.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    else shape.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  shape.closePath();
  const geo = new ExtrudeGeometry(shape, {
    depth: 0.16,
    bevelEnabled: true,
    bevelThickness: 0.07,
    bevelSize: 0.06,
    bevelSegments: 2,
  });
  geo.center();
  return geo;
};

// The five rating stars. What they show depends on where we are in the video:
// hook (all gold), average (fill up to 4.67), twist (1 red star, then 5 gold), outro (all gold).
const RatingStars: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const star = useMemo(() => buildStar(), []);
  const { hook, store, average, twist, who, outro } = SCENES;

  const inHook = frame < store;
  const inAverage = frame >= average && frame < twist;
  const inTwist = frame >= twist && frame < who;
  const start = inHook ? hook : inAverage ? average : inTwist ? twist : outro;
  const end = inHook
    ? store
    : inAverage
      ? twist
      : inTwist
        ? who
        : SHORT_DURATION + 60;
  if (!inHook && !inAverage && !inTwist && frame < outro) return null;

  const local = frame - start;
  const leave = interpolate(frame, [end - 10, end - 2], [1, 0], clamp);
  const filled = interpolate(local, [34, 112], [0, RATING], {
    ...clamp,
    easing: (t) => 1 - (1 - t) ** 3,
  });
  // In the twist the lone 1-star rating flips to 5 stars
  const FLIP = 100;
  const rowY = inAverage ? -0.38 : 0.35;
  const size = inAverage ? 0.8 : 1;

  return (
    <group position={[0, rowY, 0]} scale={size * leave}>
      {new Array(5).fill(0).map((_, i) => {
        const pop = spring({
          frame: local - (inAverage ? 8 : 16) - i * 5,
          fps,
          config: { damping: 9, mass: 0.6 },
        });
        const flip = spring({
          frame: local - FLIP - i * 4,
          fps,
          config: { damping: 14 },
        });
        const color = new Color();
        if (inAverage)
          color.copy(GREY).lerp(GOLD, Math.min(1, Math.max(0, filled - i)));
        else if (inTwist) color.copy(i === 0 ? RED : GREY).lerp(GOLD, flip);
        else color.copy(GOLD);
        const lit = inAverage
          ? Math.min(1, Math.max(0, filled - i))
          : inTwist
            ? i === 0
              ? 1
              : flip
            : 1;
        const spin = inTwist ? flip * Math.PI * 2 : (1 - pop) * Math.PI;
        const bob = Math.sin(frame * 0.09 + i * 0.9) * 0.07;
        const pulse =
          inTwist && i === 0
            ? 1 + 0.12 * Math.sin(local * 0.3) * (1 - flip)
            : 1;
        return (
          <mesh
            key={i}
            geometry={star}
            position={[(i - 2) * 1.32, bob, 0]}
            rotation={[
              0.12 * Math.sin(frame * 0.05 + i),
              spin + 0.28 * Math.sin(frame * 0.045 + i * 0.6),
              0,
            ]}
            scale={pop * pulse}
          >
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.25 + 0.3 * lit}
              metalness={0.35}
              roughness={0.32}
            />
          </mesh>
        );
      })}
    </group>
  );
};

const DUST_COLORS = ["#ff3d9a", "#3df2ff", "#ffc526", "#b98cff"];

// Slow neon dust drifting upward, at different depths for parallax
const Dust: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <group>
      {new Array(70).fill(0).map((_, i) => {
        const z = -22 + random(`dz-${i}`) * 24;
        const speed = 0.012 + random(`ds-${i}`) * 0.02;
        const y = ((random(`dy-${i}`) * 24 + frame * speed) % 24) - 12;
        const x =
          (random(`dx-${i}`) - 0.5) * 16 + Math.sin(frame * 0.02 + i) * 0.3;
        return (
          <mesh
            key={i}
            position={[x, y, z]}
            rotation={[frame * 0.02 + i, frame * 0.03, i]}
          >
            <octahedronGeometry args={[0.06 + random(`dr-${i}`) * 0.1, 0]} />
            <meshBasicMaterial
              color={DUST_COLORS[i % 4]}
              transparent
              opacity={0.75}
              toneMapped={false}
            />
          </mesh>
        );
      })}
    </group>
  );
};

export const Stars3D: React.FC = () => {
  const { width, height } = useVideoConfig();
  return (
    <ThreeCanvas
      width={width}
      height={height}
      gl={{ antialias: true, alpha: true }}
      camera={{ fov: 35, position: [0, 0, 20] }}
    >
      <ambientLight intensity={1.1} />
      <directionalLight position={[4, 6, 10]} intensity={2.6} color="#fff2d0" />
      <directionalLight
        position={[-6, -3, 6]}
        intensity={1.4}
        color="#ff5fb0"
      />
      <Dust />
      <RatingStars />
    </ThreeCanvas>
  );
};
