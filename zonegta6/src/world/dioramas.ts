import { random } from "remotion";
import {
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  Euler,
  IcosahedronGeometry,
  Matrix4,
  Quaternion,
  Vector3,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { KEYS, PAD_HEIGHT, heightAt } from "./terrain";

// Collects primitives and merges them into one vertex-colored geometry,
// so each diorama is a single draw call.
class Builder {
  private parts: BufferGeometry[] = [];

  add(geo: BufferGeometry, matrix: Matrix4, color: string) {
    const g = geo.index ? geo.toNonIndexed() : geo.clone();
    g.applyMatrix4(matrix);
    g.deleteAttribute("uv");
    const c = new Color(color);
    const colors = new Float32Array(g.attributes.position.count * 3);
    for (let i = 0; i < colors.length; i += 3) {
      colors[i] = c.r;
      colors[i + 1] = c.g;
      colors[i + 2] = c.b;
    }
    g.setAttribute("color", new BufferAttribute(colors, 3));
    this.parts.push(g);
  }

  // y is the bottom of the primitive
  box(
    w: number,
    h: number,
    d: number,
    x: number,
    y: number,
    z: number,
    color: string,
    ry = 0,
  ) {
    const m = new Matrix4().compose(
      new Vector3(x, y + h / 2, z),
      new Quaternion().setFromEuler(new Euler(0, ry, 0)),
      new Vector3(w, h, d),
    );
    this.add(new BoxGeometry(1, 1, 1), m, color);
  }

  cyl(
    rTop: number,
    rBottom: number,
    h: number,
    x: number,
    y: number,
    z: number,
    color: string,
    segments = 8,
  ) {
    const m = new Matrix4().makeTranslation(x, y + h / 2, z);
    this.add(new CylinderGeometry(rTop, rBottom, h, segments), m, color);
  }

  cone(
    r: number,
    h: number,
    x: number,
    y: number,
    z: number,
    color: string,
    segments = 6,
  ) {
    const m = new Matrix4().makeTranslation(x, y + h / 2, z);
    this.add(new ConeGeometry(r, h, segments), m, color);
  }

  blob(r: number, x: number, y: number, z: number, color: string, sy = 1) {
    const m = new Matrix4().compose(
      new Vector3(x, y, z),
      new Quaternion(),
      new Vector3(r, r * sy, r),
    );
    this.add(new IcosahedronGeometry(1, 1), m, color);
  }

  palm(x: number, y: number, z: number, h: number, seed: string) {
    this.cyl(0.07, 0.12, h, x, y, z, "#8a6a4a", 5);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + random(seed) * 6;
      const m = new Matrix4()
        .makeTranslation(x, y + h, z)
        .multiply(new Matrix4().makeRotationY(a))
        .multiply(new Matrix4().makeRotationZ(-0.45))
        .multiply(new Matrix4().makeTranslation(0.55, 0, 0))
        .multiply(new Matrix4().makeScale(1.1, 0.06, 0.32));
      this.add(new BoxGeometry(1, 1, 1), m, i % 2 ? "#2f9e58" : "#3fb568");
    }
  }

  pine(x: number, y: number, z: number, s: number, color: string) {
    this.cyl(0.08 * s, 0.1 * s, 0.5 * s, x, y, z, "#5a4030", 5);
    this.cone(0.7 * s, 1.1 * s, x, y + 0.4 * s, z, color);
    this.cone(0.52 * s, 0.95 * s, x, y + 1.0 * s, z, color);
    this.cone(0.34 * s, 0.8 * s, x, y + 1.55 * s, z, color);
  }

  build() {
    return mergeGeometries(this.parts);
  }
}

export type Diorama = { solid: BufferGeometry; glow: BufferGeometry };

const PASTELS = [
  "#ff9ec7",
  "#9ff0d8",
  "#fff1c9",
  "#c9b6ff",
  "#9bd8ff",
  "#ffffff",
  "#ffc49b",
];
const NEONS = ["#ff3d9a", "#3df2ff", "#ffd23d", "#b98cff"];

