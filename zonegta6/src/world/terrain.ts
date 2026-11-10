import { BufferAttribute, Color, PlaneGeometry } from "three";

// Stylized, original take on a Florida-like peninsula. Not the official map.

const hash = (x: number, y: number) => {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

const vnoise = (x: number, y: number) => {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi);
  const b = hash(xi + 1, yi);
  const c = hash(xi, yi + 1);
  const d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
};

export const fbm = (x: number, y: number) => {
  let sum = 0;
  let amp = 0.5;
  let f = 1;
  for (let i = 0; i < 4; i++) {
    sum += amp * vnoise(x * f, y * f);
    f *= 2.03;
    amp *= 0.5;
  }
  return sum / 0.9375;
};

const sat = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, v: number) => {
  const t = sat((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

// Island chain trailing off the southern tip: [x, z, radius]
export const KEYS: [number, number, number][] = [
  [0, 69, 4.2],
  [-8, 74, 3.6],
  [-16, 78, 3.4],
  [-24, 81, 3.4],
  [-32, 83, 2.8],
  [-40, 84, 3.2],
];

// Flattened building sites: [x, z, radius]
const PADS: [number, number, number, string][] = [
  [17, 28, 10.5, "#a9a0b4"], // Vice City
  [-45, -53, 8, "#9a93a0"], // Port Gellhorn
  [2, -8, 10, "#a8936a"], // Ambrosia
];
export const PAD_HEIGHT = 0.6;

const MOUNTAIN: [number, number] = [0, -50];
const SWAMP: [number, number] = [-7, 36];

const padAt = (x: number, z: number) => {
  let weight = 0;
  let color = PADS[0][3];
  for (const [px, pz, r, padColor] of PADS) {
    const w = 1 - smooth(r * 0.75, r, Math.hypot(x - px, z - pz));
    if (w > weight) {
      weight = w;
      color = padColor;
    }
  }
  return { weight, color };
};

const swampWeight = (x: number, z: number) =>
  1 - smooth(9, 15, Math.hypot(x - SWAMP[0], z - SWAMP[1]));

// Positive on land, negative in the sea (roughly a distance to the coast)
const landness = (x: number, z: number) => {
  const cx = 6 * Math.sin(z * 0.03);
  const w = 30 - 13 * sat((z + 78) / 140);
  const body = Math.min(w - Math.abs(x - cx), z + 78, 62 - z);
  const panhandle = Math.min(12 - Math.abs(z + 62), x + 80, 10 - x);
  let d = Math.max(body, panhandle) + (fbm(x * 0.08, z * 0.08) - 0.5) * 7;
  const keyNoise = (fbm(x * 0.3, z * 0.3) - 0.5) * 1.6;
  for (const [kx, kz, r] of KEYS) {
    d = Math.max(d, r - Math.hypot(x - kx, z - kz) + keyNoise);
  }
  for (const [px, pz, r] of PADS) {
    d = Math.max(d, r - Math.hypot(x - px, z - pz));
  }
  return d;
};

export const heightAt = (x: number, z: number) => {
  const d = landness(x, z);
  if (d <= 0) return Math.max(-4, d * 0.35);

  let h =
    Math.min(d * 0.22, 1) + fbm(x * 0.15, z * 0.15) * 1.3 * smooth(1, 9, d);
  const md = Math.hypot(x - MOUNTAIN[0], z - MOUNTAIN[1]);
  h +=
    17 *
    Math.exp(-(md * md) / (2 * 9 * 9)) *
    (0.7 + 0.6 * fbm(x * 0.2 + 9, z * 0.2)) *
    smooth(0, 5, d);
  h +=
    5 *
    Math.exp(-((x + 16) ** 2 + (z + 60) ** 2) / (2 * 7 * 7)) *
    smooth(0, 5, d);

  const gw = swampWeight(x, z);
  const channel = Math.abs(fbm(x * 0.12 + 3, z * 0.12 + 7) - 0.5);
  h = h * (1 - gw) + (channel < 0.035 ? -0.3 : 0.14 + channel * 1.2) * gw;

  const pw = padAt(x, z).weight;
  return h * (1 - pw) + PAD_HEIGHT * pw;
};

const SAND = new Color("#e6c98e");
const DEEP = new Color("#0a3350");
const GRASS_A = new Color("#3a8a4c");
const GRASS_B = new Color("#79b858");
const SWAMP_A = new Color("#2f6f55");
const SWAMP_B = new Color("#8a9648");
const ROCK = new Color("#6d6478");
const PEAK = new Color("#c4b9cf");
const PAD = new Color();

export const buildTerrain = () => {
  const geo = new PlaneGeometry(220, 220, 240, 240);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const c = new Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i) - 15;
    const z = pos.getZ(i);
    const h = heightAt(x, z);
    pos.setXYZ(i, x, h, z);

    if (h < 0) {
      c.copy(SAND).lerp(DEEP, sat(-h / 2.2));
    } else {
      c.copy(GRASS_A).lerp(GRASS_B, fbm(x * 0.3, z * 0.3));
      const gw = swampWeight(x, z);
      if (gw > 0) {
        c.lerp(SWAMP_A.clone().lerp(SWAMP_B, fbm(x * 0.5 + 4, z * 0.5)), gw);
      }
      c.lerp(SAND, (1 - smooth(0.25, 0.75, h)) * (1 - gw));
      const pad = padAt(x, z);
      c.lerp(PAD.set(pad.color), pad.weight * 0.8);
      c.lerp(ROCK, smooth(5, 9, h));
      c.lerp(PEAK, smooth(12, 16, h));
    }
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  geo.setAttribute("color", new BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  return geo;
};
