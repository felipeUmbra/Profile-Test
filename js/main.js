import { CONFIG, indexTranslations, discDescriptions, blendedDescriptions, 
    mbtiDimensions, big5Descriptions, mbtiTypeDescriptions, big5TraitDescriptions } from './data.js';
import { t, AccessibilityManager } from './utils.js';
import { fetchQuestions, saveProgress, saveResult } from './api.js';
import { calculateDISCScore, calculateMBTIType } from './scoring.js';

// --- Global State ---
const state = {
    testType: null, // 'disc', 'mbti', 'big5'
    currentQuestionIndex: 0,
    questions: [],
    answers: [], // Stores raw answers
    scores: {},  // Live score tracking
    sessionId:  crypto.randomUUID(),
    lang: localStorage.getItem('lang') || 'en',
    a11y: new AccessibilityManager()
};

// --- Initialization ---
async function init() {
    state.a11y.init();
    setupLanguageToggles();

    const path = window.location.pathname;

    // 1. Route: Result Pages
    if (path.includes('result.html')) {
        initResultPage();
        return;
    }

    // 2. Route: Test Pages
    if (path.includes('disc') || path.includes('mbti') || path.includes('big5')) {
        await initTestPage(path);
        return;
    }

    // 3. Route: Landing Page (Index)
    initIndexPage();
}

// --- Page Logic: Index ---
function initIndexPage() {
    try {
        // Fix: Use state.a11y instead of overwriting the class
        
        // Initialize static text
        if (typeof updateIndexStaticText === 'function') updateIndexStaticText();
        if (typeof loadSavedResults === 'function') loadSavedResults();
        
        // Add event listener to clear button
        const clearBtn = document.getElementById('clear-results-btn');
        if (clearBtn) {
            if (typeof clearAllResults === 'function') {
                clearBtn.addEventListener('click', clearAllResults);
            }
            const label = (typeof tIndex === 'function') ? tIndex('clearResults') : t('clearResults', state.lang);
            clearBtn.setAttribute('aria-label', label);
        }

        // Setup enhanced keyboard navigation
        if (typeof setupEnhancedKeyboardNavigation === 'function') {
            setupEnhancedKeyboardNavigation();
        }
        
        // Announce application ready
        setTimeout(() => {
            if (state.a11y) {
                state.a11y.announce('Personality test hub loaded and ready. Choose a test to begin.', 'polite');
            }
        }, 1000);
        
    } catch (error) {
        console.error('Error initializing index page:', error);
        if (typeof showError === 'function') showError(t('error_general', state.lang));
    }
}

// --- Page Logic: Test ---
async function initTestPage(path) {
    // Determine Test Type
    if (path.includes('disc')) state.testType = 'disc';
    else if (path.includes('mbti')) state.testType = 'mbti';
    else if (path.includes('big5')) state.testType = 'big5';

    updatePageTranslations();

    // Show Loading State
    const container = document.getElementById('question-container');
    if (container) container.innerHTML = `<div class="text-center p-8">${t('loading', state.lang)}...</div>`;

    // Fetch Data
    try {
        state.questions = await fetchQuestions(state.testType, state.lang);
        
        if (!state.questions || state.questions.length === 0) {
            throw new Error('No questions received');
        }

        // Initialize Scores
        if (state.testType === 'disc') state.scores = { D:0, I:0, S:0, C:0 };
        if (state.testType === 'mbti') state.scores = { E:0, I:0, S:0, N:0, T:0, F:0, J:0, P:0 };
        if (state.testType === 'big5') state.scores = { O:0, C:0, E:0, A:0, N:0 };

        // Start
        renderQuestion();
    } catch (error) {
        console.error('Failed to load test:', error);
        if (container) container.innerHTML = `<div class="text-red-500 text-center">Error loading questions. Please refresh.</div>`;
    }
}

// --- Core: Render Question ---
function renderQuestion() {
    const container = document.getElementById('question-container');
    const q = state.questions[state.currentQuestionIndex];
    const total = state.questions.length;

    if (!q) {
        finishTest();
        return;
    }

    // Update Progress Bar
    const progressPercent = ((state.currentQuestionIndex + 1) / total) * 100;
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) progressBar.style.width = `${progressPercent}%`;

    // Update Question Counter
    const counter = document.getElementById('question-counter');
    if (counter) counter.innerText = t('question_count', state.lang)
        .replace('{current}', state.currentQuestionIndex + 1)
        .replace('{total}', total);

    // Update Accessibility
    state.a11y.announce(`Question ${state.currentQuestionIndex + 1}: ${getQuestionText(q)}`);
    state.a11y.createLiveRegion(`Question ${state.currentQuestionIndex + 1} of ${total}`);

    // Render HTML based on Test Type
    if (state.testType === 'mbti') {
        renderMBTIQuestion(container, q);
    } else {
        renderLikertQuestion(container, q); // DISC & Big5
    }

    // Focus management for keyboard users
    setTimeout(() => {
        const firstInput = container.querySelector('input, button');
        if (firstInput) firstInput.focus();
    }, 100);
}

