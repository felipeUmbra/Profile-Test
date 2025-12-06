import { CONFIG } from './data.js';

const API_BASE_URL = CONFIG.apiBaseUrl || 'http://localhost:3000/api';

export async function fetchQuestions(testType, lang = 'en') {
    try {
        console.log(`Fetching ${testType} questions...`);
        const response = await fetch(`${API_BASE_URL}/questions/${testType}?lang=${lang}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();

        // ✅ FIX: Return data directly. 
        // Do NOT call transformQuestions() because the server now does this for us.
        return data; 
        
    } catch (error) {
        console.error(`API Error: ${error.message}`);
        // Return empty array so the app doesn't crash, or you can implement local fallback here
        return []; 
    }
}

export async function saveProgress(sessionId, testId, currentQuestion, answers) {
    try {
        await fetch(`${API_BASE_URL}/save-progress`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, testId, currentQuestion, answers })
        });
    } catch (e) { 
        console.error('Save progress failed', e); 
    }
}

export async function saveResult(sessionId, testId, scores, profileKey) {
    try {
        await fetch(`${API_BASE_URL}/save-result`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, testId, scores, profileKey })
        });
    } catch (e) { 
        console.error('Save result failed', e); 
    }
}