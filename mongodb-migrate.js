require('dotenv').config();
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// MongoDB Configuration
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
    console.error('❌ MONGODB_URI is not defined in your .env file. Please add it.');
    process.exit(1);
}

// Load questions from JSON file
function loadQuestions() {
    try {
        const filePath = path.join(__dirname, 'fallback-questions.json');
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('❌ Error loading fallback-questions.json:', error);
        process.exit(1);
    }
}

async function migrate() {
    const client = new MongoClient(mongoUri);
    console.log('🚀 Starting migration...');

    try {
        await client.connect();
        const db = client.db();
        console.log('✅ Connected to MongoDB');

        // 1. Clear existing collections
        console.log('🧹 Clearing old data...');
        await db.collection('questions').deleteMany({});
        await db.collection('tests').deleteMany({});
        console.log('✅ Collections cleared.');

        // 2. Define and insert tests
        console.log('📋 Inserting test definitions...');
        const tests = [
            { name: 'DISC', description: 'DISC Personality Assessment', totalQuestions: 30 },
            { name: 'MBTI', description: 'Myers-Briggs Type Indicator', totalQuestions: 28 },
            { name: 'BIG5', description: 'Big Five Personality Traits', totalQuestions: 40 }
        ];
        const testsResult = await db.collection('tests').insertMany(tests);
        console.log('✅ Tests inserted.');

        // Create a map for easy lookup of test IDs
        const testIds = {};
        for (const test of tests) {
            const insertedTest = await db.collection('tests').findOne({ name: test.name });
            if (insertedTest) {
                testIds[test.name] = insertedTest._id;
            }
        }
        
        const allQuestions = loadQuestions();
        let totalQuestionsInserted = 0;

        // 3. Migrate DISC questions
        const discQuestions = allQuestions.disc.map((q, index) => ({
            testId: testIds['DISC'],
            factor: q.factor,
            questionText: q.text,
            questionOrder: index + 1
        }));
        if (discQuestions.length > 0) {
            await db.collection('questions').insertMany(discQuestions);
            console.log(` -> DISC: ${discQuestions.length} questions inserted.`);
            totalQuestionsInserted += discQuestions.length;
        }

        // 4. Migrate MBTI questions
        const mbtiQuestions = allQuestions.mbti.map((q, index) => ({
            testId: testIds['MBTI'],
            factor: q.dimension,
            questionText: {
                optionA: q.optionA,
                optionB: q.optionB
            },
            aValue: q.aValue,
            bValue: q.bValue,
            questionOrder: index + 1
        }));
        if (mbtiQuestions.length > 0) {
            await db.collection('questions').insertMany(mbtiQuestions);
            console.log(` -> MBTI: ${mbtiQuestions.length} questions inserted.`);
            totalQuestionsInserted += mbtiQuestions.length;
        }

        // 5. Migrate Big5 questions
        const big5Questions = allQuestions.big5.map((q, index) => ({
            testId: testIds['BIG5'],
            factor: q.factor,
            questionText: q.text,
            reverseScoring: q.reverse,
            questionOrder: index + 1
        }));
        if (big5Questions.length > 0) {
            await db.collection('questions').insertMany(big5Questions);
            console.log(` -> Big5: ${big5Questions.length} questions inserted.`);
            totalQuestionsInserted += big5Questions.length;
        }

        console.log(`\n🎉 Migration complete! Inserted ${totalQuestionsInserted} questions in total.`);

    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await client.close();
        console.log('🔒 MongoDB connection closed.');
    }
}

migrate();
