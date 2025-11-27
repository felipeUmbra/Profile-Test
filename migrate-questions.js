const sql = require('mssql');
const fs = require('fs');

// Configuração do SQL Server
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

// Carrega perguntas do arquivo JSON
function loadQuestionsFromJSON() {
    try {
        const data = fs.readFileSync('fallback-questions.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Erro ao carregar fallback-questions.json:', error);
        process.exit(1);
    }
}

async function migrateQuestions() {
    let pool;
    try {
        pool = await sql.connect(dbConfig);
        console.log('✅ Conectado ao SQL Server');

        const questionsData = loadQuestionsFromJSON();
        console.log('📁 Perguntas carregadas do fallback-questions.json');

        // 1. Verifica se os testes existem na tabela 'tests'
        const existingTests = await pool.request()
            .query('SELECT id, name FROM tests');
        
        const testIds = {};
        let needsTestInsert = false;

        existingTests.recordset.forEach(row => {
            testIds[row.name] = row.id;
        });

        if (!testIds['DISC']) {
            console.log('Inserindo testes...');
            await pool.request()
                .query(`
                    INSERT INTO tests (name, description, total_questions) VALUES
                    ('DISC', 'DISC Personality Assessment', 30),
                    ('MBTI', 'Myers-Briggs Type Indicator', 28),
                    ('Big5', 'Big Five Personality Traits', 40)
                `);
            needsTestInsert = true;
            console.log('✅ Testes inseridos');
        } else {
            console.log('✅ Testes já existem no banco de dados');
        }

        if (needsTestInsert) {
            const newTestResult = await pool.request()
                .query('SELECT id, name FROM tests');
            newTestResult.recordset.forEach(row => {
                testIds[row.name] = row.id;
            });
        }

        // 2. Garante que a coluna de Espanhol exista na tabela 'questions'
        console.log('\n🔧 Verificando esquema do banco de dados...');
        try {
            await pool.request().query(`
                IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('questions') AND name = 'question_text_es')
                BEGIN
                    ALTER TABLE questions ADD question_text_es NVARCHAR(MAX);
                    PRINT 'Coluna question_text_es adicionada com sucesso.';
                END
            `);
            console.log('✅ Coluna de Espanhol verificada/criada');
        } catch (error) {
            console.error('⚠️ Erro ao verificar coluna de espanhol:', error.message);
        }

        // Função auxiliar para limpar perguntas antigas
        async function clearExistingQuestions(testId) {
            try {
                await pool.request()
                    .input('testId', sql.Int, testId)
                    .query('DELETE FROM questions WHERE test_id = @testId');
                console.log(`🧹 Perguntas limpas para o teste ID ${testId}`);
                return true;
            } catch (error) {
                console.error('Erro ao limpar perguntas:', error.message);
                return false;
            }
        }

        console.log('\n🧹 Limpando perguntas existentes...');
        await Promise.all([
            clearExistingQuestions(testIds['DISC']),
            clearExistingQuestions(testIds['MBTI']),
            clearExistingQuestions(testIds['Big5'])
        ]);

        // 3. Migração DISC (com Espanhol)
        console.log('\n📊 Migrando perguntas DISC...');
        let discInserted = 0;

        for (let i = 0; i < questionsData.disc.length; i++) {
            const q = questionsData.disc[i];
            
            await pool.request()
                .input('testId', sql.Int, testIds['DISC'])
                .input('factor', sql.VarChar(2), q.factor)
                .input('textEn', sql.Text, q.text.en)
                .input('textPt', sql.Text, q.text.pt)
                .input('textEs', sql.Text, q.text.es) // Adicionado Espanhol
                .input('order', sql.Int, i + 1)
                .query(`
                    INSERT INTO questions (test_id, factor, question_text_en, question_text_pt, question_text_es, question_order)
                    VALUES (@testId, @factor, @textEn, @textPt, @textEs, @order)
                `);
            discInserted++;
        }
        console.log(`✅ DISC: ${discInserted} perguntas inseridas`);

        // 4. Migração MBTI (com Espanhol)
        console.log('\n🧠 Migrando perguntas MBTI...');
        let mbtiInserted = 0;

        for (let i = 0; i < questionsData.mbti.length; i++) {
            const q = questionsData.mbti[i];
            
            // Cria os objetos JSON para cada idioma
            const questionTextEn = JSON.stringify({ optionA: q.optionA.en, optionB: q.optionB.en });
            const questionTextPt = JSON.stringify({ optionA: q.optionA.pt, optionB: q.optionB.pt });
            const questionTextEs = JSON.stringify({ optionA: q.optionA.es, optionB: q.optionB.es });

            await pool.request()
                .input('testId', sql.Int, testIds['MBTI'])
                .input('factor', sql.VarChar(2), q.dimension)
                .input('textEn', sql.Text, questionTextEn)
                .input('textPt', sql.Text, questionTextPt)
                .input('textEs', sql.Text, questionTextEs) // Adicionado Espanhol
                .input('order', sql.Int, i + 1)
                .query(`
                    INSERT INTO questions (test_id, factor, question_text_en, question_text_pt, question_text_es, question_order)
                    VALUES (@testId, @factor, @textEn, @textPt, @textEs, @order)
                `);
            mbtiInserted++;
        }
        console.log(`✅ MBTI: ${mbtiInserted} perguntas inseridas`);

        // 5. Migração Big5 (com Espanhol)
        console.log('\n🌟 Migrando perguntas Big5...');
        let big5Inserted = 0;

        for (let i = 0; i < questionsData.big5.length; i++) {
            const q = questionsData.big5[i];

            await pool.request()
                .input('testId', sql.Int, testIds['Big5'])
                .input('factor', sql.VarChar(2), q.factor)
                .input('textEn', sql.Text, q.text.en)
                .input('textPt', sql.Text, q.text.pt)
                .input('textEs', sql.Text, q.text.es) // Adicionado Espanhol
                .input('reverse', sql.Bit, q.reverse ? 1 : 0)
                .input('order', sql.Int, i + 1)
                .query(`
                    INSERT INTO questions (test_id, factor, question_text_en, question_text_pt, question_text_es, reverse_scoring, question_order)
                    VALUES (@testId, @factor, @textEn, @textPt, @textEs, @reverse, @order)
                `);
            big5Inserted++;
        }
        console.log(`✅ Big5: ${big5Inserted} perguntas inseridas`);

        // Resumo Final
        console.log('\n🎉 Resumo da Migração:');
        console.log(`   Total importado: ${discInserted + mbtiInserted + big5Inserted} perguntas.`);

        // Verificação de Amostra
        console.log('\n🔍 Verificação de Amostra (Espanhol):');
        try {
            const sampleQuestions = await pool.request()
                .query(`
                    SELECT TOP 3 t.name, q.question_order, 
                           SUBSTRING(CAST(q.question_text_es AS NVARCHAR(MAX)), 1, 50) as preview_es
                    FROM questions q
                    JOIN tests t ON q.test_id = t.id
                    WHERE q.question_text_es IS NOT NULL
                    ORDER BY t.name, q.question_order
                `);

            if (sampleQuestions.recordset.length > 0) {
                sampleQuestions.recordset.forEach(row => {
                    console.log(`   ${row.name} Q${row.question_order} (ES): ${row.preview_es}...`);
                });
            } else {
                console.log('   ⚠️ Nenhuma amostra em espanhol encontrada. Verifique se o JSON possui o campo "es".');
            }
        } catch (error) {
            console.log('   Pulei a verificação de amostra devido a limitações de coluna TEXT.');
        }

    } catch (error) {
        console.error('❌ Falha na migração:', error);
        process.exit(1);
    } finally {
        if (pool) {
            await pool.close();
            console.log('\n🔒 Conexão com banco de dados fechada');
        }
    }
}

migrateQuestions().then(() => {
    console.log('\n✨ Migração concluída com sucesso!');
}).catch(error => {
    console.error('\n💥 Erro fatal na migração:', error);
    process.exit(1);
});