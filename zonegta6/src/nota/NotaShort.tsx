import { Audio } from "@remotion/media";
import React from "react";
import {
  AbsoluteFill,
  Composition,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { body, display } from "../fonts";
import { Stars3D } from "./Stars3D";
import {
  FIVE_STAR_SHARE,
  RATING,
  RATING_COUNT,
  SCENES,
  SHORT_DURATION,
  SHORT_FPS,
  SHORT_HEIGHT,
  SHORT_WIDTH,
  SOURCE,
} from "./timeline";

const INK = "#0c0618";
const YELLOW = "#ffd400";
const PINK = "#ff3d9a";
const CYAN = "#3df2ff";
const GREEN = "#5dff7a";
const RED = "#ff3b4e";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame * 0.02) * 60;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at ${50 + drift / 20}% 46%, rgba(255,61,154,0.34) 0%, rgba(255,61,154,0) 42%), radial-gradient(circle at 20% 88%, rgba(61,242,255,0.2) 0%, rgba(61,242,255,0) 40%), linear-gradient(180deg, #07041a 0%, #1b0b3f 55%, #3a0f55 100%)`,
      }}
    />
  );
};

// Two-line headline in the channel's cover style: white line + tilted color box
const Headline: React.FC<{
  readonly top: string;
  readonly boxed: string;
  readonly color: string;
}> = ({ top, boxed, color }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const a = spring({
    frame: frame - 2,
    fps,
    config: { damping: 13, mass: 0.6 },
  });
  const b = spring({
    frame: frame - 8,
    fps,
    config: { damping: 10, mass: 0.7 },
  });
  const out = interpolate(
    frame,
    [durationInFrames - 8, durationInFrames - 1],
    [1, 0],
    clamp,
  );
  return (
    <div
      style={{
        position: "absolute",
        top: 230,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: out,
      }}
    >
      <div
        style={{
          fontFamily: display,
          fontSize: 132,
          lineHeight: 1.25,
          color: "white",
          letterSpacing: 2,
          textShadow: "0 8px 0 rgba(0,0,0,0.55)",
          transform: `translateY(${(1 - a) * -80}px)`,
          opacity: a,
          whiteSpace: "nowrap",
        }}
      >
        {top}
      </div>
      <div
        style={{
          fontFamily: display,
          fontSize: 150,
          lineHeight: 1.22,
          color: INK,
          background: color,
          padding: "0 40px",
          marginTop: 4,
          letterSpacing: 2,
          boxShadow: "12px 12px 0 rgba(0,0,0,0.55)",
          transform: `rotate(-3deg) scale(${b})`,
          whiteSpace: "nowrap",
        }}
      >
        {boxed}
      </div>
    </div>
  );
};

const Caption: React.FC<{
  readonly delay: number;
  readonly children: React.ReactNode;
}> = ({ delay, children }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const p = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, mass: 0.6 },
  });
  const out = interpolate(
    frame,
    [durationInFrames - 8, durationInFrames - 1],
    [1, 0],
    clamp,
  );
  return (
    <div
      style={{
        position: "absolute",
        top: 1290,
        left: 90,
        right: 90,
        textAlign: "center",
        fontFamily: body,
        fontWeight: 800,
        fontSize: 60,
        lineHeight: 1.22,
        color: "white",
        textShadow: "0 4px 18px rgba(0,0,0,0.8)",
        opacity: p * out,
        transform: `translateY(${(1 - p) * 40}px)`,
      }}
    >
      {children}
    </div>
  );
};

const Star: React.FC<{ readonly size: number; readonly color: string }> = ({
  size,
  color,
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path
        fill={color}
        d="M12 1.6l3.1 6.6 7.2.9-5.3 5 1.4 7.1L12 17.7l-6.4 3.5 1.4-7.1-5.3-5 7.2-.9z"
      />
    </svg>
  );
};

const Hook: React.FC = () => {
  return (
    <AbsoluteFill>
      <Headline top="GTA 6 JÁ TEM" boxed="NOTA?" color={YELLOW} />
      <Caption delay={44}>
        Antes mesmo do <span style={{ color: YELLOW }}>lançamento</span>
      </Caption>
    </AbsoluteFill>
  );
};

