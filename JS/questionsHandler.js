import { CONFIG } from "/script.js";
import { big5Descriptions, big5TraitDescriptions,blendedDescriptions, discDescriptions} from "/JS/trait-description.js";
import { tUtility } from "/JS/translation.js";


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

export function generateBig5ResultHTML(resultData, clang) {
    const scores = resultData.scores || {};
    const maxScores = resultData.maxScores || { O: 40, C: 40, E: 40, A: 40, N: 40 };
    let scoresHTML = '';
    const factors = ['O', 'C', 'E', 'A', 'N'];

    factors.forEach(factor => {
        const score = scores[factor] || 0;
        const max = maxScores[factor] || 40;
        const percentage = Math.round((score / max) * 100);
        
        // Fetch trait data
        const traitData = big5Descriptions[factor] || {
            title: { en: factor, pt: factor, es: factor },
            style: 'bg-gray-100 border-gray-500 text-gray-700',
            description: { en: '', pt: '', es: '' }
        };
        
        // Determine level (High, Moderate, Low)
        let level = '';
        if (percentage >= 70) level = 'high';
        else if (percentage <= 30) level = 'low';
        else level = 'moderate';
        
        // Fetch interpretation based on level and language
        let interpretationText = '';
        if (big5TraitDescriptions && big5TraitDescriptions[factor] && big5TraitDescriptions[factor][level]) {
            interpretationText = big5TraitDescriptions[factor][level][clang] || big5TraitDescriptions[factor][level]['en'];
        }

        // Apply translations to title and description
        const titleText = traitData.title[clang] || traitData.title['en'];
        const descText = traitData.description[clang] || traitData.description['en'];

        scoresHTML += `
            <div class="mb-6 p-4 rounded-lg border-l-4 ${traitData.style} shadow-sm bg-white">
                <div class="flex justify-between items-center mb-2">
                    <h3 class="text-xl font-bold flex items-center">
                        <span class="mr-2">${traitData.icon || ''}</span>
                        ${titleText}
                    </h3>
                    <span class="text-lg font-semibold">${score} / ${max}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-3 mb-3">
                    <div class="h-3 rounded-full ${traitData.style.split(' ')[0]}" style="width: ${percentage}%"></div>
                </div>
                <p class="text-gray-600 italic mb-2">${descText}</p>
                <div class="bg-gray-50 p-3 rounded border border-gray-200">
                    <p class="text-gray-800"><span class="font-semibold">${tUtility ('interpretation')}:</span> ${interpretationText}</p>
                </div>
            </div>
        `;
    });

    // Determine introductory text based on the selected language
    let introText = "";
    if (clang === 'pt') {
        introText = "Os cinco grandes traços de personalidade representam cinco amplos domínios da personalidade humana. Suas pontuações indicam sua posição relativa em cada dimensão em comparação com a população em geral. Lembre-se de que todos os traços têm pontos fortes e desafios, e nenhuma pontuação é 'melhor' que a outra.";
    } else if (clang === 'es') {
        introText = "Los cinco grandes rasgos de personalidad representan cinco amplios dominios de la personalidad humana. Tus puntuaciones indican tu posición relativa en cada dimensión en comparación con la población general. Recuerda que todos los rasgos tienen tanto fortalezas como desafíos, y ninguna puntuación es 'mejor' que otra.";
    } else {
        introText = "The Big Five personality traits represent five broad domains of human personality. Your scores indicate your relative standing on each dimension compared to the general population. Remember that all traits have both strengths and challenges, and no single score is 'better' than another.";
    }

    return `
        <div class="mb-8">
            <p class="text-gray-700 mb-6 leading-relaxed bg-blue-50 p-4 rounded-lg border border-blue-100">
                ${introText}
            </p>
            <div class="space-y-2">
                ${scoresHTML}
            </div>
        </div>
    `;
}

export function generateDISCResultHTML(resultData, clang) {
    const profileKey = resultData.profileKey;
    const profileData = blendedDescriptions[profileKey];
    const profileName = profileData ? profileData.name[clang] : 'Unknown Profile';
    const description = profileData ? profileData.description[clang] : '';
    
    const factorScores = resultData.factors || [];
    const scores = resultData.scores || {};
    const factorCounts = resultData.factorCounts || { D: 8, I: 7, S: 8, C: 7 }; // Fallback to actual counts from fallback questions
    
    let scoresHTML = '';
    const factorOrder = ['D', 'I', 'S', 'C'];
    
    factorOrder.forEach(factor => {
        const score = scores[factor] || 0;
        const desc = discDescriptions[factor];
        const factorCount = factorCounts[factor] || 8;
        const maxScore = factorCount * 4;
        const percentage = Math.round((score / maxScore) * 100);
        
        scoresHTML += `
            <div class="p-6 rounded-xl border-2 ${desc.style} shadow-lg">
                <div class="flex items-center mb-4">
                    <span class="text-3xl mr-3">${desc.icon}</span>
                    <h3 class="text-xl font-bold">${desc.title[clang]}</h3>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div class="h-2.5 rounded-full bg-indigo-600" style="width: ${percentage}%"></div>
                </div>
                <p class="text-sm font-semibold mt-2">${score} / ${maxScore} ${tUtility('points')} (${percentage}%)</p>
            </div>
        `;
    });

    return `
        <div class="text-center mb-10">
            <h1 class="text-4xl font-extrabold text-gray-800 mb-4">${tUtility('disc_title')}</h1>
            <p class="text-gray-500">${clang === 'en' ? 'Your complete DISC personality assessment results' : 'Seus resultados completos da avaliação de personalidade DISC'}</p>
        </div>

        <!-- Profile Overview -->
        <div class="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white text-center mb-10 shadow-2xl">
            <div class="text-6xl font-bold mb-4">${profileKey}</div>
            <h2 class="text-3xl font-bold mb-4">${profileName}</h2>
            <p class="text-indigo-100 text-lg">${description}</p>
        </div>

        <!-- Score Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            ${scoresHTML}
        </div>

        <!-- Detailed Interpretation -->
        <div class="mb-10">
            <h3 class="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">${tUtility('interpretation_title')}</h3>
            <div class="bg-white p-6 rounded-xl border-l-4 ${profileData.style} shadow-md">
                <h4 class="text-xl font-bold text-gray-800 mb-3 flex items-center">
                    <span class="text-2xl mr-3">${discDescriptions[profileKey.charAt(0)].icon}</span>
                    ${profileName} ${clang === 'en' ? 'Profile' : 'Perfil'}
                </h4>
                <p class="text-gray-600 leading-relaxed">${description}</p>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="text-center space-x-4">
            <button id="restart-btn" data-html2canvas-ignore="true" class="px-8 py-3 bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-600 transition duration-300 shadow-lg">
                ${tUtility('restart')}
            </button>
            <button id="export-btn" data-html2canvas-ignore="true" class="px-8 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition duration-300 shadow-lg">
                ${tUtility('export_pdf')}
            </button>
        </div>
    `;
}