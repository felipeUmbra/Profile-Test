const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Mock data - replace with your actual database queries
// Update the mock data in server.js to match your database structure
const mockQuestions = {
    disc: Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        factor: ['D', 'I', 'S', 'C'][Math.floor(i / 8)],
        question_text_en: `DISC Question ${i + 1} - English text for DISC assessment`,
        question_text_pt: `DISC Pergunta ${i + 1} - Texto em português para avaliação DISC`,
        question_order: i + 1
    })),
    mbti: Array.from({ length: 28 }, (_, i) => ({
        id: i + 1,
        factor: ['EI', 'SN', 'TF', 'JP'][Math.floor(i / 7)],
        question_text: JSON.stringify({
            optionA: { 
                en: `MBTI Option A Question ${i + 1} - English`, 
                pt: `MBTI Opção A Pergunta ${i + 1} - Português` 
            },
            optionB: { 
                en: `MBTI Option B Question ${i + 1} - English`, 
                pt: `MBTI Opção B Pergunta ${i + 1} - Português` 
            }
        }),
        question_order: i + 1
    })),
    big5: Array.from({ length: 40 }, (_, i) => ({
        id: i + 1,
        factor: ['O', 'C', 'E', 'A', 'N'][Math.floor(i / 8)],
        question_text_en: `Big5 Question ${i + 1} - English text for Big Five assessment`,
        question_text_pt: `Big5 Pergunta ${i + 1} - Texto em português para avaliação Big Five`,
        reverse_scoring: i % 3 === 0,
        question_order: i + 1
    }))
};

// Update the questions route to handle the transformation
app.get('/api/questions/:testType', (req, res) => {
    const { testType } = req.params;
    const { lang = 'en' } = req.query;
    
    console.log(`Fetching questions for ${testType} in ${lang}`);
    
    if (!mockQuestions[testType]) {
        return res.status(404).json({ error: 'Test type not found' });
    }
    
    // Return the questions as-is, let the frontend handle transformation
    res.json(mockQuestions[testType]);
});

// Add health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        endpoints: {
            questions: '/api/questions/:testType',
            saveProgress: '/api/save-progress',
            saveResult: '/api/save-result'
        }
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
    console.log('Available endpoints:');
    console.log(`  GET  http://localhost:${PORT}/api/questions/:testType?lang=en|pt`);
    console.log(`  POST http://localhost:${PORT}/api/save-progress`);
    console.log(`  POST http://localhost:${PORT}/api/save-result`);
});