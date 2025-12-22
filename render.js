/**
 * A single-file script to programmatically render a "peak performance" educational video
 * using Remotion, designed to be run in a GitHub Action.
 */
const { bundle } = require("@remotion/bundler");
const { getCompositions, renderMedia } = require("@remotion/renderer");
const path = require("path");
const fs = require("fs/promises"); // This is correct, we'll make the download function compatible
const os = require("os");
// const http = require('http'); // We no longer need the old http module

// --- Configuration ---
const VIDEO_WIDTH = 1920;
const VIDEO_HEIGHT = 1080;
const VIDEO_FPS = 30;
const COMPOSITION_ID = "EducationalVideo";
const AUDIO_URL = "https://github.com/GetyeTek/wordwise-images/blob/00d4db02f9d2c3d1cf8bda0395637c38ea46aaec/history-of-ethiopia.mp3"; // Stable URL for the audio
const OUTPUT_FILE = "output.mp4";

// --- Word/Phrase Timestamps (The Key to "Peak" Synchronization) ---
const SUBTITLES = [
    { start: 1.1, end: 4.8, text: "History of Ethiopia and the Horn, Unit 1" },
    { start: 5.2, end: 11.9, text: "Let's make it simple, like a friend talking, without skipping the main points." },
    { start: 12.5, end: 15.8, text: "History can be confusing with its many names and dates..." },
    { start: 16.2, end: 18.0, text: "...but if you grasp the CONCEPT, it's easy." },
    { start: 23.2, end: 25.5, text: "First, what does 'History' mean?" },
    { start: 26.0, end: 32.0, text: "The word comes from the Greek 'Istoria', meaning INQUIRY, or research." },
    { start: 34.0, end: 36.0, text: "There is a difference between the PAST and HISTORY." },
    { start: 37.8, end: 42.8, text: "The PAST is everything that ever happened. All actions, thoughts, events." },
    { start: 43.0, end: 45.8, text: "But the past is unwritten, unstudied." },
    { start: 46.0, end: 52.8, text: "HISTORY is the written, analyzed report about the past, created by historians." },
    { start: 57.5, end: 100.8, text: "History isn't just a list of names and dates." },
    { start: 101.5, end: 106.0, text: "It's the study of how humans interacted with their environment over time." },
    { start: 106.8, end: 117.5, text: "While Sociology studies society NOW (a snapshot), History studies CHANGE and CONTINUITY over time." },
];
const VIDEO_DURATION_IN_SECONDS = 80; // Manually set based on audio length
const VIDEO_DURATION_IN_FRAMES = VIDEO_DURATION_IN_SECONDS * VIDEO_FPS;


