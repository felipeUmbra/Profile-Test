require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
// Import Progress along with Question and Result
const { Question, Result, Progress } = require('./models');

const app = express();

app.use(cors());
app.use(express.json());

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
    console.log(`🔍 Fetching questions for ${testType}`);

    try {
        const questions = await Question.find({ testType: testType.toLowerCase() }).sort('order');

        if (!questions.length) {
            return res.status(404).json({ error: 'No questions found' });
        }

        const transformed = questions.map(q => {
            if (testType === 'mbti') {
                return {
                    id: q.order,
                    optionA: q.options.optionA,
                    optionB: q.options.optionB,
                    dimension: q.dimension,
                    aValue: q.values.a,
                    bValue: q.values.b
                };
            }
            return {
                id: q.order,
                text: q.text,
                factor: q.factor,
                reverse: q.reverse
            };
        });

        res.json(transformed);
    } catch (error) {
        console.error('❌ Error fetching questions:', error);
        res.status(500).json({ error: error.message });
    }
});

// ✅ NEW: Missing Endpoint to fix 404 Error
app.post('/api/save-progress', async (req, res) => {
    try {
        const { sessionId, testId, currentQuestion, answers } = req.body;
        // Map numerical ID to string type
        const testType = testId === 1 ? 'DISC' : (testId === 2 ? 'MBTI' : 'BIG5');

        console.log(`💾 Saving progress for session ${sessionId.substr(0, 8)}...`);

        // Use findOneAndUpdate to either create a new entry or update existing one
        await Progress.findOneAndUpdate(
            { sessionId: sessionId },
            {
                sessionId,
                testType,
                currentQuestion,
                answers,
                updatedAt: new Date()
            },
            { upsert: true, new: true } // Create if doesn't exist
        );

        res.json({ success: true, message: 'Progress saved successfully' });
    } catch (error) {
        console.error('❌ Error saving progress:', error);
        res.status(500).json({ error: 'Failed to save progress' });
    }
});

app.post('/api/save-result', async (req, res) => {
    try {
        console.log('🏆 Saving final result...');
        const result = new Result({
            sessionId: req.body.sessionId,
            testType: req.body.testId === 1 ? 'DISC' : (req.body.testId === 2 ? 'MBTI' : 'BIG5'),
            scores: req.body.scores,
            profileKey: req.body.profileKey
        });

        await result.save();
        res.json({ success: true, message: 'Result saved to MongoDB' });
    } catch (error) {
        console.error('❌ Error saving result:', error);
        res.status(500).json({ error: 'Failed to save result' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});