function getQuestionText(q) {
    if (q.text && typeof q.text === 'object') return q.text[state.lang] || q.text['en'];
    return q.text || '';
}

// --- Render Helpers ---

function renderLikertQuestion(container, q) {
    const text = getQuestionText(q);
    const options = [1, 2, 3, 4, 5]; 
    
    const labels = {
        1: t('strongly_disagree', state.lang),
        5: t('strongly_agree', state.lang)
    };

    container.innerHTML = `
        <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white">${text}</h2>
        <div class="grid grid-cols-5 gap-2 md:gap-4 mb-8" role="radiogroup" aria-labelledby="question-text">
            ${options.map(val => `
                <button onclick="window.handleRating(${val})" 
                    class="p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all focus:ring-2 focus:ring-blue-400 focus:outline-none flex flex-col items-center justify-center h-24"
                    aria-label="${labels[val] || val}"
                    aria-pressed="false">
                    <span class="text-xl font-bold text-gray-700">${val}</span>
                    ${val === 1 || val === 5 ? `<span class="text-xs text-gray-500 mt-1 text-center">${labels[val]}</span>` : ''}
                </button>
            `).join('')}
        </div>
        ${renderNavButtons()}
    `;
}

function renderMBTIQuestion(container, q) {
    // ✅ FIX: Handle nested Mongo structure (q.options.optionA) OR flat structure
    const optionsObj = q.options || q;
    const optionA = optionsObj.optionA;
    const optionB = optionsObj.optionB;

    // Safely access language with fallback
    const optA = optionA?.[state.lang] || optionA?.['en'] || "Option A";
    const optB = optionB?.[state.lang] || optionB?.['en'] || "Option B";

    container.innerHTML = `
        <h2 class="text-xl font-bold mb-6 text-gray-800 dark:text-white mb-8">${t('choose_option', state.lang)}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button onclick="window.handleMBTIOption('A')" class="p-6 text-left rounded-xl border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all h-full">
                <span class="font-semibold text-lg text-gray-800">${optA}</span>
            </button>
            <button onclick="window.handleMBTIOption('B')" class="p-6 text-left rounded-xl border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all h-full">
                <span class="font-semibold text-lg text-gray-800">${optB}</span>
            </button>
        </div>
        ${renderNavButtons()}
    `;
}

function renderNavButtons() {
    return `
        <div class="flex justify-between mt-8">
            <button onclick="window.prevQuestion()" 
                class="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                ${state.currentQuestionIndex === 0 ? 'disabled' : ''}>
                ${t('previous', state.lang)}
            </button>
            <div class="text-sm text-gray-400 self-center">
                ${state.testType.toUpperCase()} Test
            </div>
        </div>
    `;
}

// --- Interaction Handlers ---

window.handleRating = async (rating) => {
    const q = state.questions[state.currentQuestionIndex];
    
    state.answers[state.currentQuestionIndex] = { questionId: q.id, rating, factor: q.factor };
    
    if (state.testType === 'disc') {
        state.scores[q.factor] = (state.scores[q.factor] || 0) + rating;
    } else if (state.testType === 'big5') {
        const score = q.reverse ? (6 - rating) : rating;
        state.scores[q.factor] = (state.scores[q.factor] || 0) + score;
    }

    saveProgress(state.sessionId, CONFIG[state.testType.toUpperCase()].testId, state.currentQuestionIndex, state.answers);
    nextQuestion();
};

window.handleMBTIOption = async (optionChar) => {
    const q = state.questions[state.currentQuestionIndex];
    
    // ✅ FIX: Handle nested Mongo values (q.values.a) OR flat structure
    let valA, valB;
    if (q.values) {
        valA = q.values.a;
        valB = q.values.b;
    } else {
        valA = q.aValue;
        valB = q.bValue;
    }

    const value = optionChar === 'A' ? valA : valB;
    
    state.answers[state.currentQuestionIndex] = { questionId: q.id, selected: optionChar, value };
    state.scores[value] = (state.scores[value] || 0) + 1;

    saveProgress(state.sessionId, 2, state.currentQuestionIndex, state.answers);
    nextQuestion();
};

window.prevQuestion = () => {
    if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex--;
        renderQuestion();
    }
};

