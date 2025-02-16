const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post('/save', (req, res) => {
    const { data, type } = req.body;

    if (!data || !type) {
        return res.status(400).send('Missing data or type');
    }

    const logEntry = {
        timestamp: new Date().toISOString(),
        type: type,
        data: data
    };

    const logFilePath = path.join(__dirname, './logs/log.txt');

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
