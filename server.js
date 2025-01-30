const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
//const cors = require("cors"); 

const app = express();
const PORT = 3000;

// app.use(cors({
//     origin: "*",
//     methods: ["GET", "POST"],
//     allowedHeaders: ["Content-Type"]
// }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    
    next();
});
app.use(express.static(__dirname + "/public")); // Serve HTML, CSS, and JS from 'public' folder

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});


// Ensure upload_images directory exists
const uploadDir = path.join(__dirname, "upload_images");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "upload_images/"),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage: storage });

// Image upload endpoint
app.post("/upload", upload.array("images"), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
    }
    res.json({ message: "Files uploaded successfully!", files: req.files });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
