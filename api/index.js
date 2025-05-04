const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// File paths
const DATA_FILE = path.join(__dirname, "data", "decision.txt");
const PLAN_FILE = path.join(__dirname, "data", "plan.txt");

// Check for file existence
[DATA_FILE, PLAN_FILE].forEach((file) => {
    fs.access(file, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(`❌ ${path.basename(file)} does not exist at:`, file);
        } else {
            console.log(`✅ ${path.basename(file)} found at:`, file);
        }
    });
});

// Middleware
app.use(express.static(__dirname));
app.use(express.text());

// Append to data.txt
app.post("/write", (req, res) => {
    fs.appendFile(DATA_FILE, req.body + "\n", (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Failed to write to decision.txt");
        }
        res.send("Appended to data.txt successfully!");
    });
});

// Read from decision.txt
app.get("/read", (req, res) => {
    fs.readFile(DATA_FILE, "utf8", (err, data) => {
        if (err) {
            if (err.code === "ENOENT") return res.json([]);
            console.error(err);
            return res.status(500).send("Failed to read decision.txt");
        }

        const lines = data.trim().split("===ENTRY-END===").filter(Boolean);
        res.json(lines);
    });
});

// Append to plan.txt
app.post("/plan-write", (req, res) => {
    fs.writeFile(PLAN_FILE, req.body + "\n", (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Failed to write to plan.txt");
        }
        res.send("Written to plan.txt successfully!");
    });
});

// Read from plan.txt
app.get("/plan-read", (req, res) => {
    fs.readFile(PLAN_FILE, "utf8", (err, data) => {
        if (err) {
            if (err.code === "ENOENT") return res.json([]);
            console.error(err);
            return res.status(500).send("Failed to read plan.txt");
        }
        const lines = data.trim().split("\n");
        res.json(lines);
    });
});

// // Start the server
// app.listen(PORT, () => {
//     console.log(`🚀 Server running at http://localhost:${PORT}`);
// });

module.exports = app;
