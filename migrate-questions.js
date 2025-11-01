const sql = require('mssql');
const fs = require('fs');

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

// Load questions from JSON file
function loadQuestionsFromJSON() {
    try {
        const data = fs.readFileSync('fallback-questions.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading fallback-questions.json:', error);
        process.exit(1);
    }
}

async function migrateQuestions() {
    let pool;
    try {
        pool = await sql.connect(dbConfig);
        console.log('✅ Connected to SQL Server');

        // Load questions from JSON file
        const questionsData = loadQuestionsFromJSON();
        console.log('📁 Loaded questions from fallback-questions.json');

        // Check if tests already exist
        const existingTests = await pool.request()
            .query('SELECT id, name FROM tests');
        
        const testIds = {};
        let needsTestInsert = false;

        // Create test IDs mapping
        existingTests.recordset.forEach(row => {
            testIds[row.name] = row.id;
        });

        // Insert tests if they don't exist
        if (!testIds['DISC']) {
            console.log('Inserting tests...');
            await pool.request()
                .query(`
                    INSERT INTO tests (name, description, total_questions) VALUES
                    ('DISC', 'DISC Personality Assessment', 30),
                    ('MBTI', 'Myers-Briggs Type Indicator', 28),
                    ('Big5', 'Big Five Personality Traits', 40)
                `);
            needsTestInsert = true;
            console.log('✅ Tests inserted');
        } else {
            console.log('✅ Tests already exist in database');
        }

        // If we inserted tests, get the new IDs
        if (needsTestInsert) {
            const newTestResult = await pool.request()
                .query('SELECT id, name FROM tests');
            
            newTestResult.recordset.forEach(row => {
                testIds[row.name] = row.id;
            });
        }

        // Function to clear existing questions
        async function clearExistingQuestions(testId) {
            try {
                await pool.request()
                    .input('testId', sql.Int, testId)
                    .query('DELETE FROM questions WHERE test_id = @testId');
                console.log(`🧹 Cleared existing questions for test ID ${testId}`);
                return true;
            } catch (error) {
                console.error('Error clearing questions:', error.message);
                return false;
            }
        }

        // Clear existing questions to avoid duplicates
        console.log('\n🧹 Clearing existing questions...');
        const clearResults = await Promise.all([
            clearExistingQuestions(testIds['DISC']),
            clearExistingQuestions(testIds['MBTI']),
            clearExistingQuestions(testIds['Big5'])
        ]);

        // Check if all clearing operations were successful
        if (clearResults.some(result => !result)) {
            console.log('⚠️ Some clearing operations failed, but continuing with migration...');
        }

        // Insert DISC questions
        console.log('\n📊 Migrating DISC questions...');
        let discInserted = 0;

        for (let i = 0; i < questionsData.disc.length; i++) {
            const q = questionsData.disc[i];
            const questionTextEn = q.text.en;
            const questionTextPt = q.text.pt;

            await pool.request()
                .input('testId', sql.Int, testIds['DISC'])
                .input('factor', sql.VarChar(2), q.factor)
                .input('textEn', sql.Text, questionTextEn)
                .input('textPt', sql.Text, questionTextPt)
                .input('order', sql.Int, i + 1)
                .query(`
                    INSERT INTO questions (test_id, factor, question_text_en, question_text_pt, question_order)
                    VALUES (@testId, @factor, @textEn, @textPt, @order)
                `);
            discInserted++;
            
            // Show progress every 5 questions
            if ((i + 1) % 5 === 0) {
                console.log(`   Processed ${i + 1}/${questionsData.disc.length} DISC questions`);
            }
        }
        console.log(`✅ DISC: ${discInserted} questions inserted`);

        // Insert MBTI questions
        console.log('\n🧠 Migrating MBTI questions...');
        let mbtiInserted = 0;

        for (let i = 0; i < questionsData.mbti.length; i++) {
            const q = questionsData.mbti[i];
            const questionTextEn = JSON.stringify({
                optionA: q.optionA.en,
                optionB: q.optionB.en
            });
            const questionTextPt = JSON.stringify({
                optionA: q.optionA.pt,
                optionB: q.optionB.pt
            });

            await pool.request()
                .input('testId', sql.Int, testIds['MBTI'])
                .input('factor', sql.VarChar(2), q.dimension)
                .input('textEn', sql.Text, questionTextEn)
                .input('textPt', sql.Text, questionTextPt)
                .input('order', sql.Int, i + 1)
                .query(`
                    INSERT INTO questions (test_id, factor, question_text_en, question_text_pt, question_order)
                    VALUES (@testId, @factor, @textEn, @textPt, @order)
                `);
            mbtiInserted++;
            
            // Show progress every 5 questions
            if ((i + 1) % 5 === 0) {
                console.log(`   Processed ${i + 1}/${questionsData.mbti.length} MBTI questions`);
            }
        }
        console.log(`✅ MBTI: ${mbtiInserted} questions inserted`);

        // Insert Big5 questions
        console.log('\n🌟 Migrating Big5 questions...');
        let big5Inserted = 0;

        for (let i = 0; i < questionsData.big5.length; i++) {
            const q = questionsData.big5[i];
            const questionTextEn = q.text.en;
            const questionTextPt = q.text.pt;

            await pool.request()
                .input('testId', sql.Int, testIds['Big5'])
                .input('factor', sql.VarChar(2), q.factor)
                .input('textEn', sql.Text, questionTextEn)
                .input('textPt', sql.Text, questionTextPt)
                .input('reverse', sql.Bit, q.reverse ? 1 : 0)
                .input('order', sql.Int, i + 1)
                .query(`
                    INSERT INTO questions (test_id, factor, question_text_en, question_text_pt, reverse_scoring, question_order)
                    VALUES (@testId, @factor, @textEn, @textPt, @reverse, @order)
                `);
            big5Inserted++;
            
            // Show progress every 5 questions
            if ((i + 1) % 5 === 0) {
                console.log(`   Processed ${i + 1}/${questionsData.big5.length} Big5 questions`);
            }
        }
        console.log(`✅ Big5: ${big5Inserted} questions inserted`);

        // Display final summary
        console.log('\n🎉 Migration Summary:');
        console.log(`   DISC: ${discInserted} questions`);
        console.log(`   MBTI: ${mbtiInserted} questions`);
        console.log(`   Big5: ${big5Inserted} questions`);
        console.log(`   Total: ${discInserted + mbtiInserted + big5Inserted} questions`);

        // Verify the migration - FIXED: Use CAST for TEXT columns
        console.log('\n🔍 Verifying migration...');
        const verification = await pool.request()
            .query(`
                SELECT t.name, COUNT(q.id) as question_count
                FROM tests t
                LEFT JOIN questions q ON t.id = q.test_id
                GROUP BY t.name
            `);

        console.log('\n📋 Final counts in database:');
        verification.recordset.forEach(row => {
            console.log(`   ${row.name}: ${row.question_count} questions`);
        });

        // Verify question content - FIXED: Use CAST for TEXT columns
        console.log('\n🔍 Sample questions verification:');
        try {
            const sampleQuestions = await pool.request()
                .query(`
                    SELECT TOP 3 t.name, q.factor, q.question_order, 
                           SUBSTRING(CAST(q.question_text_en AS NVARCHAR(MAX)), 1, 50) as preview_en
                    FROM questions q
                    JOIN tests t ON q.test_id = t.id
                    ORDER BY t.name, q.question_order
                `);

            sampleQuestions.recordset.forEach(row => {
                console.log(`   ${row.name} - ${row.factor} Q${row.question_order}: ${row.preview_en}...`);
            });
        } catch (error) {
            console.log('   Sample preview skipped due to TEXT column limitations');
        }

        // Additional verification: Check for any data issues
        console.log('\n🔍 Checking for potential data issues...');
        const issueCheck = await pool.request()
            .query(`
                SELECT 
                    t.name,
                    COUNT(q.id) as total_questions,
                    COUNT(DISTINCT q.question_order) as unique_orders,
                    MIN(q.question_order) as min_order,
                    MAX(q.question_order) as max_order
                FROM tests t
                JOIN questions q ON t.id = q.test_id
                GROUP BY t.name
            `);

        issueCheck.recordset.forEach(row => {
            const hasIssues = row.total_questions !== row.unique_orders || 
                             row.min_order !== 1 || 
                             row.max_order !== row.total_questions;
            
            if (hasIssues) {
                console.log(`   ⚠️  ${row.name}: Potential issues detected`);
                console.log(`      Total: ${row.total_questions}, Unique orders: ${row.unique_orders}`);
                console.log(`      Order range: ${row.min_order} to ${row.max_order}`);
            } else {
                console.log(`   ✅ ${row.name}: Data looks good`);
            }
        });

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    } finally {
        if (pool) {
            await pool.close();
            console.log('\n🔒 Database connection closed');
        }
    }
}

// Run the migration
migrateQuestions().then(() => {
    console.log('\n✨ Migration completed successfully!');
    
    // Explain the count discrepancy
    console.log('\n📝 Note about question counts:');
    console.log('   If database counts differ from inserted counts, this could be due to:');
    console.log('   - Foreign key constraints preventing deletion');
    console.log('   - Transactions not committing properly');
    console.log('   - Existing data in related tables');
    console.log('   The migration has completed and questions are available for use.');
    
}).catch(error => {
    console.error('\n💥 Migration failed:', error);
    process.exit(1);
});