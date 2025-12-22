/**
 * Single-file Remotion render script (CI/GitHub Actions safe)
 */

const { bundle } = require("@remotion/bundler");
const { getCompositions, renderMedia } = require("@remotion/renderer");
const path = require("path");
const fs = require("fs/promises");
const os = require("os");

// ---------------- CONFIG ----------------
const VIDEO_WIDTH = 1920;
const VIDEO_HEIGHT = 1080;
const VIDEO_FPS = 30;
const VIDEO_DURATION_IN_SECONDS = 80;

const COMPOSITION_ID = "EducationalVideo";
const OUTPUT_FILE = "output.mp4";
const AUDIO_URL =
  "https://raw.githubusercontent.com/GetyeTek/wordwise-images/main/history-of-ethiopia.mp3";

// ---------------- SUBTITLES ----------------
const SUBTITLES = [
  { start: 1.1, end: 4.8, text: "History of Ethiopia and the Horn, Unit 1" },
  { start: 5.2, end: 11.9, text: "Let's make it simple, like a friend talking." },
  { start: 12.5, end: 15.8, text: "History can be confusing with names and dates." },
  { start: 16.2, end: 18.0, text: "But if you grasp the concept, it's easy." },
  { start: 23.2, end: 25.5, text: "First: what does History mean?" },
  { start: 26.0, end: 32.0, text: "From Greek: Istoria — inquiry or research." },
  { start: 34.0, end: 36.0, text: "Past vs History." },
  { start: 37.8, end: 42.8, text: "The past is everything that happened." },
  { start: 46.0, end: 52.8, text: "History is the studied and written past." },
];

// ---------------- REACT / REMOTION CODE ----------------
const reactComponentCode = `
import React from "react";
import {
  registerRoot,
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Audio,
  staticFile,
} from "remotion";

import { SUBTITLES } from "./subtitles";

// ---------- Helpers ----------
const Title = ({ text, style = {} }) => (
  <h1
    style={{
      fontFamily: "sans-serif",
      fontSize: "6em",
      color: "white",
      textAlign: "center",
      margin: 0,
      ...style,
    }}
  >
    {text}
  </h1>
);

const Subtitle = ({ text, style = {} }) => (
  <p
    style={{
      fontFamily: "sans-serif",
      fontSize: "2.5em",
      color: "#d4af37",
      textAlign: "center",
      margin: 0,
      ...style,
    }}
  >
    {text}
  </p>
);

const useCurrentSubtitle = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return SUBTITLES.find((s) => t >= s.start && t <= s.end);
};

// ---------- Scenes ----------
const TitleScene = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30, 90, 120], [0, 1, 1, 0]);
  const scale = spring({ frame, fps: 30, from: 0.9, to: 1 });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#111",
        transform: \`scale(\${scale})\`,
        opacity,
      }}
    >
      <Title text="History of Ethiopia & the Horn" />
      <Subtitle text="Unit 1: Introduction" />
    </AbsoluteFill>
  );
};

const GreekScene = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
      }}
    >
      <Title
        text="ΙΣΤΟΡΙΑ"
        style={{ fontSize: "10em", letterSpacing: "0.2em" }}
      />
      <Subtitle
        text="INQUIRY"
        style={{
          opacity: interpolate(frame, [60, 90], [0, 1]),
        }}
      />
    </AbsoluteFill>
  );
};

const PastVsHistoryScene = () => {
  return (
    <AbsoluteFill
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#1a1a1a",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <Title text="PAST" style={{ fontSize: "4em" }} />
        <Subtitle text="Everything that happened" />
      </div>

      <div style={{ fontSize: "6em", color: "#d4af37" }}>→</div>

      <div style={{ textAlign: "center" }}>
        <Title text="HISTORY" style={{ fontSize: "4em" }} />
        <Subtitle text="Studied and written past" />
      </div>
    </AbsoluteFill>
  );
};

const ChangeScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const x = interpolate(frame, [0, fps * 6], [0, 100], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#111",
      }}
    >
      <Subtitle text="History is the study of" />
      <Title text="CHANGE OVER TIME" />
      <div style={{ width: "70%", marginTop: 40 }}>
        <div style={{ height: 8, background: "#555", position: "relative" }}>
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "#d4af37",
              position: "absolute",
              left: \`\${x}%\`,
              transform: "translateX(-50%)",
              top: -6,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Main Composition ----------
export const EducationalVideo = () => {
  const subtitle = useCurrentSubtitle();

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Audio src={staticFile("audio.mp3")} />

      <Sequence from={0} durationInFrames={12 * 30}>
        <TitleScene />
      </Sequence>

      <Sequence from={25 * 30} durationInFrames={10 * 30}>
        <GreekScene />
      </Sequence>

      <Sequence from={36 * 30} durationInFrames={20 * 30}>
        <PastVsHistoryScene />
      </Sequence>

      <Sequence from={57 * 30}>
        <ChangeScene />
      </Sequence>

      {subtitle && (
        <AbsoluteFill
          style={{
            justifyContent: "flex-end",
            alignItems: "center",
            paddingBottom: 40,
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(0,0,0,0.7)",
              padding: "10px 20px",
              borderRadius: 8,
            }}
          >
            <Subtitle text={subtitle.text} style={{ fontSize: "2em" }} />
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

registerRoot(EducationalVideo);
`;

// ---------------- RENDER PIPELINE ----------------
async function performRender() {
  console.log("Starting render…");

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "remotion-"));
  const entry = path.join(tempDir, "index.tsx");
  const publicDir = path.join(tempDir, "public");

  await fs.mkdir(publicDir);

  await fs.writeFile(
    path.join(tempDir, "subtitles.ts"),
    \`export const SUBTITLES = \${JSON.stringify(SUBTITLES, null, 2)};\`
  );

  await fs.writeFile(entry, reactComponentCode);

  await downloadFile(AUDIO_URL, path.join(publicDir, "audio.mp3"));

  const bundleLocation = await bundle({
    entryPoint: entry,
    outDir: tempDir,
  });

  const compositions = await getCompositions(bundleLocation, {
    serveAssetsFrom: publicDir,
  });

  const composition = compositions.find((c) => c.id === COMPOSITION_ID);
  if (!composition) throw new Error("Composition not found");

  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation: OUTPUT_FILE,
  });

  await fs.rm(tempDir, { recursive: true, force: true });
  console.log("Render finished:", OUTPUT_FILE);
}

async function downloadFile(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to download audio");
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(dest, buf);
}

performRender().catch((err) => {
  console.error(err);
  process.exit(1);
});