function nextQuestion() {
    state.currentQuestionIndex++;
    renderQuestion();
}

window.setLanguage = (lang) => {
    state.lang = lang;
    localStorage.setItem('lang', lang);
    updatePageTranslations();
    
    if (state.questions.length > 0) {
        renderQuestion();
    }
};

// --- completion & Results ---

async function finishTest() {
    const container = document.getElementById('question-container');
    container.innerHTML = `<div class="text-center text-xl animate-pulse">${t('analyzing', state.lang)}...</div>`;

    let profileKey;
    
    if (state.testType === 'disc') {
        profileKey = calculateDISCScore(state.scores);
    } else if (state.testType === 'mbti') {
        profileKey = calculateMBTIType(state.scores);
    } else if (state.testType === 'big5') {
        profileKey = 'completed';
    }

    await saveResult(state.sessionId, CONFIG[state.testType.toUpperCase()].testId, state.scores, profileKey);

    const resultPage = `${state.testType}-result.html`;
    let queryParams = `?s=${state.sessionId}`;
    
    if (state.testType === 'disc') queryParams += `&type=${profileKey}`;
    if (state.testType === 'mbti') queryParams += `&type=${profileKey}`;
    if (state.testType === 'big5') {
        queryParams += `&o=${state.scores.O}&c=${state.scores.C}&e=${state.scores.E}&a=${state.scores.A}&n=${state.scores.N}`;
    }

    window.location.href = resultPage + queryParams;
}

// --- Page Logic: Result Page ---

async function initResultPage() {
    updatePageTranslations();
    
    const params = new URLSearchParams(window.location.search);
    const container = document.getElementById('results-content');
    
    if (!container) return;

    if (window.location.pathname.includes('disc')) {
        const type = params.get('type');
        const storedResult = JSON.parse(localStorage.getItem(CONFIG.DISC.resultKeys?.DISC || 'personalityTest_disc_result')) || {};
        const scores = storedResult.scores || { D:0, I:0, S:0, C:0 };

        if (type) {
            renderDISCResults(container, type, scores);
        }
    }

    if (window.location.pathname.includes('mbti')) {
        const type = params.get('type');
        const storedResult = JSON.parse(localStorage.getItem(CONFIG.MBTI.resultKeys?.MBTI || 'personalityTest_mbti_result')) || {};
        const scores = storedResult.scores || { E:0, I:0, S:0, N:0, T:0, F:0, J:0, P:0 };

        if (type) {
            renderMBTIResults(container, type, scores);
        }
    }

    if (window.location.pathname.includes('big5')) {
        const scores = {
            O: parseInt(params.get('o')) || 0,
            C: parseInt(params.get('c')) || 0,
            E: parseInt(params.get('e')) || 0,
            A: parseInt(params.get('a')) || 0,
            N: parseInt(params.get('n')) || 0
        };
        
        renderBig5Results(container, scores);
    }

    if (typeof Chart !== 'undefined') {
        renderCharts(params);
    }
}

// --- Render Helpers ---

function renderDISCResults(container, profileKey, scores) {
    const profileData = blendedDescriptions[profileKey];
    if (!profileData) return;

    // ... (Keep the sorting/highlighting logic from the previous step) ...
    const factorScores = Object.entries(scores).map(([factor, score]) => ({ factor, score }));
    factorScores.sort((a, b) => b.score - a.score);
    const primaryFactors = factorScores.slice(0, 2).map(f => f.factor);

    const factors = ['D', 'I', 'S', 'C'];
    const maxScore = 30;
    
    const scoresHTML = factors.map(factor => {
        const score = scores[factor] || 0;
        const percent = Math.min(100, Math.round((score / maxScore) * 100));
        const desc = discDescriptions[factor];
        const isPrimary = primaryFactors.includes(factor);
        
        const highlightClasses = isPrimary 
            ? 'scale-[1.02] ring-4 ring-offset-2 ring-indigo-500' 
            : 'opacity-90 hover:opacity-100';

        return `
            <div class="p-4 bg-white rounded-lg shadow-sm border border-gray-100 transition-all duration-300 ${highlightClasses}">
                <div class="flex items-center mb-2">
                    <span class="text-2xl mr-2" aria-hidden="true">${desc.icon}</span>
                    <span class="font-bold text-gray-700">${desc.title[state.lang]}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5" role="progressbar" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100">
                    <div class="h-2.5 rounded-full ${desc.style.split(' ')[0].replace('bg-', 'bg-')}" style="width: ${percent}%"></div>
                </div>
                <div class="text-right text-xs text-gray-500 mt-1">${score} pts</div>
            </div>
        `;
    }).join('');

    // ✅ HERO BANNER RESTORED BELOW
    container.innerHTML = `
        <div class="text-center mb-10">
            <h1 class="text-4xl font-extrabold text-gray-800 mb-4">${t('main_result_title', state.lang)}</h1>
            <p class="text-gray-500">${t('result_subtitle', state.lang)}</p>
        </div>

        <div class="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white text-center mb-10 shadow-2xl transform transition hover:scale-[1.01]">
            <div class="text-6xl font-bold mb-4 tracking-wider">${profileKey}</div>
            <h2 class="text-3xl font-bold mb-4">${profileData.name[state.lang]}</h2>
            <p class="text-indigo-100 text-lg max-w-2xl mx-auto">${profileData.description[state.lang]}</p>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-lg border-l-4 ${profileData.style.split(' ')[1]} mb-8">
            <h3 class="text-xl font-bold mb-4">${t('interpretation_title', state.lang)}</h3>
            <p class="text-gray-600 leading-relaxed text-lg">
                ${profileData.description[state.lang]}
            </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            ${scoresHTML}
        </div>

        <div class="flex justify-center gap-4">
             <button onclick="window.location.href='index.html'" class="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition shadow-lg">
                ${t('back_to_home', state.lang)}
            </button>
            <button onclick="window.exportResultToPDF('DISC')" class="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition shadow-lg">
                ${t('export_pdf', state.lang)}
            </button>
        </div>
    `;
}