// --- The React Components (The Visuals of the Video) ---
// We define our entire Remotion video as a string of TypeScript/JSX code.
const reactComponentCode = `
import {
    AbsoluteFill,
    Sequence,
    useCurrentFrame,
    useVideoConfig,
    interpolate,
    spring,
    Audio,
    staticFile
} from 'remotion';
import React from 'react';

// --- Reusable Animated Components ---
const Title = ({ text, style }) => (
    <h1 style={{ fontFamily: 'sans-serif', fontSize: '7em', color: 'white', textShadow: '0 0 20px black', textAlign: 'center', ...style }}>{text}</h1>
);
const Subtitle = ({ text, style }) => (
    <p style={{ fontFamily: 'sans-serif', fontSize: '3em', color: '#d4af37', textShadow: '0 0 10px black', textAlign: 'center', ...style }}>{text}</p>
);
const Word = ({ children, style }) => <span style={{ display: 'inline-block', ...style }}>{children}</span>;

// Hook to find the currently spoken phrase
const useCurrentSubtitle = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const currentTime = frame / fps;
    return SUBTITLES.find(s => currentTime >= s.start && currentTime <= s.end);
};

// --- SCENES ---

// Scene 1: Title
const TitleScene = () => {
    const frame = useCurrentFrame();
    const opacity = interpolate(frame, [0, 30, 90, 120], [0, 1, 1, 0]);
    const scale = spring({ frame, fps: 30, from: 0.8, to: 1 });
    return (
        <AbsoluteFill style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', transform: \`scale(\${scale})\`, opacity, background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6))' }}>
            <Title text="History of Ethiopia & the Horn" />
            <Subtitle text="Unit 1: An Introduction" />
        </AbsoluteFill>
    );
};

// Scene 2: Greek Etymology
const GreekScene = () => {
    const frame = useCurrentFrame();
    const springIn = spring({ frame: frame - 10, fps: 30, durationInFrames: 60 });
    const word = "ΙΣΤΟΡΙΑ";
    return (
        <AbsoluteFill style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', backgroundColor: '#111' }}>
            <h2 style={{ fontFamily: 'serif', fontSize: '12em', color: 'white' }}>
                {word.split('').map((char, i) => (
                    <Word key={i} style={{ transform: \`scale(\${spring({ frame: frame - i * 5, fps: 30 })})\` }}>{char}</Word>
                ))}
            </h2>
            <Subtitle text="INQUIRY" style={{ opacity: interpolate(frame, [80, 100], [0, 1]) }} />
        </AbsoluteFill>
    );
}

// Scene 3: Past vs History
const PastVsHistoryScene = () => {
    const frame = useCurrentFrame();
    const slideIn = interpolate(frame, [0, 30], [-100, 0], { extrapolateRight: 'clamp' });
    return (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#1a1a1a', padding: '50px', transform: \`translateX(\${slideIn}%)\` }}>
            <div style={{ flex: 1, textAlign: 'center', border: '5px dashed #555', padding: 20, borderRadius: 15 }}>
                <Title text="🌫️ The PAST" style={{ fontSize: '4em' }}/>
                <Subtitle text="Everything that happened. Unorganized." style={{ fontSize: '2em' }}/>
            </div>
            <div style={{ fontSize: '8em', color: '#d4af37', margin: '0 40px' }}>➡️</div>
            <div style={{ flex: 1, textAlign: 'center', border: '5px solid #d4af37', padding: 20, borderRadius: 15 }}>
                <Title text="✍️ HISTORY" style={{ fontSize: '4em' }}/>
                <Subtitle text="The organized study of the past." style={{ fontSize: '2em' }}/>
            </div>
        </AbsoluteFill>
    );
}

// Scene 4: Change & Continuity
const ChangeScene = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const dotPosition = interpolate(frame, [0, 10 * fps], [0, 100], { extrapolateRight: 'clamp' });
    return(
         <AbsoluteFill style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', backgroundColor: '#111' }}>
            <Subtitle text="History is the study of..." />
            <Title text="CHANGE over TIME" />
            <div style={{ width: '70%', height: '10px', background: '#555', marginTop: 50, borderRadius: 5 }}>
                <div style={{ width: '40px', height: '40px', background: '#d4af37', borderRadius: '50%', position: 'relative', left: \`\${dotPosition}%\`, transform: 'translate(-50%, -15px)' }}/>
            </div>
         </AbsoluteFill>
    );
}

// Main component with subtitles
export const ${COMPOSITION_ID} = () => {
    const currentSubtitle = useCurrentSubtitle();
    return (
        <AbsoluteFill style={{ backgroundColor: '#1a1a1a' }}>
            <Audio src={staticFile('audio.mp3')} />
            
            <Sequence from={0} durationInFrames={12 * VIDEO_FPS}>
                <TitleScene />
            </Sequence>
            <Sequence from={25 * VIDEO_FPS} durationInFrames={10 * VIDEO_FPS}>
                <GreekScene />
            </Sequence>
            <Sequence from={36 * VIDEO_FPS} durationInFrames={21 * VIDEO_FPS}>
                <PastVsHistoryScene />
            </Sequence>
            <Sequence from={57 * VIDEO_FPS}>
                <ChangeScene />
            </Sequence>

            {/* Subtitle Overlay */}
            <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: '50px' }}>
                {currentSubtitle && (
                    <div style={{ backgroundColor: 'rgba(0,0,0,0.7)', padding: '10px 20px', borderRadius: 10 }}>
                        <Subtitle text={currentSubtitle.text} style={{ fontSize: '2.5em', margin: 0 }} />
                    </div>
                )}
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
`;

/**
 * Main rendering function.
 */
const performRender = async () => {
    console.log("Starting video render process...");

    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'remotion-'));
    console.log(`Created temporary directory: ${tempDir}`);

    const entryPoint = path.join(tempDir, "index.ts");
    const subtitlesData = `export const SUBTITLES = ${JSON.stringify(SUBTITLES, null, 2)};`;
    await fs.writeFile(entryPoint, `${subtitlesData}\n${reactComponentCode}`);

    const publicDir = path.join(tempDir, 'public');
    await fs.mkdir(publicDir);

    console.log(`Downloading audio from ${AUDIO_URL}...`);
    const audioFilePath = path.join(publicDir, 'audio.mp3');
    await downloadFile(AUDIO_URL, audioFilePath); // Using the new function
    console.log("Audio downloaded successfully.");

    try {
        console.log("Bundling Remotion project...");
        const bundleLocation = await bundle({
            entryPoint,
            outDir: tempDir,
            webpackOverride: (config) => config,
        });

        console.log("Getting compositions...");
        const comps = await getCompositions(bundleLocation, {
            serveAssetsFrom: publicDir
        });
        const video = comps.find((c) => c.id === COMPOSITION_ID);
        if (!video) {
            throw new Error(`Composition "${COMPOSITION_ID}" not found.`);
        }

        console.log("Rendering video... This may take a few minutes.");
        await renderMedia({
            composition: video,
            serveUrl: bundleLocation,
            codec: "h264",
            outputLocation: OUTPUT_FILE,
            inputProps: {},
            logLevel: 'verbose',
        });
        console.log(`Render complete! Video saved to ${OUTPUT_FILE}`);

    } finally {
        await fs.rm(tempDir, { recursive: true, force: true });
        console.log("Cleaned up temporary files.");
    }
};

// ====================================================================================
// THE FIX IS HERE: A new, modern download function using fetch()
// ====================================================================================
const downloadFile = async (url, dest) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        await fs.writeFile(dest, buffer);
    } catch (error) {
        throw new Error(`Failed to download file: ${error.message}`);
    }
};


// Execute the render
performRender().catch((err) => {
    console.error("Error during rendering:", err);
    process.exit(1);
});
