import express from "express";
import { performAutomation } from "./performAutomation.js";

const app = express();

// Optional: basic health endpoint
app.get("/", (req, res) => {
  res.send("Automation service is running.");
});

// GET version (for testing in browser)
app.get("/run", async (req, res) => {
   try {
    // Combine query and body parameters so you can use either
    const params = { ...req.query, ...req.body };
    console.log("🔧 Incoming parameters:", params);

    const result = await performAutomation(params);
     
    res.json({ success: true, result });
  } catch (err) {
    console.error("Automation failed:", err);
    res.json({ success: false, error: err.stack || err.message });
  }
});
     
// POST version (for n8n, Zapier, Make.com, etc.)
app.post("/run", async (req, res) => {
  try {
    const params = req.body;   // <-- Body JSON works now
    console.log("Incoming POST params:", params);

    const result = await performAutomation(params);
    res.json({ success: true, result });
  } catch (err) {
    console.error("❌ Automation failed:", err);
    res.json({ success: false, error: err.stack || err.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
