import { loadFont } from "@remotion/fonts";
import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { REGION, REGIONS, Region } from "./timeline";
import { projectToScreen } from "./world/camera";

// Fonts ship with the project (SIL Open Font License) so renders work offline
const display = "Anton";
const body = "Montserrat";
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

const PINK = "#ff3d9a";
const ORANGE = "#ff9a3d";
const SUNSET = `linear-gradient(180deg, #fff3b0 0%, ${ORANGE} 38%, ${PINK} 78%, #b03dff 100%)`;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Text slides up from behind a mask
const Reveal: React.FC<{
  readonly delay: number;
  readonly children: React.ReactNode;
  readonly style: React.CSSProperties | null;
}> = ({ delay, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
    durationInFrames: 22,
  });
  return (
    <div style={{ overflow: "hidden", ...style }}>
      <div style={{ transform: `translateY(${(1 - p) * 110}%)`, opacity: p }}>
        {children}
      </div>
    </div>
  );
};

export const ChannelBug: React.FC = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: 56,
        right: 72,
        display: "flex",
        alignItems: "center",
        gap: 14,
        fontFamily: display,
        fontSize: 40,
        letterSpacing: 3,
        color: "white",
        textShadow: "0 2px 12px rgba(20,0,40,0.7)",
      }}
    >
      <div
        style={{
          width: 16,
          height: 16,
          background: PINK,
          transform: "rotate(45deg)",
        }}
      />
      ZONE<span style={{ color: PINK }}>GTA6</span>
    </div>
  );
};

export const Vignette: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(18,2,40,0.55) 100%), linear-gradient(180deg, rgba(18,2,40,0.35) 0%, rgba(0,0,0,0) 18%)",
      }}
    />
  );
};

export const IntroTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const out = interpolate(
    frame,
    [durationInFrames - 14, durationInFrames - 2],
    [1, 0],
    clamp,
  );
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        opacity: out,
        transform: `scale(${1 + (1 - out) * 0.25})`,
      }}
    >
      <Reveal delay={6} style={null}>
        <div
          style={{
            fontFamily: body,
            fontWeight: 800,
            fontSize: 46,
            letterSpacing: 18,
            color: "white",
          }}
        >
          O MAPA DE GTA VI
        </div>
      </Reveal>
      <div style={{ display: "flex", marginTop: 4 }}>
        {"LEONIDA".split("").map((letter, i) => {
          const p = spring({
            frame: frame - 12 - i * 3,
            fps,
            config: { damping: 12, mass: 0.7 },
          });
          return (
            <span
              key={i}
              style={{
                fontFamily: display,
                fontSize: 400,
                lineHeight: 1.12,
                letterSpacing: 10,
                backgroundImage: SUNSET,
                WebkitBackgroundClip: "text",
                color: "transparent",
                filter:
                  "drop-shadow(0 10px 0 rgba(40,4,80,0.9)) drop-shadow(0 0 50px rgba(255,61,154,0.55))",
                transform: `translateY(${(1 - p) * 160}px) scale(${0.6 + 0.4 * p})`,
                opacity: Math.min(1, p * 1.5),
              }}
            >
              {letter}
            </span>
          );
        })}
      </div>
      <Reveal delay={40} style={null}>
        <div
          style={{
            fontFamily: body,
            fontWeight: 800,
            fontSize: 52,
            letterSpacing: 6,
            color: "#1a0530",
            background: "white",
            padding: "10px 34px",
          }}
        >
          AS 6 REGIÕES QUE VOCÊ VAI EXPLORAR
        </div>
      </Reveal>
    </AbsoluteFill>
  );
};

