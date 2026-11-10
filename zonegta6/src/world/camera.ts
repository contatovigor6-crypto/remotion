import { PerspectiveCamera, Vector3 } from "three";
import {
  HEIGHT,
  INTRO,
  OUTRO_START,
  REGION,
  REGIONS,
  OVERVIEW,
  WIDTH,
  regionStart,
  OUTRO,
} from "../timeline";

type Shot = {
  start: number;
  duration: number;
  target: [number, number, number];
  radius: number;
  height: number;
  angle: number;
  sweep: number;
  // Horizontal view shift as a fraction of the width (negative = subject moves right)
  shift: number;
};

const SHOTS: Shot[] = [
  {
    start: 0,
    duration: INTRO,
    target: [0, 14, 0],
    radius: 215,
    height: 26,
    angle: -0.3,
    sweep: 0.12,
    shift: 0,
  },
  {
    start: INTRO,
    duration: OVERVIEW,
    target: [-14, 0, 8],
    radius: 105,
    height: 205,
    angle: 1.5,
    sweep: 0.12,
    shift: -0.13,
  },
  ...REGIONS.map((r, i): Shot => {
    return {
      start: regionStart(i),
      duration: REGION,
      target: r.pos,
      radius: r.radius,
      height: r.height,
      angle: r.angle,
      sweep: r.sweep,
      shift: -0.15,
    };
  }),
  {
    start: OUTRO_START,
    duration: OUTRO,
    target: [0, 18, 0],
    radius: 200,
    height: 30,
    angle: -0.42,
    sweep: 0.24,
    shift: 0,
  },
];

// The move to a new shot starts a little before its bar and lands after it
const LEAD = 14;
const TRAVEL = 52;

const evalShot = (shot: Shot, frame: number) => {
  const a = shot.angle + (shot.sweep * (frame - shot.start)) / shot.duration;
  return {
    position: new Vector3(
      shot.target[0] + shot.radius * Math.cos(a),
      shot.target[1] + shot.height,
      shot.target[2] + shot.radius * Math.sin(a),
    ),
    target: new Vector3(...shot.target),
    shift: shot.shift,
  };
};

const camera = new PerspectiveCamera(40, WIDTH / HEIGHT, 0.5, 4000);

// One shared camera, a pure function of the frame. The 3D scene renders with it
// and the HTML overlay uses it to project world positions to pixels.
export const getCamera = (frame: number) => {
  let k = 0;
  for (let i = 0; i < SHOTS.length; i++) {
    if (frame >= SHOTS[i].start - LEAD) k = i;
  }

  const pose = evalShot(SHOTS[k], frame);
  const p = (frame - (SHOTS[k].start - LEAD)) / TRAVEL;
  if (k > 0 && p < 1) {
    const from = evalShot(SHOTS[k - 1], frame);
    const t = p * p * p * (p * (6 * p - 15) + 10);
    const lift =
      Math.sin(Math.PI * t) * from.position.distanceTo(pose.position) * 0.1;
    pose.position.lerpVectors(from.position, pose.position, t);
    pose.position.y += lift;
    pose.target.lerpVectors(from.target, pose.target, t);
    pose.shift = from.shift + (pose.shift - from.shift) * t;
  }

  camera.position.copy(pose.position);
  camera.lookAt(pose.target);
  camera.setViewOffset(WIDTH, HEIGHT, pose.shift * WIDTH, 0, WIDTH, HEIGHT);
  camera.updateMatrixWorld();
  return camera;
};

export const projectToScreen = (
  frame: number,
  point: [number, number, number],
) => {
  const v = new Vector3(...point).project(getCamera(frame));
  return { x: ((v.x + 1) / 2) * WIDTH, y: ((1 - v.y) / 2) * HEIGHT };
};