function renderMBTIResults(container, type, scores) {
    // Fix: Use type descriptions for the full profile, not dimensions
    const typeData = mbtiTypeDescriptions[type];
    if (!typeData) return;

    // ... (Keep the dimension calculation logic from the previous step) ...
    const pairs = [['E', 'I'], ['S', 'N'], ['T', 'F'], ['J', 'P']];
    
    const dimensionsHTML = pairs.map(([a, b]) => {
        const scoreA = scores[a] || 0;
        const scoreB = scores[b] || 0;
        const total = scoreA + scoreB || 1; 
        const percentA = Math.round((scoreA / total) * 100);
        const percentB = 100 - percentA;
        
        const dimA = mbtiDimensions[a];
        const dimB = mbtiDimensions[b];
        
        const isA = scoreA >= scoreB;
        const winnerData = isA ? dimA : dimB;
        const winnerPercent = isA ? percentA : percentB;

        return `
            <div class="p-6 rounded-xl border-2 ${winnerData.style} shadow-lg transition duration-300 scale-[1.02] ring-4 ring-offset-2 ring-purple-500">
                <div class="flex items-center mb-4">
                    <span class="text-3xl mr-3" aria-hidden="true">${winnerData.icon}</span>
                    <h3 class="text-xl font-bold">${dimA.title[state.lang]} vs ${dimB.title[state.lang]}</h3>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5 mb-2" role="progressbar" aria-valuenow="${winnerPercent}" aria-valuemin="0" aria-valuemax="100">
                    <div class="h-2.5 rounded-full ${isA ? 'bg-purple-600' : 'bg-gray-500'}" style="width: ${percentA}%"></div>
                </div>
                <div class="flex justify-between text-sm font-semibold">
                    <span class="${isA ? 'text-purple-700 font-bold' : 'text-gray-500'}">${dimA.title[state.lang]} ${percentA}%</span>
                    <span class="${!isA ? 'text-purple-700 font-bold' : 'text-gray-500'}">${dimB.title[state.lang]} ${percentB}%</span>
                </div>
                <p class="text-sm mt-2 text-gray-600">${winnerData.description[state.lang]}</p>
            </div>
        `;
    }).join('');

    // ✅ HERO BANNER RESTORED BELOW
    container.innerHTML = `
        <div class="text-center mb-10">
            <h1 class="text-4xl font-extrabold text-gray-800 mb-4">${t('mbti_title', state.lang)}</h1>
            <p class="text-gray-500">${t('mbti_result_subtitle', state.lang)}</p>
        </div>

        <div class="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-8 text-white text-center mb-10 shadow-2xl transform transition hover:scale-[1.01]">
            <div class="text-6xl font-bold mb-4 tracking-wider">${type}</div>
            <h2 class="text-3xl font-bold mb-4">${typeData.name[state.lang]}</h2>
            <p class="text-purple-100 text-lg">${state.lang === 'en' ? 'Your Personality Type' : (state.lang === 'pt' ? 'Seu Tipo de Personalidade' : 'Tu Tipo de Personalidad')}</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2">
                <div class="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
                    <h3 class="text-xl font-bold mb-4 text-gray-800">${t('mbti_interpretation_title', state.lang)}</h3>
                    <p class="text-gray-600 leading-relaxed text-lg">
                        ${typeData.description[state.lang]}
                    </p>
                </div>
            </div>
            
            <div class="bg-gray-50 p-6 rounded-2xl space-y-6">
                <h3 class="text-lg font-bold mb-4 text-gray-700">Dimensions</h3>
                ${dimensionsHTML}
            </div>
        </div>
        
        <div class="flex justify-center mt-8 gap-4">
             <button onclick="window.location.href='index.html'" class="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition shadow-lg">
                ${t('back_to_home', state.lang)}
            </button>
            <button onclick="window.exportResultToPDF('MBTI')" class="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition shadow-lg">
                ${t('export_pdf', state.lang)}
            </button>
        </div>
    `;
}

