import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Composition, Sequence, staticFile } from "remotion";
import {
  ChannelBug,
  IntroTitle,
  Outro,
  OverviewLabels,
  RegionCard,
  Vignette,
} from "./Overlay";
import {
  DURATION,
  FPS,
  HEIGHT,
  INTRO,
  OUTRO,
  OUTRO_START,
  OVERVIEW,
  REGION,
  REGIONS,
  WIDTH,
  regionStart,
} from "./timeline";
import { World } from "./world/World";

export const LeonidaVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#160430" }}>
      <Sequence name="Mundo 3D">
        <World />
      </Sequence>
      <Sequence name="Vinheta">
        <Vignette />
      </Sequence>
      <Sequence name="Título" durationInFrames={INTRO}>
        <IntroTitle />
      </Sequence>
      <Sequence name="Visão geral" from={INTRO} durationInFrames={OVERVIEW}>
        <OverviewLabels from={INTRO} />
      </Sequence>
      {REGIONS.map((region, i) => (
        <Sequence
          key={region.id}
          name={region.name}
          from={regionStart(i)}
          durationInFrames={REGION}
        >
          <RegionCard region={region} index={i} />
        </Sequence>
      ))}
      <Sequence name="Encerramento" from={OUTRO_START} durationInFrames={OUTRO}>
        <Outro />
      </Sequence>
      <Sequence
        name="Canal"
        from={INTRO}
        durationInFrames={OUTRO_START - INTRO}
      >
        <ChannelBug />
      </Sequence>
      <Audio src={staticFile("music.mp3")} volume={0.9} />
    </AbsoluteFill>
  );
};

export const LeonidaComposition: React.FC = () => {
  return (
    <Composition
      id="Leonida"
      component={LeonidaVideo}
      durationInFrames={DURATION}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
