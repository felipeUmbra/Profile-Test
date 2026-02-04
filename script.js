import { exportResultToPDF, AccessibilityManager, TestRunner, showError, setupEnhancedKeyboardNavigation,
     setupVirtualScrollingForResults, cleanupVirtualScrolling } from '/JS/utils.js';
import {big5TraitDescriptions, mbtiDimensions, mbtiTypeDescriptions, discDescriptions, big5Descriptions, blendedDescriptions} from '/JS/trait-description.js';
// import { generateDISCResultHTML } from '/JS/scoring.js';
// --- Configuration Object ---
const CONFIG = {
    DISC: {
        totalQuestions: 30,
        minRating: 1,
        maxRating: 4,
        factors: ['D', 'I', 'S', 'C'],
        pureThreshold: 4,
        progressKey: 'personalityTest_disc',
        testId: 1
    },
    MBTI: {
        totalQuestions: 28,
        dimensions: ['EI', 'SN', 'TF', 'JP'],
        questionsPerDimension: 7,
        progressKey: 'personalityTest_mbti',
        testId: 2
    },
    BIG5: {
        totalQuestions: 40,
        minRating: 1,
        maxRating: 5,
        factors: ['O', 'C', 'E', 'A', 'N'],
        questionsPerFactor: 8,
        maxScorePerFactor: 40,
        progressKey: 'personalityTest_big5',
        testId: 3
    },
    localStorageTimeout: 3600000,
    resultKeys: {
        DISC: 'personalityTest_disc_result',
        MBTI: 'personalityTest_mbti_result', 
        BIG5: 'personalityTest_big5_result'
    },
    apiBaseUrl: 'http://localhost:3000/api' // Update this to your backend URL
};

// Test Type Detection
export const currentPage = window.location.pathname.split('/').pop();
export const isMBTITest = currentPage === 'mbti.html';
export const isDISCTest = currentPage === 'disc.html';
export const isBig5Test = currentPage === 'big5.html';
export const isIndexPage = currentPage === 'index.html' || currentPage === '';
export const isResultPage = currentPage.includes('-result.html');

// Language State and Translations
export let currentLang = 'en';

// Global Accessibility Manager
export let accessibilityManager;

const translations = {
    'en': {
        disc_title: "DISC Personality Test",
        disc_subtitle: "Rate how much each statement describes you (1 = Least, 4 = Most)",
        progress_q_of_total: "Question {q} of {total}",
        rating_1: "1 - Least Like Me",
        rating_2: "2 - Less Like Me", 
        rating_3: "3 - More Like Me",
        rating_4: "4 - Most Like Me",
        rating_guide: "Tap or click a number to rate the statement (1=Least, 4=Most)",
        main_result_title: "Your Personality Profile:",
        result_subtitle: "Below are your scores for the four DISC factors, followed by a detailed interpretation of your combined style.",
        interpretation_title: "Detailed Profile Interpretation",
        points: "Points",
        restart: "Restart Test",
        export_pdf: "Export to PDF 📄",
        filename: "DISC_Personality_Results_EN",
        back_to_home: "← Back to Home",
        
        mbti_title: "MBTI Personality Test",
        mbti_subtitle: "Choose the option that best describes you for each statement",
        mbti_rating_guide: "Choose the statement that better describes your natural preference",
        mbti_main_result_title: "Your MBTI Personality Type:",
        mbti_result_subtitle: "Your MBTI personality type and detailed interpretation",
        mbti_interpretation_title: "Detailed Type Interpretation",
        mbti_filename: "MBTI_Personality_Results_EN",
        
        big5_title: "Big Five Personality Test",
        big5_subtitle: "Rate how much each statement describes you (1 = Strongly Disagree, 5 = Strongly Agree)",
        big5_main_result_title: "Your Big Five Personality Traits:",
        big5_result_subtitle: "Below are your scores for the five major personality factors",
        big5_interpretation_title: "Trait Interpretations",
        big5_filename: "Big5_Personality_Results_EN",

        // Big Five factor names
        big5_openness: "Openness",
        big5_conscientiousness: "Conscientiousness", 
        big5_extraversion: "Extraversion",
        big5_agreeableness: "Agreeableness",
        big5_neuroticism: "Neuroticism",

        error_general: "An error occurred. Please try again.",
        error_pdf: "Failed to generate PDF. Please try again.",
        loading: "Loading...",
        resuming_test: "Resuming previous test...",
        test_data_invalid: "Test data appears to be invalid. Starting fresh test.",
        error_fetch_questions: "Failed to load questions from server. Please check your connection."
    },
    'pt': {
        disc_title: "Teste de Personalidade DISC",
        disc_subtitle: "Avalie o quanto cada afirmação o descreve (1 = Mínimo, 4 = Máximo)",
        progress_q_of_total: "Pergunta {q} de {total}",
        rating_1: "1 - Não sou assim",
        rating_2: "2 - Quase não sou assim", 
        rating_3: "3 - Sou um pouco assim",
        rating_4: "4 - Sou assim",
        rating_guide: "Toque ou clique em um número para avaliar a afirmação (1=Mínimo, 4=Máximo)",
        main_result_title: "Seu Perfil de Personalidade:",
        result_subtitle: "Abaixo estão suas pontuações para os quatro fatores DISC, seguidas de uma interpretação detalhada do seu estilo combinado.",
        interpretation_title: "Interpretação Detalhada do Perfil",
        points: "Pontos",
        restart: "Reiniciar Teste",
        export_pdf: "Exportar para PDF 📄",
        filename: "DISC_Personality_Results_PT",
        back_to_home: "← Voltar para a Página Inicial",
        
        mbti_title: "Teste de Personalidade MBTI",
        mbti_subtitle: "Escolha a opção que melhor descreve você para cada afirmação",
        mbti_rating_guide: "Escolha a afirmação que melhor descreve sua preferência natural",
        mbti_main_result_title: "Seu Tipo de Personalidade MBTI:",
        mbti_result_subtitle: "Seu tipo de personalidade MBTI e interpretação detalhada",
        mbti_interpretation_title: "Interpretação Detalhada do Tipo",
        mbti_filename: "MBTI_Personality_Results_PT",
        
        big5_title: "Teste de Personalidade Big Five",
        big5_subtitle: "Avalie o quanto cada afirmação o descreve (1 = Discordo Totalmente, 5 = Concordo Totalmente)",
        big5_main_result_title: "Seus Traços de Personalidade Big Five:",
        big5_result_subtitle: "Abaixo estão suas pontuações para os cinco principais fatores de personalidade",
        big5_interpretation_title: "Interpretações dos Traços",
        big5_filename: "Big5_Personality_Results_PT",

        // Big Five factor names
        big5_openness: "Abertura",
        big5_conscientiousness: "Conscienciosidade",
        big5_extraversion: "Extroversão",
        big5_agreeableness: "Amabilidade",
        big5_neuroticism: "Neuroticismo",

        error_general: "Ocorreu um erro. Por favor, tente novamente.",
        error_pdf: "Falha ao gerar PDF. Por favor, tente novamente.",
        loading: "Carregando...",
        resuming_test: "Continuando teste anterior...",
        test_data_invalid: "Os dados do teste parecem inválidos. Iniciando novo teste.",
        error_fetch_questions: "Falha ao carregar perguntas do servidor. Por favor, verifique sua conexão."
    },
    'es': {
        disc_title: "Test de Personalidad DISC",
        disc_subtitle: "Evalúa cuánto te describe cada afirmación (1 = Mínimo, 4 = Máximo)",
        progress_q_of_total: "Pregunta {q} de {total}",
        rating_1: "1 - No soy así",
        rating_2: "2 - Rara vez soy así",
        rating_3: "3 - A veces soy así",
        rating_4: "4 - Soy así",
        rating_guide: "Toca o haz clic en un número para calificar (1=Mínimo, 4=Máximo)",
        main_result_title: "Tu Perfil de Personalidad:",
        result_subtitle: "A continuación, tus puntuaciones para los cuatro factores DISC, seguidas de una interpretación detallada.",
        interpretation_title: "Interpretación Detallada del Perfil",
        points: "Puntos",
        restart: "Reiniciar Test",
        export_pdf: "Exportar a PDF 📄",
        filename: "Resultados_Personalidad_DISC_ES",
        back_to_home: "← Volver al Inicio",

        mbti_title: "Test de Personalidad MBTI",
        mbti_subtitle: "Elige la opción que mejor te describa para cada afirmación",
        mbti_rating_guide: "Elige la afirmación que mejor describa tu preferencia natural",
        mbti_main_result_title: "Tu Tipo de Personalidad MBTI:",
        mbti_result_subtitle: "Tu tipo de personalidad MBTI e interpretación detallada",
        mbti_interpretation_title: "Interpretación Detallada del Tipo",
        mbti_filename: "Resultados_Personalidad_MBTI_ES",

        big5_title: "Test de Personalidad Big Five",
        big5_subtitle: "Evalúa cuánto te describe cada afirmación (1 = Totalmente en desacuerdo, 5 = Totalmente de acuerdo)",
        big5_main_result_title: "Tus Rasgos de Personalidad Big Five:",
        big5_result_subtitle: "A continuación, tus puntuaciones para los cinco grandes factores",
        big5_interpretation_title: "Interpretación de los Rasgos",
        big5_filename: "Resultados_Personalidad_Big5_ES",

        big5_openness: "Apertura",
        big5_conscientiousness: "Responsabilidad",
        big5_extraversion: "Extraversión",
        big5_agreeableness: "Amabilidad",
        big5_neuroticism: "Neuroticismo",

        error_general: "Ocurrió un error. Por favor, inténtalo de nuevo.",
        error_pdf: "Error al generar el PDF. Por favor, inténtalo de nuevo.",
        loading: "Cargando...",
        resuming_test: "Reanudando test anterior...",
        test_data_invalid: "Datos del test inválidos. Iniciando nuevo test.",
        error_fetch_questions: "Error al cargar preguntas. Verifica tu conexión."
    }
};