function renderBig5Results(container, scores) {
    const factors = ['O', 'C', 'E', 'A', 'N'];
    const maxScore = 40; 

    const cardsHTML = factors.map(factor => {
        const score = scores[factor] || 0;
        const percent = Math.round((score / maxScore) * 100);
        // Use big5Descriptions for style info, big5Descriptions for text
        const descStyle = big5Descriptions[factor];
        const descText = big5Descriptions[factor];
        
    let levelKey = percent > 66 ? 'high' : (percent > 33 ? 'moderate' : 'low');
            // Use the detailed description from big5TraitDescriptions
            const detailedDesc = big5TraitDescriptions[factor]?.[levelKey]?.[state.lang] || '';

            return `
                <div class="p-6 rounded-xl border-2 ${descStyle.style} shadow-lg transition duration-300">
                    <div class="flex justify-between items-start mb-4">
                        <div class="flex items-center">
                            <span class="text-3xl mr-3" aria-hidden="true">${descStyle.icon}</span>
                            <h3 class="font-bold text-lg">${descStyle.title[state.lang]}</h3>
                        </div>
                        <div class="text-2xl font-bold text-gray-700">${percent}%</div>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div class="h-2 rounded-full ${descStyle.style.split(' ')[0].replace('bg-', 'bg-')}" style="width: ${percent}%"></div>
                    </div>
                    <p class="text-sm text-gray-600">${descStyle.description[state.lang]}</p>
                    <div class="mt-3 text-sm font-semibold ${percent > 66 ? 'text-green-600' : percent > 33 ? 'text-yellow-600' : 'text-blue-600'}">
                        ${detailedDesc}
                    </div>
                </div>
            `;
    }).join('');

    container.innerHTML = `
        <div class="text-center mb-10">
            <h1 class="text-3xl font-bold text-gray-800">${t('big5_main_result_title', state.lang)}</h1>
            <p class="text-gray-500">${t('big5_result_subtitle', state.lang)}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            ${cardsHTML}
        </div>

        <div class="flex justify-center gap-4">
             <button onclick="window.location.href='index.html'" class="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition">
                ${t('back_to_home', state.lang)}
            </button>
            <button onclick="window.exportResultToPDF('BIG5')" class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                ${t('export_pdf', state.lang)}
            </button>
        </div>
    `;
}

