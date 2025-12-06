require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { Question, Result, Progress } = require('./models');

const app = express();

app.use(cors());
app.use(express.json());

// ✅ CRITICAL FIX: Serve static files (HTML, JS, CSS) from the current folder
// Without this, the browser gets a 404 when trying to load main.js
app.use(express.static(__dirname));

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/personality_tests';

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- Endpoints ---

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected' });
});

app.get('/api/questions/:testType', async (req, res) => {
    const { testType } = req.params;
    try {
        const questions = await Question.find({ testType: testType.toLowerCase() }).sort('order');
        if (!questions.length) return res.status(404).json({ error: 'No questions found' });
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/save-progress', async (req, res) => {
    try {
        const { sessionId, testId, currentQuestion, answers } = req.body;
        // Simple mapping for logging/debugging
        const testType = testId === 1 ? 'DISC' : (testId === 2 ? 'MBTI' : 'BIG5');
        
        await Progress.findOneAndUpdate(
            { sessionId: sessionId },
            { sessionId, testType, currentQuestion, answers, updatedAt: new Date() },
            { upsert: true, new: true }
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save progress' });
    }
});

app.post('/api/save-result', async (req, res) => {
    try {
        const result = new Result({
            sessionId: req.body.sessionId,
            testType: req.body.testId === 1 ? 'DISC' : (req.body.testId === 2 ? 'MBTI' : 'BIG5'),
            scores: req.body.scores,
            profileKey: req.body.profileKey
        });
        await result.save();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save result' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`👉 Open http://localhost:${PORT}/index.html to start`);
});