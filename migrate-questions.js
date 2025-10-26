const sql = require('mssql');

// Your existing question arrays from script.js
const discQuestions = [
    { text: { en: "I prioritize getting measurable results quickly.", pt: "Eu priorizo a obtenção de resultados mensuráveis rapidamente." }, factor: "D" },
    { text: { en: "I am direct and assertive in my communication style.", pt: "Eu sou direto e assertivo no meu estilo de comunicação." }, factor: "D" },
    // ... include ALL 30 DISC questions from your script.js
];

const mbtiQuestions = [
    { 
        optionA: { en: "You enjoy being the center of attention at social gatherings", pt: "Você gosta de ser o centro das atenções em encontros sociais" }, 
        optionB: { en: "You prefer observing from the sidelines in social situations", pt: "Você prefere observar de fora em situações sociais" },
        dimension: "EI",
        aValue: "E",
        bValue: "I"
    },
    // ... include ALL 28 MBTI questions from your script.js
];

const big5Questions = [
    { text: { en: "I have a rich vocabulary.", pt: "Eu tenho um vocabulário rico." }, factor: "O", reverse: false },
    { text: { en: "I have a vivid imagination.", pt: "Eu tenho uma imaginação vívida." }, factor: "O", reverse: false },
    // ... include ALL 40 Big5 questions from your script.js
];

// SQL Server configuration
const dbConfig = {
    server: 'localhost',
    database: 'personality_tests',
    user: 'SA',
    password: 'Shopee123',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

async function migrateQuestions() {
    try {
        const pool = await sql.connect(dbConfig);
        console.log('Connected to SQL Server');

        // Insert tests
        console.log('Inserting tests...');
        await pool.request()
            .query(`
                INSERT INTO tests (name, description, total_questions) VALUES
                ('DISC', 'DISC Personality Assessment', 30),
                ('MBTI', 'Myers-Briggs Type Indicator', 28),
                ('Big5', 'Big Five Personality Traits', 40)
            `);
        console.log('Tests inserted');

        // Get test IDs
        const testResult = await pool.request()
            .query('SELECT id, name FROM tests');
        
        const testIds = {};
        testResult.recordset.forEach(row => {
            testIds[row.name] = row.id;
        });

        // Insert DISC questions
        console.log('Inserting DISC questions...');
        for (let i = 0; i < discQuestions.length; i++) {
            const q = discQuestions[i];
            await pool.request()
                .input('testId', sql.Int, testIds['DISC'])
                .input('factor', sql.VarChar(2), q.factor)
                .input('textEn', sql.Text, q.text.en)
                .input('textPt', sql.Text, q.text.pt)
                .input('order', sql.Int, i + 1)
                .query(`
                    INSERT INTO questions (test_id, factor, question_text_en, question_text_pt, question_order)
                    VALUES (@testId, @factor, @textEn, @textPt, @order)
                `);
        }
        console.log(`Inserted ${discQuestions.length} DISC questions`);

        // Insert MBTI questions
        console.log('Inserting MBTI questions...');
        for (let i = 0; i < mbtiQuestions.length; i++) {
            const q = mbtiQuestions[i];
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
        }
        console.log(`Inserted ${mbtiQuestions.length} MBTI questions`);

        // Insert Big5 questions
        console.log('Inserting Big5 questions...');
        for (let i = 0; i < big5Questions.length; i++) {
            const q = big5Questions[i];
            await pool.request()
                .input('testId', sql.Int, testIds['Big5'])
                .input('factor', sql.VarChar(2), q.factor)
                .input('textEn', sql.Text, q.text.en)
                .input('textPt', sql.Text, q.text.pt)
                .input('reverse', sql.Bit, q.reverse ? 1 : 0)
                .input('order', sql.Int, i + 1)
                .query(`
                    INSERT INTO questions (test_id, factor, question_text_en, question_text_pt, reverse_scoring, question_order)
                    VALUES (@testId, @factor, @textEn, @textPt, @reverse, @order)
                `);
        }
        console.log(`Inserted ${big5Questions.length} Big5 questions`);

        console.log('Migration completed successfully!');
        await pool.close();

    } catch (error) {
        console.error('Migration failed:', error);
    }
}

migrateQuestions();