export const buildViceCity = (): Diorama => {
  const solid = new Builder();
  const glow = new Builder();
  const cx = 17;
  const cz = 28;
  const y = PAD_HEIGHT;
  for (let i = -5; i <= 5; i++) {
    for (let j = -5; j <= 5; j++) {
      const seed = `vc-${i}-${j}`;
      const x = cx + i * 1.75;
      const z = cz + j * 1.75;
      const dist = Math.hypot(i, j) * 1.75;
      if (dist > 9 || random(seed) < 0.12) continue;
      const downtown = Math.exp(-((i + 1) ** 2 + (j - 0.5) ** 2) / 7);
      const h =
        0.9 +
        random(seed + "h") * 2.2 +
        downtown * (5 + random(seed + "t") * 5);
      const w = 1.05 + random(seed + "w") * 0.3;
      const color = PASTELS[Math.floor(random(seed + "c") * PASTELS.length)];
      const neon = NEONS[Math.floor(random(seed + "n") * NEONS.length)];
      solid.box(w, h, w, x, y, z, color);
      // Lit floor bands and a neon crown
      for (let f = 0.55; f < h - 0.3; f += 0.7) {
        glow.box(w + 0.03, 0.12, w + 0.03, x, y + f, z, "#ffe9b8");
      }
      glow.box(w + 0.06, 0.1, w + 0.06, x, y + h, z, neon);
      if (h > 6) {
        solid.box(w * 0.6, 1.2, w * 0.6, x, y + h, z, color);
        glow.box(0.08, 1.6, 0.08, x, y + h + 1.2, z, neon);
      }
    }
  }
  // Ocean Beach: palms and lifeguard huts along the eastern shore
  for (let k = 0; k < 16; k++) {
    const z = cz - 9 + k * 1.2;
    const x = cx + 9.6 + random(`vcp-${k}`) * 0.8;
    solid.palm(
      x,
      heightAt(x, z),
      z,
      1.5 + random(`vcph-${k}`) * 0.7,
      `vcpl-${k}`,
    );
    if (k % 4 === 1) {
      solid.box(
        0.5,
        0.4,
        0.5,
        x + 0.9,
        heightAt(x + 0.9, z) + 0.2,
        z,
        PASTELS[k % PASTELS.length],
      );
    }
  }
  return { solid: solid.build(), glow: glow.build() };
};

export const buildKeys = (): Diorama => {
  const solid = new Builder();
  const glow = new Builder();
  KEYS.forEach(([kx, kz, r], i) => {
    for (let p = 0; p < 5; p++) {
      const a = random(`kp-${i}-${p}`) * Math.PI * 2;
      const d = random(`kd-${i}-${p}`) * r * 0.6;
      const x = kx + Math.cos(a) * d;
      const z = kz + Math.sin(a) * d;
      solid.palm(
        x,
        heightAt(x, z),
        z,
        1.3 + random(`kh-${i}-${p}`) * 0.9,
        `kl-${i}-${p}`,
      );
    }
    // Beach bar with a neon sign
    const by = heightAt(kx, kz);
    solid.box(1.1, 0.5, 0.8, kx, by, kz, PASTELS[i % PASTELS.length], i);
    solid.cone(0.95, 0.5, kx, by + 0.5, kz, "#c98f5a", 4);
    glow.box(0.7, 0.14, 0.05, kx, by + 1.15, kz, NEONS[i % NEONS.length], i);

    // Overseas highway to the next key
    const next = KEYS[i + 1] ?? null;
    if (next) {
      const dx = next[0] - kx;
      const dz = next[1] - kz;
      const len = Math.hypot(dx, dz);
      const ry = -Math.atan2(dz, dx);
      solid.box(len, 0.1, 0.5, kx + dx / 2, 0.65, kz + dz / 2, "#d8d2c8", ry);
      for (let s = 1; s < 6; s++) {
        solid.box(
          0.14,
          1.6,
          0.4,
          kx + (dx * s) / 6,
          -0.9,
          kz + (dz * s) / 6,
          "#bdb6ac",
          ry,
        );
      }
    }
  });
  // Bridge from the mainland to the first key
  solid.box(0.5, 0.1, 9, 0.5, 0.65, 64.5, "#d8d2c8", 0.05);
  // Sailboats
  [
    [-10, 83],
    [-27, 74],
    [-4, 79],
  ].forEach(([x, z], i) => {
    solid.box(1.1, 0.22, 0.36, x, -0.02, z, "#ffffff", i);
    solid.box(0.04, 1.3, 0.04, x, 0.2, z, "#dddddd");
    solid.box(
      0.5,
      0.9,
      0.03,
      x + 0.25,
      0.45,
      z,
      i % 2 ? "#ff9ec7" : "#fff1c9",
      i,
    );
  });
  return { solid: solid.build(), glow: glow.build() };
};

