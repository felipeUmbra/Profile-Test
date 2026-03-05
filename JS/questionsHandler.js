import { CONFIG } from "/script.js";

// Cache for fallback questions
let fallbackQuestionsCache = null;

// Transform backend questions to frontend format
function transformQuestions(backendQuestions, testType, lang) {
    try {
        // Handle DISC and Big5
        if (testType === 'disc' || testType === 'big5') {
            return backendQuestions.map(q => {
                let textObj = { en: '', pt: '', es: '' };
                
                // If question_text is a properly formatted multilingual object
                if (typeof q.question_text === 'object' && q.question_text !== null) {
                    textObj = {
                        en: q.question_text.en || q.question_text_en || '',
                        pt: q.question_text.pt || q.question_text_pt || '',
                        es: q.question_text.es || q.question_text_es || ''
                    };
                } else {
                    // Fallback if it's just a string
                    const textStr = q.question_text || q.question_text_en || '';
                    textObj = { en: textStr, pt: textStr, es: textStr };
                }

                const result = {
                    id: q.id,
                    text: textObj,
                    factor: q.factor
                };

                if (testType === 'big5') {
                    result.reverse = q.reverse_scoring || false;
                }
                return result;
            });
            
        // Handle MBTI
        } else if (testType === 'mbti') {
            return backendQuestions.map(q => {
                let optA = { en: '', pt: '', es: '' };
                let optB = { en: '', pt: '', es: '' };
                
                if (q.question_text && typeof q.question_text === 'object') {
                    // Check if optionA/B are properly nested multilingual objects
                    if (q.question_text.optionA && typeof q.question_text.optionA === 'object') {
                        optA = {
                            en: q.question_text.optionA.en || '',
                            pt: q.question_text.optionA.pt || '',
                            es: q.question_text.optionA.es || ''
                        };
                        optB = {
                            en: q.question_text.optionB.en || '',
                            pt: q.question_text.optionB.pt || '',
                            es: q.question_text.optionB.es || ''
                        };
                    } else {
                        // Fallback for flat strings
                        const textA = q.question_text.optionA || q.question_text_en || '';
                        const textB = q.question_text.optionB || q.question_text_pt || '';
                        optA = { en: textA, pt: textA, es: textA };
                        optB = { en: textB, pt: textB, es: textB };
                    }
                } 

                return {
                    id: q.id,
                    optionA: optA,
                    optionB: optB,
                    dimension: q.factor,
                    aValue: q.aValue || (q.factor ? q.factor[0] : 'E'), 
                    bValue: q.bValue || (q.factor ? q.factor[1] : 'I')
                };
            });
        }
        
        return backendQuestions;
    } catch (error) {
        console.error('Error transforming questions:', error);
        throw error;
    }
} 

/**
 * Retrieves fallback questions for a specific test type.
 * This function is used as a safety mechanism when the primary database connection fails,
 * loading questions from a local JSON source instead.
 *
 * @async
 * @param {string} testType - The unique identifier of the test (e.g., 'mbti', 'disc', 'big5').
 * @param {string} lang - The language code for logging purposes (e.g., 'en', 'pt', 'es').
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of question objects. 
 * Returns an empty array [] if an error occurs or the test type is not found.
 */
async function getFallbackQuestions(testType, lang) {
    try {
        let fallbackData;

        // 1. Check if we already have the fallback questions cached
        if (fallbackQuestionsCache) {
            fallbackData = fallbackQuestionsCache;
        } else {
            // 2. If not cached, attempt to fetch them from the JSON file
            try {
                const response = await fetch('/JSON/fallback-questions.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                fallbackQuestionsCache = await response.json();
                console.log('Fallback questions loaded from JSON file');
                fallbackData = fallbackQuestionsCache;
            } catch (error) {
                console.error('Failed to load fallback questions from JSON file:', error);
                // Create an empty structure as a last resort if the file fails to load
                fallbackData = { disc: [], mbti: [], big5: [] };
            }
        }

        // 3. Return the specific test questions
        console.log(`Using fallback questions for ${testType} in ${lang}`);
        return fallbackData[testType] || [];
        
    } catch (error) {
        console.error('Error getting fallback questions:', error);
        return [];
    }
}

export async function fetchQuestions(testType, lang = 'en') {
    try {
        console.log(`Attempting to fetch ${testType} questions from backend...`);
        
        // Fetch with a 5-second timeout to prevent hanging
        const response = await fetch(`${CONFIG.apiBaseUrl}/questions/${testType}?lang=${lang}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            signal: AbortSignal.timeout(5000)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const questions = await response.json();
        console.log(`Successfully fetched ${questions.length} ${testType} questions from backend`);
        
        // Transform the raw API data into the format expected by the UI
        return transformQuestions(questions, testType, lang);
        
    } catch (error) {
        console.warn(`Failed to fetch questions from API: ${error.message}. Using fallback questions.`);
        
        // Fail gracefully by loading local JSON data
        return getFallbackQuestions(testType, lang);
    }
}