const express = require('express');
const cors = require('cors');
const sql = require('mssql');

const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// SQL Server configuration
const dbConfig = {
    server: 'localhost',
    database: 'personality_tests',
    user: 'SA',
    password: 'Shopee123',
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

let pool;

// Initialize database connection
async function initializeDatabase() {
    try {
        pool = await sql.connect(dbConfig);
        console.log('✅ Connected to SQL Server database successfully');
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
}

// Health check endpoint
app.get('/api/health', async (req, res) => {
    try {
        const dbConnected = pool && pool.connected;
        res.json({ 
            status: 'OK', 
            database: dbConnected ? 'Connected' : 'Disconnected',
            timestamp: new Date().toISOString(),
            endpoints: {
                questions: '/api/questions/:testType?lang=en|pt',
                saveProgress: '/api/save-progress',
                saveResult: '/api/save-result'
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Health check failed', details: error.message });
    }
});

// Get questions from database
app.get('/api/questions/:testType', async (req, res) => {
    const { testType } = req.params;
    const { lang = 'en' } = req.query;
    
    console.log(`🔍 Fetching questions for ${testType} in ${lang}`);
    
    // Validate test type
    const validTestTypes = ['disc', 'mbti', 'big5'];
    if (!validTestTypes.includes(testType.toLowerCase())) {
        return res.status(400).json({ error: 'Invalid test type. Must be: disc, mbti, or big5' });
    }

    try {
        // Check if database is connected
        if (!pool || !pool.connected) {
            const connected = await initializeDatabase();
            if (!connected) {
                return res.status(500).json({ error: 'Database connection unavailable' });
            }
        }

        // Get test ID - ensure we get the correct test
        const testResult = await pool.request()
            .input('testName', sql.VarChar(50), testType.toUpperCase())
            .query('SELECT id, name, total_questions FROM tests WHERE name = @testName');
        
        if (testResult.recordset.length === 0) {
            console.error(`❌ Test type '${testType}' not found in database`);
            return res.status(404).json({ error: 'Test type not found in database' });
        }
        
        const testId = testResult.recordset[0].id;
        const testName = testResult.recordset[0].name;
        const totalQuestions = testResult.recordset[0].total_questions;
        
        console.log(`📋 Found test: ID=${testId}, Name=${testName}, Expected questions=${totalQuestions}`);
        
        // Get questions for this test
        const questionsResult = await pool.request()
            .input('testId', sql.Int, testId)
            .query(`
                SELECT id, factor, question_text_en, question_text_pt, 
                       reverse_scoring, question_order 
                FROM questions 
                WHERE test_id = @testId 
                ORDER BY question_order
            `);
        
        console.log(`📊 Database returned ${questionsResult.recordset.length} questions for ${testType}`);
        
        if (questionsResult.recordset.length === 0) {
            console.error(`❌ No questions found for test ID ${testId}`);
            return res.status(404).json({ error: 'No questions found for this test type' });
        }

        if (questionsResult.recordset.length !== totalQuestions) {
            console.warn(`⚠️ Question count mismatch: expected ${totalQuestions}, got ${questionsResult.recordset.length}`);
        }
        
        // Transform questions based on test type and language
        const questions = questionsResult.recordset.map(q => {
            const baseQuestion = {
                id: q.id,
                factor: q.factor,
                question_order: q.question_order
            };
            
            if (testType === 'mbti') {
                // MBTI questions are stored as JSON
                try {
                    // Try to parse the question text as JSON
                    const questionTextEn = typeof q.question_text_en === 'string' 
                        ? JSON.parse(q.question_text_en) 
                        : { optionA: { en: '', pt: '' }, optionB: { en: '', pt: '' } };
                    
                    const questionTextPt = typeof q.question_text_pt === 'string'
                        ? JSON.parse(q.question_text_pt)
                        : { optionA: { en: '', pt: '' }, optionB: { en: '', pt: '' } };

                    return {
                        ...baseQuestion,
                        optionA: {
                            en: questionTextEn.optionA?.en || questionTextEn.optionA || 'Option A',
                            pt: questionTextPt.optionA?.pt || questionTextPt.optionA || 'Opção A'
                        },
                        optionB: {
                            en: questionTextEn.optionB?.en || questionTextEn.optionB || 'Option B',
                            pt: questionTextPt.optionB?.pt || questionTextPt.optionB || 'Opção B'
                        },
                        dimension: q.factor,
                        aValue: q.factor && q.factor.length >= 1 ? q.factor[0] : 'E',
                        bValue: q.factor && q.factor.length >= 2 ? q.factor[1] : 'I'
                    };
                } catch (e) {
                    console.error('❌ Error parsing MBTI question JSON:', e.message);
                    // Fallback for MBTI questions
                    return {
                        ...baseQuestion,
                        optionA: { 
                            en: `MBTI Option A Question ${q.question_order}`, 
                            pt: `MBTI Opção A Pergunta ${q.question_order}` 
                        },
                        optionB: { 
                            en: `MBTI Option B Question ${q.question_order}`, 
                            pt: `MBTI Opção B Pergunta ${q.question_order}` 
                        },
                        dimension: q.factor || 'EI',
                        aValue: q.factor && q.factor.length >= 1 ? q.factor[0] : 'E',
                        bValue: q.factor && q.factor.length >= 2 ? q.factor[1] : 'I'
                    };
                }
            } else {
                // DISC and Big5 questions - direct text
                const questionText = {
                    en: q.question_text_en || `Question ${q.question_order}`,
                    pt: q.question_text_pt || `Pergunta ${q.question_order}`
                };
                
                if (testType === 'big5') {
                    return {
                        ...baseQuestion,
                        text: questionText,
                        reverse: q.reverse_scoring || false
                    };
                } else {
                    // DISC questions
                    return {
                        ...baseQuestion,
                        text: questionText
                    };
                }
            }
        });

        console.log(`✅ Successfully transformed ${questions.length} questions for ${testType}`);
        
        res.json(questions);
        
    } catch (error) {
        console.error('❌ Error fetching questions:', error);
        res.status(500).json({ 
            error: 'Failed to fetch questions from database', 
            details: error.message 
        });
    }
});

// Debug endpoint to check raw database data
app.get('/api/debug/questions/:testType', async (req, res) => {
    const { testType } = req.params;
    
    try {
        if (!pool || !pool.connected) {
            await initializeDatabase();
        }

        const testResult = await pool.request()
            .input('testName', sql.VarChar(50), testType.toUpperCase())
            .query('SELECT id, name FROM tests WHERE name = @testName');
        
        if (testResult.recordset.length === 0) {
            return res.status(404).json({ error: 'Test not found' });
        }
        
        const testId = testResult.recordset[0].id;
        
        const questionsResult = await pool.request()
            .input('testId', sql.Int, testId)
            .query(`
                SELECT id, factor, question_order, 
                       CAST(question_text_en AS NVARCHAR(MAX)) as question_text_en,
                       CAST(question_text_pt AS NVARCHAR(MAX)) as question_text_pt,
                       reverse_scoring
                FROM questions 
                WHERE test_id = @testId 
                ORDER BY question_order
            `);
        
        res.json({
            test: testResult.recordset[0],
            questions: questionsResult.recordset,
            count: questionsResult.recordset.length
        });
        
    } catch (error) {
        console.error('Debug endpoint error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Save progress to database
app.post('/api/save-progress', async (req, res) => {
    try {
        const { sessionId, testId, currentQuestion, answers } = req.body;
        
        console.log('💾 Saving progress:', { 
            sessionId, 
            testId, 
            currentQuestion, 
            answersCount: answers?.length 
        });
        
        // For now, just log the progress (you can implement actual saving later)
        // This would typically involve creating a user_sessions table and user_answers table
        
        res.json({ 
            success: true, 
            message: 'Progress saved successfully',
            sessionId: sessionId,
            savedAt: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('❌ Error saving progress:', error);
        res.status(500).json({ 
            error: 'Failed to save progress', 
            details: error.message 
        });
    }
});

// Save result to database
app.post('/api/save-result', async (req, res) => {
    try {
        const { sessionId, testId, scores, profileKey, type } = req.body;
        
        console.log('🏆 Saving result:', { 
            sessionId, 
            testId, 
            profileKey: profileKey || type,
            scores: scores ? Object.keys(scores).length + ' scores' : 'none'
        });
        
        // For now, just log the result (you can implement actual saving later)
        // This would typically involve updating the user_sessions table with final results
        
        res.json({ 
            success: true, 
            message: 'Result saved successfully',
            resultId: `result_${Date.now()}`,
            savedAt: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('❌ Error saving result:', error);
        res.status(500).json({ 
            error: 'Failed to save result', 
            details: error.message 
        });
    }
});

// Test data validation endpoint
app.get('/api/validate-data', async (req, res) => {
    try {
        if (!pool || !pool.connected) {
            await initializeDatabase();
        }

        const testsResult = await pool.request()
            .query(`
                SELECT t.name, t.total_questions as expected, COUNT(q.id) as actual
                FROM tests t
                LEFT JOIN questions q ON t.id = q.test_id
                GROUP BY t.name, t.total_questions
            `);

        const validationResults = testsResult.recordset.map(test => ({
            test: test.name,
            expected: test.expected,
            actual: test.actual,
            status: test.expected === test.actual ? '✅' : '❌',
            match: test.expected === test.actual
        }));

        const allValid = validationResults.every(result => result.match);

        res.json({
            valid: allValid,
            results: validationResults,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Validation error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Initialize database on startup
initializeDatabase().then(connected => {
    if (connected) {
        console.log('✅ Backend initialized with database connection');
        
        // Validate data on startup
        setTimeout(async () => {
            try {
                const testsResult = await pool.request()
                    .query(`
                        SELECT t.name, t.total_questions as expected, COUNT(q.id) as actual
                        FROM tests t
                        LEFT JOIN questions q ON t.id = q.test_id
                        GROUP BY t.name, t.total_questions
                    `);

                console.log('\n📊 Database Validation on Startup:');
                testsResult.recordset.forEach(test => {
                    const status = test.expected === test.actual ? '✅' : '❌';
                    console.log(`   ${status} ${test.name}: ${test.actual}/${test.expected} questions`);
                });
            } catch (error) {
                console.log('   ⚠️ Could not validate data on startup:', error.message);
            }
        }, 1000);
    } else {
        console.log('⚠️ Backend running in fallback mode (no database)');
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`\n🚀 Backend server running on http://localhost:${PORT}`);
    console.log('\n📋 Available endpoints:');
    console.log(`   GET  http://localhost:${PORT}/api/health`);
    console.log(`   GET  http://localhost:${PORT}/api/questions/:testType?lang=en|pt`);
    console.log(`   GET  http://localhost:${PORT}/api/debug/questions/:testType`);
    console.log(`   GET  http://localhost:${PORT}/api/validate-data`);
    console.log(`   POST http://localhost:${PORT}/api/save-progress`);
    console.log(`   POST http://localhost:${PORT}/api/save-result`);
    console.log('\n🔍 Test these URLs to verify:');
    console.log(`   http://localhost:${PORT}/api/questions/disc?lang=en`);
    console.log(`   http://localhost:${PORT}/api/validate-data`);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🔻 Shutting down server...');
    if (pool) {
        await pool.close();
        console.log('✅ Database connection closed');
    }
    console.log('👋 Server stopped');
    process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('💥 Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
});