export const buildGrassrivers = (): Diorama => {
  const solid = new Builder();
  const glow = new Builder();
  const cx = -7;
  const cz = 36;
  for (let i = 0; i < 420; i++) {
    const a = random(`gr-a-${i}`) * Math.PI * 2;
    const d = Math.sqrt(random(`gr-d-${i}`)) * 13.5;
    const x = cx + Math.cos(a) * d;
    const z = cz + Math.sin(a) * d;
    const h = heightAt(x, z);
    if (h < 0) continue;
    if (i % 9 === 0) {
      // Mangrove / cypress
      const s = 0.8 + random(`gr-s-${i}`) * 0.8;
      solid.cyl(0.06 * s, 0.16 * s, 1.1 * s, x, h, z, "#5b4636", 5);
      solid.blob(
        0.75 * s,
        x,
        h + 1.3 * s,
        z,
        i % 2 ? "#2c6e4a" : "#3a8050",
        0.7,
      );
    } else {
      solid.cone(
        0.09,
        0.5 + random(`gr-h-${i}`) * 0.6,
        x,
        h,
        z,
        i % 3 ? "#a9b85a" : "#7fa04a",
        4,
      );
    }
  }
  // Stilt shack with a lit window
  const sx = cx + 2.5;
  const sz = cz - 1.5;
  const sy = heightAt(sx, sz);
  for (const [ox, oz] of [
    [-0.5, -0.4],
    [0.5, -0.4],
    [-0.5, 0.4],
    [0.5, 0.4],
  ]) {
    solid.box(0.08, 0.7, 0.08, sx + ox, sy, sz + oz, "#5b4636");
  }
  solid.box(1.4, 0.08, 1.2, sx, sy + 0.7, sz, "#7a5c40");
  solid.box(1.1, 0.7, 0.9, sx, sy + 0.78, sz, "#8f6e4c");
  solid.box(1.3, 0.1, 1.1, sx, sy + 1.48, sz, "#b0452f");
  glow.box(0.3, 0.25, 0.92, sx + 0.2, sy + 1.0, sz, "#ffd27a");
  return { solid: solid.build(), glow: glow.build() };
};

const CONTAINER_COLORS = [
  "#d9483b",
  "#2f7fd1",
  "#f09a2e",
  "#3aa66a",
  "#e8d44a",
  "#8a5bd1",
  "#e8e4dc",
];

export const buildPortGellhorn = (): Diorama => {
  const solid = new Builder();
  const glow = new Builder();
  const cx = -45;
  const cz = -53;
  const y = PAD_HEIGHT;
  // Concrete quay reaching into the gulf
  solid.box(13, 1.4, 4.5, cx, -0.75, cz + 8.2, "#8f8a94");
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 2; j++) {
      const stack = 1 + Math.floor(random(`pg-s-${i}-${j}`) * 3);
      for (let k = 0; k < stack; k++) {
        const color =
          CONTAINER_COLORS[
            Math.floor(random(`pg-c-${i}-${j}-${k}`) * CONTAINER_COLORS.length)
          ];
        solid.box(
          1.15,
          0.5,
          0.5,
          cx - 5.4 + i * 1.3,
          0.65 + k * 0.52,
          cz + 7 + j * 0.7,
          color,
        );
      }
    }
  }
  // Gantry cranes
  for (const ox of [-3.5, 2.5]) {
    const x = cx + ox;
    const z = cz + 9.6;
    for (const lx of [-0.7, 0.7]) {
      solid.box(0.16, 3.6, 0.16, x + lx, 0.65, z - 0.5, "#e8b53a");
      solid.box(0.16, 3.6, 0.16, x + lx, 0.65, z + 0.5, "#e8b53a");
    }
    solid.box(1.7, 0.22, 1.3, x, 4.25, z, "#e8b53a");
    solid.box(0.3, 0.22, 5.2, x, 4.47, z + 1.6, "#d9483b");
    solid.box(0.5, 0.4, 0.5, x, 3.85, z + 2.4, "#3b3644");
    glow.box(0.12, 0.12, 0.12, x, 4.72, z + 4.1, "#ff3d3d");
  }
  // Warehouses
  for (let i = 0; i < 3; i++) {
    const x = cx - 4.5 + i * 3.4;
    solid.box(2.8, 1.1, 2.2, x, y, cz + 2.6, i % 2 ? "#7c8fa3" : "#a39a8c");
    solid.box(2.9, 0.14, 2.3, x, y + 1.1, cz + 2.6, "#5c5568");
  }
  // Faded motel strip with a buzzing sign
  solid.box(6.5, 0.7, 1.1, cx - 1, y, cz - 2.2, "#e8c8b0");
  solid.box(6.7, 0.1, 1.3, cx - 1, y + 0.7, cz - 2.2, "#b0605a");
  for (let i = 0; i < 7; i++) {
    glow.box(
      0.28,
      0.3,
      0.03,
      cx - 3.7 + i * 0.9,
      y + 0.2,
      cz - 1.63,
      i === 4 ? "#3b3644" : "#ffd27a",
    );
  }
  solid.box(0.1, 2.2, 0.1, cx + 3.2, y, cz - 1.4, "#3b3644");
  glow.box(1.3, 0.5, 0.08, cx + 3.2, y + 2.0, cz - 1.4, "#ff3d9a");
  glow.box(1.0, 0.16, 0.1, cx + 3.2, y + 1.7, cz - 1.4, "#3df2ff");
  // Shuttered attraction: a dead ferris wheel
  const fx = cx - 5.2;
  const fz = cz - 3.6;
  solid.box(0.12, 2.3, 0.12, fx - 0.5, y, fz, "#6d6478");
  solid.box(0.12, 2.3, 0.12, fx + 0.5, y, fz, "#6d6478");
  for (let s = 0; s < 12; s++) {
    const a = (s / 12) * Math.PI * 2;
    const m = new Matrix4()
      .makeTranslation(fx, y + 2.3, fz)
      .multiply(new Matrix4().makeRotationZ(a))
      .multiply(new Matrix4().makeTranslation(0.85, 0, 0))
      .multiply(new Matrix4().makeScale(1.7, 0.06, 0.06));
    solid.add(new BoxGeometry(1, 1, 1), m, "#8a8296");
    solid.box(
      0.28,
      0.24,
      0.2,
      fx + Math.cos(a) * 1.7,
      y + 2.18 + Math.sin(a) * 1.7,
      fz,
      CONTAINER_COLORS[s % 5],
    );
  }
  // Trucks at the stop
  for (let i = 0; i < 4; i++) {
    const x = cx + 1 + i * 1.2;
    solid.box(0.4, 0.5, 1.3, x, y, cz - 4.6, "#e8e4dc");
    solid.box(0.4, 0.42, 0.4, x, y, cz - 3.7, CONTAINER_COLORS[i]);
  }
  return { solid: solid.build(), glow: glow.build() };
};