// Index Page Translations
const indexTranslations = {
    'en': {
        mainTitle: "Personality Test Hub",
        subtitle: "Choose a personality test to discover more about yourself:",
        discTest: "DISC Personality Test",
        discSubtitle: "Understand your communication and work style",
        mbtiTest: "MBTI Personality Test",
        mbtiSubtitle: "Discover your psychological type",
        big5Test: "Big Five Personality Test", 
        big5Subtitle: "Explore the five major personality dimensions",
        resultsTitle: "Your Test Results",
        clearResults: "Clear All Results",
        footerText1: "All tests available in English, Portuguese and Spanish",
        footerText2: "Your results are saved automatically and can be viewed here anytime",
        confirmDelete: "Are you sure you want to delete this result?",
        confirmClearAll: "Are you sure you want to clear all your test results?",
        // Big Five trait descriptions
        strongCharacteristics: "🌟 Strong Characteristics:",
        balancedCharacteristics: "⚖️ Balanced Characteristics:",
        developingCharacteristics: "🌱 Developing Characteristics:",
        personalityProfile: "Your Personality Profile",
        basedOnAssessment: "Based on your Big Five assessment"
    },
    'pt': {
        mainTitle: "Central de Testes de Personalidade",
        subtitle: "Escolha um teste de personalidade para descobrir mais sobre você:",
        discTest: "Teste de Personalidade DISC",
        discSubtitle: "Compreenda seu estilo de comunicação e trabalho",
        mbtiTest: "Teste de Personalidade MBTI",
        mbtiSubtitle: "Descubra seu tipo psicológico",
        big5Test: "Teste de Personalidade Big Five",
        big5Subtitle: "Explore as cinco principais dimensões da personalidade",
        resultsTitle: "Seus Resultados de Teste",
        clearResults: "Limpar Todos os Resultados",
        footerText1: "Todos os testes disponíveis em Inglês, Português e Espanhol",
        footerText2: "Seus resultados são salvos automaticamente e podem ser vistos aqui a qualquer momento",
        confirmDelete: "Tem certeza que deseja excluir este resultado?",
        confirmClearAll: "Tem certeza que deseja limpar todos os seus resultados de teste?",
        // Big Five trait descriptions
        strongCharacteristics: "🌟 Características Fortes:",
        balancedCharacteristics: "⚖️ Características Equilibradas:",
        developingCharacteristics: "🌱 Características em Desenvolvimento:",
        personalityProfile: "Seu Perfil de Personalidade",
        basedOnAssessment: "Baseado na sua avaliação Big Five"
    },
    'es': {
        mainTitle: "Centro de Tests de Personalidad",
        subtitle: "Elige un test de personalidad para descubrir más sobre ti:",
        discTest: "Test de Personalidad DISC",
        discSubtitle: "Comprende tu estilo de comunicación y trabajo",
        mbtiTest: "Test de Personalidad MBTI",
        mbtiSubtitle: "Descubre tu tipo psicológico",
        big5Test: "Test de Personalidad Big Five",
        big5Subtitle: "Explora las cinco grandes dimensiones de la personalidad",
        resultsTitle: "Tus Resultados",
        clearResults: "Borrar Todos los Resultados",
        footerText1: "Todos los tests disponibles en Inglés, Portugués y Español",
        footerText2: "Tus resultados se guardan automáticamente y puedes verlos aquí en cualquier momento",
        confirmDelete: "¿Estás seguro de que deseas eliminar este resultado?",
        confirmClearAll: "¿Estás seguro de que deseas borrar todos tus resultados?",
        strongCharacteristics: "🌟 Características Fuertes:",
        balancedCharacteristics: "⚖️ Características Equilibradas:",
        developingCharacteristics: "🌱 Características en Desarrollo:",
        personalityProfile: "Tu Perfil de Personalidad",
        basedOnAssessment: "Basado en tu evaluación Big Five"
    }
    
};

// Utility function for translation
function t(key, replacements = {}) {
    try {
        let text = translations[currentLang][key] || translations['en'][key] || key;
        for (const [k, v] of Object.entries(replacements)) {
            text = text.replace(`{${k}}`, v);
        }
        return text;
    } catch (error) {
        console.error('Translation error:', error);
        return key;
    }
}

// Index page translation function
function tIndex(key, replacements = {}) {
    try {
        let text = indexTranslations[currentLang][key] || indexTranslations['en'][key] || key;
        for (const [k, v] of Object.entries(replacements)) {
            text = text.replace(`{${k}}`, v);
        }
        return text;
    } catch (error) {
        console.error('Index translation error:', error);
        return key;
    }
}

// Cache for fallback questions
let fallbackQuestionsCache = null;