function renderCharts(params) {
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded. Skipping chart render.');
        return;
    }

    const canvas = document.getElementById('resultsChart');
    if (!canvas) {
        console.warn('No canvas element with id "resultsChart" found.');
        return;
    }

    if (window.myResultsChart) {
        window.myResultsChart.destroy();
    }

    let testType = '';
    let labels = [];
    let dataPoints = [];
    let backgroundColors = [];
    let borderColors = [];
    let chartType = 'bar';
    let options = {};

    const getLabel = (key, defaultText) => {
        return defaultText; 
    };

    if (window.location.pathname.includes('disc')) {
        testType = 'DISC';
        
        const stored = JSON.parse(localStorage.getItem(CONFIG.DISC.resultKeys?.DISC || 'personalityTest_disc_result')) || {};
        const scores = stored.scores || { D:0, I:0, S:0, C:0 };

        labels = [
            discDescriptions.D.title[state.lang], 
            discDescriptions.I.title[state.lang], 
            discDescriptions.S.title[state.lang], 
            discDescriptions.C.title[state.lang]
        ];
        dataPoints = [scores.D, scores.I, scores.S, scores.C];
        
        backgroundColors = [
            'rgba(239, 68, 68, 0.6)',
            'rgba(234, 179, 8, 0.6)',
            'rgba(34, 197, 94, 0.6)',
            'rgba(59, 130, 246, 0.6)'
        ];
        borderColors = [
            'rgba(239, 68, 68, 1)',
            'rgba(234, 179, 8, 1)',
            'rgba(34, 197, 94, 1)',
            'rgba(59, 130, 246, 1)'
        ];

        chartType = 'bar';
        options = {
            indexAxis: 'y',
            scales: {
                x: { beginAtZero: true, max: 40 }
            },
            plugins: {
                legend: { display: false }
            }
        };
    } 
    
    else if (window.location.pathname.includes('mbti')) {
        testType = 'MBTI';
        
        const stored = JSON.parse(localStorage.getItem(CONFIG.MBTI.resultKeys?.MBTI || 'personalityTest_mbti_result')) || {};
        const scores = stored.scores || { E:0, I:0, S:0, N:0, T:0, F:0, J:0, P:0 };

        labels = [
            mbtiDimensions.E.title[state.lang], mbtiDimensions.I.title[state.lang],
            mbtiDimensions.S.title[state.lang], mbtiDimensions.N.title[state.lang],
            mbtiDimensions.T.title[state.lang], mbtiDimensions.F.title[state.lang],
            mbtiDimensions.J.title[state.lang], mbtiDimensions.P.title[state.lang]
        ];
        
        dataPoints = [
            scores.E, scores.I, 
            scores.S, scores.N, 
            scores.T, scores.F, 
            scores.J, scores.P
        ];

        backgroundColors = 'rgba(147, 51, 234, 0.2)';
        borderColors = 'rgba(147, 51, 234, 1)';
        
        chartType = 'radar';
        options = {
            scales: {
                r: {
                    beginAtZero: true,
                    suggestedMax: 10,
                    angleLines: { color: 'rgba(0,0,0,0.1)' },
                    grid: { color: 'rgba(0,0,0,0.05)' }
                }
            },
            plugins: {
                legend: { display: false }
            }
        };
    } 
    
    else if (window.location.pathname.includes('big5')) {
        testType = 'BIG5';
        
        let scores = {};
        if (params.has('o')) {
            scores = {
                O: parseInt(params.get('o')) || 0,
                C: parseInt(params.get('c')) || 0,
                E: parseInt(params.get('e')) || 0,
                A: parseInt(params.get('a')) || 0,
                N: parseInt(params.get('n')) || 0
            };
        } else {
            const stored = JSON.parse(localStorage.getItem(CONFIG.BIG5.resultKeys?.BIG5 || 'personalityTest_big5_result')) || {};
            scores = stored.scores || { O:0, C:0, E:0, A:0, N:0 };
        }

        labels = [
            big5Descriptions.O.title[state.lang],
            big5Descriptions.C.title[state.lang],
            big5Descriptions.E.title[state.lang],
            big5Descriptions.A.title[state.lang],
            big5Descriptions.N.title[state.lang]
        ];

        dataPoints = [scores.O, scores.C, scores.E, scores.A, scores.N];

        backgroundColors = 'rgba(79, 70, 229, 0.2)';
        borderColors = 'rgba(79, 70, 229, 1)';
        
        chartType = 'radar';
        options = {
            scales: {
                r: {
                    beginAtZero: true,
                    max: 40,
                    angleLines: { color: 'rgba(0,0,0,0.1)' },
                    grid: { color: 'rgba(0,0,0,0.05)' },
                    pointLabels: {
                        font: { size: 12, weight: 'bold' }
                    }
                }
            },
            plugins: {
                legend: { display: false }
            }
        };
    }

    if (!testType) return;

    window.myResultsChart = new Chart(canvas, {
        type: chartType,
        data: {
            labels: labels,
            datasets: [{
                label: t('points', state.lang) || 'Points',
                data: dataPoints,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 2,
                pointBackgroundColor: borderColors,
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            ...options
        }
    });
}

function updatePageTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.innerText = t(key, state.lang);
    });
}

function setupLanguageToggles() {
    const btns = document.querySelectorAll('.lang-btn');
    btns.forEach(btn => {
        btn.onclick = () => window.setLanguage(btn.getAttribute('data-lang'));
    });
}

window.addEventListener('DOMContentLoaded', init);

// ==========================================
// === MISSING LOGIC (Migrated from script.js) ===
// ==========================================

// --- Index Page Helpers ---

