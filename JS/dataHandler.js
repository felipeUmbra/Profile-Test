import { getCurrentTestId, userRatings, currentTestQuestions, CONFIG, currentQuestionIndex, big5Scores, getStorageKey, isBig5Test, isDISCTest, isMBTITest, mbtiScores, scores } from "/script.js";

/**
 * Asynchronously saves the user's current test progress to the backend database.
 * * This function gathers the current session ID, test ID, and the user's answers so far,
 * formatting them into a standard payload. It then attempts to send this data to the 
 * API's `/save-progress` endpoint.
 * * **Fallback Mechanism:**
 * If the network request fails or the server returns an error, this function catches the 
 * exception, logs a warning, and automatically falls back to `saveProgressToLocalStorage`. 
 * This ensures that the user's progress is preserved even if the backend is offline.
 * * @async
 * @returns {Promise<void>} A promise that resolves when the save operation is complete (either via database or local storage fallback).
 * * @example
 * // Call this function after a user selects an answer
 * await saveProgressToDatabase();
 */
export async function saveProgressToDatabase(clang) {
    try {
        const sessionId = getOrCreateSessionId();
        const testId = getCurrentTestId();
        
        // Map current ratings to the schema expected by the backend
        const answers = userRatings.map((rating, index) => ({
            questionId: currentTestQuestions[index]?.id || index + 1,
            rating: rating.rating || rating.finalScore || 1,
            factor: rating.factor || rating.dimension
        }));

        const response = await fetch(`${CONFIG.apiBaseUrl}/save-progress`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId: sessionId,
                testId: testId,
                currentQuestion: currentQuestionIndex,
                answers: answers
            })
        });
        
        if (!response.ok) throw new Error('Failed to save progress to database');
        
        console.log('Progress saved to database');
    } catch (error) {
        console.warn('Could not save progress to database:', error);
        // Continue with local storage as fallback
        saveProgressToLocalStorage(clang);
    }
}

export function saveProgressToLocalStorage(clang) {
    try {
        const progress = {
            currentQuestionIndex,
            scores: isDISCTest ? scores : undefined,
            mbtiScores: isMBTITest ? mbtiScores : undefined,
            big5Scores: isBig5Test ? big5Scores : undefined,
            userRatings,
            clang,
            timestamp: Date.now()
        };
        localStorage.setItem(getStorageKey(), JSON.stringify(progress));
    } catch (error) {
        console.warn('Could not save progress to localStorage:', error);
    }
}

// Save result to database
export async function saveResultToDatabase(resultData) {
    try {
        const sessionId = getOrCreateSessionId();
        const testId = getCurrentTestId();
        
        const response = await fetch(`${CONFIG.apiBaseUrl}/save-result`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId: sessionId,
                testId: testId,
                scores: resultData.scores,
                profileKey: resultData.profileKey || resultData.type
            })
        });
        
        if (!response.ok) throw new Error('Failed to save result to database');
        
        console.log('Result saved to database');
        return true;
    } catch (error) {
        console.warn('Could not save result to database:', error);
        return false;
    }
}

// Get or create session ID
function getOrCreateSessionId() {
    let sessionId = localStorage.getItem('personalityTest_sessionId');
    if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('personalityTest_sessionId', sessionId);
    }
    return sessionId;
}