// Load fallback questions from JSON file
async function loadFallbackQuestions() {
    if (fallbackQuestionsCache) {
        return fallbackQuestionsCache;
    }
    
    try {
        const response = await fetch('/JSON/fallback-questions.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        fallbackQuestionsCache = await response.json();
        console.log('Fallback questions loaded from JSON file');
        return fallbackQuestionsCache;
    } catch (error) {
        console.error('Failed to load fallback questions from JSON file:', error);
        // Return empty structure as last resort
        return { disc: [], mbti: [], big5: [] };
    }
}

// Get fallback questions for specific test type
async function getFallbackQuestions(testType, lang) {
    try {
        const fallbackData = await loadFallbackQuestions();
        console.log(`Using fallback questions for ${testType} in ${lang}`);
        return fallbackData[testType] || [];
    } catch (error) {
        console.error('Error getting fallback questions:', error);
        return [];
    }
}
// --- Database Integration Functions ---

// Fetch questions from the database
// Fetch questions from the database with fallback
async function fetchQuestions(testType, lang = 'en') {
    try {
        console.log(`Attempting to fetch ${testType} questions from backend...`);
        
        const response = await fetch(`${CONFIG.apiBaseUrl}/questions/${testType}?lang=${lang}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            // Add timeout for better error handling
            signal: AbortSignal.timeout(5000)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const questions = await response.json();
        console.log(`Successfully fetched ${questions.length} ${testType} questions from backend`);
        
        // Transform the questions to match the expected frontend format
        return transformQuestions(questions, testType, lang);
        
    } catch (error) {
        console.warn(`Failed to fetch questions from API: ${error.message}. Using fallback questions.`);
        return getFallbackQuestions(testType, lang);
    }
}

// Transform backend questions to frontend format
function transformQuestions(backendQuestions, testType, lang) {
    try {
        if (testType === 'disc') {
            return backendQuestions.map(q => ({
                id: q.id,
                text: { 
                    en: q.question_text_en || q.question_text, 
                    pt: q.question_text_pt || q.question_text 
                },
                factor: q.factor
            }));
        } else if (testType === 'mbti') {
            return backendQuestions.map(q => {
                let optionA, optionB;
                
                // Handle both stringified JSON and direct object formats
                if (typeof q.question_text === 'string') {
                    try {
                        const parsed = JSON.parse(q.question_text);
                        optionA = parsed.optionA || { en: '', pt: '' };
                        optionB = parsed.optionB || { en: '', pt: '' };
                    } catch (e) {
                        // If parsing fails, use the text directly
                        optionA = { en: q.question_text, pt: q.question_text };
                        optionB = { en: q.question_text, pt: q.question_text };
                    }
                } else {
                    optionA = q.question_text?.optionA || { en: '', pt: '' };
                    optionB = q.question_text?.optionB || { en: '', pt: '' };
                }
                
                return {
                    id: q.id,
                    optionA: {
                        en: optionA.en || q.question_text_en,
                        pt: optionA.pt || q.question_text_pt
                    },
                    optionB: {
                        en: optionB.en || q.question_text_en,
                        pt: optionB.pt || q.question_text_pt
                    },
                    dimension: q.factor,
                    aValue: q.factor ? q.factor[0] : 'E', // Default fallbacks
                    bValue: q.factor ? q.factor[1] : 'I'
                };
            });
        } else if (testType === 'big5') {
            return backendQuestions.map(q => ({
                id: q.id,
                text: { 
                    en: q.question_text_en || q.question_text, 
                    pt: q.question_text_pt || q.question_text 
                },
                factor: q.factor,
                reverse: q.reverse_scoring || false
            }));
        }
        
        return backendQuestions;
    } catch (error) {
        console.error('Error transforming questions:', error);
        throw error;
    }
}

// Save progress to database
async function saveProgressToDatabase() {
    try {
        const sessionId = getOrCreateSessionId();
        const testId = getCurrentTestId();
        
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
        saveProgressToLocalStorage(currentLang);
    }
}

// Save result to database
async function saveResultToDatabase(resultData) {
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

// Get current test ID
function getCurrentTestId() {
    if (isDISCTest) return CONFIG.DISC.testId;
    if (isMBTITest) return CONFIG.MBTI.testId;
    if (isBig5Test) return CONFIG.BIG5.testId;
    return 0;
}

// Performance Optimization: Debounce Function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Local Storage Management (Fallback)
function getStorageKey() {
    if (isMBTITest) return CONFIG.MBTI.progressKey;
    if (isBig5Test) return CONFIG.BIG5.progressKey;
    return CONFIG.DISC.progressKey;
}

function saveProgressToLocalStorage(clang) {
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

function loadProgressFromLocalStorage() {
    try {
        const saved = localStorage.getItem(getStorageKey());
        if (saved) {
            const progress = JSON.parse(saved);
            
            if (Date.now() - progress.timestamp < CONFIG.localStorageTimeout) {
                console.log(t('resuming_test'));
                return progress;
            } else {
                localStorage.removeItem(getStorageKey());
            }
        }
    } catch (error) {
        console.warn('Could not load progress from localStorage:', error);
    }
    return null;
}

function clearProgressFromLocalStorage() {
    try {
        localStorage.removeItem(getStorageKey());
    } catch (error) {
        console.warn('Could not clear progress from localStorage:', error);
    }
}

// Combined progress management
function saveProgress() {
    // Try database first, then localStorage as fallback
    saveProgressToDatabase().catch(() => {
        saveProgressToLocalStorage(currentLang);
    });
}

function loadProgress() {
    // For now, we'll use localStorage for progress resumption
    // In a future version, we could try to load from database first
    return loadProgressFromLocalStorage();
}

function clearProgress() {
    clearProgressFromLocalStorage();
    // Note: We don't clear database progress as it's meant for analytics
}

// Test Result Storage Management
function saveTestResult(resultData) {
    // Save to database
    saveResultToDatabase(resultData).then(success => {
        if (success) {
            // Also save to localStorage for display on index page
            saveTestResultToLocalStorage(resultData, currentLang);
        } else {
            // Fallback to localStorage only
            saveTestResultToLocalStorage(resultData, currentLang);
        }
    }).catch(() => {
        // Fallback to localStorage only
        saveTestResultToLocalStorage(resultData, currentLang);
    });
}

function saveTestResultToLocalStorage(resultData, clang) {
    try {
        let storageKey;
        let resultObject = {
            ...resultData,
            timestamp: Date.now()
        };

        if (isMBTITest) {
            storageKey = CONFIG.resultKeys.MBTI;
        } else if (isBig5Test) {
            storageKey = CONFIG.resultKeys.BIG5;
        } else {
            storageKey = CONFIG.resultKeys.DISC;
        }

        localStorage.setItem(storageKey, JSON.stringify(resultObject));
        console.log(`Test result saved to ${storageKey}`);
        
        // Show success message
        showSuccessMessage(clang === 'en' ? 'Result saved successfully!' : 'Resultado salvo com sucesso!');
    } catch (error) {
        console.warn('Could not save test result to localStorage:', error);
        showError(clang === 'en' ? 'Failed to save result.' : 'Falha ao salvar resultado.');
    }
}

function showSuccessMessage(message, duration = 3000) {
    let successContainer = document.getElementById('success-container');
    if (!successContainer) {
        successContainer = document.createElement('div');
        successContainer.id = 'success-container';
        successContainer.className = 'fixed top-4 right-4 z-50 max-w-sm';
        successContainer.setAttribute('role', 'alert');
        successContainer.setAttribute('aria-live', 'polite');
        document.body.appendChild(successContainer);
    }

    const successElement = document.createElement('div');
    successElement.className = 'bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg mb-2 success-message';
    successElement.innerHTML = `
        <div class="flex items-center">
            <span class="text-green-500 mr-2" aria-hidden="true">✓</span>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" 
                    class="ml-4 text-green-500 hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    aria-label="Close success message">
                ×
            </button>
        </div>
    `;

    successContainer.appendChild(successElement);
    if (accessibilityManager) {
        accessibilityManager.announce(`Success: ${message}`, 'assertive');
    }

    setTimeout(() => {
        if (successElement.parentNode) {
            successElement.parentNode.removeChild(successElement);
        }
    }, duration);
}

// Data Validation
function validateTestData() {
    try {
        if (!currentTestQuestions || currentTestQuestions.length === 0) {
            console.warn('No questions loaded from database');
            return false;
        }
        
        const expectedCount = isMBTITest ? CONFIG.MBTI.totalQuestions : 
                            isBig5Test ? CONFIG.BIG5.totalQuestions : 
                            CONFIG.DISC.totalQuestions;
        
        if (currentTestQuestions.length !== expectedCount) {
            console.warn(`Questions count mismatch: expected ${expectedCount}, got ${currentTestQuestions.length}`);
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('Error validating test data:', error);
        return false;
    }
}

export function showLoading(message = t('loading')) {
    const loadingElement = document.createElement('div');
    loadingElement.id = 'loading-overlay';
    loadingElement.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    loadingElement.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-xl flex items-center" role="alert" aria-live="polite">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-3" aria-hidden="true"></div>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(loadingElement);
    if (accessibilityManager) {
        accessibilityManager.announce(message, 'polite');
    }
    return loadingElement;
}

function hideLoading() {
    const loadingElement = document.getElementById('loading-overlay');
    if (loadingElement && loadingElement.parentNode) {
        loadingElement.parentNode.removeChild(loadingElement);
    }
}

// --- QUESTION DATA (Now loaded from database) ---
let currentTestQuestions = [];

// Global State
let currentQuestionIndex = 0;
let scores = { D: 0, I: 0, S: 0, C: 0 };
let mbtiScores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
let big5Scores = { O: 0, C: 0, E: 0, A: 0, N: 0 };
let userRatings = [];

// DOM Elements
let testContainer;
let resultsContainer;
let questionTextElement;
let progressTextElement;
let ratingButtonsContainer;
let progressBarElement;



// Debounced Handlers
const debouncedHandleRating = debounce(handleRating, 300);
const debouncedHandleMBTIRating = debounce(handleMBTIRating, 300);
const debouncedHandleBig5Rating = debounce(handleBig5Rating, 300);

// Enhanced Language Function
function setLanguage(lang) {
    try {
        if (lang === currentLang) return;
        currentLang = lang;
        
        if (isIndexPage) {
            updateIndexStaticText();
            loadSavedResults();  // Reload results to apply new language
        } else {
            updateStaticText();
            
            if (resultsContainer && resultsContainer.classList.contains('hidden')) {
                // Re-render current question with new language
                if (currentTestQuestions.length > 0) {
                    if (isMBTITest) {
                        renderMBTIQuestion(currentLang);
                    } else if (isBig5Test) {
                        renderBig5Question();
                    } else {
                        renderQuestion(currentLang);
                    }
                }
            } else if (resultsContainer) {
                showResults(true);
            }
        }
        
        try {
            localStorage.setItem('personalityTest_language', lang);
        } catch (e) {
            console.warn('Could not save language preference');
        }
        
        if (accessibilityManager) {
            accessibilityManager.announce(`Language changed to ${lang === 'en' ? 'English' : 'Portuguese'}`);
        }
    } catch (error) {
        console.error('Error setting language:', error);
        showError(t('error_general'));
    }
}

function updateStaticText() {
    try {
        // 1. Atualiza elementos específicos de TESTE (apenas se não for página de resultado)
        if (!isResultPage) {
            const headerTitle = document.getElementById('header-title');
            const headerSubtitle = document.getElementById('header-subtitle');
            const ratingGuide = document.getElementById('rating-guide');

            if (isMBTITest) {
                if (headerTitle) headerTitle.textContent = t('mbti_title');
                if (headerSubtitle) headerSubtitle.textContent = t('mbti_subtitle');
                if (ratingGuide) ratingGuide.textContent = t('mbti_rating_guide');
            } else if (isBig5Test) {
                if (headerTitle) headerTitle.textContent = t('big5_title');
                if (headerSubtitle) headerSubtitle.textContent = t('big5_subtitle');
                
                // Traduções específicas dos labels do Big 5
                const ratingLabels = currentLang === 'en' 
                    ? ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
                    : (currentLang === 'pt' 
                        ? ["Discordo Totalmente", "Discordo", "Neutro", "Concordo", "Concordo Totalmente"]
                        : ["Totalmente en desacuerdo", "En desacuerdo", "Neutral", "De acuerdo", "Totalmente de acuerdo"]);
                
                for (let i = 1; i <= 5; i++) {
                    const button = document.getElementById(`rating-${i}`);
                    const label = document.getElementById(`label-${i}`);
                    if (button) button.textContent = i;
                    if (label) label.textContent = ratingLabels[i-1];
                }
                
                if (ratingGuide) {
                    ratingGuide.textContent = currentLang === 'en' 
                        ? "Tap or click a number to rate the statement (1=Strongly Disagree, 5=Strongly Agree)"
                        : (currentLang === 'pt'
                            ? "Toque ou clique em um número para avaliar a afirmação (1=Discordo Totalmente, 5=Concordo Totalmente)"
                            : "Toca o haz clic en un número para calificar (1=Totalmente en desacuerdo, 5=Totalmente de acuerdo)");
                }
            } else {
                // Padrão DISC
                if (headerTitle) headerTitle.textContent = t('disc_title');
                if (headerSubtitle) headerSubtitle.textContent = t('disc_subtitle');
                
                const r1 = document.getElementById('rating-1');
                const r2 = document.getElementById('rating-2');
                const r3 = document.getElementById('rating-3');
                const r4 = document.getElementById('rating-4');
                
                if (r1) r1.textContent = t('rating_1');
                if (r2) r2.textContent = t('rating_2');
                if (r3) r3.textContent = t('rating_3');
                if (r4) r4.textContent = t('rating_4');
                if (ratingGuide) ratingGuide.textContent = t('rating_guide');
            }
        }
        
        // 2. Atualiza elementos COMUNS (existem em teste e resultado)
        const restartBtn = document.getElementById('restart-btn');
        const exportBtn = document.getElementById('export-btn');
        const backBtn = document.getElementById('back-btn'); // NOVO: Seleciona o botão de voltar

        if (restartBtn) restartBtn.textContent = t('restart');
        if (exportBtn) exportBtn.textContent = t('export_pdf');
        if (backBtn) backBtn.textContent = t('back_to_home'); // NOVO: Aplica a tradução
        
        // 3. Se estiver na página de resultados, força recarga do conteúdo dinâmico
        if (isResultPage) {
            const type = window.location.pathname.includes('disc') ? 'DISC' : 
                         (window.location.pathname.includes('mbti') ? 'MBTI' : 'BIG5');
            loadStoredResult(type);
        }

    } catch (error) {
        console.error('Error updating static text:', error);
    }
}

function updateIndexStaticText() {
    try {
        // Update main content
        document.getElementById('main-title').textContent = tIndex('mainTitle');
        document.getElementById('subtitle').textContent = tIndex('subtitle');
        
        // Update test links
        document.getElementById('disc-test').textContent = tIndex('discTest');
        document.getElementById('disc-subtitle').textContent = tIndex('discSubtitle');
        document.getElementById('mbti-test').textContent = tIndex('mbtiTest');
        document.getElementById('mbti-subtitle').textContent = tIndex('mbtiSubtitle');
        document.getElementById('big5-test').textContent = tIndex('big5Test');
        document.getElementById('big5-subtitle').textContent = tIndex('big5Subtitle');
        
        // Update results section
        document.getElementById('results-title').textContent = tIndex('resultsTitle');
        document.getElementById('clear-results-btn').textContent = tIndex('clearResults');
        
        // Update footer
        document.getElementById('footer-text-1').textContent = tIndex('footerText1');
        document.getElementById('footer-text-2').textContent = tIndex('footerText2');
    } catch (error) {
        console.error('Error updating index static text:', error);
    }
}

// Enhanced Question Rendering with Accessibility
function renderQuestion(clang) {
    try {
        if (currentQuestionIndex >= currentTestQuestions.length) {
            showResults();
            return;
        }

        const currentQ = currentTestQuestions[currentQuestionIndex];
        const totalQuestions = currentTestQuestions.length;

        questionTextElement.textContent = currentQ.text[clang];
        questionTextElement.setAttribute('aria-live', 'polite');
        
        const progress = (currentQuestionIndex / totalQuestions) * 100;
        progressTextElement.textContent = t('progress_q_of_total', { q: currentQuestionIndex + 1, total: totalQuestions });
        if (accessibilityManager) {
            accessibilityManager.updateProgressBar(progress);
        }

        Array.from(ratingButtonsContainer.children).forEach(btn => btn.classList.remove('selected'));

        // Announce new question for screen readers
        if (accessibilityManager) {
            accessibilityManager.announce(`Question ${currentQuestionIndex + 1} of ${totalQuestions}: ${currentQ.text[currentLang]}`, 'polite');
        }

        saveProgress();
    } catch (error) {
        console.error('Error rendering question:', error);
        showError(t('error_general'));
    }
}

function renderMBTIQuestion(clang) {
    try {
        if (currentQuestionIndex >= currentTestQuestions.length) {
            showResults();
            return;
        }

        const currentQ = currentTestQuestions[currentQuestionIndex];
        const totalQuestions = currentTestQuestions.length;

        document.getElementById('option-a-text').textContent = currentQ.optionA[clang];
        document.getElementById('option-b-text').textContent = currentQ.optionB[clang];
        
        // Update ARIA labels
        document.getElementById('option-a').setAttribute('aria-label', `Option A: ${currentQ.optionA[clang]}`);
        document.getElementById('option-b').setAttribute('aria-label', `Option B: ${currentQ.optionB[clang]}`);
        
        const progress = (currentQuestionIndex / totalQuestions) * 100;
        progressTextElement.textContent = t('progress_q_of_total', { q: currentQuestionIndex + 1, total: totalQuestions });
        if (accessibilityManager) {
            accessibilityManager.updateProgressBar(progress);
        }

        document.getElementById('option-a').classList.remove('selected', 'bg-blue-200', 'border-blue-500');
        document.getElementById('option-b').classList.remove('selected', 'bg-purple-200', 'border-purple-500');
        
        document.getElementById('option-a').classList.add('bg-gray-100', 'border-gray-300');
        document.getElementById('option-b').classList.add('bg-gray-100', 'border-gray-300');

        // Announce new question for screen readers
        if (accessibilityManager) {
            accessibilityManager.announce(`Question ${currentQuestionIndex + 1} of ${totalQuestions}. Option A: ${currentQ.optionA[currentLang]}. Option B: ${currentQ.optionB[currentLang]}`, 'polite');
        }

        saveProgress();
    } catch (error) {
        console.error('Error rendering MBTI question:', error);
        showError(t('error_general'));
    }
}

function renderBig5Question() {
    try {
        if (currentQuestionIndex >= currentTestQuestions.length) {
            showResults();
            return;
        }

        const currentQ = currentTestQuestions[currentQuestionIndex];
        const totalQuestions = currentTestQuestions.length;

        questionTextElement.textContent = currentQ.text[currentLang];
        questionTextElement.setAttribute('aria-live', 'polite');
        
        const progress = (currentQuestionIndex / totalQuestions) * 100;
        progressTextElement.textContent = t('progress_q_of_total', { q: currentQuestionIndex + 1, total: totalQuestions });
        if (accessibilityManager) {
            accessibilityManager.updateProgressBar(progress);
        }

        Array.from(ratingButtonsContainer.children).forEach(btn => btn.classList.remove('selected'));

        // Announce new question for screen readers
        if (accessibilityManager) {
            accessibilityManager.announce(`Question ${currentQuestionIndex + 1} of ${totalQuestions}: ${currentQ.text[currentLang]}`, 'polite');
        }

        saveProgress();
    } catch (error) {
        console.error('Error rendering Big5 question:', error);
        showError(t('error_general'));
    }
}

// Enhanced Rating Handlers with Accessibility
function handleRating(rating, buttonElement) {
    try {
        if (currentQuestionIndex >= currentTestQuestions.length) return;

        const currentQ = currentTestQuestions[currentQuestionIndex];

        Array.from(ratingButtonsContainer.children).forEach(btn => btn.classList.remove('selected'));
        buttonElement.classList.add('selected');

        scores[currentQ.factor] += rating;
        userRatings.push({ 
            questionId: currentQ.id,
            factor: currentQ.factor, 
            rating: rating 
        });
        
        // Announce selection for screen readers
        if (accessibilityManager) {
            accessibilityManager.announce(`Selected rating ${rating} for question`, 'assertive');
        }

        saveProgress();

        setTimeout(() => {
            currentQuestionIndex++;
            renderQuestion(currentLang);
        }, 300);
    } catch (error) {
        console.error('Error handling rating:', error);
        showError(t('error_general'));
    }
}

function handleMBTIRating(option, buttonElement) {
    try {
        if (currentQuestionIndex >= currentTestQuestions.length) return;

        const currentQ = currentTestQuestions[currentQuestionIndex];
        const selectedValue = option === 'A' ? currentQ.aValue : currentQ.bValue;

        document.getElementById('option-a').classList.remove('selected', 'bg-blue-200', 'border-blue-500', 'bg-gray-100');
        document.getElementById('option-b').classList.remove('selected', 'bg-purple-200', 'border-purple-500', 'bg-gray-100');
        
        if (option === 'A') {
            buttonElement.classList.add('selected', 'bg-blue-200', 'border-blue-500');
        } else {
            buttonElement.classList.add('selected', 'bg-purple-200', 'border-purple-500');
        }

        mbtiScores[selectedValue] += 1;
        userRatings.push({ 
            questionId: currentQ.id,
            dimension: currentQ.dimension, 
            choice: option, 
            value: selectedValue 
        });

        // Announce selection for screen readers
        const selectedText = option === 'A' ? currentQ.optionA[currentLang] : currentQ.optionB[currentLang];
        if (accessibilityManager) {
            accessibilityManager.announce(`Selected: ${selectedText}`, 'assertive');
        }

        saveProgress();

        setTimeout(() => {
            currentQuestionIndex++;
            renderMBTIQuestion(currentLang);
        }, 500);
    } catch (error) {
        console.error('Error handling MBTI rating:', error);
        showError(t('error_general'));
    }
}

function handleBig5Rating(rating, buttonElement) {
    try {
        if (currentQuestionIndex >= currentTestQuestions.length) return;

        const currentQ = currentTestQuestions[currentQuestionIndex];

        Array.from(ratingButtonsContainer.children).forEach(btn => btn.classList.remove('selected'));
        buttonElement.classList.add('selected');

        const finalScore = currentQ.reverse ? (6 - rating) : rating;
        
        big5Scores[currentQ.factor] += finalScore;
        userRatings.push({ 
            questionId: currentQ.id,
            factor: currentQ.factor, 
            rating: rating, 
            finalScore: finalScore 
        });

        // Announce selection for screen readers
        if (accessibilityManager) {
            accessibilityManager.announce(`Selected rating ${rating} for question`, 'assertive');
        }

        saveProgress();

        setTimeout(() => {
            currentQuestionIndex++;
            renderBig5Question();
        }, 300);
    } catch (error) {
        console.error('Error handling Big5 rating:', error);
        showError(t('error_general'));
    }
}

// Scoring Algorithms
function getProfileKey(factorScores) {
    try {
        const primary = factorScores[0];
        const secondary = factorScores[1];
        const PURE_THRESHOLD = CONFIG.DISC.pureThreshold;

        if (primary.score - secondary.score > PURE_THRESHOLD) {
            return primary.factor;
        } else {
            return primary.factor + secondary.factor;
        }
    } catch (error) {
        console.error('Error getting profile key:', error);
        return 'UNKN';
    }
}

function calculateMBTIType() {
    try {
        const eiType = mbtiScores.E >= mbtiScores.I ? 'E' : 'I';
        const snType = mbtiScores.S >= mbtiScores.N ? 'S' : 'N';
        const tfType = mbtiScores.T >= mbtiScores.F ? 'T' : 'F';
        const jpType = mbtiScores.J >= mbtiScores.P ? 'J' : 'P';
        
        return eiType + snType + tfType + jpType;
    } catch (error) {
        console.error('Error calculating MBTI type:', error);
        return 'UNKN';
    }
}

// Enhanced Results Display with Virtual Scrolling
function showResults(forceRerender = false) {
    try {
        if (!forceRerender) {
            testContainer.classList.add('hidden');
            resultsContainer.classList.remove('hidden');
            
            // Move focus to results for screen readers
            resultsContainer.setAttribute('tabindex', '-1');
            resultsContainer.focus();
        }

        const resultScores = document.getElementById('result-scores');
        const resultInterpretation = document.getElementById('result-interpretation');

        // Clear progress when test is completed
        clearProgress();

        // Announce completion
        if (accessibilityManager) {
            accessibilityManager.announce('Test completed. Displaying results.', 'assertive');
        }

        if (isMBTITest) {
            showMBTIResults(resultScores, resultInterpretation);
        } else if (isBig5Test) {
            showBig5Results(resultScores, resultInterpretation);
        } else {
            showDISCResults(resultScores, resultInterpretation);
        }

        // Enhance dynamic content for accessibility
        if (accessibilityManager) {
            accessibilityManager.enhanceDynamicContent(resultsContainer);
        }
        
        // Setup virtual scrolling for long interpretations
        setTimeout(() => {
            setupVirtualScrollingForResults();
        }, 100);

    } catch (error) {
        console.error('Error showing results:', error);
        showError(t('error_general'));
    }
}

// Enhanced MBTI Results with Accessibility
function showMBTIResults(resultScores, resultInterpretation) {
    try {
        const mbtiType = calculateMBTIType();
        const typeData = mbtiTypeDescriptions[mbtiType];

        if (!typeData) {
            showError(t('test_data_invalid'));
            return;
        }

        const mainResultTitle = document.getElementById('main-result-title');
        mainResultTitle.innerHTML = `${t('mbti_main_result_title')} <span class="text-purple-600 font-extrabold">${mbtiType}</span>`;
        document.getElementById('result-subtitle').textContent = t('mbti_result_subtitle');
        document.getElementById('interpretation-title').textContent = t('mbti_interpretation_title');

        const mbtiTypeDisplay = document.getElementById('mbti-type-display');
        mbtiTypeDisplay.innerHTML = `
            <div class="text-6xl font-bold mb-4" aria-label="Your MBTI type: ${mbtiType}">${mbtiType}</div>
            <div class="text-2xl font-semibold">${typeData.name[currentLang]}</div>
        `;
        mbtiTypeDisplay.setAttribute('role', 'status');
        mbtiTypeDisplay.setAttribute('aria-live', 'polite');

        // Save the result
        saveTestResult({
            testType: 'MBTI',
            type: mbtiType,
            scores: { ...mbtiScores },
            dimensions: ['EI', 'SN', 'TF', 'JP']
        });

        // Announce result
        if (accessibilityManager) {
            accessibilityManager.announce(`Your MBTI personality type is ${mbtiType}: ${typeData.name[currentLang]}`, 'assertive');
        }

        let scoreCardsHTML = '';
        const dimensions = [
            { dim: 'E', opposite: 'I' },
            { dim: 'S', opposite: 'N' },
            { dim: 'T', opposite: 'F' },
            { dim: 'J', opposite: 'P' }
        ];

        dimensions.forEach(({ dim, opposite }) => {
            const dimData = mbtiDimensions[dim];
            const oppData = mbtiDimensions[opposite];
            const dimScore = mbtiScores[dim];
            const oppScore = mbtiScores[opposite];
            const totalQuestions = CONFIG.MBTI.questionsPerDimension;
            const dimPercentage = Math.round((dimScore / totalQuestions) * 100);
            const oppPercentage = Math.round((oppScore / totalQuestions) * 100);
            const isPreferred = dimScore >= oppScore;

            scoreCardsHTML += `
                <div class="p-6 rounded-xl border-2 ${dimData.style} shadow-lg transition duration-300 ${isPreferred ? 'scale-[1.02] ring-4 ring-offset-2 ring-purple-500' : ''}"
                     role="article" aria-label="${dimData.title[currentLang]} vs ${oppData.title[currentLang]} score">
                    <div class="flex items-center mb-4">
                        <span class="text-3xl mr-3" aria-hidden="true">${dimData.icon}</span>
                        <h3 class="text-xl font-bold">${dimData.title[currentLang]} vs ${oppData.title[currentLang]}</h3>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2.5 mb-2" role="progressbar" 
                         aria-valuenow="${dimPercentage}" aria-valuemin="0" aria-valuemax="100">
                        <div class="h-2.5 rounded-full ${isPreferred ? 'bg-purple-600' : 'bg-gray-500'}" style="width: ${dimPercentage}%"></div>
                    </div>
                    <div class="flex justify-between text-sm font-semibold">
                        <span>${dimData.title[currentLang]} ${dimPercentage}%</span>
                        <span>${oppData.title[currentLang]} ${oppPercentage}%</span>
                    </div>
                    <p class="text-sm mt-2 text-gray-600">${dimData.description[currentLang]}</p>
                </div>
            `;
        });

        resultScores.innerHTML = scoreCardsHTML;

        const mainInterpretationHTML = `
            <div class="mb-6 p-6 rounded-xl border-l-4 border-purple-500 shadow-md bg-white" role="article" aria-label="Detailed interpretation">
                <h4 class="text-2xl font-bold text-gray-800 mb-2 flex items-center">
                    <span class="text-3xl mr-3" aria-hidden="true">${mbtiDimensions[mbtiType[0]].icon}</span>
                    ${mbtiType} - ${typeData.name[currentLang]}
                </h4>
                <p class="text-gray-600">${typeData.description[currentLang]}</p>
            </div>
        `;
        
        resultInterpretation.innerHTML = mainInterpretationHTML;
    } catch (error) {
        console.error('Error showing MBTI results:', error);
        showError(t('error_general'));
    }
}

// Enhanced Big Five Results with Accessibility
function showBig5Results(resultScores, resultInterpretation) {
    try {
        const mainResultTitle = document.getElementById('main-result-title');
        mainResultTitle.innerHTML = `${t('big5_main_result_title')}`;
        document.getElementById('result-subtitle').textContent = t('big5_result_subtitle');
        document.getElementById('interpretation-title').textContent = t('big5_interpretation_title');

        // Save the result
        saveTestResult({
            testType: 'BIG5',
            scores: { ...big5Scores },
            factors: ['O', 'C', 'E', 'A', 'N'],
            maxScores: {
                O: CONFIG.BIG5.maxScorePerFactor,
                C: CONFIG.BIG5.maxScorePerFactor,
                E: CONFIG.BIG5.maxScorePerFactor,
                A: CONFIG.BIG5.maxScorePerFactor,
                N: CONFIG.BIG5.maxScorePerFactor
            }
        });

        let scoreCardsHTML = '';
        const dimensions = ['O', 'C', 'E', 'A', 'N'];

        dimensions.forEach(factor => {
            const desc = big5Descriptions[factor];
            const score = big5Scores[factor];
            const maxScore = CONFIG.BIG5.maxScorePerFactor;
            const percentage = Math.round((score / maxScore) * 100);

            let interpretation = "";
            if (percentage >= 70) {
                interpretation = factor === 'N' ? 
                    { en: "High - May experience frequent emotional distress", pt: "Alto - Pode experimentar angústia emocional frequente" } :
                    { en: "High - Strong tendency in this trait", pt: "Alto - Forte tendência neste traço" };
            } else if (percentage >= 30) {
                interpretation = { en: "Moderate - Balanced level of this trait", pt: "Moderado - Nível equilibrado deste traço" };
            } else {
                interpretation = factor === 'N' ?
                    { en: "Low - Emotionally stable and resilient", pt: "Baixo - Estável emocionalmente e resiliente" } :
                    { en: "Low - Limited tendency in this trait", pt: "Baixo - Tendência limitada neste traço" };
            }

            scoreCardsHTML += `
                <div class="p-6 rounded-xl border-2 ${desc.style} shadow-lg transition duration-300"
                     role="article" aria-label="${desc.title[currentLang]} score">
                    <div class="flex items-center mb-4">
                        <span class="text-3xl mr-3" aria-hidden="true">${desc.icon}</span>
                        <h3 class="text-xl font-bold">${desc.title[currentLang]}</h3>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2.5 mb-2" role="progressbar" 
                         aria-valuenow="${percentage}" aria-valuemin="0" aria-valuemax="100">
                        <div class="h-2.5 rounded-full bg-indigo-600" style="width: ${percentage}%"></div>
                    </div>
                    <p class="text-sm font-semibold mt-2">${score}/${maxScore} ${t('points')} (${percentage}%)</p>
                    <p class="text-sm mt-2 text-gray-600">${desc.description[currentLang]}</p>
                    <p class="text-sm mt-2 font-semibold ${percentage >= 70 ? 'text-green-600' : percentage >= 30 ? 'text-yellow-600' : 'text-blue-600'}">
                        ${interpretation[currentLang]}
                    </p>
                </div>
            `;
        });

        resultScores.innerHTML = scoreCardsHTML;

        const mainInterpretationHTML = `
            <div class="mb-6 p-6 rounded-xl border-l-4 border-indigo-500 shadow-md bg-white" role="article" aria-label="Trait interpretations">
                <h4 class="text-2xl font-bold text-gray-800 mb-2">${currentLang === 'en' ? 'Understanding Your Big Five Results' : 'Entendendo Seus Resultados Big Five'}</h4>
                <p class="text-gray-600 mb-4">
                    ${currentLang === 'en' ? 
                    "The Big Five personality traits represent five broad domains of human personality. Your scores indicate your relative standing on each dimension compared to the general population. Remember that all traits have both strengths and challenges, and no single score is 'better' than another." :
                    "Os cinco grandes traços de personalidade representam cinco domínios amplos da personalidade humana. Suas pontuações indicam sua posição relativa em cada dimensão em comparação com a população em geral. Lembre-se de que todos os traços têm pontos fortes e desafios, e nenhuma pontuação única é 'melhor' que outra."}
                </p>
                <ul class="list-disc list-inside text-gray-600 space-y-2" role="list">
                    <li><strong>${t('big5_openness')}:</strong> ${currentLang === 'en' ? "Imagination, creativity, curiosity, and appreciation for new experiences" : "Imaginação, criatividade, curiosidade e apreço por novas experiências"}</li>
                    <li><strong>${t('big5_conscientiousness')}:</strong> ${currentLang === 'en' ? "Organization, diligence, reliability, and goal-directed behavior" : "Organização, diligência, confiabilidade e comportamento orientado a objetivos"}</li>
                    <li><strong>${t('big5_extraversion')}:</strong> ${currentLang === 'en' ? "Sociability, assertiveness, energy, and positive emotions" : "Sociabilidade, assertividade, energia e emoções positivas"}</li>
                    <li><strong>${t('big5_agreeableness')}:</strong> ${currentLang === 'en' ? "Compassion, cooperation, trust, and concern for social harmony" : "Compaixão, cooperação, confiança e preocupação com a harmonia social"}</li>
                    <li><strong>${t('big5_neuroticism')}:</strong> ${currentLang === 'en' ? "Anxiety, moodiness, emotional sensitivity, and vulnerability to stress" : "Ansiedade, instabilidade emocional, sensibilidade emocional e vulnerabilidade ao estresse"}</li>
                </ul>
            </div>
        `;
        
        resultInterpretation.innerHTML = mainInterpretationHTML;
        
        // Announce completion
        if (accessibilityManager) {
            accessibilityManager.announce('Big Five results displayed. Review your scores for each personality trait.', 'polite');
        }
    } catch (error) {
        console.error('Error showing Big5 results:', error);
        showError(t('error_general'));
    }
}

// Enhanced DISC Results with Accessibility
function showDISCResults(resultScores, resultInterpretation) {
    try {
        const factorCounts = currentTestQuestions.reduce((acc, q) => {
            acc[q.factor] = (acc[q.factor] || 0) + 1;
            return acc;
        }, {});

        let factorScores = [
            { factor: 'D', score: scores.D },
            { factor: 'I', score: scores.I },
            { factor: 'S', score: scores.S },
            { factor: 'C', score: scores.C },
        ];
        
        factorScores.sort((a, b) => b.score - a.score);
        
        const profileKey = getProfileKey(factorScores);
        const profileData = blendedDescriptions[profileKey];
        
        if (!profileData) {
            showError(t('test_data_invalid'));
            return;
        }

        const mainResultTitle = document.getElementById('main-result-title');
        mainResultTitle.innerHTML = `${t('main_result_title')} <span class="text-indigo-600 font-extrabold">${profileData.name[currentLang]}</span>`;
        document.getElementById('result-subtitle').textContent = t('result_subtitle');
        document.getElementById('interpretation-title').textContent = t('interpretation_title');

        // Save the result
        saveTestResult({
            testType: 'DISC',
            profileKey: profileKey,
            scores: { ...scores },
            factors: factorScores
        });

        // Announce result
        if (accessibilityManager) {
            accessibilityManager.announce(`Your DISC personality profile is ${profileData.name[currentLang]}`, 'assertive');
        }

        let scoreCardsHTML = '';
        const primaryStyles = [factorScores[0].factor, factorScores[1].factor];
        const factorOrder = ['D', 'I', 'S', 'C'];
        const sortedForDisplay = factorOrder.map(f => factorScores.find(s => s.factor === f));
        
        sortedForDisplay.forEach(item => {
            const desc = discDescriptions[item.factor];
            const factorCount = factorCounts[item.factor];
            const maxScore = factorCount * 4;
            const minScore = factorCount * 1;
            const range = maxScore - minScore;
            const percentage = range > 0 ? Math.round(((item.score - minScore) / range) * 100) : 0;
            const isPrimary = primaryStyles.includes(item.factor);

            scoreCardsHTML += `
                <div class="p-6 rounded-xl border-2 ${desc.style} shadow-lg transition duration-300 ${isPrimary ? 'scale-[1.02] ring-4 ring-offset-2 ring-indigo-500' : ''}"
                     role="article" aria-label="${desc.title[currentLang]} score">
                    <div class="flex items-center mb-4">
                        <span class="text-3xl mr-3" aria-hidden="true">${desc.icon}</span>
                        <h3 class="text-xl font-bold">${desc.title[currentLang]}</h3>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2.5 mb-2" role="progressbar" 
                         aria-valuenow="${percentage}" aria-valuemin="0" aria-valuemax="100">
                        <div class="h-2.5 rounded-full ${isPrimary ? 'bg-indigo-600' : 'bg-gray-500'}" style="width: ${percentage}%"></div>
                    </div>
                    <p class="text-sm font-semibold mt-2">${item.score} / ${maxScore} ${t('points')} (${percentage}%)</p>
                </div>
            `;
        });

        resultScores.innerHTML = scoreCardsHTML;

        const mainInterpretationHTML = `
            <div class="mb-6 p-6 rounded-xl border-l-4 ${profileData.style} shadow-md bg-white" role="article" aria-label="Detailed profile interpretation">
                <h4 class="text-2xl font-bold text-gray-800 mb-2 flex items-center">
                    <span class="text-3xl mr-3" aria-hidden="true">${discDescriptions[profileKey.charAt(0)].icon}</span>
                    ${profileData.name[currentLang]}
                </h4>
                <p class="text-gray-600">${profileData.description[currentLang]}</p>
            </div>
        `;
        
        resultInterpretation.innerHTML = mainInterpretationHTML;
    } catch (error) {
        console.error('Error showing DISC results:', error);
        showError(t('error_general'));
    }
}

// Enhanced Restart Function with Accessibility
function restartTest() {
    try {
        // 1. Check if we are on a Result Page
        // If yes, we simply redirect to the test page instead of trying to manipulate the DOM
        if (typeof isResultPage !== 'undefined' && isResultPage) {
            if (window.location.href.includes('disc')) {
                window.location.href = 'disc.html';
            } else if (window.location.href.includes('mbti')) {
                window.location.href = 'mbti.html';
            } else if (window.location.href.includes('big5')) {
                window.location.href = 'big5.html';
            }
            return; // Stop execution here
        }

        // 2. Normal Restart Logic (Only runs if we are on the Test Page)
        
        // Cleanup virtual scrolling if it exists
        if (typeof cleanupVirtualScrolling === 'function') {
            cleanupVirtualScrolling();
        }
        
        // Reset Progress Variables
        currentQuestionIndex = 0;
        
        if (typeof isMBTITest !== 'undefined' && isMBTITest) {
            mbtiScores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
        } else if (typeof isBig5Test !== 'undefined' && isBig5Test) {
            big5Scores = { O: 0, C: 0, E: 0, A: 0, N: 0 };
        } else {
            scores = { D: 0, I: 0, S: 0, C: 0 };
        }

        // Reset UI Elements (These only exist on the test page)
        const resultsContainer = document.getElementById('results-container');
        const quizContainer = document.getElementById('quiz-container');
        const introCard = document.getElementById('intro-card');

        // Safe check for elements before accessing classList
        if (resultsContainer) resultsContainer.classList.add('hidden');
        
        // If we have an intro card, show it; otherwise start the quiz directly
        if (introCard) {
            introCard.classList.remove('hidden');
            if (quizContainer) quizContainer.classList.add('hidden');
        } else if (quizContainer) {
            quizContainer.classList.remove('hidden');
            // Re-render the first question
            if (typeof isMBTITest !== 'undefined' && isMBTITest) renderMBTIQuestion();
            else if (typeof isBig5Test !== 'undefined' && isBig5Test) renderBig5Question();
            else renderQuestion();
        }

        // Scroll to top
        window.scrollTo(0, 0);

        // Announce restart to screen readers
        if (typeof accessibilityManager !== 'undefined' && accessibilityManager) {
            accessibilityManager.announce('Test restarted. You are back at the beginning.', 'assertive');
        }

    } catch (error) {
        console.error('Error restarting test:', error);
        // Fallback: reload the page
        window.location.reload();
    }
}

// Index Page Functions
// Enhanced Index Page Functions
function loadSavedResults() {
    const resultsContainer = document.getElementById('saved-results');
    const section = document.getElementById('saved-results-section');
    
    if (!resultsContainer || !section) return;

    let hasResults = false;
    let resultsHTML = '';

    // Check for DISC results
    const discResult = localStorage.getItem(CONFIG.resultKeys.DISC);
    if (discResult) {
        try {
            const result = JSON.parse(discResult);
            resultsHTML += createResultCard('DISC', result);
            hasResults = true;
        } catch (e) {
            console.error('Error parsing DISC result:', e);
        }
    }

    // Check for MBTI results
    const mbtiResult = localStorage.getItem(CONFIG.resultKeys.MBTI);
    if (mbtiResult) {
        try {
            const result = JSON.parse(mbtiResult);
            resultsHTML += createResultCard('MBTI', result);
            hasResults = true;
        } catch (e) {
            console.error('Error parsing MBTI result:', e);
        }
    }

    // Check for Big5 results
    const big5Result = localStorage.getItem(CONFIG.resultKeys.BIG5);
    if (big5Result) {
        try {
            const result = JSON.parse(big5Result);
            resultsHTML += createResultCard('BIG5', result);
            hasResults = true;
        } catch (e) {
            console.error('Error parsing Big5 result:', e);
        }
    }

    if (hasResults) {
        resultsContainer.innerHTML = resultsHTML;
        section.classList.remove('hidden');
        
        // Re-attach event listeners for dynamically created buttons
        attachResultCardEvents();
    } else {
        section.classList.add('hidden');
    }
}

function createResultCard(testType, result) {
    const testNames = {
        DISC: { en: 'DISC Personality', pt: 'Personalidade DISC', es: 'Personalidad DISC' },
        MBTI: { en: 'MBTI Personality', pt: 'Personalidade MBTI', es: 'Personalidad MBTI' }, 
        BIG5: { en: 'Big Five Personality', pt: 'Personalidade Big Five', es: 'Personalidad Big Five' }
    };

    const testColors = {
        DISC: 'indigo',
        MBTI: 'purple',
        BIG5: 'green'
    };

    const color = testColors[testType];
    const date = new Date(result.timestamp).toLocaleDateString();
    
    let content = '';
    
    if (testType === 'DISC') {
        const profileKey = result.profileKey;
        const profileData = blendedDescriptions[profileKey];
        const profileName = profileData ? profileData.name[currentLang] : (result.profileName || 'Unknown Profile');
        const description = profileData ? profileData.description[currentLang] : (result.description || '');
        
        content = `
            <div class="flex items-center justify-between">
                <div>
                    <h3 class="font-bold text-lg text-${color}-700">${profileName}</h3>
                    <p class="text-gray-600 text-sm">${description}</p>
                </div>
                <div class="text-right">
                    <div class="text-2xl font-bold text-${color}-600">${profileKey}</div>
                    <div class="text-xs text-gray-500">${date}</div>
                </div>
            </div>
        `;
    } else if (testType === 'MBTI') {
        const mbtiType = result.type;
        const typeData = mbtiTypeDescriptions[mbtiType];
        const typeName = typeData ? typeData.name[currentLang] : (result.typeName || 'Unknown Type');
        const description = typeData ? typeData.description[currentLang] : (result.description || '');
        
        content = `
            <div class="flex items-center justify-between">
                <div>
                    <h3 class="font-bold text-lg text-${color}-700">${typeName}</h3>
                    <p class="text-gray-600 text-sm">${description}</p>
                </div>
                <div class="text-right">
                    <div class="text-2xl font-bold text-${color}-600">${mbtiType}</div>
                    <div class="text-xs text-gray-500">${date}</div>
                </div>
            </div>
        `;
    } else if (testType === 'BIG5') {
        const traitAnalysis = analyzeBig5Traits(result.scores, result.maxScores);
        content = createBig5FriendlyDescription(traitAnalysis, date);
    }

    return `
        <div class="result-card p-4 rounded-xl border-2 border-${color}-200 bg-${color}-50 hover:bg-${color}-100 transition duration-300 cursor-pointer" 
             data-test-type="${testType}">
            <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-semibold text-${color}-600">${testNames[testType][currentLang]}</span>
                <button class="delete-btn text-xs text-gray-500 hover:text-red-700 transition duration-200 p-1 rounded" 
                        data-test-type="${testType}">
                    🗑️
                </button>
            </div>
            ${content}
        </div>
    `;
}

function analyzeBig5Traits(scores, maxScores) {
    const analysis = {};
    const factors = ['O', 'C', 'E', 'A', 'N'];
    
    factors.forEach(factor => {
        const score = scores[factor];
        const maxScore = maxScores[factor];
        const percentage = (score / maxScore) * 100;
        
        let level, description;
        
        if (percentage >= 70) {
            level = 'high';
            description = big5TraitDescriptions[factor].high;
        } else if (percentage >= 40) {
            level = 'moderate';
            description = big5TraitDescriptions[factor].moderate;
        } else {
            level = 'low';
            description = big5TraitDescriptions[factor].low;
        }
        
        analysis[factor] = {
            name: big5TraitDescriptions[factor].name,
            score: score,
            maxScore: maxScore,
            percentage: Math.round(percentage),
            level: level,
            description: description
        };
    });
    
    return analysis;
}

// Attach event listeners to result cards
function attachResultCardEvents() {
    // Delete button events
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent card click event
            const testType = this.getAttribute('data-test-type');
            deleteResult(testType);
        });
    });

    // Card click events (retake test)
    document.querySelectorAll('.result-card').forEach(card => {
        card.addEventListener('click', function() {
            const testType = this.getAttribute('data-test-type');
            viewResult(testType);
        });
    });
}

function createBig5FriendlyDescription(traitAnalysis, date) {
    const t = indexTranslations[currentLang];
    
    // Group traits by level
    const highTraits = Object.values(traitAnalysis).filter(trait => trait.level === 'high');
    const moderateTraits = Object.values(traitAnalysis).filter(trait => trait.level === 'moderate');
    const lowTraits = Object.values(traitAnalysis).filter(trait => trait.level === 'low');
    
    let descriptionHTML = `
        <div class="mb-3">
            <h3 class="font-bold text-lg text-green-700 mb-2">${t.personalityProfile}</h3>
    `;
    
    // High traits section
    if (highTraits.length > 0) {
        descriptionHTML += `
            <div class="mb-3">
                <h4 class="font-semibold text-green-600 text-sm mb-1">${t.strongCharacteristics}</h4>
                <ul class="text-xs text-gray-600 space-y-1">
        `;
        highTraits.forEach(trait => {
            descriptionHTML += `<li>• <strong>${trait.name[currentLang]}:</strong> ${trait.description[currentLang]}</li>`;
        });
        descriptionHTML += `</ul></div>`;
    }
    
    // Moderate traits section
    if (moderateTraits.length > 0) {
        descriptionHTML += `
            <div class="mb-3">
                <h4 class="font-semibold text-yellow-600 text-sm mb-1">${t.balancedCharacteristics}</h4>
                <ul class="text-xs text-gray-600 space-y-1">
        `;
        moderateTraits.forEach(trait => {
            descriptionHTML += `<li>• <strong>${trait.name[currentLang]}:</strong> ${trait.description[currentLang]}</li>`;
        });
        descriptionHTML += `</ul></div>`;
    }
    
    // Low traits section
    if (lowTraits.length > 0) {
        descriptionHTML += `
            <div class="mb-3">
                <h4 class="font-semibold text-blue-600 text-sm mb-1">${t.developingCharacteristics}</h4>
                <ul class="text-xs text-gray-600 space-y-1">
        `;
        lowTraits.forEach(trait => {
            descriptionHTML += `<li>• <strong>${trait.name[currentLang]}:</strong> ${trait.description[currentLang]}</li>`;
        });
        descriptionHTML += `</ul></div>`;
    }
    
    // Summary
    descriptionHTML += `
        <div class="text-xs text-gray-500 mt-2">
            <div class="flex justify-between items-center">
                <span>${t.basedOnAssessment}</span>
                <span>${date}</span>
            </div>
        </div>
    </div>
    `;
    
    return descriptionHTML;
}

function viewResult(testType) {
    const resultPages = {
        DISC: 'disc-result.html',
        MBTI: 'mbti-result.html',
        BIG5: 'big5-result.html'
    };
    
    if (resultPages[testType]) {
        window.location.href = resultPages[testType];
    } else {
        console.error('Unknown test type:', testType);
    }
}

// Retake a test
function retakeTest(testType) {
    const testPages = {
        DISC: 'disc.html',
        MBTI: 'mbti.html',
        BIG5: 'big5.html'
    };
    
    if (testPages[testType]) {
        window.location.href = testPages[testType];
    } else {
        console.error('Unknown test type:', testType);
    }
}

function deleteResult(testType) {
    const t = indexTranslations[currentLang];
    if (confirm(t.confirmDelete || 'Are you sure you want to delete this result?')) {
        localStorage.removeItem(CONFIG.resultKeys[testType]);
        showSuccessMessage(
            currentLang === 'en' ? 'Result deleted successfully!' : 'Resultado excluído com sucesso!'
        );
        loadSavedResults();
        
        if (accessibilityManager) {
            accessibilityManager.announce('Result deleted', 'assertive');
        }
    }
}

// Clear all results
function clearAllResults() {
    const t = indexTranslations[currentLang];
    if (confirm(t.confirmClearAll || 'Are you sure you want to clear all your test results?')) {
        Object.values(CONFIG.resultKeys).forEach(key => {
            localStorage.removeItem(key);
        });
        showSuccessMessage(
            currentLang === 'en' ? 'All results cleared successfully!' : 'Todos os resultados foram limpos com sucesso!'
        );
        loadSavedResults();
        
        if (accessibilityManager) {
            accessibilityManager.announce('All results cleared', 'assertive');
        }
    }
}

// Load and display stored result on result pages
function loadStoredResult(testType) {
    try {
        const resultKey = CONFIG.resultKeys[testType];
        const storedResult = localStorage.getItem(resultKey);
        
        if (!storedResult) {
            showNoResultMessage(testType);
            return;
        }

        const resultData = JSON.parse(storedResult);
        displayFullResult(testType, resultData);
        
    } catch (error) {
        console.error('Error loading stored result:', error);
        showNoResultMessage(testType);
    }
}

function showNoResultMessage(testType) {
    const testNames = {
        DISC: { en: 'DISC', pt: 'DISC' },
        MBTI: { en: 'MBTI', pt: 'MBTI' },
        BIG5: { en: 'Big Five', pt: 'Big Five' }
    };
    
    const containerId = `${testType.toLowerCase()}-result-content`;
    const container = document.getElementById(containerId);
    
    if (container) {
        container.innerHTML = `
            <div class="text-center py-12">
                <div class="text-6xl mb-4">😕</div>
                <h2 class="text-2xl font-bold text-gray-800 mb-4">${currentLang === 'en' ? 'No Results Found' : 'Nenhum Resultado Encontrado'}</h2>
                <p class="text-gray-600 mb-6">${currentLang === 'en' 
                    ? `No saved results found for the ${testNames[testType].en} test.` 
                    : `Nenhum resultado salvo encontrado para o teste ${testNames[testType].pt}.`}</p>
                <a href="${testType.toLowerCase()}.html" class="px-6 py-3 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition duration-300">
                    ${currentLang === 'en' ? 'Take the Test' : 'Fazer o Teste'}
                </a>
            </div>
        `;
    }
}

function displayFullResult(testType, resultData) {
    const containerId = `${testType.toLowerCase()}-result-content`;
    const container = document.getElementById(containerId);
    
    if (!container) return;

    let resultHTML = '';
    
    switch (testType) {
        case 'DISC':
            resultHTML = generateDISCResultHTML(resultData, currentLang);
            break;
        case 'MBTI':
            resultHTML = generateMBTIResultHTML(resultData);
            break;
        case 'BIG5':
            resultHTML = generateBig5ResultHTML(resultData);
            break;
    }
    
    container.innerHTML = resultHTML;
    
}

export function generateBig5ResultHTML(resultData) {
    const scores = resultData.scores || {};
    const maxScores = resultData.maxScores || { O: 40, C: 40, E: 40, A: 40, N: 40 };
    
    let scoresHTML = '';
    const factors = ['O', 'C', 'E', 'A', 'N'];

    factors.forEach(factor => {
        const desc = big5Descriptions[factor];
        const score = scores[factor] || 0;
        const maxScore = maxScores[factor] || 40;
        const percentage = Math.round((score / maxScore) * 100);

        let interpretation = "";
        if (percentage >= 70) {
            interpretation = factor === 'N' ? 
                (currentLang === 'en' ? "High - May experience frequent emotional distress" : "Alto - Pode experimentar angústia emocional frequente") :
                (currentLang === 'en' ? "High - Strong tendency in this trait" : "Alto - Forte tendência neste traço");
        } else if (percentage >= 30) {
            interpretation = currentLang === 'en' ? "Moderate - Balanced level of this trait" : "Moderado - Nível equilibrado deste traço";
        } else {
            interpretation = factor === 'N' ?
                (currentLang === 'en' ? "Low - Emotionally stable and resilient" : "Baixo - Estável emocionalmente e resiliente") :
                (currentLang === 'en' ? "Low - Limited tendency in this trait" : "Baixo - Tendência limitada neste traço");
        }

        scoresHTML += `
            <div class="p-6 rounded-xl border-2 ${desc.style} shadow-lg">
                <div class="flex items-center mb-4">
                    <span class="text-3xl mr-3">${desc.icon}</span>
                    <h3 class="text-xl font-bold">${desc.title[currentLang]}</h3>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div class="h-2.5 rounded-full bg-indigo-600" style="width: ${percentage}%"></div>
                </div>
                <p class="text-sm font-semibold mt-2">${score}/${maxScore} ${t('points')} (${percentage}%)</p>
                <p class="text-sm mt-2 text-gray-600">${desc.description[currentLang]}</p>
                <p class="text-sm mt-2 font-semibold ${percentage >= 70 ? 'text-green-600' : percentage >= 30 ? 'text-yellow-600' : 'text-blue-600'}">
                    ${interpretation}
                </p>
            </div>
        `;
    });

    return `
        <div class="text-center mb-10">
            <h1 class="text-4xl font-extrabold text-gray-800 mb-4">${t('big5_title')}</h1>
            <p class="text-gray-500">${currentLang === 'en' ? 'Your complete Big Five personality traits results' : 'Seus resultados completos dos traços de personalidade Big Five'}</p>
        </div>

        <!-- Score Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            ${scoresHTML}
        </div>

        <!-- Trait Interpretations -->
        <div class="mb-10">
            <h3 class="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">${t('big5_interpretation_title')}</h3>
            <div class="bg-white p-6 rounded-xl border-l-4 border-indigo-500 shadow-md">
                <h4 class="text-xl font-bold text-gray-800 mb-4">${currentLang === 'en' ? 'Understanding Your Big Five Results' : 'Entendendo Seus Resultados Big Five'}</h4>
                <p class="text-gray-600 mb-4">
                    ${currentLang === 'en' ? 
                    "The Big Five personality traits represent five broad domains of human personality. Your scores indicate your relative standing on each dimension compared to the general population. Remember that all traits have both strengths and challenges, and no single score is 'better' than another." :
                    "Os cinco grandes traços de personalidade representam cinco domínios amplos da personalidade humana. Suas pontuações indicam sua posição relativa em cada dimensão em comparação com a população em geral. Lembre-se de que todos os traços têm pontos fortes e desafios, e nenhuma pontuação única é 'melhor' que outra."}
                </p>
                <ul class="list-disc list-inside text-gray-600 space-y-2">
                    <li><strong>${t('big5_openness')}:</strong> ${currentLang === 'en' ? "Imagination, creativity, curiosity, and appreciation for new experiences" : "Imaginação, criatividade, curiosidade e apreço por novas experiências"}</li>
                    <li><strong>${t('big5_conscientiousness')}:</strong> ${currentLang === 'en' ? "Organization, diligence, reliability, and goal-directed behavior" : "Organização, diligência, confiabilidade e comportamento orientado a objetivos"}</li>
                    <li><strong>${t('big5_extraversion')}:</strong> ${currentLang === 'en' ? "Sociability, assertiveness, energy, and positive emotions" : "Sociabilidade, assertividade, energia e emoções positivas"}</li>
                    <li><strong>${t('big5_agreeableness')}:</strong> ${currentLang === 'en' ? "Compassion, cooperation, trust, and concern for social harmony" : "Compaixão, cooperação, confiança e preocupação com a harmonia social"}</li>
                    <li><strong>${t('big5_neuroticism')}:</strong> ${currentLang === 'en' ? "Anxiety, moodiness, emotional sensitivity, and vulnerability to stress" : "Ansiedade, instabilidade emocional, sensibilidade emocional e vulnerabilidade ao estresse"}</li>
                </ul>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="text-center space-x-4">
            <button id="restart-btn" data-html2canvas-ignore="true" class="px-8 py-3 bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-600 transition duration-300 shadow-lg">
                ${t('restart')}
            </button>
            <button id="export-btn" data-html2canvas-ignore="true" class="px-8 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition duration-300 shadow-lg">
                ${t('export_pdf')}
            </button>
        </div>
    `;
}

function generateDISCResultHTML(resultData, clang) {
    const profileKey = resultData.profileKey;
    const profileData = blendedDescriptions[profileKey];
    const profileName = profileData ? profileData.name[clang] : 'Unknown Profile';
    const description = profileData ? profileData.description[clang] : '';
    
    const factorScores = resultData.factors || [];
    const scores = resultData.scores || {};
    
    let scoresHTML = '';
    const factorOrder = ['D', 'I', 'S', 'C'];
    
    factorOrder.forEach(factor => {
        const score = scores[factor] || 0;
        const desc = discDescriptions[factor];
        const factorCount = 8; // Default, you might want to store this in resultData
        const maxScore = factorCount * 4;
        const percentage = Math.round((score / maxScore) * 100);
        
        scoresHTML += `
            <div class="p-6 rounded-xl border-2 ${desc.style} shadow-lg">
                <div class="flex items-center mb-4">
                    <span class="text-3xl mr-3">${desc.icon}</span>
                    <h3 class="text-xl font-bold">${desc.title[currentLang]}</h3>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div class="h-2.5 rounded-full bg-indigo-600" style="width: ${percentage}%"></div>
                </div>
                <p class="text-sm font-semibold mt-2">${score} / ${maxScore} ${t('points')} (${percentage}%)</p>
            </div>
        `;
    });

    return `
        <div class="text-center mb-10">
            <h1 class="text-4xl font-extrabold text-gray-800 mb-4">${t('disc_title')}</h1>
            <p class="text-gray-500">${currentLang === 'en' ? 'Your complete DISC personality assessment results' : 'Seus resultados completos da avaliação de personalidade DISC'}</p>
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
            <h3 class="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">${t('interpretation_title')}</h3>
            <div class="bg-white p-6 rounded-xl border-l-4 ${profileData.style} shadow-md">
                <h4 class="text-xl font-bold text-gray-800 mb-3 flex items-center">
                    <span class="text-2xl mr-3">${discDescriptions[profileKey.charAt(0)].icon}</span>
                    ${profileName} ${currentLang === 'en' ? 'Profile' : 'Perfil'}
                </h4>
                <p class="text-gray-600 leading-relaxed">${description}</p>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="text-center space-x-4">
            <button id="restart-btn" data-html2canvas-ignore="true" class="px-8 py-3 bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-600 transition duration-300 shadow-lg">
                ${t('restart')}
            </button>
            <button id="export-btn" data-html2canvas-ignore="true" class="px-8 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition duration-300 shadow-lg">
                ${t('export_pdf')}
            </button>
        </div>
    `;
}

function generateMBTIResultHTML(resultData) {
    const mbtiType = resultData.type;
    const typeData = mbtiTypeDescriptions[mbtiType];
    const typeName = typeData ? typeData.name[currentLang] : 'Unknown Type';
    const description = typeData ? typeData.description[currentLang] : '';
    const scores = resultData.scores || {};
    
    let dimensionsHTML = '';
    const dimensions = [
        { dim: 'E', opposite: 'I' },
        { dim: 'S', opposite: 'N' },
        { dim: 'T', opposite: 'F' },
        { dim: 'J', opposite: 'P' }
    ];

    dimensions.forEach(({ dim, opposite }) => {
        const dimData = mbtiDimensions[dim];
        const oppData = mbtiDimensions[opposite];
        const dimScore = scores[dim] || 0;
        const oppScore = scores[opposite] || 0;
        const totalQuestions = 7; // MBTI questions per dimension
        const dimPercentage = Math.round((dimScore / totalQuestions) * 100);
        const oppPercentage = Math.round((oppScore / totalQuestions) * 100);
        const isPreferred = dimScore >= oppScore;

        dimensionsHTML += `
            <div class="p-6 rounded-xl border-2 ${dimData.style} shadow-lg transition duration-300 ${isPreferred ? 'scale-[1.02] ring-4 ring-offset-2 ring-purple-500' : ''}">
                <div class="flex items-center mb-4">
                    <span class="text-3xl mr-3">${dimData.icon}</span>
                    <h3 class="text-xl font-bold">${dimData.title[currentLang]} vs ${oppData.title[currentLang]}</h3>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div class="h-2.5 rounded-full ${isPreferred ? 'bg-purple-600' : 'bg-gray-500'}" style="width: ${dimPercentage}%"></div>
                </div>
                <div class="flex justify-between text-sm font-semibold">
                    <span>${dimData.title[currentLang]} ${dimPercentage}%</span>
                    <span>${oppData.title[currentLang]} ${oppPercentage}%</span>
                </div>
                <p class="text-sm mt-2 text-gray-600">${dimData.description[currentLang]}</p>
            </div>
        `;
    });

    return `
        <div class="text-center mb-10">
            <h1 class="text-4xl font-extrabold text-gray-800 mb-4">${t('mbti_title')}</h1>
            <p class="text-gray-500">${currentLang === 'en' ? 'Your complete MBTI personality type results' : 'Seus resultados completos do tipo de personalidade MBTI'}</p>
        </div>

        <!-- Type Display -->
        <div class="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-8 text-white text-center mb-10 shadow-2xl">
            <div class="text-6xl font-bold mb-4">${mbtiType}</div>
            <h2 class="text-3xl font-bold mb-4">${typeName}</h2>
            <p class="text-purple-100 text-lg">${currentLang === 'en' ? 'Your Personality Type' : 'Seu Tipo de Personalidade'}</p>
        </div>

        <!-- Dimension Scores -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            ${dimensionsHTML}
        </div>

        <!-- Detailed Interpretation -->
        <div class="mb-10">
            <h3 class="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">${t('mbti_interpretation_title')}</h3>
            <div class="bg-white p-6 rounded-xl border-l-4 border-purple-500 shadow-md">
                <h4 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span class="text-3xl mr-3">${mbtiDimensions[mbtiType[0]].icon}</span>
                    ${mbtiType} - ${typeName}
                </h4>
                <p class="text-gray-600 leading-relaxed text-lg">${description}</p>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="text-center space-x-4">
            <button id="restart-btn" data-html2canvas-ignore="true" class="px-8 py-3 bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-600 transition duration-300 shadow-lg">
                ${t('restart')}
            </button>
            <button id="export-btn" data-html2canvas-ignore="true" class="px-8 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition duration-300 shadow-lg">
                ${t('export_pdf')}
            </button>
        </div>
    `;
}

function restartTestFromResult(testType) {
    const testPages = {
        DISC: 'disc.html',
        MBTI: 'mbti.html',
        BIG5: 'big5.html'
    };
    
    if (testPages[testType]) {
        window.location.href = testPages[testType];
    }
}

// Enhanced Initialization
async function init() {
    try {
        // Load language preference
        try {
            const savedLang = localStorage.getItem('personalityTest_language');
            if (savedLang && (savedLang === 'en' || savedLang === 'pt' || savedLang === 'es')) {
                currentLang = savedLang;
            }
        } catch (e) {
            console.warn('Could not load language preference');
        }

        // Set initial language
        document.documentElement.lang = currentLang;

        if (isIndexPage) {
            initIndexPage();
        } else if (!isResultPage) {
            await initTestPage();
        }
        
    } catch (error) {
        console.error('Error initializing application:', error);
        showError(t('error_general'));
    }
}

async function initTestPage() {
    try {
        testContainer = document.getElementById('test-container');
        resultsContainer = document.getElementById('results-container');
        questionTextElement = document.getElementById('question-text');
        progressTextElement = document.getElementById('progress-text');
        progressBarElement = document.getElementById('progress-bar-inner');
        ratingButtonsContainer = document.getElementById('rating-buttons');

        // Initialize accessibility manager
        accessibilityManager = new AccessibilityManager();

        // Show loading while fetching questions
        const loading = showLoading(t('loading'));

        // Fetch questions from database
        let testType = '';
        if (isDISCTest) testType = 'disc';
        else if (isMBTITest) testType = 'mbti';
        else if (isBig5Test) testType = 'big5';

        currentTestQuestions = await fetchQuestions(testType, currentLang);
        
        hideLoading();

        // Validate test data
        if (!validateTestData()) {
            console.warn(t('test_data_invalid'));
            showError(t('test_data_invalid'));
            return;
        }

        // Load progress if available
        const progress = loadProgress();
        if (progress) {
            currentQuestionIndex = progress.currentQuestionIndex;
            scores = progress.scores || scores;
            mbtiScores = progress.mbtiScores || mbtiScores;
            big5Scores = progress.big5Scores || big5Scores;
            userRatings = progress.userRatings || userRatings;
            currentLang = progress.currentLang || currentLang;
        }

        // Initialize static text
        updateStaticText();
        
        // Setup enhanced keyboard navigation
        setupEnhancedKeyboardNavigation();
        
        // Run unit tests in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            TestRunner.runScoringTests();
        }
        
        // Render initial question based on test type
        if (isMBTITest) {
            if (currentQuestionIndex < currentTestQuestions.length) {
                renderMBTIQuestion(currentLang);
            } else {
                showResults();
            }
        } else if (isBig5Test) {
            if (currentQuestionIndex < currentTestQuestions.length) {
                renderBig5Question();
            } else {
                showResults();
            }
        } else {
            if (currentQuestionIndex < currentTestQuestions.length) {
                renderQuestion(currentLang);
            } else {
                showResults();
            }
        }
        
        // Announce application ready
        setTimeout(() => {
            if (accessibilityManager) {
                accessibilityManager.announce('Personality test application loaded and ready. Use Tab key to navigate and arrow keys for selection.', 'polite');
            }
        }, 1000);
        
    } catch (error) {
        console.error('Error initializing test page:', error);
        showError(t('error_general'));
    }
}

function initIndexPage() {
    try {
        // Initialize accessibility manager
        accessibilityManager = new AccessibilityManager();

        // Initialize static text
        updateIndexStaticText();
        loadSavedResults();
        
        // Add event listener to clear button
        const clearBtn = document.getElementById('clear-results-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', clearAllResults);
            clearBtn.setAttribute('aria-label', tIndex('clearResults'));
        }

        // Setup enhanced keyboard navigation
        setupEnhancedKeyboardNavigation();
        
        // Announce application ready
        setTimeout(() => {
            if (accessibilityManager) {
                accessibilityManager.announce('Personality test hub loaded and ready. Choose a test to begin.', 'polite');
            }
        }, 1000);
        
    } catch (error) {
        console.error('Error initializing index page:', error);
        showError(t('error_general'));
    }
}

// Initialize the application when the window loads
window.onload = init;

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getProfileKey,
        calculateMBTIType,
        TestRunner,
        saveTestResult,
        fetchQuestions
    };
}

// ==========================================
// NEW: Event Listener Initialization
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    setupLanguageListeners();
    setupActionListeners();
    setupTestListeners();

    if (typeof isResultPage !== 'undefined' && isResultPage) {
        if (window.location.href.includes('disc')) loadStoredResult('DISC');
        else if (window.location.href.includes('mbti')) loadStoredResult('MBTI');
        else if (window.location.href.includes('big5')) loadStoredResult('BIG5');
    }
});

function setupLanguageListeners() {
    const langBtns = document.querySelectorAll('.lang-button');
    langBtns.forEach(btn => {
        const img = btn.querySelector('img');
        if (!img) return;
        
        // Identify language by alt text or order
        if (img.alt === 'English') {
            btn.addEventListener('click', () => setLanguage('en'));
        } else if (img.alt.includes('Português')) {
            btn.addEventListener('click', () => setLanguage('pt'));
        } else if (img.alt === 'Español') {
            btn.addEventListener('click', () => setLanguage('es'));
        }
    });
}

function setupActionListeners() {
    // Event Delegation for buttons (handles dynamic content)
    document.body.addEventListener('click', async (e) => {
        
        // Handle EXPORT Button
        const exportBtn = e.target.closest('#export-btn');
        if (exportBtn) {
            e.preventDefault();
            
            // 1. Determine Filename
            let filenameKey = 'filename';
            if (typeof isMBTITest !== 'undefined' && isMBTITest) filenameKey = 'mbti_filename';
            else if (typeof isBig5Test !== 'undefined' && isBig5Test) filenameKey = 'big5_filename';

            const filename = (typeof t === 'function' ? t(filenameKey) : 'Results') + '.pdf';
            const loadingText = typeof t === 'function' ? t('loading') : 'Generating PDF...';
            
            if (typeof showLoading === 'function') showLoading(loadingText);

            try {
                // 2. CRITICAL: Pass 'results-container' (not testType)
                await exportResultToPDF('results-container', filename);
            } catch (error) {
                console.error('PDF Export Error:', error);
                if (typeof showError === 'function') showError('Failed to generate PDF');
            } finally {
                if (typeof hideLoading === 'function') hideLoading();
            }
        }
        
        // Handle RESTART Button
        const restartBtn = e.target.closest('#restart-btn');
        if (restartBtn) {
            e.preventDefault();
            if (typeof restartTest === 'function') restartTest();
        }
    });
}

function setupTestListeners() {
    // Detect which test is running based on the page/config
    if (isDISCTest) {
        // DISC has buttons with IDs rating-1 to rating-4
        [1, 2, 3, 4].forEach(num => {
            const btn = document.getElementById(`rating-${num}`);
            if (btn) {
                btn.addEventListener('click', function() {
                    handleRating(num, this);
                });
            }
        });
    } 
    else if (isMBTITest) {
        // MBTI has buttons option-a and option-b
        const btnA = document.getElementById('option-a');
        const btnB = document.getElementById('option-b');
        
        if (btnA) {
            btnA.addEventListener('click', function() { 
                handleMBTIRating('A', this); 
            });
        }
        if (btnB) {
            btnB.addEventListener('click', function() { 
                handleMBTIRating('B', this); 
            });
        }
    } 
    else if (isBig5Test) {
        // Big5 has buttons rating-1 to rating-5
        [1, 2, 3, 4, 5].forEach(num => {
            const btn = document.getElementById(`rating-${num}`);
            if (btn) {
                btn.addEventListener('click', function() {
                    handleBig5Rating(num, this);
                });
            }
        });
    }
}