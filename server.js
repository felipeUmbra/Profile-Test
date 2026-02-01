require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB configuration
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
    console.error('❌ MONGODB_URI is not defined in your .env file. Please add it.');
    process.exit(1);
}

// Add connection options for better stability
const client = new MongoClient(mongoUri, {
    family: 4 // Force IPv4 to avoid DNS issues
});
let db;

// Database connection function
async function connectToDatabase() {
    try {
        await client.connect();
        db = client.db(); // Uses the database name from the URI (e.g., /profile_test)
        console.log('✅ Connected to MongoDB successfully');
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        return false;
    }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
    const dbConnected = client && client.topology && client.topology.isConnected();
    res.json({
        status: 'OK',
        database: dbConnected ? 'Connected' : 'Disconnected',
        timestamp: new Date().toISOString(),
    });
});

// Get questions from database
app.get('/api/questions/:testType', async (req, res) => {
    const { testType } = req.params;
    const { lang = 'en' } = req.query;

    console.log(`🔍 Fetching questions for ${testType.toUpperCase()} in ${lang}`);

    const validTestTypes = ['disc', 'mbti', 'big5'];
    if (!validTestTypes.includes(testType.toLowerCase())) {
        return res.status(400).json({ error: 'Invalid test type. Must be: disc, mbti, or big5' });
    }

    try {
        if (!db) {
            return res.status(500).json({ error: 'Database not connected' });
        }

        // Find the test to get its info
        const test = await db.collection('tests').findOne({ name: testType.toUpperCase() });

        if (!test) {
            console.error(`❌ Test type '${testType.toUpperCase()}' not found in database`);
            return res.status(404).json({ error: 'Test type not found' });
        }

        // Find all questions for that test
        const questionsFromDb = await db.collection('questions')
            .find({ testId: test._id })
            .sort({ questionOrder: 1 })
            .toArray();
            
        console.log(`📊 Database returned ${questionsFromDb.length} questions for ${test.name}`);

        if (questionsFromDb.length === 0) {
            return res.status(404).json({ error: 'No questions found for this test type' });
        }

        // Transform questions based on language and test type
        const questions = questionsFromDb.map(q => {
            const baseQuestion = {
                id: q._id,
                factor: q.factor,
                question_order: q.questionOrder
            };

            if (test.name === 'MBTI') {
                return {
                    ...baseQuestion,
                    optionA: {
                        en: q.questionText.optionA.en,
                        pt: q.questionText.optionA.pt
                    },
                    optionB: {
                        en: q.questionText.optionB.en,
                        pt: q.questionText.optionB.pt
                    },
                    dimension: q.factor,
                    aValue: q.aValue,
                    bValue: q.bValue
                };
            } else { // For DISC and Big5
                const question = {
                    ...baseQuestion,
                    text: {
                        en: q.questionText.en,
                        pt: q.questionText.pt
                    },
                };
                if (test.name === 'BIG5') {
                    question.reverse = q.reverseScoring;
                }
                return question;
            }
        });
        
        res.json(questions);

    } catch (error) {
        console.error('❌ Error fetching questions:', error);
        res.status(500).json({ error: 'Failed to fetch questions', details: error.message });
    }
});

// The save-progress and save-result endpoints remain as placeholders
app.post('/api/save-progress', (req, res) => {
    console.log('💾 Saving progress (placeholder):', req.body);
    res.json({ success: true, message: 'Progress saved (placeholder)' });
});

app.post('/api/save-result', (req, res) => {
    console.log('🏆 Saving result (placeholder):', req.body);
    res.json({ success: true, message: 'Result saved (placeholder)' });
});

// Start server
const PORT = 3000;
connectToDatabase().then(connected => {
    if (connected) {
        app.listen(PORT, () => {
            console.log(`\n🚀 Backend server running on http://localhost:${PORT}`);
        });
    } else {
        console.log('⚠️ Could not start server due to database connection failure.');
    }
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🔻 Shutting down server...');
    await client.close();
    console.log('✅ MongoDB connection closed');
    process.exit(0);
});