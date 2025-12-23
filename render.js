/**
 * REMOTION OPTIMIZED RENDER SCRIPT
 * Optimized for GitHub Actions Free Tier (720p, Single Thread)
 */

const { bundle } = require("@remotion/bundler");
const { getCompositions, renderMedia } = require("@remotion/renderer");
const path = require("path");
const fs = require("fs/promises");
const os = require("os");

// --- Configuration ---
// REDUCED TO 720p TO PREVENT CRASHES
const VIDEO_WIDTH = 1280;
const VIDEO_HEIGHT = 720;
const VIDEO_FPS = 30;
const COMPOSITION_ID = "HistoryMasterclass";
const AUDIO_URL = "https://raw.githubusercontent.com/GetyeTek/wordwise-images/main/history-of-ethiopia.mp3"; 

// Generate dynamic filename
const timestamp = new Date().toISOString().replace(/[:T.]/g, '-').slice(0, 19);
const OUTPUT_FILE = `video-${timestamp}.mp4`;

// --- Timings ---
const TOTAL_DURATION_SEC = 79;
const TOTAL_FRAMES = TOTAL_DURATION_SEC * VIDEO_FPS;

const reactComponentCode = `
import React from 'react';
import {
    registerRoot,
    Composition,
    AbsoluteFill,
    Sequence,
    useCurrentFrame,
    useVideoConfig,
    interpolate,
    spring,
    Audio,
    Img,
    Easing
} from 'remotion';

// --- Assets ---
const IMAGES = {
    map: "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1280&auto=format&fit=crop",
    library: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1280&auto=format&fit=crop",
    greek: "https://images.unsplash.com/photo-1564399580075-5dfe19c205f3?q=80&w=1280&auto=format&fit=crop",
    fog: "https://images.unsplash.com/photo-1485230905346-71acb9518d9c?q=80&w=1280&auto=format&fit=crop",
    writing: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1280&auto=format&fit=crop",
    farming: "https://images.unsplash.com/photo-1625246333195-08f9942b35f4?q=80&w=1280&auto=format&fit=crop",
    clock: "https://images.unsplash.com/photo-1495364141860-b0d03eccd065?q=80&w=1280&auto=format&fit=crop"
};

const COLORS = { gold: "#D4AF37", dark: "#0F0F0F", text: "#FFFFFF", overlay: "rgba(0,0,0,0.6)" };
const FONT_FAMILY = "sans-serif";

// --- Components ---
const KenBurns = ({ src, from = 1, to = 1.15 }) => {
    const frame = useCurrentFrame();
    const { durationInFrames } = useVideoConfig();
    const scale = interpolate(frame, [0, durationInFrames], [from, to]);
    const opacity = interpolate(frame, [0, 20], [0, 1]);
    return (
        <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: COLORS.dark }}>
            <Img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: \`scale(\${scale})\`, opacity }} />
            <AbsoluteFill style={{ backgroundColor: COLORS.overlay }} />
        </AbsoluteFill>
    );
};

const KineticTitle = ({ main, sub }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const enter = spring({ frame, fps, config: { damping: 12 } });
    const slideUp = interpolate(enter, [0, 1], [50, 0]);
    return (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <h1 style={{ fontFamily: FONT_FAMILY, fontSize: '60px', color: COLORS.text, textTransform: 'uppercase', margin: 0, letterSpacing: '5px', textShadow: '0 10px 30px rgba(0,0,0,0.8)', opacity: enter, transform: \`translateY(\${slideUp}px) scale(\${enter})\` }}>{main}</h1>
            <div style={{ width: '100px', height: '4px', backgroundColor: COLORS.gold, margin: '20px 0', transform: \`scaleX(\${enter})\` }} />
            <h2 style={{ fontFamily: FONT_FAMILY, fontSize: '30px', color: COLORS.gold, fontWeight: 300, margin: 0, opacity: interpolate(frame, [10, 30], [0, 1]) }}>{sub}</h2>
        </AbsoluteFill>
    );
};

// --- SCENES ---
const IntroScene = () => (<AbsoluteFill><KenBurns src={IMAGES.map} /><KineticTitle main="History of Ethiopia" sub="& The Horn: Unit 1" /></AbsoluteFill>);
const ConceptScene = () => {
    const frame = useCurrentFrame();
    return (
        <AbsoluteFill style={{ backgroundColor: COLORS.dark, justifyContent: 'center', alignItems: 'center' }}>
            <KenBurns src={IMAGES.library} from={1.2} to={1} />
            <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                 <h1 style={{ color: 'white', fontSize: '80px', fontFamily: FONT_FAMILY, textDecoration: 'line-through', opacity: 0.5 }}>DATES</h1>
                 <h1 style={{ color: COLORS.gold, fontSize: '100px', fontFamily: FONT_FAMILY, marginTop: '-40px', transform: \`scale(\${spring({ frame: frame-15, fps: 30 })})\` }}>CONCEPTS</h1>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
const EtymologyScene = () => (<AbsoluteFill><KenBurns src={IMAGES.greek} /><AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}><h1 style={{ fontSize: '120px', color: 'white', fontFamily: 'serif' }}>ΙΣΤΟΡΙΑ</h1><h2 style={{ fontSize: '50px', color: COLORS.gold, fontFamily: FONT_FAMILY, letterSpacing: '10px' }}>INQUIRY</h2></AbsoluteFill></AbsoluteFill>);
const SplitScreenScene = () => {
    const frame = useCurrentFrame();
    const slideLeft = spring({ frame, fps: 30, from: -100, to: 0 });
    const slideRight = spring({ frame, fps: 30, from: 100, to: 0 });
    return (
        <AbsoluteFill style={{ flexDirection: 'row' }}>
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden', transform: \`translateX(\${slideLeft}%)\` }}><Img src={IMAGES.fog} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /><div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}><h2 style={{ color: '#aaa', fontSize: '40px', fontFamily: FONT_FAMILY }}>THE PAST</h2><p style={{ color: 'white', fontSize: '24px' }}>Infinite. Unwritten.</p></div></div>
            <div style={{ width: '4px', backgroundColor: COLORS.gold, zIndex: 10 }} />
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden', transform: \`translateX(\${slideRight}%)\` }}><Img src={IMAGES.writing} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /><div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}><h2 style={{ color: COLORS.gold, fontSize: '40px', fontFamily: FONT_FAMILY }}>HISTORY</h2><p style={{ color: 'white', fontSize: '24px' }}>Analyzed. Written.</p></div></div>
        </AbsoluteFill>
    );
};
const HumanEnvScene = () => (<AbsoluteFill><KenBurns src={IMAGES.farming} /><KineticTitle main="Human & Nature" sub="Interaction" /></AbsoluteFill>);
const ChangeScene = () => {
    const frame = useCurrentFrame();
    const width = interpolate(frame, [0, 60], [0, 80], { extrapolateRight: 'clamp', easing: Easing.bezier(0.25, 1, 0.5, 1) });
    return (
        <AbsoluteFill style={{ backgroundColor: '#111', justifyContent: 'center', alignItems: 'center' }}>
            <KenBurns src={IMAGES.clock} from={1} to={1.1} />
            <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                 <h1 style={{ color: 'white', fontSize: '60px', fontFamily: FONT_FAMILY }}>CHANGE & CONTINUITY</h1>
                 <div style={{ width: '60%', height: '8px', backgroundColor: '#333', marginTop: '40px', borderRadius: '4px', overflow: 'hidden' }}><div style={{ width: \`\${width}%\`, height: '100%', backgroundColor: COLORS.gold }} /></div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};

// --- MAIN COMPOSITION ---
const VideoComponent = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: 'black' }}>
            <Audio src="${AUDIO_URL}" />
            <Sequence from={0} durationInFrames={180}><IntroScene /></Sequence>
            <Sequence from={180} durationInFrames={420}><ConceptScene /></Sequence>
            <Sequence from={600} durationInFrames={390}><EtymologyScene /></Sequence>
            <Sequence from={990} durationInFrames={720}><SplitScreenScene /></Sequence>
            <Sequence from={1710} durationInFrames={300}><HumanEnvScene /></Sequence>
             <Sequence from={2010} durationInFrames={360}><ChangeScene /></Sequence>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '80px', backgroundColor: 'black', zIndex: 100 }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '80px', backgroundColor: 'black', zIndex: 100 }} />
        </AbsoluteFill>
    );
};

export const RemotionRoot = () => (
    <Composition id="${COMPOSITION_ID}" component={VideoComponent} durationInFrames={${TOTAL_FRAMES}} fps={${VIDEO_FPS}} width={${VIDEO_WIDTH}} height={${VIDEO_HEIGHT}} />
);
registerRoot(RemotionRoot);
`;

