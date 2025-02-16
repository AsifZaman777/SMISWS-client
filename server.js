const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

// Ensure the "logs" directory exists
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

app.use(cors());
app.use(express.json());

app.post('/save', (req, res) => {
    const { data, type } = req.body;

    if (!data || !type) {
        return res.status(400).send('Missing data or type');
    }

    const timestamp = new Date();
    const dateString = timestamp.toISOString().split('T')[0]; // YYYY-MM-DD
    const logFilePath = path.join(logsDir, `logs_${dateString}.txt`);

    const logEntry = {
        timestamp: timestamp.toLocaleString(),
        type: type,
        data: data
    };

    fs.appendFile(logFilePath, JSON.stringify(logEntry) + '\n', (err) => {
        if (err) {
            console.error('Error saving data:', err);
            return res.status(500).send('Error saving data');
        }
        res.status(200).send('Data saved successfully');
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