// A drawn stand-in for a store listing, not a real screenshot
const StoreCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const enter = spring({ frame: frame - 6, fps, config: { damping: 14 } });
  const out = interpolate(
    frame,
    [durationInFrames - 8, durationInFrames - 1],
    [1, 0],
    clamp,
  );
  const ring = spring({ frame: frame - 62, fps, config: { damping: 9 } });
  const tag = spring({ frame: frame - 78, fps, config: { damping: 10 } });
  return (
    <AbsoluteFill style={{ perspective: 1600, opacity: out }}>
      <div
        style={{
          position: "absolute",
          top: 640,
          left: 100,
          width: 880,
          transform: `translateY(${(1 - enter) * 200}px) rotateY(${-10 + Math.sin(frame * 0.04) * 4}deg) rotateX(5deg) scale(${0.85 + 0.15 * enter})`,
          opacity: enter,
          background: "linear-gradient(160deg, #1d2440 0%, #0f1326 100%)",
          borderRadius: 36,
          border: "3px solid rgba(255,255,255,0.14)",
          boxShadow: "0 40px 90px rgba(0,0,0,0.6)",
          padding: 40,
          display: "flex",
          gap: 36,
        }}
      >
        <div
          style={{
            width: 270,
            height: 360,
            borderRadius: 20,
            background: `linear-gradient(180deg, #ffd27a 0%, #ff7a5c 45%, ${PINK} 75%, #5b2a9c 100%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: display,
            fontSize: 190,
            color: "white",
            textShadow: "0 8px 0 rgba(60,10,90,0.7)",
            flexShrink: 0,
          }}
        >
          VI
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            fontFamily: body,
            color: "white",
          }}
        >
          <div
            style={{
              fontWeight: 800,
              fontSize: 46,
              lineHeight: 1.1,
              whiteSpace: "nowrap",
            }}
          >
            Grand Theft Auto VI
          </div>
          <div
            style={{
              fontWeight: 600,
              fontSize: 32,
              color: "rgba(255,255,255,0.65)",
            }}
          >
            Rockstar Games
          </div>
          <div
            style={{ display: "flex", gap: 12, fontWeight: 800, fontSize: 28 }}
          >
            <span
              style={{
                background: "white",
                color: INK,
                padding: "4px 16px",
                borderRadius: 8,
              }}
            >
              PS5
            </span>
            <span
              style={{
                border: "2px solid white",
                padding: "2px 16px",
                borderRadius: 8,
              }}
            >
              PRÉ-VENDA
            </span>
          </div>
          <div
            style={{
              position: "relative",
              marginTop: 26,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {new Array(5).fill(0).map((_, i) => (
              <Star key={i} size={58} color={YELLOW} />
            ))}
            <div
              style={{
                position: "absolute",
                inset: "-18px -22px",
                border: `7px solid ${PINK}`,
                borderRadius: 26,
                transform: `scale(${1.5 - 0.5 * ring})`,
                opacity: ring,
              }}
            />
          </div>
          <div style={{ fontWeight: 800, fontSize: 44 }}>
            {String(RATING).replace(".", ",")}
            <span
              style={{
                fontWeight: 600,
                fontSize: 30,
                color: "rgba(255,255,255,0.65)",
              }}
            >
              {" "}
              · {RATING_COUNT} avaliações
            </span>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            right: -20,
            bottom: -44,
            fontFamily: display,
            fontSize: 64,
            color: INK,
            background: PINK,
            padding: "2px 28px",
            transform: `rotate(-5deg) scale(${tag})`,
            boxShadow: "8px 8px 0 rgba(0,0,0,0.5)",
          }}
        >
          OLHA ISSO
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1170,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: body,
          fontWeight: 600,
          fontSize: 26,
          color: "rgba(255,255,255,0.6)",
          opacity: enter,
        }}
      >
        Ilustração · não é captura de tela da loja
      </div>
    </AbsoluteFill>
  );
};

const Store: React.FC = () => {
  return (
    <AbsoluteFill>
      <Headline top="APARECEU NA" boxed="PS STORE" color={CYAN} />
      <StoreCard />
      <Caption delay={34}>
        As estrelas surgiram{" "}
        <span style={{ color: CYAN }}>antes do jogo sair</span>
      </Caption>
    </AbsoluteFill>
  );
};

const Average: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const value = interpolate(frame, [34, 112], [0, RATING], {
    ...clamp,
    easing: (t) => 1 - (1 - t) ** 3,
  });
  const pop = spring({ frame: frame - 10, fps, config: { damping: 12 } });
  const out = interpolate(
    frame,
    [durationInFrames - 8, durationInFrames - 1],
    [1, 0],
    clamp,
  );
  const bars = [
    { label: "5", share: FIVE_STAR_SHARE, note: "11 notas", color: YELLOW },
    { label: "1", share: 100 - FIVE_STAR_SHARE, note: "1 nota", color: RED },
  ];
  return (
    <AbsoluteFill>
      <Headline top="A MÉDIA É" boxed="ALTÍSSIMA" color={YELLOW} />
      <div
        style={{
          position: "absolute",
          top: 585,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: display,
          fontSize: 250,
          lineHeight: 1.1,
          color: YELLOW,
          textShadow: "0 12px 0 rgba(0,0,0,0.5), 0 0 80px rgba(255,212,0,0.45)",
          transform: `scale(${pop})`,
          opacity: out,
        }}
      >
        {value.toFixed(2).replace(".", ",")}
        <span style={{ fontSize: 120, color: "white" }}> /5</span>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1115,
          left: 120,
          right: 120,
          display: "flex",
          flexDirection: "column",
          gap: 18,
          opacity: out,
        }}
      >
        {bars.map((bar, i) => {
          const grow = spring({
            frame: frame - 118 - i * 12,
            fps,
            config: { damping: 200 },
            durationInFrames: 30,
          });
          return (
            <div
              key={bar.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                opacity: Math.min(1, grow * 3),
              }}
            >
              <div
                style={{
                  width: 86,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontFamily: display,
                  fontSize: 50,
                  color: "white",
                }}
              >
                {bar.label}
                <Star size={40} color={bar.color} />
              </div>
              <div
                style={{
                  flex: 1,
                  height: 44,
                  background: "rgba(255,255,255,0.14)",
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${bar.share * grow}%`,
                    height: "100%",
                    background: bar.color,
                    borderRadius: 10,
                  }}
                />
              </div>
              <div
                style={{
                  width: 250,
                  fontFamily: body,
                  fontWeight: 800,
                  fontSize: 40,
                  color: "white",
                }}
              >
                {Math.round(bar.share * grow)}%
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: 28,
                    color: "rgba(255,255,255,0.65)",
                  }}
                >
                  {" "}
                  · {bar.note}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <Caption delay={150}>
        Só <span style={{ color: YELLOW }}>{RATING_COUNT} avaliações</span> até
        agora
      </Caption>
    </AbsoluteFill>
  );
};