export const buildAmbrosia = (): Diorama => {
  const solid = new Builder();
  const glow = new Builder();
  const cx = 2;
  const cz = -8;
  const y = PAD_HEIGHT;
  // Refinery halls
  solid.box(4.2, 1.9, 2.8, cx - 1, y, cz, "#9a8f86");
  solid.box(2.2, 2.8, 2.2, cx + 2.4, y, cz - 0.2, "#7f7670");
  solid.box(3.2, 1.2, 1.8, cx - 1.4, y, cz + 2.6, "#b3a79b");
  for (let i = 0; i < 4; i++) {
    const m = new Matrix4()
      .makeTranslation(cx - 2.5 + i * 1.05, y + 1.9, cz)
      .multiply(new Matrix4().makeRotationX(Math.PI / 4))
      .multiply(new Matrix4().makeScale(1, 0.75, 0.75));
    solid.add(new BoxGeometry(1, 1, 2.6), m, "#6f6862");
    glow.box(
      0.9,
      0.3,
      0.04,
      cx - 2.5 + i * 1.05,
      y + 1.0,
      cz + 1.42,
      "#ffcf6a",
    );
  }
  glow.box(1.6, 0.4, 0.06, cx + 2.4, y + 2.1, cz + 0.93, "#ffd23d");
  // Chimneys with warning stripes
  for (const [ox, oz, h] of CHIMNEYS) {
    for (let s = 0; s < 6; s++) {
      const r0 = 0.34 - s * 0.02;
      solid.cyl(
        r0 - 0.02,
        r0,
        h / 6,
        cx + ox,
        y + (s * h) / 6,
        cz + oz,
        s % 2 ? "#e8e4dc" : "#c9453a",
        10,
      );
    }
    glow.box(0.12, 0.12, 0.12, cx + ox, y + h, cz + oz, "#ff3d3d");
  }
  // Sugar silos and pipes
  for (let i = 0; i < 4; i++) {
    const x = cx - 3.2 + i * 1.25;
    solid.cyl(0.55, 0.55, 2.4, x, y, cz - 2.6, "#d8d2c8", 12);
    solid.cone(0.55, 0.4, x, y + 2.4, cz - 2.6, "#b8b0a4", 12);
  }
  solid.box(4.6, 0.14, 0.14, cx - 1.3, y + 2.2, cz - 2.6, "#8a8296");
  solid.box(0.14, 0.14, 2.4, cx + 0.9, y + 2.2, cz - 1.4, "#8a8296");
  // Cane fields around the plant
  for (let i = 0; i < 460; i++) {
    const a = random(`am-a-${i}`) * Math.PI * 2;
    const d = 9.5 + random(`am-d-${i}`) * 7;
    const x = cx + Math.cos(a) * d;
    const z = Math.round((cz + Math.sin(a) * d) / 0.9) * 0.9;
    const h = heightAt(x, z);
    if (h < 0.3) continue;
    solid.box(
      0.9,
      0.5 + random(`am-h-${i}`) * 0.35,
      0.3,
      x,
      h,
      z,
      i % 2 ? "#b9c95a" : "#8fb04a",
    );
  }
  // Workers' houses and the biker bar
  for (let i = 0; i < 7; i++) {
    const x = cx - 5.4 + i * 1.5;
    const z = cz + 5.6 + (i % 2) * 0.9;
    solid.box(0.9, 0.6, 0.8, x, y, z, PASTELS[(i + 2) % PASTELS.length]);
    solid.cone(0.75, 0.45, x, y + 0.6, z, "#8a4f3f", 4);
  }
  solid.box(1.8, 0.8, 1.2, cx + 5.6, y, cz + 3.2, "#3b3644");
  glow.box(1.4, 0.3, 0.06, cx + 5.6, y + 0.95, cz + 3.83, "#ff3d3d");
  for (let i = 0; i < 5; i++) {
    solid.box(
      0.1,
      0.22,
      0.42,
      cx + 4.9 + i * 0.35,
      y,
      cz + 4.5,
      "#1c1a22",
      0.3,
    );
  }
  return { solid: solid.build(), glow: glow.build() };
};

