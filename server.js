const express = require("express");
const path = require("path");
const app = express();

// Serve static files from src, styles, and assets
app.use(express.static(path.join(__dirname, "src")));
app.use("/styles", express.static(path.join(__dirname, "styles")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

// Serve index.html at root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src/index.html"));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