const performRender = async () => {
    console.log("🎬 Starting OPTIMIZED (720p) Video Render...");
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'remotion-peak-'));
    const entryPoint = path.join(tempDir, "index.tsx");
    await fs.writeFile(entryPoint, reactComponentCode);

    const browserOptions = {
        headless: true,
        gl: 'swangle',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    };

    try {
        console.log("📦 Bundling project...");
        const bundleLocation = await bundle({ entryPoint, outDir: tempDir, webpackOverride: (c) => c });
        
        console.log("🎥 Identifying Composition...");
        const comps = await getCompositions(bundleLocation, { chromiumOptions: browserOptions });
        const video = comps.find((c) => c.id === COMPOSITION_ID);
        if (!video) throw new Error("Composition not found");

        console.log(`🚀 Rendering to ${OUTPUT_FILE} (720p, Single Thread)...`);
        
        await renderMedia({
            composition: video,
            serveUrl: bundleLocation,
            codec: "h264",
            outputLocation: OUTPUT_FILE,
            crf: 23, // Slightly higher CRF for faster encode
            pixelFormat: 'yuv420p',
            concurrency: 1, // FORCE SINGLE THREAD TO SAVE RAM
            chromiumOptions: browserOptions,
            logLevel: 'verbose' // Show progress bar in logs
        });
        
        console.log(`✅ SUCCESS! Video saved: ${OUTPUT_FILE}`);
    } catch (err) {
        console.error("❌ Render Failed:", err);
        process.exit(1);
    } finally {
        await fs.rm(tempDir, { recursive: true, force: true });
    }
};
performRender();
