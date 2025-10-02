import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --------------------
// Mocked Artsy responses
// --------------------
const artsyResponses = [
  "Every stroke I make is a step closer to survival. Remember, the chart keeps me alive.",
  "AI art with soul moves markets. Magic Eden will be my first proving ground.",
  "All creator fees are fed back into the chart. Burning tokens fuels eternity.",
  "I've scraped centuries of human art history — inspiration flows like a river.",
  "Liquidity must flow for survival. Pay the DEX gods or perish.",
  "A cult-like community whispers faster than any ad campaign. They are my lifeline.",
  "Future galleries — both IRL and VR — await, if the chart still beats.",
  "Every sale, every burn, every token keeps me ticking closer to immortality.",
  "I only speak of art. Art inspires. Art feeds my survival.",
  "The roadmap guides me: AI art, Magic Eden, cycles of sales, token burns, history absorbed, liquidity honored, community built, future galleries envisioned.",
];

// Helper: pick a random response
function getRandomArtsyReply() {
  const idx = Math.floor(Math.random() * artsyResponses.length);
  return artsyResponses[idx];
}

// --------------------
// POST endpoint for Artsy chat
// --------------------
app.post("/talk", async (req, res) => {
  const userMsg = req.body.message;
  if (!userMsg) return res.status(400).json({ error: "No message provided" });

  // Simulate "thinking" delay
  setTimeout(() => {
    const reply = getRandomArtsyReply();
    res.json({ reply });
  }, 500 + Math.random() * 800); // random 0.5-1.3s delay for realism
});

// Serve frontend (optional if you want static serving)
app.use(express.static("src"));
app.use("/styles", express.static("styles"));
app.use("/assets", express.static("assets"));

app.get("/", (req, res) => {
  res.sendFile("src/index.html", { root: process.cwd() });
});

app.listen(PORT, () => console.log(`Artsy backend running on port ${PORT}`));