window.updateIndexStaticText = function() {
    if (!indexTranslations) return;
    
    // Helper for index-specific translations
    const tIndex = (key) => indexTranslations[state.lang]?.[key] || indexTranslations['en']?.[key] || key;

    try {
        const setTxt = (id, key) => {
            const el = document.getElementById(id);
            if (el) el.textContent = tIndex(key);
        };

        setTxt('main-title', 'mainTitle');
        setTxt('subtitle', 'subtitle');
        
        setTxt('disc-test', 'discTest');
        setTxt('disc-subtitle', 'discSubtitle');
        setTxt('mbti-test', 'mbtiTest');
        setTxt('mbti-subtitle', 'mbtiSubtitle');
        setTxt('big5-test', 'big5Test');
        setTxt('big5-subtitle', 'big5Subtitle');
        
        setTxt('results-title', 'resultsTitle');
        setTxt('clear-results-btn', 'clearResults');
        setTxt('footer-text-1', 'footerText1');
        setTxt('footer-text-2', 'footerText2');
    } catch (error) {
        console.error('Error updating index text:', error);
    }
}

window.loadSavedResults = function() {
    const container = document.getElementById('saved-results');
    const section = document.getElementById('saved-results-section');
    
    if (!container || !section) return;

    let html = '';
    let count = 0;

    ['DISC', 'MBTI', 'BIG5'].forEach(type => {
        const key = CONFIG[type].resultKeys?.[type] || `personalityTest_${type.toLowerCase()}_result`;
        const stored = localStorage.getItem(key);
        if (stored) {
            try {
                const result = JSON.parse(stored);
                html += createResultCard(type, result);
                count++;
            } catch (e) { console.error(e); }
        }
    });

    if (count > 0) {
        container.innerHTML = html;
        section.classList.remove('hidden');
    } else {
        section.classList.add('hidden');
    }
}

function createResultCard(testType, result) {
    const colors = { DISC: 'indigo', MBTI: 'purple', BIG5: 'green' };
    const color = colors[testType];
    const date = new Date(result.timestamp || Date.now()).toLocaleDateString();
    
    let title = '', subtitle = '', scoreDisplay = '';

    if (testType === 'DISC') {
        const key = result.profileKey;
        title = blendedDescriptions[key]?.name[state.lang] || key;
        subtitle = blendedDescriptions[key]?.description[state.lang]?.substring(0, 100) + '...';
        scoreDisplay = key;
    } 
    else if (testType === 'MBTI') {
        const key = result.profileKey || result.type;
        title = mbtiDimensions[key]?.name[state.lang] || key;
        subtitle = mbtiDimensions[key]?.description[state.lang]?.substring(0, 100) + '...';
        scoreDisplay = key;
    }
    else if (testType === 'BIG5') {
        title = t('big5_main_result_title', state.lang);
        subtitle = t('big5_result_subtitle', state.lang);
        scoreDisplay = 'View';
    }

    return `
        <div onclick="window.viewResult('${testType.toLowerCase()}')" 
             class="cursor-pointer p-4 rounded-xl border-2 border-${color}-200 bg-${color}-50 hover:bg-${color}-100 transition duration-300 relative group">
            
            <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-semibold text-${color}-600">${testType}</span>
                <button onclick="event.stopPropagation(); window.deleteResult('${testType}')" 
                        class="text-gray-400 hover:text-red-500 p-1">
                    🗑️
                </button>
            </div>
            
            <div class="flex items-center justify-between">
                <div>
                    <h3 class="font-bold text-lg text-${color}-700">${title}</h3>
                    <p class="text-gray-600 text-sm max-w-md">${subtitle}</p>
                </div>
                <div class="text-right">
                    <div class="text-2xl font-bold text-${color}-600">${scoreDisplay}</div>
                    <div class="text-xs text-gray-500">${date}</div>
                </div>
            </div>
        </div>
    `;
}

// --- Actions ---

window.viewResult = function(type) {
    const result = localStorage.getItem(CONFIG[type.toUpperCase()].resultKeys[type.toUpperCase()]);
    if (!result) return;
    
    const data = JSON.parse(result);
    // Redirect based on type
    if (type === 'disc') window.location.href = `disc-result.html?s=${data.sessionId || 'saved'}&type=${data.profileKey}`;
    if (type === 'mbti') window.location.href = `mbti-result.html?s=${data.sessionId || 'saved'}&type=${data.profileKey || data.type}`;
    if (type === 'big5') window.location.href = `big5-result.html?s=${data.sessionId || 'saved'}&o=${data.scores.O}&c=${data.scores.C}&e=${data.scores.E}&a=${data.scores.A}&n=${data.scores.N}`;
}

// --- PDF Export Logic ---

