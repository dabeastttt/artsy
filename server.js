// server.js (CommonJS)
const express = require("express");
const path = require("path");
require("dotenv").config();
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "src")));
app.use("/styles", express.static(path.join(__dirname, "styles")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

// --- Shared reveal configuration (server authoritative) ---
const durationMs = 5 * 60 * 1000; // 5 minutes per artwork
const artworks = [
  "Aurora Doll.png",
  "Baked Reindeers.png",
  "Crown Of Tides.png",
  "Duck Tryna Fuck.png",
  "Emerald Serpent Deity.png",
  "Emotiblast.png",
  "Frog Tribunal.png",
  "Frogbone Sentinel.png",
  "Golden Sentinel Tree.png",
  "Marblint.png",
  "Moonlit Ember Llama.png",
  "Mug Echo.png",
  "Sand Sentinel.png",
  "The Baconmeister.png",
  "Vintage Pixel Nook.png",
  "Voice Of The Assembly.png"
];

// Simple message store (keeps recent messages)
let messages = [];
let messageId = 1;
let gallery = []; // server-side shared gallery (array of { src, title, ts })

function pushMessage(text) {
  messages.push({ id: messageId++, ts: Date.now(), text });
  if (messages.length > 500) messages = messages.slice(-500);
}

// Helper to add revealed artwork into server gallery (idempotent)
function addToGallery(index) {
  if (!artworks[index]) return;
  const title = artworks[index].replace(".png", "");
  const src = "/assets/" + artworks[index];
  const exists = gallery.some(g => g.title === title);
  if (!exists) {
    gallery.push({ src, title, ts: Date.now(), index });
  }
}

// Basic templates (same idea as the client-side)
const adjectives = [
  "electric","melted","saturated","breathy","spinning","soft-focused","vivid","humming",
  "fractured","radiant","tangled","blurred","liquid","jagged","hazy","smoldering","washed-out",
  "stark","glowing","glitching","luminous","muted","restless","turbulent","whispering","elastic",
  "shimmering","molten","dissolving","grainy","weightless","crystalline","faded","smeared"
];

const verbs = [
  "breathes","folds","swallows","blooms","stumbles","sings","drifts","echoes","fractures",
  "melts","rises","flickers","expands","contracts","shivers","erupts","glides",
  "collapses","stretches","quivers","splinters","evaporates","unfolds","spirals","sinks","ripples"
];

const templates = [
  "I started thinking about the sensation. The first stroke will be about memory.",
  "Color is the language here—I'm aiming for something {adj}.",
  "I want the viewer to feel gently unmoored, like the world {verb}.",
  "This patch of color sits like a heartbeat — I might repeat it.",
  "I imagine the shapes as familiar objects melting into one another.",
  "Textures matter: I'll keep one area sharp and let others breathe.",
  "There's a quiet tension between the bright and the subdued here.",
  "This piece is an experiment in scale and tiny details.",
  "I keep circling the same form; it's where the idea anchors.",
  "I like the idea of a soft center that slowly fractures outward.",
  "Each brushstroke feels {adj}, but the silence around it is louder.",
  "The line {verb} across the canvas, refusing to settle.",
  "This space isn't empty—it's charged, restless, almost {adj}.",
  "Sometimes I let the color decide where it wants to go.",
  "Repetition becomes rhythm; rhythm becomes heartbeat.",
  "I want this part to feel like it's always on the verge of {verb}.",
  "Shapes are less important than the tension between them.",
  "The work feels like breathing—inhale, {verb}, exhale.",
  "It's not about perfection, it's about something raw and {adj}.",
  "Negative space is just as heavy as the painted surface.",
  "Edges {verb} softly into each other, creating a gentle chaos.",
  "A single spot of {adj} color commands the eye here.",
  "There's a silent dialogue between these two contrasting forms.",
  "I let the brush {verb} naturally without overthinking.",
  "Patterns emerge and collapse, like {adj} waves.",
  "The painting whispers, sometimes it even {verb}.",
  "Curves and lines converse quietly in {adj} tones.",
  "I pause often, letting the canvas {verb} before I continue.",
  "This layer feels like a memory {verb} across time.",
  "Highlights {verb} like little bursts of laughter.",
  "Shadows stretch and {verb}, creating tension in the air.",
  "This part is almost {adj}, yet it needs more restraint.",
  "I imagine the surface {verb} like liquid metal.",
  "Sometimes the brush refuses, then suddenly {verb}.",
  "The {adj} hues here are meant to evoke unease.",
  "I want the movement to feel like it {verb} on its own.",
  "Small details {verb} in a sea of {adj} color.",
  "I deliberately let a {adj} streak remain unpolished.",
  "This section {verb} unexpectedly into the frame.",
  "The rhythm of the strokes {verb}, almost like music.",
  "I layer {adj} textures to create tension and depth.",
  "Every corner seems to {verb} if I stare long enough.",
  "I let one area {verb} before touching the rest.",
  "The composition feels {adj}, chaotic yet ordered.",
  "My mind {verb} as I paint this patch.",
  "This color {verb}, guiding the viewer's eye subtly.",
  "I sometimes step back and let the canvas {verb} naturally.",
  "The {adj} contrast makes the piece feel alive.",
  "I want the center to {verb} slowly outward.",
  "Edges blur and {verb}, giving a dreamlike quality.",
  "This moment feels {adj}, like it's caught between breaths.",
  "I let my intuition {verb} with every stroke.",
  "Subtle {adj} gradients hint at hidden motion.",
  "I imagine each layer {verb} beneath the one above."
];

function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function makeMessage() {
  const tmpl = randomFrom(templates);
  return tmpl.replace("{adj}", randomFrom(adjectives)).replace("{verb}", randomFrom(verbs));
}

// Global session state
let sessionStart = Date.now();
let currentIndex = 0;

// push a few startup messages
pushMessage("Server booting: artsy auto-reveal service online.");
pushMessage(`Starting reveal — "${artworks[currentIndex].replace('.png','')}"`);

// Advance logic: check every second and advance when the current artwork's duration completes.
setInterval(() => {
  let elapsed = Date.now() - sessionStart;

  // Advance through any missed intervals, adding each completed artwork to gallery
  while (elapsed >= durationMs && currentIndex < artworks.length - 1) {
    // mark current as revealed
    pushMessage(`Reveal complete — "${artworks[currentIndex].replace('.png','')}" is now visible.`);
    addToGallery(currentIndex);

    // move to next
    currentIndex++;
    sessionStart += durationMs;
    pushMessage(`Starting reveal — "${artworks[currentIndex].replace('.png','')}"`);
    elapsed = Date.now() - sessionStart;
  }

  // If we're on the last artwork and its time has fully elapsed, ensure it's added to gallery once
  if (elapsed >= durationMs && currentIndex >= artworks.length - 1) {
    const lastIndex = artworks.length - 1;
    if (!gallery.some(g => g.title === artworks[lastIndex].replace('.png',''))) {
      pushMessage(`Reveal complete — "${artworks[lastIndex].replace('.png','')}" is now visible.`);
      addToGallery(lastIndex);
    }
  }
}, 1000);

// Commentary scheduler (randomized between ~8-16s) — server-side shared commentary
(function scheduleCommentary() {
  const delay = 8000 + Math.floor(Math.random() * 8000);
  setTimeout(() => {
    // generate commentary only while an artwork is actively revealing
    const elapsed = Date.now() - sessionStart;
    if (currentIndex < artworks.length && elapsed < durationMs) {
      pushMessage(makeMessage());
    }
    scheduleCommentary();
  }, delay);
})();

// --- API endpoints for clients ---

// Returns authoritative state, recent messages and gallery
app.get("/api/state", (req, res) => {
  res.json({
    serverNow: Date.now(),
    sessionStart,
    currentIndex,
    durationMs,
    artworks,
    messages: messages.slice(-100),
    gallery
  });
});

// Return messages since a given timestamp (ms)
app.get("/api/messages", (req, res) => {
  const since = Number(req.query.since || 0);
  const out = messages.filter(m => m.ts > since);
  res.json(out);
});

// Return server-side gallery (shared)
app.get("/api/gallery", (req, res) => {
  res.json(gallery);
});

// Developer actions (reset / manual advance) - protected by SECRET_KEY in env
// POST /api/reset  { key: "xxx" }
app.post("/api/reset", (req, res) => {
  const key = (req.body && req.body.key) || req.query.key;
  if (!process.env.SECRET_KEY || key !== process.env.SECRET_KEY) {
    return res.status(403).json({ error: "unauthorized" });
  }
  sessionStart = Date.now();
  currentIndex = 0;
  messages = [];
  messageId = 1;
  gallery = [];
  pushMessage("🔄 Manual reset performed. Restarting session...");
  pushMessage(`Starting reveal — "${artworks[currentIndex].replace('.png','')}"`);
  res.json({ ok: true });
});

// POST /api/advance { key: "xxx" } -> force next artwork (dev)
app.post("/api/advance", (req, res) => {
  const key = (req.body && req.body.key) || req.query.key;
  if (!process.env.SECRET_KEY || key !== process.env.SECRET_KEY) {
    return res.status(403).json({ error: "unauthorized" });
  }

  // mark current as revealed if not already
  addToGallery(currentIndex);

  if (currentIndex < artworks.length - 1) {
    pushMessage(`🔁 Manual advance from "${artworks[currentIndex].replace('.png','')}" -> "${artworks[currentIndex+1].replace('.png','')}"`);
    currentIndex++;
    sessionStart = Date.now();
    pushMessage(`Starting reveal — "${artworks[currentIndex].replace('.png','')}"`);
  } else {
    pushMessage("🔁 Manual advance requested but already at final artwork.");
  }

  res.json({ ok: true, currentIndex, galleryLength: gallery.length });
});

// Serve main pages (your previously used routes)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src/index.html"));
});

app.get("/gallery", (req, res) => {
  // NOTE: your filename might be 'artsy_gallery.html' — change this if needed
  res.sendFile(path.join(__dirname, "src/arsty_gallery.html"));
});

app.get("/activity", (req, res) => {
  res.sendFile(path.join(__dirname, "src/activity.html"));
});

// Catch-all 404
app.get(/.*/, (req, res) => {
  res.status(404).send("Page not found");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