// Math operators are set in the body font, which has full-size glyphs for them
const Op: React.FC<{ readonly children: string }> = ({ children }) => {
  return (
    <span style={{ fontFamily: body, fontWeight: 800, fontSize: 80 }}>
      {children}
    </span>
  );
};

const Twist: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const FLIP = 100;
  const math = spring({ frame: frame - 26, fps, config: { damping: 14 } });
  const mathOut = interpolate(frame, [FLIP - 10, FLIP - 2], [1, 0], clamp);
  const stamp = spring({
    frame: frame - FLIP - 14,
    fps,
    config: { damping: 8, mass: 0.7 },
  });
  return (
    <AbsoluteFill>
      <Headline top="ALGUÉM DEU" boxed="1 ESTRELA" color={RED} />
      <div
        style={{
          position: "absolute",
          top: 1050,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: display,
          fontSize: 92,
          color: "white",
          opacity: math * mathOut,
          transform: `scale(${0.8 + 0.2 * math})`,
        }}
      >
        11 <Op>×</Op> <span style={{ color: YELLOW }}>5</span> <Op>+</Op> 1{" "}
        <Op>×</Op> <span style={{ color: RED }}>1</span> <Op>=</Op>{" "}
        {String(RATING).replace(".", ",")}
      </div>
      {frame >= FLIP ? (
        <div
          style={{
            position: "absolute",
            top: 1040,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontFamily: display,
              fontSize: 100,
              color: INK,
              background: GREEN,
              padding: "0 36px",
              transform: `rotate(-4deg) scale(${stamp})`,
              boxShadow: "10px 10px 0 rgba(0,0,0,0.5)",
            }}
          >
            VIROU 5 ESTRELAS
          </div>
        </div>
      ) : null}
      <Sequence durationInFrames={FLIP} layout="none">
        <Caption delay={40}>
          Foi ela que puxou a média pra{" "}
          <span style={{ color: RED }}>baixo</span>
        </Caption>
      </Sequence>
      <Sequence from={FLIP} layout="none">
        <Caption delay={18}>
          Depois, a pessoa <span style={{ color: GREEN }}>mudou a nota</span>
        </Caption>
      </Sequence>
    </AbsoluteFill>
  );
};