export const OverviewLabels: React.FC<{ readonly from: number }> = ({
  from,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const out = interpolate(
    frame,
    [durationInFrames - 16, durationInFrames - 4],
    [1, 0],
    clamp,
  );
  return (
    <AbsoluteFill style={{ opacity: out }}>
      {REGIONS.map((region, i) => {
        const p = spring({
          frame: frame - 14 - i * 5,
          fps,
          config: { damping: 14 },
        });
        const { x, y } = projectToScreen(frame + from, [
          region.pos[0],
          21,
          region.pos[2],
        ]);
        const anchor =
          region.label === "left"
            ? "-100%"
            : region.label === "right"
              ? "0%"
              : "-50%";
        return (
          <div
            key={region.id}
            style={{
              position: "absolute",
              left: x,
              top: y,
              transform: `translate(${anchor}, -100%) scale(${p})`,
              transformOrigin: `${anchor.replace("-", "")} 100%`,
              fontFamily: display,
              fontSize: 44,
              letterSpacing: 2,
              color: "white",
              background: "rgba(22,4,48,0.88)",
              borderBottom: `6px solid ${region.accent}`,
              padding: "6px 20px 4px",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ color: region.accent, marginRight: 12 }}>
              {i + 1}
            </span>
            {region.name}
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 96, bottom: 110 }}>
        <Reveal delay={8} style={null}>
          <div
            style={{
              fontFamily: display,
              fontSize: 150,
              lineHeight: 1.1,
              color: "white",
              textShadow: "0 6px 30px rgba(20,0,40,0.8)",
            }}
          >
            UM ESTADO.
          </div>
        </Reveal>
        <Reveal delay={18} style={null}>
          <div
            style={{
              fontFamily: display,
              fontSize: 150,
              lineHeight: 1.3,
              backgroundImage: SUNSET,
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            6 REGIÕES.
          </div>
        </Reveal>
      </div>
      <Disclaimer />
    </AbsoluteFill>
  );
};

const Disclaimer: React.FC = () => {
  return (
    <div
      style={{
        position: "absolute",
        right: 72,
        bottom: 60,
        fontFamily: body,
        fontWeight: 600,
        fontSize: 26,
        color: "rgba(255,255,255,0.85)",
        textShadow: "0 2px 8px rgba(20,0,40,0.9)",
      }}
    >
      Mapa estilizado · ilustração de fã, não é o mapa oficial
    </div>
  );
};

export const RegionCard: React.FC<{
  readonly region: Region;
  readonly index: number;
}> = ({ region, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const out = interpolate(frame, [REGION - 22, REGION - 10], [1, 0], {
    ...clamp,
    easing: Easing.in(Easing.quad),
  });
  const scrim = interpolate(frame, [0, 20], [0, 1], clamp) * out;
  const bar = spring({
    frame: frame - 14,
    fps,
    config: { damping: 200 },
    durationInFrames: 30,
  });
  const progress = interpolate(frame, [20, REGION - 22], [0, 1], clamp);

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          opacity: scrim,
          background:
            "linear-gradient(90deg, rgba(16,2,38,0.93) 0%, rgba(16,2,38,0.8) 30%, rgba(16,2,38,0) 60%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 96,
          bottom: 120,
          width: 900,
          opacity: out,
          transform: `translateX(${(1 - out) * -60}px)`,
        }}
      >
        <Reveal delay={14} style={null}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              fontFamily: body,
              fontWeight: 800,
              fontSize: 34,
              letterSpacing: 6,
              color: "white",
            }}
          >
            <span
              style={{
                background: region.accent,
                color: "#160430",
                padding: "4px 16px",
                letterSpacing: 2,
              }}
            >
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(REGIONS.length).padStart(2, "0")}
            </span>
            REGIÃO DE LEONIDA
          </div>
        </Reveal>
        <Reveal delay={20} style={{ marginTop: 10 }}>
          <div
            style={{
              fontFamily: display,
              // Longer names shrink so they always fit the card
              fontSize: Math.min(168, 880 / (region.name.length * 0.5)),
              lineHeight: 1.12,
              letterSpacing: 2,
              color: "white",
              whiteSpace: "nowrap",
              textShadow: `6px 6px 0 ${region.accent}`,
            }}
          >
            {region.name}
          </div>
        </Reveal>
        <div
          style={{
            height: 8,
            width: 900 * bar,
            background: region.accent,
            marginTop: 6,
          }}
        />
        <Reveal delay={32} style={{ marginTop: 22 }}>
          <div
            style={{
              fontFamily: body,
              fontWeight: 800,
              fontSize: 48,
              color: region.accent,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {region.tagline}
          </div>
        </Reveal>
        <div
          style={{
            marginTop: 26,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {region.facts.map((fact, i) => {
            const p = spring({
              frame: frame - 52 - i * 30,
              fps,
              config: { damping: 200 },
              durationInFrames: 20,
            });
            return (
              <div
                key={fact}
                style={{
                  display: "flex",
                  gap: 22,
                  alignItems: "flex-start",
                  fontFamily: body,
                  fontWeight: 600,
                  fontSize: 44,
                  lineHeight: 1.22,
                  color: "white",
                  opacity: p,
                  transform: `translateX(${(1 - p) * -40}px)`,
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    background: region.accent,
                    transform: "rotate(45deg)",
                    marginTop: 18,
                    flexShrink: 0,
                  }}
                />
                {fact}
              </div>
            );
          })}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 96,
          bottom: 72,
          width: 900,
          height: 6,
          background: "rgba(255,255,255,0.25)",
          opacity: scrim,
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            background: "white",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const SWAP = 112;
  const first = interpolate(frame, [SWAP - 12, SWAP], [1, 0], clamp);
  const pop = spring({
    frame: frame - SWAP - 30,
    fps,
    config: { damping: 11 },
  });
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          opacity: interpolate(frame, [10, 40], [0, 1], clamp),
          background:
            "radial-gradient(ellipse at center, rgba(16,2,38,0.8) 0%, rgba(16,2,38,0.3) 80%)",
        }}
      />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          opacity: first,
        }}
      >
        <Reveal delay={30} style={null}>
          <div
            style={{
              fontFamily: body,
              fontWeight: 800,
              fontSize: 50,
              letterSpacing: 16,
              color: "white",
            }}
          >
            LEONIDA ABRE AS PORTAS EM
          </div>
        </Reveal>
        <Reveal delay={40} style={null}>
          <div
            style={{
              fontFamily: display,
              fontSize: 330,
              lineHeight: 1.12,
              backgroundImage: SUNSET,
              WebkitBackgroundClip: "text",
              color: "transparent",
              filter: "drop-shadow(0 8px 0 rgba(40,4,80,0.9))",
            }}
          >
            19 NOV 2026
          </div>
        </Reveal>
        <Reveal delay={54} style={null}>
          <div
            style={{
              fontFamily: body,
              fontWeight: 800,
              fontSize: 48,
              letterSpacing: 8,
              color: "white",
            }}
          >
            PS5 · XBOX SERIES X|S
          </div>
        </Reveal>
      </AbsoluteFill>
      {frame >= SWAP ? (
        <AbsoluteFill
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <Reveal delay={SWAP + 4} style={null}>
            <div
              style={{
                fontFamily: display,
                fontSize: 130,
                lineHeight: 1.3,
                color: "white",
                textAlign: "center",
                textShadow: "0 6px 30px rgba(20,0,40,0.8)",
              }}
            >
              QUAL REGIÃO VOCÊ VAI
            </div>
          </Reveal>
          <Reveal delay={SWAP + 12} style={null}>
            <div
              style={{
                fontFamily: display,
                fontSize: 130,
                lineHeight: 1.15,
                backgroundImage: SUNSET,
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              EXPLORAR PRIMEIRO?
            </div>
          </Reveal>
          <div
            style={{
              marginTop: 50,
              transform: `scale(${pop})`,
              display: "flex",
              alignItems: "center",
              gap: 28,
              fontFamily: body,
              fontWeight: 800,
              fontSize: 50,
              color: "white",
            }}
          >
            COMENTE E
            <span
              style={{
                background: PINK,
                padding: "14px 36px",
                letterSpacing: 3,
              }}
            >
              INSCREVA-SE
            </span>
            <span
              style={{ fontFamily: display, fontSize: 68, letterSpacing: 3 }}
            >
              ZONE<span style={{ color: PINK }}>GTA6</span>
            </span>
          </div>
        </AbsoluteFill>
      ) : null}
      <Disclaimer />
    </AbsoluteFill>
  );
};
