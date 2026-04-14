import 'dotenv/config';
import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dns from 'dns';

// ===== DNS FIX: Configure resolver to use specific DNS servers =====
// Helps prevent connection timeouts and SRV resolution errors
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
console.log('✅ DNS configured with custom servers:', dns.getServers());
// ===== END DNS FIX =====

// ES Module workaround for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// MongoDB Configuration
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
    console.error('❌ MONGODB_URI is not defined in your .env file. Please add it.');
    process.exit(1);
}

// Load questions from JSON file
function loadQuestions() {
    try {
        const filePath = path.join(__dirname, '/JSON/fallback-questions.json');
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('❌ Error loading fallback-questions.json:', error);
        process.exit(1);
    }
}

// Load trait descriptions from JSON file
function loadDescriptions() {
    try {
        const filePath = path.join(__dirname, '/JSON/fallback-trait-description.json');
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('⚠️ Error loading fallback-trait-description.json. Make sure the file exists in the JSON folder:', error.message);
        return null; // Return null so the rest of the migration can still run if the file is missing
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
        await db.collection('trait_descriptions').deleteMany({}); // Clear new descriptions collection
        console.log('✅ Collections cleared.');

        // 2. Define and insert tests
        console.log('📋 Inserting test definitions...');
        const tests = [
            { name: 'DISC', description: 'DISC Personality Assessment', totalQuestions: 30 },
            { name: 'MBTI', description: 'Myers-Briggs Type Indicator', totalQuestions: 28 },
            { name: 'BIG5', description: 'Big Five Personality Traits', totalQuestions: 40 }
        ];
        await db.collection('tests').insertMany(tests);
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
            testType: 'DISC',
            factor: q.factor || q.dimension,
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
            testType: 'MBTI',
            factor: q.dimension || q.factor,
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
            testType: 'BIG5',
            factor: q.factor || q.dimension,
            questionText: q.text,
            reverseScoring: q.reverse,
            questionOrder: index + 1
        }));
        if (big5Questions.length > 0) {
            await db.collection('questions').insertMany(big5Questions);
            console.log(` -> Big5: ${big5Questions.length} questions inserted.`);
            totalQuestionsInserted += big5Questions.length;
        }

        // 6. Migrate Trait Descriptions
        console.log('📋 Migrating trait descriptions...');
        const descriptionsData = loadDescriptions();
        if (descriptionsData) {
            // Map each root key in the JSON to a separate document in MongoDB
            const descriptionDocs = Object.keys(descriptionsData).map(key => ({
                category: key,
                content: descriptionsData[key]
            }));

            if (descriptionDocs.length > 0) {
                await db.collection('trait_descriptions').insertMany(descriptionDocs);
                console.log(` -> Trait Descriptions: ${descriptionDocs.length} categories inserted into 'trait_descriptions' collection.`);
            }
        }

        console.log(`\n🎉 Migration complete! Inserted ${totalQuestionsInserted} questions and ${descriptionsData ? Object.keys(descriptionsData).length : 0} description categories in total.`);

    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await client.close();
        console.log('🔒 MongoDB connection closed.');
    }
}

migrate();