const Who: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const out = interpolate(
    frame,
    [durationInFrames - 8, durationInFrames - 1],
    [1, 0],
    clamp,
  );
  const cards = [
    {
      tag: "HIPÓTESE 1",
      text: "Imprensa e criadores que já receberam o jogo",
      delay: 22,
    },
    {
      tag: "HIPÓTESE 2",
      text: "O pré-load liberou o botão de avaliar",
      delay: 82,
    },
  ];
  const stamp = spring({
    frame: frame - 150,
    fps,
    config: { damping: 8, mass: 0.7 },
  });
  return (
    <AbsoluteFill>
      <Headline top="MAS QUEM" boxed="AVALIOU?" color={GREEN} />
      <div
        style={{
          position: "absolute",
          top: 640,
          left: 90,
          right: 90,
          display: "flex",
          flexDirection: "column",
          gap: 34,
          opacity: out,
        }}
      >
        {cards.map((card, i) => {
          const p = spring({
            frame: frame - card.delay,
            fps,
            config: { damping: 14, mass: 0.7 },
          });
          return (
            <div
              key={card.tag}
              style={{
                background: "rgba(12,6,24,0.82)",
                border: "3px solid rgba(255,255,255,0.16)",
                borderLeft: `14px solid ${GREEN}`,
                borderRadius: 24,
                padding: "30px 40px 36px",
                opacity: p,
                transform: `translateX(${(1 - p) * (i % 2 ? 160 : -160)}px)`,
              }}
            >
              <div
                style={{
                  fontFamily: display,
                  fontSize: 48,
                  letterSpacing: 3,
                  color: GREEN,
                }}
              >
                {card.tag}
              </div>
              <div
                style={{
                  fontFamily: body,
                  fontWeight: 800,
                  fontSize: 58,
                  lineHeight: 1.18,
                  color: "white",
                  marginTop: 8,
                }}
              >
                {card.text}
              </div>
            </div>
          );
        })}
      </div>
      <Caption delay={150}>
        <span
          style={{
            display: "inline-block",
            fontFamily: display,
            fontWeight: 400,
            fontSize: 64,
            lineHeight: 1.25,
            color: "white",
            background: RED,
            padding: "6px 30px",
            transform: `rotate(-2deg) scale(${stamp})`,
            boxShadow: "8px 8px 0 rgba(0,0,0,0.5)",
          }}
        >
          SONY E ROCKSTAR NÃO COMENTARAM
        </span>
      </Caption>
    </AbsoluteFill>
  );
};

