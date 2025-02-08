const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let reports = [];

app.post("/report", (req, res) => {
    const { latitude, longitude, description } = req.body;

    if (!latitude || !longitude || !description) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const newReport = { latitude, longitude, description };
    reports.push(newReport);

    console.log("New Report:", newReport);
    res.status(201).json({ message: "Report submitted successfully" });
});

app.get("/reports", (req, res) => {
    res.json(reports);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