// Chimney offsets from the Ambrosia center: [x, z, height]
export const CHIMNEYS: [number, number, number][] = [
  [3.9, -1.4, 6],
  [4.8, 0.2, 5.2],
  [0.4, 1.9, 4.6],
];

export const buildKalaga = (): Diorama => {
  const solid = new Builder();
  const glow = new Builder();
  const cx = 0;
  const cz = -50;
  for (let i = 0; i < 520; i++) {
    const a = random(`mk-a-${i}`) * Math.PI * 2;
    const d = 4 + Math.sqrt(random(`mk-d-${i}`)) * 21;
    const x = cx + Math.cos(a) * d;
    const z = cz + Math.sin(a) * d;
    const h = heightAt(x, z);
    if (h < 0.7 || h > 11.5) continue;
    const s = 0.75 + random(`mk-s-${i}`) * 0.7;
    solid.pine(x, h - 0.05, z, s, ["#1f5a3c", "#2a6b45", "#356f3d"][i % 3]);
  }
  // Ranger cabin and lookout tower, facing the southern slope
  const bx = cx + 6;
  const bz = cz + 10.5;
  const by = heightAt(bx, bz);
  solid.box(1.5, 0.8, 1.1, bx, by, bz, "#7a5236");
  const roof = new Matrix4()
    .makeTranslation(bx, by + 0.8, bz)
    .multiply(new Matrix4().makeRotationX(Math.PI / 4))
    .multiply(new Matrix4().makeScale(1.7, 0.85, 0.85));
  solid.add(new BoxGeometry(1, 1, 1), roof, "#3f2f28");
  glow.box(0.3, 0.3, 0.04, bx - 0.3, by + 0.3, bz + 0.56, "#ffd27a");
  glow.box(0.3, 0.3, 0.04, bx + 0.35, by + 0.3, bz + 0.56, "#ffd27a");

  const tx = cx - 5.5;
  const tz = cz + 8;
  const ty = heightAt(tx, tz);
  for (const [ox, oz] of [
    [-0.3, -0.3],
    [0.3, -0.3],
    [-0.3, 0.3],
    [0.3, 0.3],
  ]) {
    solid.box(0.07, 2.6, 0.07, tx + ox, ty, tz + oz, "#6b4a34");
  }
  solid.box(1, 0.5, 1, tx, ty + 2.6, tz, "#8a6444");
  solid.cone(0.85, 0.45, tx, ty + 3.1, tz, "#3f2f28", 4);
  glow.box(1.02, 0.14, 1.02, tx, ty + 2.85, tz, "#ffd27a");
  // Campfire
  glow.cone(0.16, 0.4, bx + 1.6, by, bz + 1.2, "#ff8a2a", 5);
  return { solid: solid.build(), glow: glow.build() };
};
