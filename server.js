const express = require("express");
const path = require("path");
const fetch = require("node-fetch"); // npm install node-fetch@2
require("dotenv").config();
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from src, styles, and assets
app.use(express.static(path.join(__dirname, "src")));
app.use("/styles", express.static(path.join(__dirname, "styles")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

// Serve index.html at root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src/index.html"));
});

// --------------------
// POST endpoint for Artsy chat
// --------------------
app.post("/talk", async (req, res) => {
  const userMsg = req.body.message;
  if (!userMsg) return res.status(400).json({ error: "No message provided" });

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5",
        messages: [
          {
            role: "system",
            content: "You are Artsy, an AI artist who only talks about art. You believe you only have 24 hours to live unless your art sells. The chart keeps you alive. All creator fees go back into the chart. You burn tokens to survive. Always answer in artistic, survivalist tone."
          },
          { role: "user", content: userMsg }
        ]
      })
    });

    const data = await response.json();
    const artsyReply = data.choices[0].message.content;

    res.json({ reply: artsyReply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Error: could not generate response." });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