window.exportResultToPDF = function(testType) {
    // 1. Determine the container to export
    // Note: main.js uses 'results-content' as the ID for all result pages
    const element = document.getElementById('results-content');
    
    if (!element) {
        alert('Could not find result content to export.');
        return;
    }

    // 2. Show a temporary loading state (using simple alert/text for now)
    const originalBtnText = event.target.innerText;
    event.target.innerText = 'Generating...';
    event.target.disabled = true;

    // 3. Define filename based on test type and language
    const langKey = state.lang.toUpperCase(); 
    const filename = `${testType}_Results_${langKey}.pdf`;

    // 4. PDF Options
    const options = {
        margin: 10,
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2, // Higher scale for better quality
            logging: false, 
            useCORS: true,
            windowWidth: element.scrollWidth
        }, 
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // 5. Generate PDF
    // Check if html2pdf is loaded
    if (typeof html2pdf === 'undefined') {
        alert('PDF library not loaded. Please refresh the page.');
        event.target.innerText = originalBtnText;
        event.target.disabled = false;
        return;
    }

    html2pdf().set(options).from(element).save().then(() => {
        // Reset button state
        event.target.innerText = originalBtnText;
        event.target.disabled = false;
    }).catch(err => {
        console.error('PDF Export Error:', err);
        alert('Failed to generate PDF. Please try again.');
        event.target.innerText = originalBtnText;
        event.target.disabled = false;
    });
};

window.deleteResult = function(type) {
    const typeUpper = type.toUpperCase();
    if (confirm(t('confirmDelete', state.lang) || "Delete this result?")) {
        localStorage.removeItem(CONFIG[typeUpper].resultKeys[typeUpper]);
        
        // Show success message
        window.showSuccessMessage(
            state.lang === 'en' ? 'Result deleted successfully!' : 
            state.lang === 'pt' ? 'Resultado excluído com sucesso!' : 
            '¡Resultado eliminado con éxito!'
        );
        
        window.loadSavedResults();
    }
};

window.clearAllResults = function() {
    if (confirm(t('confirmClearAll', state.lang) || "Clear all results?")) {
        ['DISC', 'MBTI', 'BIG5'].forEach(type => {
             localStorage.removeItem(CONFIG[type].resultKeys[type]);
        });
        
        // Show success message
        window.showSuccessMessage(
            state.lang === 'en' ? 'All results cleared successfully!' : 
            state.lang === 'pt' ? 'Todos os resultados foram limpos com sucesso!' : 
            '¡Todos los resultados fueron borrados con éxito!'
        );
        
        window.loadSavedResults();
    }
};

window.showError = function(message = t('error_general', state.lang), duration = 5000) {
    let errorContainer = document.getElementById('error-container');
    if (!errorContainer) {
        errorContainer = document.createElement('div');
        errorContainer.id = 'error-container';
        errorContainer.className = 'fixed top-4 right-4 z-50 max-w-sm';
        errorContainer.setAttribute('role', 'alert');
        errorContainer.setAttribute('aria-live', 'assertive');
        document.body.appendChild(errorContainer);
    }

    const errorElement = document.createElement('div');
    errorElement.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg mb-2 flex items-center animate-fade-in';
    errorElement.innerHTML = `
        <span class="text-red-500 mr-2 text-xl" aria-hidden="true">⚠</span>
        <span class="flex-grow">${message}</span>
        <button onclick="this.parentElement.remove()" 
                class="ml-4 text-red-500 hover:text-red-700 focus:outline-none font-bold"
                aria-label="Close error message">
            ×
        </button>
    `;

    errorContainer.appendChild(errorElement);
    
    if (state.a11y) {
        state.a11y.announce(`Error: ${message}`, 'assertive');
    }

    setTimeout(() => {
        if (errorElement.parentNode) {
            errorElement.parentNode.removeChild(errorElement);
        }
    }, duration);
};

window.showSuccessMessage = function(message, duration = 3000) {
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
    successElement.className = 'bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg mb-2 flex items-center animate-fade-in';
    successElement.innerHTML = `
        <span class="text-green-500 mr-2 text-xl" aria-hidden="true">✓</span>
        <span class="flex-grow">${message}</span>
        <button onclick="this.parentElement.remove()" 
                class="ml-4 text-green-500 hover:text-green-700 focus:outline-none font-bold"
                aria-label="Close success message">
            ×
        </button>
    `;

    successContainer.appendChild(successElement);
    
    if (state.a11y) {
        state.a11y.announce(`Success: ${message}`, 'polite');
    }

    setTimeout(() => {
        if (successElement.parentNode) {
            successElement.parentNode.removeChild(successElement);
        }
    }, duration);
};

window.setupEnhancedKeyboardNavigation = function() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') document.body.classList.add('keyboard-navigation');
        if (e.key === 'Escape') {
             const main = document.querySelector('main') || document.body;
             main.focus();
        }
    });
    document.addEventListener('mousedown', () => document.body.classList.remove('keyboard-navigation'));
};