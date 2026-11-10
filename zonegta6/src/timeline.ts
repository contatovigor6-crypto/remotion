export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// 120 BPM soundtrack: one bar = 60 frames. Every section starts on a bar.
export const INTRO = 120;
export const OVERVIEW = 120;
export const REGION = 240;
export const OUTRO = 240;

export type Region = {
  id: string;
  name: string;
  tagline: string;
  facts: string[];
  accent: string;
  // Which way the name tag hangs off the pin on the overview map
  label: "left" | "center" | "right";
  // World position of the diorama (x east, y up, z south)
  pos: [number, number, number];
  // Orbit shot: camera = pos + (radius·cos a, height, radius·sin a)
  radius: number;
  height: number;
  angle: number;
  sweep: number;
};

export const REGIONS: Region[] = [
  {
    id: "vice-city",
    label: "right",
    name: "VICE CITY",
    tagline: "A capital do sol e da diversão",
    facts: [
      "Hotéis art déco em tons pastel e as areias de Ocean Beach",
      "Little Cuba e o mercado de pulgas Tisha-Wocka",
      "VC Port: a capital mundial dos cruzeiros",
    ],
    accent: "#ff3d9a",
    pos: [17, 2.5, 28],
    radius: 31,
    height: 12,
    angle: 0.25,
    sweep: 0.55,
  },
  {
    id: "leonida-keys",
    label: "left",
    name: "LEONIDA KEYS",
    tagline: "O arquipélago tropical do sul",
    facts: [
      "Ilhas ligadas por pontes no extremo sul do estado",
      "Alguns dos melhores bares de beira de estrada da América",
      "Águas lindas… e perigosas",
    ],
    accent: "#3df2ff",
    pos: [-20, 0.5, 77],
    radius: 36,
    height: 9,
    angle: 2.95,
    sweep: -0.3,
  },
  {
    id: "grassrivers",
    label: "left",
    name: "GRASSRIVERS",
    tagline: "O coração primitivo de Leonida",
    facts: [
      "Um pântano gigante no interior do mapa",
      "Jacarés são a atração principal",
      "Mas há predadores bem mais mortais à espreita",
    ],
    accent: "#7dff6a",
    pos: [-7, 0.5, 36],
    radius: 27,
    height: 10,
    angle: 2.5,
    sweep: -0.55,
  },
  {
    id: "port-gellhorn",
    label: "center",
    name: "PORT GELLHORN",
    tagline: "A costa esquecida de Leonida",
    facts: [
      "Motéis baratos e atrações abandonadas",
      "Antigo destino de férias, hoje em decadência",
      "Nova economia: energéticos, analgésicos e paradas de caminhão",
    ],
    accent: "#ff9a3d",
    pos: [-45, 1, -51],
    radius: 29,
    height: 11,
    angle: 1.15,
    sweep: 0.5,
  },
  {
    id: "ambrosia",
    label: "right",
    name: "AMBROSIA",
    tagline: "Indústria e valores à moda antiga",
    facts: [
      "A refinaria de açúcar Allied Crystal emprega a cidade",
      "Uma gangue de motoqueiros manda nas ruas",
      "Aqui a regra é uma só: custe o que custar",
    ],
    accent: "#ffd23d",
    pos: [2, 2.5, -8],
    radius: 29,
    height: 12,
    angle: 0.15,
    sweep: 0.55,
  },
  {
    id: "mount-kalaga",
    label: "right",
    name: "MOUNT KALAGA",
    tagline: "O parque nacional da fronteira norte",
    facts: [
      "Caça, pesca e trilhas off-road",
      "Natureza selvagem perto da divisa do estado",
      "Místicos e radicais paranoicos escondidos na mata",
    ],
    accent: "#b98cff",
    pos: [0, 7, -50],
    radius: 46,
    height: 16,
    angle: 0.9,
    sweep: 0.6,
  },
];

export const REGIONS_START = INTRO + OVERVIEW;
export const regionStart = (i: number) => REGIONS_START + i * REGION;
export const OUTRO_START = regionStart(REGIONS.length);
export const DURATION = OUTRO_START + OUTRO;
