import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import dns from 'dns';

// ===== DNS FIX: Configure resolver to use specific DNS servers =====
// Helps prevent connection timeouts in some environments
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
// ===== END DNS FIX =====

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Configuration
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
    console.error('❌ MONGODB_URI is not defined in your .env file.');
    process.exit(1);
}

const client = new MongoClient(mongoUri, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
});

let db;

async function connectToDatabase() {
    try {
        await client.connect();
        db = client.db('profile_test'); // Ensure this matches your DB name
        console.log('✅ Connected to MongoDB successfully');
        return true;
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        return false;
    }
}

// ==========================================
// 🚀 API ROUTES (These were missing!)
// ==========================================

// 1. GET Questions Endpoint
app.get('/api/questions/:type', async (req, res) => {
    try {
        if (!db) return res.status(503).json({ error: 'Database not connected' });

        const testType = req.params.type.toUpperCase(); // DISC, MBTI, BIG5
        
        // Find the test definition (e.g., BIG5) to get its ID
        const testDef = await db.collection('tests').findOne({ name: testType });
        
        if (!testDef) {
            return res.status(404).json({ error: `Test type '${testType}' not found in database` });
        }

        // Fetch questions matching this test ID
        const questions = await db.collection('questions')
            .find({ testId: testDef._id })
            .sort({ questionOrder: 1 })
            .toArray();

        // Map MongoDB data (camelCase) to the format script.js expects (snake_case)
        const mappedQuestions = questions.map(q => {
            // Handle questionText whether it's a string or a multilingual object
            const textObj = typeof q.questionText === 'object' ? q.questionText : { en: q.questionText, pt: q.questionText };
            
            return {
                id: q._id,
                // script.js looks for these specific snake_case keys:
                question_text: q.questionText, 
                question_text_en: textObj.en || q.questionText,
                question_text_pt: textObj.pt || q.questionText,
                factor: q.factor,
                reverse_scoring: q.reverseScoring, // Critical for Big5
                question_order: q.questionOrder
            };
        });

        console.log(`📦 Served ${mappedQuestions.length} questions for ${testType}`);
        res.json(mappedQuestions);

    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ error: error.message });
    }
});

// 2. POST Save Progress Endpoint
app.post('/api/save-progress', async (req, res) => {
    try {
        if (!db) return res.status(503).json({ error: 'Database not connected' });
        
        const { sessionId, testId, currentQuestion, answers } = req.body;
        
        // Update or insert progress
        await db.collection('test_progress').updateOne(
            { sessionId, testId },
            { 
                $set: { 
                    currentQuestion, 
                    answers,
                    updatedAt: new Date()
                } 
            },
            { upsert: true }
        );

        res.json({ status: 'saved' });
    } catch (error) {
        console.error('Error saving progress:', error);
        res.status(500).json({ error: error.message });
    }
});

// 3. POST Save Result Endpoint
app.post('/api/save-result', async (req, res) => {
    try {
        if (!db) return res.status(503).json({ error: 'Database not connected' });
        
        const { sessionId, testId, scores, profileKey } = req.body;
        
        await db.collection('test_results').insertOne({
            sessionId,
            testId,
            scores,
            profileKey,
            completedAt: new Date()
        });

        console.log('🏆 Result saved for session:', sessionId);
        res.json({ status: 'saved' });
    } catch (error) {
        console.error('Error saving result:', error);
        res.status(500).json({ error: error.message });
    }
});

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', database: db ? 'connected' : 'disconnected' });
});

// Start Server
connectToDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`\n🚀 Server running on http://localhost:${PORT}`);
        console.log(`📡 Ready to handle requests at http://localhost:${PORT}/api/questions/big5`);
    });
});