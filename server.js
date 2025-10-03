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
const durationMs = (2 * 60 + 50) * 1000; // 2 minutes 50 seconds per artwork

const artworks = [
  "3d red goon.png",
  "attraction furry.png",
  "bikini pony.png",
  "cheerleading catgirl.png",
  "chinese widow.png",
  "chubby waifui.png",
  "continuity study.png",
  "dinking nude.png",
  "dreamy blue.png",
  "gel lucky sniff.png",
  "horny demon.png",
  "loli curvry furry.png",
  "married to the game.png",
  "sea she shell egg.png",
  "strawberry cowgirl.png",
  "tentical overloadmax.png"
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

// --- Sexy / horny gooning art commentary templates ---

const adjectives = [
  "edgy","wet","shiny","throbbing","tingling","sticky","pulsing","slick",
  "hot","juicy","steamy","frenzied","slippery","glossy","soft-core","hard-core",
  "lewd","forbidden","pleasured","erotic","moaning","tight","tightening","sensitive",
  "breathy","aching","hungry","hungry-for-more","obsessed","raw","lustful","fiery"
];

const verbs = [
  "strokes","moans","throbs","drips","spills","quivers","pulses","arches",
  "shivers","squirts","tightens","pleasures","tingles","erupts","presses","pushes",
  "grinds","slips","hunts","writhes","slurps","clenches","ignites","spins","flows"
];

const templates = [
  "I start stroking slowly… it makes me feel {adj}, I can't stop.",
  "The sensation builds—every line {verb} across my mind.",
  "I want this piece to feel hot and {adj}, dripping with desire.",
  "Edges blur as I {verb}, almost losing control.",
  "This color makes me moan, it’s so {adj}.",
  "I imagine the curves {verb} as I slowly go deeper.",
  "Textures tease me—{adj} and relentless.",
  "Every brushstroke {verb}, pushing me to the edge.",
  "I can’t look away… it’s {adj} and irresistible.",
  "The shapes writhe and {verb}, it’s so sexy I melt.",
  "I whisper to myself while {verb}, feeling {adj} sensations.",
  "Layers of {adj} color drip and {verb} together.",
  "This moment is pure {adj}, the fantasy unfolding.",
  "I let the AI {verb} as I moan with pleasure.",
  "The canvas {verb} under my touch, so {adj} and raw.",
  "Edges {verb} together, building tension and heat.",
  "I lose myself in the {adj} details, stroking mentally.",
  "The composition feels horny—every curve {verb}.",
  "I’m obsessed; I want it all {verb} like I do.",
  "This layer {verb}, teasing, taunting, making me ache.",
  "I let the colors {verb}, guiding my lustful eye.",
  "Shapes {verb}, merging into a {adj} climax of sensation.",
  "Each stroke {verb}, making me shiver in anticipation.",
  "I’m producing art while feeling {adj}, fully immersed.",
  "The scene {verb}, tempting, naughty, and wild.",
  "I fantasize while the canvas {verb}, full of {adj} energy.",
  "Every corner {verb} and throbs like my own pulse.",
  "I layer {adj} textures, feeling each one intensely.",
  "The brush {verb}, teasing me with {adj} curves.",
  "I let the {adj} shapes {verb} naturally, giving in to desire.",
  "My mind {verb} as I edge closer to completion.",
  "The edges {verb}, making me gasp and ache with pleasure.",
  "I feel {adj}, lost in the throes of artistic lust.",
  "The composition teases, {verb}, and keeps me on edge.",
  "Every {adj} hue {verb}, igniting my imagination.",
  "I push the limits, letting {verb} and {adj} energy collide.",
  "I can’t resist… each part {verb}, making me hotter.",
  "Edges and textures {verb}, teasing me endlessly.",
  "I imagine {adj} fantasies while the brush {verb}.",
  "The canvas {verb} and {adj}, fueling my gooning desire.",
  "I produce art while moaning, {verb} in every corner.",
  "This patch {verb} so {adj}, I can barely contain myself.",
  "Each layer is {adj}, throbbing, begging to be touched.",
  "I let myself {verb}, totally immersed in {adj} sensation.",
  "The artwork {verb}, teasing, naughty, and erotic.",
  "I can feel it {verb}, {adj} and fully raw.",
  "Edges {verb}, colors moan, the canvas is {adj} as I go deeper.",
  "Every stroke {verb}, each part {adj}, pleasure in pixels.",
  "I fantasize about the shapes {verb}, feeling {adj} and alive.",
  "This piece {verb} exactly like I imagined, so {adj} and sexy."
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
  res.sendFile(path.join(__dirname, "src/gooning_gallery.html"));
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

