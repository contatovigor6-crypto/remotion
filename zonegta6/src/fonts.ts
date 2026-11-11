import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fonts ship with the project (SIL Open Font License) so renders work offline
export const display = "Anton";
export const body = "Montserrat";
loadFont({
  family: display,
  url: staticFile("fonts/anton-latin-400-normal.woff2"),
  weight: "400",
});
loadFont({
  family: body,
  url: staticFile("fonts/montserrat-latin-600-normal.woff2"),
  weight: "600",
});
loadFont({
  family: body,
  url: staticFile("fonts/montserrat-latin-800-normal.woff2"),
  weight: "800",
});
