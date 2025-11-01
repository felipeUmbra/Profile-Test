const sql = require('mssql');

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

async function verifyMigration() {
    try {
        const pool = await sql.connect(dbConfig);
        
        console.log('=== Migration Verification ===\n');
        
        // Count questions per test
        const result = await pool.request()
            .query(`
                SELECT t.name, COUNT(q.id) as question_count
                FROM tests t
                LEFT JOIN questions q ON t.id = q.test_id
                GROUP BY t.name
            `);
        
        console.log('Questions per test:');
        result.recordset.forEach(row => {
            console.log(`  ${row.name}: ${row.question_count} questions`);
        });
        
        // Sample questions from each test
        console.log('\nSample questions:');
        const samples = await pool.request()
            .query(`
                SELECT t.name, q.factor, q.question_text_en, q.question_order
                FROM questions q
                JOIN tests t ON q.test_id = t.id
                WHERE q.question_order = 1
            `);
        
        samples.recordset.forEach(row => {
            console.log(`\n${row.name} (${row.factor}) - Q${row.question_order}:`);
            console.log(`  EN: ${row.question_text_en.substring(0, 50)}...`);
        });
        
        await pool.close();
        
    } catch (error) {
        console.error('Verification failed:', error);
    }
}

verifyMigration();