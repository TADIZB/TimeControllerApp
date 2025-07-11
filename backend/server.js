const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { LocalStorage } = require('node-localstorage');
const path = require('path');

const app = express();
const PORT = 4000;
const STORAGE_DIR = path.join(__dirname, 'local_storage');
const localStorage = new LocalStorage(STORAGE_DIR);

app.use(cors());
app.use(bodyParser.json());

function readAlarms() {
    const data = localStorage.getItem('alarms');
    if (!data) return [];
    try {
        return JSON.parse(data);
    } catch {
        return [];
    }
}
function writeAlarms(alarms) {
    localStorage.setItem('alarms', JSON.stringify(alarms, null, 2));
}

app.get('/alarms', (req, res) => {
    const alarms = readAlarms();
    res.json(alarms);
});

app.post('/alarms', (req, res) => {
    console.log('POST /alarms', req.body);
    const alarms = readAlarms();
    const { time, label, enabled } = req.body;
    const newAlarm = {
        id: Date.now().toString(),
        time,
        label,
        enabled: enabled ?? true,
    };
    alarms.push(newAlarm);
    writeAlarms(alarms);
    res.status(201).json(newAlarm);
});

app.put('/alarms/:id', (req, res) => {
    const alarms = readAlarms();
    const idx = alarms.findIndex(a => a.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    alarms[idx] = { ...alarms[idx], ...req.body };
    writeAlarms(alarms);
    res.json(alarms[idx]);
});

app.delete('/alarms/:id', (req, res) => {
    let alarms = readAlarms();
    const idx = alarms.findIndex(a => a.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    const deleted = alarms[idx];
    alarms = alarms.filter(a => a.id !== req.params.id);
    writeAlarms(alarms);
    res.json(deleted);
});

app.listen(PORT, () => {
    console.log(`Alarm backend server running at http://localhost:${PORT}`);
}); 