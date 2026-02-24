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
        // Leave it empty to use the default database (which is 'test'), 
        // exactly matching how mongodb-migrate.js works
        db = client.db(); 
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
        
        // Fetch questions directly using the testType field
        const questions = await db.collection('questions')
            .find({ testType: testType })
            .sort({ questionOrder: 1 })
            .toArray();

        // If no questions are found
        if (questions.length === 0) {
             return res.status(404).json({ error: `No questions found for test type '${testType}'. Did you run the migration?` });
        }

        // Map MongoDB data to the format script.js expects
        const mappedQuestions = questions.map(q => {
            const textObj = typeof q.questionText === 'object' ? q.questionText : { en: q.questionText, pt: q.questionText, es: q.questionText };
            
            return {
                id: q._id,
                question_text: q.questionText, // Contains the full {en, pt, es} object
                question_text_en: textObj.en || q.questionText,
                question_text_pt: textObj.pt || q.questionText,
                question_text_es: textObj.es || q.questionText, // Added Spanish support
                reverse_scoring: q.reverseScoring, 
                question_order: q.questionOrder,
                aValue: q.aValue, // Needed for MBTI
                bValue: q.bValue  // Needed for MBTI
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
        console.log(`📡 Ready to handle requests at http://localhost:${PORT}/api/questions/mbti`);
        console.log(`📡 Ready to handle requests at http://localhost:${PORT}/api/questions/disc`);
    });
});