const Warning: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const out = interpolate(
    frame,
    [durationInFrames - 8, durationInFrames - 1],
    [1, 0],
    clamp,
  );
  const rows = [
    {
      big: "SÓ ESTRELAS",
      small: "Nenhuma avaliação tem texto",
      color: "white",
      delay: 20,
    },
    {
      big: "REVIEWS: 18/11",
      small: "Previsão, ainda sem confirmação oficial",
      color: CYAN,
      delay: 62,
    },
  ];
  const stamp = spring({
    frame: frame - 108,
    fps,
    config: { damping: 8, mass: 0.7 },
  });
  return (
    <AbsoluteFill>
      <Headline top="ISSO NÃO É" boxed="REVIEW" color={PINK} />
      <div
        style={{
          position: "absolute",
          top: 650,
          left: 90,
          right: 90,
          display: "flex",
          flexDirection: "column",
          gap: 44,
          opacity: out,
        }}
      >
        {rows.map((row) => {
          const p = spring({
            frame: frame - row.delay,
            fps,
            config: { damping: 14, mass: 0.7 },
          });
          return (
            <div
              key={row.big}
              style={{
                textAlign: "center",
                opacity: p,
                transform: `translateY(${(1 - p) * 50}px)`,
              }}
            >
              <div
                style={{
                  fontFamily: display,
                  fontSize: 130,
                  lineHeight: 1.15,
                  color: row.color,
                }}
              >
                {row.big}
              </div>
              <div
                style={{
                  fontFamily: body,
                  fontWeight: 600,
                  fontSize: 44,
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                {row.small}
              </div>
            </div>
          );
        })}
      </div>
      <Caption delay={108}>
        Nota no Metacritic antes disso?{" "}
        <span
          style={{
            display: "inline-block",
            fontFamily: display,
            fontWeight: 400,
            fontSize: 80,
            color: "white",
            background: RED,
            padding: "0 26px",
            transform: `rotate(-4deg) scale(${stamp})`,
          }}
        >
          FAKE
        </span>
      </Caption>
    </AbsoluteFill>
  );
};

const Brand: React.FC<{ readonly size: number }> = ({ size }) => {
  return (
    <div
      style={{
        fontFamily: display,
        fontSize: size,
        letterSpacing: 2,
        color: "white",
        transform: "skewX(-8deg)",
        filter: "drop-shadow(0 5px 0 rgba(0,0,0,0.5))",
        whiteSpace: "nowrap",
      }}
    >
      Zone
      <span
        style={{
          backgroundImage: `linear-gradient(90deg, ${PINK}, #d47bff)`,
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
      >
        GTAVI
      </span>
    </div>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const brand = spring({ frame: frame - 34, fps, config: { damping: 11 } });
  return (
    <AbsoluteFill>
      <Headline top="E VOCÊ, QUE" boxed="NOTA DÁ?" color={YELLOW} />
      <div
        style={{
          position: "absolute",
          top: 1045,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          transform: `scale(${brand})`,
        }}
      >
        <div
          style={{
            fontFamily: body,
            fontWeight: 800,
            fontSize: 44,
            letterSpacing: 6,
            color: "white",
          }}
        >
          SEGUE PRA MAIS
        </div>
        <Brand size={118} />
      </div>
      <Caption delay={18}>
        Comenta de <span style={{ color: YELLOW }}>1 a 5</span> aqui embaixo
      </Caption>
    </AbsoluteFill>
  );
};

// A quick flash on every cut, in time with the soundtrack's impacts
const CutFlash: React.FC = () => {
  const frame = useCurrentFrame();
  const cuts = Object.values(SCENES).filter((start) => start > 0);
  const since = Math.min(
    ...cuts.map((start) => (frame >= start ? frame - start : Infinity)),
  );
  const opacity = interpolate(since, [0, 7], [0.5, 0], clamp);
  if (opacity <= 0) return null;
  return <AbsoluteFill style={{ background: "white", opacity }} />;
};

const Chrome: React.FC = () => {
  const frame = useCurrentFrame();
  const show = interpolate(
    frame,
    [SCENES.outro - 8, SCENES.outro],
    [1, 0],
    clamp,
  );
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: 10,
          width: `${(frame / SHORT_DURATION) * 100}%`,
          background: PINK,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: show,
        }}
      >
        <Brand size={64} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 1500,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: body,
          fontWeight: 600,
          fontSize: 26,
          color: "rgba(255,255,255,0.7)",
        }}
      >
        {SOURCE}
      </div>
    </AbsoluteFill>
  );
};

export const NotaShort: React.FC = () => {
  const { hook, store, average, twist, who, warning, outro } = SCENES;
  return (
    <AbsoluteFill style={{ backgroundColor: "#07041a" }}>
      <Sequence name="Fundo">
        <Background />
      </Sequence>
      <Sequence name="Estrelas 3D">
        <Stars3D />
      </Sequence>
      <Sequence name="Gancho" from={hook} durationInFrames={store - hook}>
        <Hook />
      </Sequence>
      <Sequence name="PS Store" from={store} durationInFrames={average - store}>
        <Store />
      </Sequence>
      <Sequence name="Média" from={average} durationInFrames={twist - average}>
        <Average />
      </Sequence>
      <Sequence name="1 estrela" from={twist} durationInFrames={who - twist}>
        <Twist />
      </Sequence>
      <Sequence name="Quem avaliou" from={who} durationInFrames={warning - who}>
        <Who />
      </Sequence>
      <Sequence
        name="Não é review"
        from={warning}
        durationInFrames={outro - warning}
      >
        <Warning />
      </Sequence>
      <Sequence name="Encerramento" from={outro}>
        <Outro />
      </Sequence>
      <Sequence name="Marca e fonte">
        <Chrome />
      </Sequence>
      <Sequence name="Flash de corte">
        <CutFlash />
      </Sequence>
      <Audio src={staticFile("music-nota.mp3")} volume={0.9} />
    </AbsoluteFill>
  );
};

export const NotaShortComposition: React.FC = () => {
  return (
    <Composition
      id="NotaPSN"
      component={NotaShort}
      durationInFrames={SHORT_DURATION}
      fps={SHORT_FPS}
      width={SHORT_WIDTH}
      height={SHORT_HEIGHT}
    />
  );
};
