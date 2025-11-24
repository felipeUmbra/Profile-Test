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

// --- Virtual Scrolling Implementation ---
class VirtualScroller {
    constructor(container, items, itemHeight, renderItem) {
        this.container = container;
        this.items = items;
        this.itemHeight = itemHeight;
        this.renderItem = renderItem;
        this.visibleItems = [];
        this.scrollTop = 0;
        this.visibleCount = 0;
        
        this.init();
    }

    init() {
        // Set container height for proper scrolling
        this.container.style.height = `${this.items.length * this.itemHeight}px`;
        this.container.style.position = 'relative';
        this.container.style.overflow = 'auto';
        
        // Create viewport element
        this.viewport = document.createElement('div');
        this.viewport.style.position = 'relative';
        this.viewport.style.height = '100%';
        this.container.appendChild(this.viewport);
        
        // Calculate visible count
        this.visibleCount = Math.ceil(this.container.clientHeight / this.itemHeight) + 2;
        
        // Add scroll listener with debouncing
        this.container.addEventListener('scroll', this.debounce(this.handleScroll.bind(this), 10));
        
        // Initial render
        this.render();
        
        // Add ARIA attributes
        this.container.setAttribute('role', 'region');
        this.container.setAttribute('aria-label', 'Scrollable content');
        this.container.setAttribute('aria-busy', 'false');
    }

    debounce(func, wait) {
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

    handleScroll() {
        this.scrollTop = this.container.scrollTop;
        this.render();
    }

    render() {
        const startIndex = Math.floor(this.scrollTop / this.itemHeight);
        const endIndex = Math.min(startIndex + this.visibleCount, this.items.length);
        
        // Clear existing items
        while (this.viewport.firstChild) {
            this.viewport.removeChild(this.viewport.firstChild);
        }
        
        // Render visible items
        for (let i = startIndex; i < endIndex; i++) {
            const item = this.items[i];
            const element = this.renderItem(item, i);
            element.style.position = 'absolute';
            element.style.top = `${i * this.itemHeight}px`;
            element.style.width = '100%';
            element.style.height = `${this.itemHeight}px`;
            element.setAttribute('data-index', i);
            this.viewport.appendChild(element);
        }
        
        // Update ARIA attributes for accessibility
        this.container.setAttribute('aria-setsize', this.items.length);
        this.container.setAttribute('aria-posinset', startIndex + 1);
    }

    destroy() {
        this.container.removeEventListener('scroll', this.handleScroll);
        this.container.innerHTML = '';
    }
}

// --- Enhanced Accessibility Manager ---
class AccessibilityManager {
    constructor() {
        this.liveRegions = new Map();
        this.currentFocus = null;
        this.init();
    }

    init() {
        // Create live regions for different priority levels
        this.createLiveRegion('assertive', 'assertive');
        this.createLiveRegion('polite', 'polite');
        
        // Add screen reader styles
        this.addScreenReaderStyles();
        
        // Enhance existing elements
        this.enhanceExistingElements();
        
        // Setup focus tracking
        this.setupFocusManagement();
    }

    createLiveRegion(id, politeness) {
        const region = document.createElement('div');
        region.id = `live-region-${id}`;
        region.setAttribute('aria-live', politeness);
        region.setAttribute('aria-atomic', 'true');
        region.className = 'sr-only';
        document.body.appendChild(region);
        this.liveRegions.set(id, region);
    }

    announce(message, politeness = 'polite') {
        const region = this.liveRegions.get(politeness);
        if (region) {
            // Clear previous message
            region.textContent = '';
            // Use setTimeout to ensure the DOM updates
            setTimeout(() => {
                region.textContent = message;
                console.log(`Screen Reader: ${message}`); // For debugging
            }, 100);
        }
    }

    addScreenReaderStyles() {
        if (!document.getElementById('sr-styles')) {
            const style = document.createElement('style');
            style.id = 'sr-styles';
            style.textContent = `
                .sr-only {
                    position: absolute;
                    width: 1px;
                    height: 1px;
                    padding: 0;
                    margin: -1px;
                    overflow: hidden;
                    clip: rect(0, 0, 0, 0);
                    white-space: nowrap;
                    border: 0;
                }
                
                .focus-visible {
                    outline: 3px solid #4f46e5;
                    outline-offset: 2px;
                    border-radius: 8px;
                }
                
                .keyboard-navigation *:focus {
                    outline: 3px solid #4f46e5;
                    outline-offset: 2px;
                }
                
                @media (prefers-reduced-motion: reduce) {
                    * {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    enhanceExistingElements() {
        // Enhance progress bars
        this.enhanceProgressBars();
        
        // Enhance rating buttons
        this.enhanceRatingButtons();
        
        // Enhance navigation
        this.enhanceNavigation();
    }

    enhanceProgressBars() {
        const progressBars = document.querySelectorAll('[id*="progress"]');
        progressBars.forEach(bar => {
            if (!bar.getAttribute('role')) {
                bar.setAttribute('role', 'progressbar');
                bar.setAttribute('aria-valuemin', '0');
                bar.setAttribute('aria-valuemax', '100');
                bar.setAttribute('aria-valuenow', '0');
            }
        });
    }

    enhanceRatingButtons() {
        const ratingButtons = document.querySelectorAll('.rating-button');
        ratingButtons.forEach((button, index) => {
            if (!button.getAttribute('aria-label')) {
                const label = button.textContent.trim();
                button.setAttribute('aria-label', label);
            }
            button.setAttribute('tabindex', '0');
            button.setAttribute('role', 'button');
            
            // Add focus management
            button.addEventListener('focus', () => {
                this.currentFocus = button;
                button.classList.add('focus-visible');
            });
            
            button.addEventListener('blur', () => {
                button.classList.remove('focus-visible');
            });
        });
    }

    enhanceNavigation() {
        const backButton = document.querySelector('a[href="index.html"]');
        if (backButton) {
            backButton.setAttribute('aria-label', 'Back to home page');
            backButton.setAttribute('tabindex', '0');
        }

        const languageButtons = document.querySelectorAll('.lang-button');
        languageButtons.forEach((button, index) => {
            button.setAttribute('aria-label', button.querySelector('img').alt);
            button.setAttribute('tabindex', '0');
        });
    }

    setupFocusManagement() {
        // Track keyboard vs mouse navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        // Skip to main content functionality
        this.addSkipToContentLink();
    }

    addSkipToContentLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:bg-white focus:p-4 focus:z-50';
        skipLink.textContent = 'Skip to main content';
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Add main content ID to the main container
        const mainContainer = document.querySelector('.max-w-\\[80vw\\]') || document.querySelector('.container');
        if (mainContainer) {
            mainContainer.id = 'main-content';
            mainContainer.setAttribute('role', 'main');
            mainContainer.setAttribute('tabindex', '-1');
        }
    }

    updateProgressBar(percentage) {
        const progressBar = document.getElementById('progress-bar-inner');
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
            progressBar.setAttribute('aria-valuenow', percentage);
            
            const progressText = document.getElementById('progress-text');
            if (progressText) {
                const text = progressText.textContent;
                this.announce(`Progress: ${percentage}%. ${text}`);
            }
        }
    }

    enhanceDynamicContent(container) {
        if (!container) return;

        // Enhance result cards
        const resultCards = container.querySelectorAll('[id*="result"], .score-card, .p-6.rounded-xl');
        resultCards.forEach((card, index) => {
            if (!card.getAttribute('role')) {
                card.setAttribute('role', 'article');
                card.setAttribute('aria-label', `Result ${index + 1}`);
                card.setAttribute('tabindex', '0');
            }
        });

        // Enhance headings
        const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach((heading, index) => {
            if (!heading.getAttribute('tabindex')) {
                heading.setAttribute('tabindex', '-1');
            }
        });

        // Enhance buttons in dynamic content
        const buttons = container.querySelectorAll('button');
        buttons.forEach(button => {
            if (!button.getAttribute('aria-label') && button.textContent.trim()) {
                button.setAttribute('aria-label', button.textContent.trim());
            }
            button.setAttribute('tabindex', '0');
        });
    }

    moveFocusToElement(element) {
        if (element) {
            element.focus();
            element.classList.add('focus-visible');
            
            // Announce focus change for screen readers
            const label = element.getAttribute('aria-label') || element.textContent || 'Element';
            this.announce(`Focused on ${label}`, 'polite');
        }
    }
}

// --- Test Runner for Unit Testing ---
class TestRunner {
    static runScoringTests() {
        const tests = {
            passed: 0,
            failed: 0,
            results: []
        };

        // Test DISC scoring
        try {
            const discScores = { D: 28, I: 10, S: 8, C: 12 };
            const discFactorScores = [
                { factor: 'D', score: 28 },
                { factor: 'I', score: 10 },
                { factor: 'C', score: 12 },
                { factor: 'S', score: 8 }
            ].sort((a, b) => b.score - a.score);
            
            const discProfile = getProfileKey(discFactorScores);
            if (discProfile === 'D') {
                tests.passed++;
                tests.results.push({ test: 'DISC Pure D Profile', status: 'PASS' });
            } else {
                tests.failed++;
                tests.results.push({ test: 'DISC Pure D Profile', status: 'FAIL', expected: 'D', got: discProfile });
            }
        } catch (error) {
            tests.failed++;
            tests.results.push({ test: 'DISC Pure D Profile', status: 'ERROR', error: error.message });
        }

        // Test MBTI scoring
        try {
            const mbtiScores = { E: 6, I: 1, S: 2, N: 5, T: 7, F: 0, J: 6, P: 1 };
            const mbtiType = calculateMBTIType(mbtiScores);
            if (mbtiType === 'ENTJ') {
                tests.passed++;
                tests.results.push({ test: 'MBTI ENTJ Type', status: 'PASS' });
            } else {
                tests.failed++;
                tests.results.push({ test: 'MBTI ENTJ Type', status: 'FAIL', expected: 'ENTJ', got: mbtiType });
            }
        } catch (error) {
            tests.failed++;
            tests.results.push({ test: 'MBTI ENTJ Type', status: 'ERROR', error: error.message });
        }

        // Test Big Five reverse scoring
        try {
            const question = { factor: 'O', reverse: true };
            const rating = 5;
            const finalScore = question.reverse ? (6 - rating) : rating;
            if (finalScore === 1) {
                tests.passed++;
                tests.results.push({ test: 'Big Five Reverse Scoring', status: 'PASS' });
            } else {
                tests.failed++;
                tests.results.push({ test: 'Big Five Reverse Scoring', status: 'FAIL', expected: 1, got: finalScore });
            }
        } catch (error) {
            tests.failed++;
            tests.results.push({ test: 'Big Five Reverse Scoring', status: 'ERROR', error: error.message });
        }

        console.log('🧪 Scoring Tests Completed:', tests);
        return tests;
    }
}

// Test Type Detection
const currentPage = window.location.pathname.split('/').pop();
const isMBTITest = currentPage === 'mbti.html';
const isDISCTest = currentPage === 'disc.html';
const isBig5Test = currentPage === 'big5.html';
const isIndexPage = currentPage === 'index.html' || currentPage === '';
const isResultPage = currentPage.includes('-result.html');

// Language State and Translations
let currentLang = 'en';

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
        footerText1: "All tests available in English and Portuguese",
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
        footerText1: "Todos os testes disponíveis em Inglês e Português",
        footerText2: "Seus resultados são salvos automaticamente e podem ser vistos aqui a qualquer momento",
        confirmDelete: "Tem certeza que deseja excluir este resultado?",
        confirmClearAll: "Tem certeza que deseja limpar todos os seus resultados de teste?",
        // Big Five trait descriptions
        strongCharacteristics: "🌟 Características Fortes:",
        balancedCharacteristics: "⚖️ Características Equilibradas:",
        developingCharacteristics: "🌱 Características em Desenvolvimento:",
        personalityProfile: "Seu Perfil de Personalidade",
        basedOnAssessment: "Baseado na sua avaliação Big Five"
    }
};

// Big Five trait descriptions for index page
const big5TraitDescriptions = {
    'O': {
        name: { en: 'Openness', pt: 'Abertura' },
        high: { 
            en: 'Imaginative, creative, curious, open to new experiences', 
            pt: 'Imaginativo, criativo, curioso, aberto a novas experiências' 
        },
        moderate: { 
            en: 'Balanced between practicality and creativity', 
            pt: 'Equilibrado entre praticidade e criatividade' 
        },
        low: { 
            en: 'Practical, conventional, prefers routine', 
            pt: 'Prático, convencional, prefere rotina' 
        }
    },
    'C': {
        name: { en: 'Conscientiousness', pt: 'Conscienciosidade' },
        high: { 
            en: 'Organized, disciplined, reliable, goal-oriented', 
            pt: 'Organizado, disciplinado, confiável, orientado a objetivos' 
        },
        moderate: { 
            en: 'Balanced between spontaneity and planning', 
            pt: 'Equilibrado entre espontaneidade e planejamento' 
        },
        low: { 
            en: 'Flexible, spontaneous, adaptable to change', 
            pt: 'Flexível, espontâneo, adaptável a mudanças' 
        }
    },
    'E': {
        name: { en: 'Extraversion', pt: 'Extroversão' },
        high: { 
            en: 'Sociable, energetic, enthusiastic, talkative', 
            pt: 'Sociável, energético, entusiástico, comunicativo' 
        },
        moderate: { 
            en: 'Balanced between social and solitary activities', 
            pt: 'Equilibrado entre atividades sociais e solitárias' 
        },
        low: { 
            en: 'Reserved, reflective, enjoys solitude', 
            pt: 'Reservado, reflexivo, aprecia solidão' 
        }
    },
    'A': {
        name: { en: 'Agreeableness', pt: 'Amabilidade' },
        high: { 
            en: 'Compassionate, cooperative, trusting, empathetic', 
            pt: 'Compassivo, cooperativo, confiante, empático' 
        },
        moderate: { 
            en: 'Balanced between cooperation and assertiveness', 
            pt: 'Equilibrado entre cooperação e assertividade' 
        },
        low: { 
            en: 'Analytical, straightforward, values independence', 
            pt: 'Analítico, direto, valoriza independência' 
        }
    },
    'N': {
        name: { en: 'Neuroticism', pt: 'Neuroticismo' },
        high: { 
            en: 'Sensitive to stress, experiences strong emotions', 
            pt: 'Sensível ao estresse, experimenta emoções fortes' 
        },
        moderate: { 
            en: 'Generally emotionally stable with occasional sensitivity', 
            pt: 'Geralmente estável emocionalmente com sensibilidade ocasional' 
        },
        low: { 
            en: 'Emotionally stable, resilient, calm under pressure', 
            pt: 'Estável emocionalmente, resiliente, calmo sob pressão' 
        }
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
        const response = await fetch('./fallback-questions.json');
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
        saveProgressToLocalStorage();
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

function saveProgressToLocalStorage() {
    try {
        const progress = {
            currentQuestionIndex,
            scores: isDISCTest ? scores : undefined,
            mbtiScores: isMBTITest ? mbtiScores : undefined,
            big5Scores: isBig5Test ? big5Scores : undefined,
            userRatings,
            currentLang,
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
        saveProgressToLocalStorage();
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
            saveTestResultToLocalStorage(resultData);
        } else {
            // Fallback to localStorage only
            saveTestResultToLocalStorage(resultData);
        }
    }).catch(() => {
        // Fallback to localStorage only
        saveTestResultToLocalStorage(resultData);
    });
}

function saveTestResultToLocalStorage(resultData) {
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
        showSuccessMessage(currentLang === 'en' ? 'Result saved successfully!' : 'Resultado salvo com sucesso!');
    } catch (error) {
        console.warn('Could not save test result to localStorage:', error);
        showError(currentLang === 'en' ? 'Failed to save result.' : 'Falha ao salvar resultado.');
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

// Error Handling Utilities
function showError(message = t('error_general'), duration = 5000) {
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
    errorElement.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg mb-2';
    errorElement.innerHTML = `
        <div class="flex items-center">
            <span class="text-red-500 mr-2" aria-hidden="true">⚠</span>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" 
                    class="ml-4 text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    aria-label="Close error message">
                ×
            </button>
        </div>
    `;

    errorContainer.appendChild(errorElement);
    if (accessibilityManager) {
        accessibilityManager.announce(`Error: ${message}`, 'assertive');
    }

    setTimeout(() => {
        if (errorElement.parentNode) {
            errorElement.parentNode.removeChild(errorElement);
        }
    }, duration);
}

function showLoading(message = t('loading')) {
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

// Enhanced Keyboard Navigation
function setupEnhancedKeyboardNavigation() {
    document.addEventListener('keydown', handleEnhancedKeyboardNavigation);
    
    // Add focus visible class for better keyboard navigation feedback
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
}

function handleEnhancedKeyboardNavigation(event) {
    const { key, target, ctrlKey, altKey } = event;
    
    // Skip if user is typing in an input field
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
    }

    switch (key) {
        case 'ArrowLeft':
        case 'ArrowRight':
        case 'ArrowUp':
        case 'ArrowDown':
            handleArrowNavigation(event, key);
            break;
        case ' ':
        case 'Enter':
            handleActionKey(event, target);
            break;
        case 'Escape':
            handleEscapeKey(event);
            break;
        case 'h':
        case 'H':
            if (ctrlKey) showKeyboardShortcuts();
            break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
            if (isDISCTest || isBig5Test) handleNumberKey(event, key);
            break;
        case 'a':
        case 'A':
        case 'b':
        case 'B':
            if (isMBTITest) handleMBTIKey(event, key);
            break;
    }
}

function handleArrowNavigation(event, direction) {
    const focusableElements = getFocusableElements();
    const currentIndex = focusableElements.indexOf(document.activeElement);
    
    if (currentIndex !== -1) {
        event.preventDefault();
        let newIndex;
        
        if (direction === 'ArrowRight' || direction === 'ArrowDown') {
            newIndex = (currentIndex + 1) % focusableElements.length;
        } else {
            newIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length;
        }
        
        const newElement = focusableElements[newIndex];
        newElement.focus();
        newElement.classList.add('focus-visible');
        
        // Announce focus change for screen readers
        if (accessibilityManager) {
            const label = newElement.getAttribute('aria-label') || newElement.textContent || 'Element';
            accessibilityManager.announce(label, 'polite');
        }
    }
}

function handleActionKey(event, target) {
    if (target.classList.contains('rating-button') || target.hasAttribute('data-rating') || 
        target.id.startsWith('option-') || target.id === 'restart-btn' || target.id === 'export-btn') {
        event.preventDefault();
        target.click();
        if (accessibilityManager) {
            accessibilityManager.announce(`Selected: ${target.textContent.trim()}`, 'assertive');
        }
    }
}

function handleEscapeKey(event) {
    const mainContent = document.querySelector('main') || document.querySelector('#main-content');
    if (mainContent) {
        mainContent.focus();
        if (accessibilityManager) {
            accessibilityManager.announce('Returned to main content', 'polite');
        }
    }
}

function handleNumberKey(event, key) {
    const rating = parseInt(key);
    const maxRating = isBig5Test ? 5 : 4;
    
    if (rating >= 1 && rating <= maxRating) {
        const buttons = document.querySelectorAll(`button[data-rating="${rating}"]`);
        if (buttons.length > 0) {
            event.preventDefault();
            buttons[0].click();
        }
    }
}

function handleMBTIKey(event, key) {
    const option = key.toLowerCase();
    const button = document.getElementById(`option-${option}`);
    if (button) {
        event.preventDefault();
        button.click();
    }
}

function getFocusableElements() {
    return Array.from(document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )).filter(el => !el.disabled && el.offsetParent !== null);
}

function showKeyboardShortcuts() {
    const shortcuts = [
        'Arrow Keys: Navigate between options',
        'Enter/Space: Select current option',
        'Escape: Return to main content',
        'Number Keys 1-5: Select rating (DISC/Big5)',
        'A/B Keys: Select MBTI options',
        'Ctrl+H: Show this help'
    ].join('. ');
    
    if (accessibilityManager) {
        accessibilityManager.announce(`Keyboard shortcuts: ${shortcuts}`);
    }
    showError(`Keyboard Shortcuts: ${shortcuts}`, 8000);
}

// Virtual Scrolling Setup for Results
function setupVirtualScrollingForResults() {
    const interpretationContainers = document.querySelectorAll('.scroll-container');
    interpretationContainers.forEach(container => {
        // Only enable virtual scrolling for containers with many items
        const items = Array.from(container.children);
        if (items.length > 10) { // Lower threshold for better performance
            // Backup original content
            const originalHTML = container.innerHTML;
            
            const scroller = new VirtualScroller(
                container,
                items,
                120, // estimated item height
                (item, index) => {
                    const div = document.createElement('div');
                    div.className = item.className + ' virtual-item';
                    div.innerHTML = item.innerHTML;
                    div.setAttribute('role', 'article');
                    div.setAttribute('aria-label', `Result item ${index + 1}`);
                    return div;
                }
            );
            virtualScrollers.set(container.id, { scroller, originalHTML });
        }
    });
}

function cleanupVirtualScrolling() {
    virtualScrollers.forEach(({ scroller, originalHTML }, containerId) => {
        const container = document.getElementById(containerId);
        if (container) {
            scroller.destroy();
            container.innerHTML = originalHTML;
        }
    });
    virtualScrollers.clear();
}

// --- QUESTION DATA (Now loaded from database) ---
let currentTestQuestions = [];

// Base descriptions for DISC factors
const discDescriptions = {
    D: { title: { en: "Dominance (D)", pt: "Dominância (D)" }, style: "bg-red-100 border-red-500 text-red-700", icon: "⚡" },
    I: { title: { en: "Influence (I)", pt: "Influência (I)" }, style: "bg-yellow-100 border-yellow-500 text-yellow-700", icon: "✨" },
    S: { title: { en: "Steadiness (S)", pt: "Estabilidade (S)" }, style: "bg-green-100 border-green-500 text-green-700", icon: "🌿" },
    C: { title: { en: "Conscientiousness (C)", pt: "Conscienciosidade (C)" }, style: "bg-blue-100 border-blue-500 text-blue-700", icon: "🔬" }
};

// MBTI Dimension descriptions
const mbtiDimensions = {
    E: { title: { en: "Extraversion", pt: "Extroversão" }, style: "bg-blue-100 border-blue-500 text-blue-700", icon: "🗣️", description: { en: "Energized by social interaction", pt: "Energizado por interação social" } },
    I: { title: { en: "Introversion", pt: "Introversão" }, style: "bg-indigo-100 border-indigo-500 text-indigo-700", icon: "🤫", description: { en: "Energized by solitude and reflection", pt: "Energizado por solidão e reflexão" } },
    S: { title: { en: "Sensing", pt: "Sensação" }, style: "bg-green-100 border-green-500 text-green-700", icon: "🔍", description: { en: "Focus on concrete, practical details", pt: "Foco em detalhes concretos e práticos" } },
    N: { title: { en: "Intuition", pt: "Intuição" }, style: "bg-purple-100 border-purple-500 text-purple-700", icon: "💡", description: { en: "Focus on patterns and possibilities", pt: "Foco em padrões e possibilidades" } },
    T: { title: { en: "Thinking", pt: "Pensamento" }, style: "bg-orange-100 border-orange-500 text-orange-700", icon: "⚖️", description: { en: "Decisions based on logic and objectivity", pt: "Decisões baseadas em lógica e objetividade" } },
    F: { title: { en: "Feeling", pt: "Sentimento" }, style: "bg-pink-100 border-pink-500 text-pink-700", icon: "❤️", description: { en: "Decisions based on values and harmony", pt: "Decisões baseadas em valores e harmonia" } },
    J: { title: { en: "Judging", pt: "Julgamento" }, style: "bg-teal-100 border-teal-500 text-teal-700", icon: "📋", description: { en: "Prefer structure and decidedness", pt: "Prefere estrutura e decisões tomadas" } },
    P: { title: { en: "Perceiving", pt: "Percepção" }, style: "bg-amber-100 border-amber-500 text-amber-700", icon: "🔄", description: { en: "Prefer flexibility and spontaneity", pt: "Prefere flexibilidade e espontaneidade" } }
};

// Big Five Dimension descriptions
const big5Descriptions = {
    O: { title: { en: "Openness", pt: "Abertura" }, style: "bg-purple-100 border-purple-500 text-purple-700", icon: "🌈", description: { en: "Imagination, creativity, curiosity", pt: "Imaginação, criatividade, curiosidade" } },
    C: { title: { en: "Conscientiousness", pt: "Conscienciosidade" }, style: "bg-blue-100 border-blue-500 text-blue-700", icon: "📊", description: { en: "Organization, diligence, reliability", pt: "Organização, diligência, confiabilidade" } },
    E: { title: { en: "Extraversion", pt: "Extroversão" }, style: "bg-yellow-100 border-yellow-500 text-yellow-700", icon: "🌟", description: { en: "Sociability, assertiveness, energy", pt: "Sociabilidade, assertividade, energia" } },
    A: { title: { en: "Agreeableness", pt: "Amabilidade" }, style: "bg-green-100 border-green-500 text-green-700", icon: "🤝", description: { en: "Compassion, cooperation, trust", pt: "Compaixão, cooperação, confiança" } },
    N: { title: { en: "Neuroticism", pt: "Neuroticismo" }, style: "bg-red-100 border-red-500 text-red-700", icon: "🌊", description: { en: "Anxiety, moodiness, emotional sensitivity", pt: "Ansiedade, instabilidade emocional, sensibilidade" } }
};

// MBTI Type Descriptions
const mbtiTypeDescriptions = {
    "ISTJ": {
        name: { en: "The Inspector", pt: "O Inspetor" },
        description: {
            en: "Practical, fact-minded, and reliable. You value tradition, order, and stability. You are thorough and dutiful, following through on commitments. Your strength is your reliability and attention to detail, but you may be resistant to change and overly focused on established procedures.",
            pt: "Prático, centrado em fatos e confiável. Você valoriza tradição, ordem e estabilidade. Você é minucioso e cumpre seus deveres, honrando compromissos. Sua força é sua confiabilidade e atenção aos detalhes, mas você pode ser resistente a mudanças e excessivamente focado em procedimentos estabelecidos."
        }
    },
    "ISFJ": {
        name: { en: "The Protector", pt: "O Protetor" },
        description: {
            en: "Warm, caring, and responsible. You are committed to your duties and loyal to your relationships. You have a strong sense of responsibility and work well in structured environments. Your strength is your dedication and practicality, but you may be overly sensitive to criticism and resistant to change.",
            pt: "Caloroso, cuidadoso e responsável. Você é comprometido com seus deveres e leal aos seus relacionamentos. Você tem um forte senso de responsabilidade e trabalha bem em ambientes estruturados. Sua força é sua dedicação e praticidade, mas você pode ser excessivamente sensível a críticas e resistente a mudanças."
        }
    },
    "INFJ": {
        name: { en: "The Advocate", pt: "O Advogado" },
        description: {
            en: "Insightful, principled, and organized. You have a strong sense of purpose and work towards your ideals with determination. You are creative and deeply caring about others. Your strength is your insight and conviction, but you may be perfectionistic and sensitive to conflict.",
            pt: "Perspicaz, principista e organizado. Você tem um forte senso de propósito e trabalha em direção aos seus ideais com determinação. Você é criativo e profundamente preocupado com os outros. Sua força é sua percepção e convicção, mas você pode ser perfeccionista e sensível a conflitos."
        }
    },
    "INTJ": {
        name: { en: "The Architect", pt: "O Arquiteto" },
        description: {
            en: "Strategic, independent, and determined. You have a vision for the future and work systematically to achieve your goals. You are analytical and value competence and knowledge. Your strength is your strategic thinking and independence, but you may be overly critical and dismissive of others' input.",
            pt: "Estratégico, independente e determinado. Você tem uma visão para o futuro e trabalha sistematicamente para alcançar seus objetivos. Você é analítico e valoriza competência e conhecimento. Sua força é seu pensamento estratégico e independência, mas você pode ser excessivamente crítico e desdenhoso das contribuições dos outros."
        }
    },
    "ISTP": {
        name: { en: "The Craftsman", pt: "O Artesão" },
        description: {
            en: "Practical, observant, and flexible. You enjoy understanding how things work and are skilled at solving practical problems. You are adaptable and prefer hands-on learning. Your strength is your resourcefulness and calm under pressure, but you may be risk-prone and easily bored.",
            pt: "Prático, observador e flexível. Você gosta de entender como as coisas funcionam e é habilidoso em resolver problemas práticos. Você é adaptável e prefere aprendizado prático. Sua força é sua capacidade de improvisação e calma sob pressão, mas você pode ser propenso a riscos e facilmente entediado."
        }
    },
    "ISFP": {
        name: { en: "The Artist", pt: "O Artista" },
        description: {
            en: "Gentle, sensitive, and artistic. You value harmony and enjoy creating beauty in your surroundings. You are loyal to your values and attentive to others' needs. Your strength is your compassion and aesthetic sense, but you may be overly self-critical and avoid conflict.",
            pt: "Gentil, sensível e artístico. Você valoriza harmonia e gosta de criar beleza em seu entorno. Você é leal aos seus valores e atento às necessidades dos outros. Sua força é sua compaixão e senso estético, mas você pode ser excessivamente autocrítico e evitar conflitos."
        }
    },
    "INFP": {
        name: { en: "The Mediator", pt: "O Mediador" },
        description: {
            en: "Idealistic, creative, and empathetic. You are guided by your strong values and desire to make the world a better place. You are adaptable and supportive of others. Your strength is your empathy and idealism, but you may be overly idealistic and sensitive to criticism.",
            pt: "Idealista, criativo e empático. Você é guiado por seus fortes valores e desejo de tornar o mundo um lugar melhor. Você é adaptável e apoia os outros. Sua força é sua empatia e idealismo, mas você pode ser excessivamente idealista e sensível a críticas."
        }
    },
    "INTP": {
        name: { en: "The Thinker", pt: "O Pensador" },
        description: {
            en: "Analytical, innovative, and curious. You enjoy theoretical problems and exploring complex ideas. You are logical and value precision in thought. Your strength is your intellectual curiosity and objectivity, but you may be overly abstract and inattentive to practical matters.",
            pt: "Analítico, inovador e curioso. Você gosta de problemas teóricos e explorar ideias complexas. Você é lógico e valoriza precisão no pensamento. Sua força é sua curiosidade intelectual e objetividade, mas você pode ser excessivamente abstrato e desatento a questões práticas."
        }
    },
    "ESTP": {
        name: { en: "The Persuader", pt: "O Persuador" },
        description: {
            en: "Energetic, practical, and spontaneous. You enjoy action and are skilled at navigating immediate challenges. You are observant and adaptable in the moment. Your strength is your practicality and boldness, but you may be impulsive and impatient with theory.",
            pt: "Energético, prático e espontâneo. Você gosta de ação e é habilidoso em navegar desafios imediatos. Você é observador e adaptável no momento. Sua força é sua praticidade e ousadia, mas você pode ser impulsivo e impaciente com a teoria."
        }
    },
    "ESFP": {
        name: { en: "The Performer", pt: "O Performista" },
        description: {
            en: "Outgoing, friendly, and enthusiastic. You enjoy bringing energy and fun to social situations. You are practical and observant of your environment. Your strength is your spontaneity and people skills, but you may be easily distracted and dislike routine.",
            pt: "Extrovertido, amigável e entusiástico. Você gosta de trazer energia e diversão para situações sociais. Você é prático e observador do seu ambiente. Sua força é sua espontaneidade e habilidades com pessoas, mas você pode ser facilmente distraído e não gostar de rotina."
        }
    },
    "ENFP": {
        name: { en: "The Champion", pt: "O Campeão" },
        description: {
            en: "Enthusiastic, creative, and sociable. You see possibilities everywhere and enjoy inspiring others. You are adaptable and value deep connections. Your strength is your enthusiasm and creativity, but you may be overly optimistic and struggle with follow-through.",
            pt: "Entusiástico, criativo e sociável. Você vê possibilidades em todos os lugares e gosta de inspirar os outros. Você é adaptável e valoriza conexões profundas. Sua força é seu entusiasmo e criatividade, mas você pode ser excessivamente otimista e ter dificuldade com a implementação."
        }
    },
    "ENTP": {
        name: { en: "The Debater", pt: "O Debatedor" },
        description: {
            en: "Innovative, quick-witted, and outspoken. You enjoy intellectual challenges and debating ideas. You are energetic and value knowledge. Your strength is your ingenuity and verbal skill, but you may be argumentative and inattentive to details.",
            pt: "Inovador, perspicaz e franco. Você gosta de desafios intelectuais e debater ideias. Você é energético e valoriza conhecimento. Sua força é sua engenhosidade e habilidade verbal, mas você pode ser argumentativo e desatento a detalhes."
        }
    },
    "ESTJ": {
        name: { en: "The Supervisor", pt: "O Supervisor" },
        description: {
            en: "Practical, traditional, and organized. You value order and structure in your environment. You are dependable and take your responsibilities seriously. Your strength is your reliability and decisiveness, but you may be inflexible and judgmental.",
            pt: "Prático, tradicional e organizado. Você valoriza ordem e estrutura em seu ambiente. Você é confiável e leva suas responsabilidades a sério. Sua força é sua confiabilidade e decisão, mas você pode ser inflexível e crítico."
        }
    },
    "ESFJ": {
        name: { en: "The Caregiver", pt: "O Cuidador" },
        description: {
            en: "Sociable, caring, and popular. You enjoy helping others and creating harmonious environments. You are conscientious and value cooperation. Your strength is your warmth and practicality, but you may be overly sensitive and need approval from others.",
            pt: "Sociável, cuidadoso e popular. Você gosta de ajudar os outros e criar ambientes harmoniosos. Você é consciencioso e valoriza cooperação. Sua força é seu calor e praticidade, mas você pode ser excessivamente sensível e precisar de aprovação dos outros."
        }
    },
    "ENFJ": {
        name: { en: "The Teacher", pt: "O Professor" },
        description: {
            en: "Empathetic, organized, and inspiring. You are skilled at understanding others and motivating them towards growth. You value harmony and personal development. Your strength is your charisma and insight, but you may be overly idealistic and sensitive to conflict.",
            pt: "Empático, organizado e inspirador. Você é habilidoso em entender os outros e motivá-los para o crescimento. Você valoriza harmonia e desenvolvimento pessoal. Sua força é seu carisma e percepção, mas você pode ser excessivamente idealista e sensível a conflitos."
        }
    },
    "ENTJ": {
        name: { en: "The Commander", pt: "O Comandante" },
        description: {
            en: "Strategic, assertive, and efficient. You are a natural leader who enjoys organizing people and resources towards goals. You value competence and long-term planning. Your strength is your leadership and strategic thinking, but you may be impatient and overly critical.",
            pt: "Estratégico, assertivo e eficiente. Você é um líder natural que gosta de organizar pessoas e recursos para atingir objetivos. Você valoriza competência e planejamento de longo prazo. Sua força é sua liderança e pensamento estratégico, mas você pode ser impaciente e excessivamente crítico."
        }
    }
};

// Detailed Blended Profile Descriptions for DISC
const blendedDescriptions = {
    "D": {
        name: { en: "Dominant", pt: "Dominante" },
        style: "bg-red-100 border-red-500 text-red-700",
        description: {
            en: "You are direct, results-oriented, and assertive. You thrive on challenges and take charge in situations. Your natural confidence and determination help you overcome obstacles quickly. You prefer environments where you can make decisions and see immediate progress.",
            pt: "Você é direto, orientado a resultados e assertivo. Você prospera em desafios e assume o comando em situações. Sua confiança natural e determinação ajudam você a superar obstáculos rapidamente. Você prefere ambientes onde pode tomar decisões e ver progresso imediato."
        }
    },
    "I": {
        name: { en: "Influential", pt: "Influente" },
        style: "bg-yellow-100 border-yellow-500 text-yellow-700",
        description: {
            en: "You are outgoing, enthusiastic, and persuasive. You excel at building relationships and motivating others. Your optimism and communication skills make you effective in social and team settings. You thrive in environments that value collaboration and positive energy.",
            pt: "Você é extrovertido, entusiástico e persuasivo. Você se destaca em construir relacionamentos e motivar os outros. Seu otimismo e habilidades de comunicação tornam você eficaz em ambientes sociais e de equipe. Você prospera em ambientes que valorizam colaboração e energia positiva."
        }
    },
    "S": {
        name: { en: "Steady", pt: "Estável" },
        style: "bg-green-100 border-green-500 text-green-700",
        description: {
            en: "You are patient, reliable, and supportive. You value stability and work well in consistent environments. Your calm demeanor and listening skills make you an excellent team player. You excel in roles that require persistence, cooperation, and attention to established processes.",
            pt: "Você é paciente, confiável e solidário. Você valoriza estabilidade e trabalha bem em ambientes consistentes. Sua serenidade e habilidades de escuta tornam você um excelente membro de equipe. Você se destaca em funções que exigem persistência, cooperação e atenção aos processos estabelecidos."
        }
    },
    "C": {
        name: { en: "Conscientious", pt: "Consciencioso" },
        style: "bg-blue-100 border-blue-500 text-blue-700",
        description: {
            en: "You are analytical, precise, and quality-focused. You value accuracy and enjoy working with detailed information. Your systematic approach and high standards ensure excellent results. You thrive in environments that require careful analysis, planning, and attention to detail.",
            pt: "Você é analítico, preciso e focado na qualidade. Você valoriza precisão e gosta de trabalhar com informações detalhadas. Sua abordagem sistemática e altos padrões garantem resultados excelentes. Você prospera em ambientes que exigem análise cuidadosa, planejamento e atenção aos detalhes."
        }
    },
    "DI": {
        name: { en: "Driver-Influencer", pt: "Condutor-Influenciador" },
        style: "bg-orange-100 border-orange-500 text-orange-700",
        description: {
            en: "You combine determination with social energy. You're both goal-oriented and people-focused, able to drive results while maintaining positive relationships. Your blend of assertiveness and enthusiasm makes you effective in leadership and sales roles.",
            pt: "Você combina determinação com energia social. Você é orientado a objetivos e focado em pessoas, capaz de conduzir resultados mantendo relacionamentos positivos. Sua mistura de assertividade e entusiasmo torna você eficaz em funções de liderança e vendas."
        }
    },
    "ID": {
        name: { en: "Influencer-Driver", pt: "Influenciador-Condutor" },
        style: "bg-amber-100 border-amber-500 text-amber-700",
        description: {
            en: "You lead with enthusiasm backed by determination. Your primary focus is on relationships and inspiration, but you can be decisive when needed. You excel at motivating teams while ensuring progress toward objectives.",
            pt: "Você lidera com entusiasmo apoiado por determinação. Seu foco principal está em relacionamentos e inspiração, mas você pode ser decisivo quando necessário. Você se destaca em motivar equipes enquanto garante progresso em direção aos objetivos."
        }
    },
    "IS": {
        name: { en: "Influencer-Steady", pt: "Influenciador-Estável" },
        style: "bg-lime-100 border-lime-500 text-lime-700",
        description: {
            en: "You blend social energy with supportive stability. You're great at building lasting relationships and creating harmonious environments. Your combination of enthusiasm and reliability makes you a trusted team member who balances optimism with practical support.",
            pt: "Você combina energia social com estabilidade solidária. Você é ótimo em construir relacionamentos duradouros e criar ambientes harmoniosos. Sua combinação de entusiasmo e confiabilidade torna você um membro da equipe confiável que equilibra otimismo com suporte prático."
        }
    },
    "SI": {
        name: { en: "Steady-Influencer", pt: "Estável-Influenciador" },
        style: "bg-emerald-100 border-emerald-500 text-emerald-700",
        description: {
            en: "You provide stable support with warm enthusiasm. Your primary strength is reliability and patience, complemented by good people skills. You create comfortable environments where people feel supported and valued.",
            pt: "Você fornece suporte estável com entusiasmo caloroso. Sua principal força é confiabilidade e paciência, complementada por boas habilidades com pessoas. Você cria ambientes confortáveis onde as pessoas se sentem apoiadas e valorizadas."
        }
    },
    "SC": {
        name: { en: "Steady-Conscientious", pt: "Estável-Consciencioso" },
        style: "bg-cyan-100 border-cyan-500 text-cyan-700",
        description: {
            en: "You combine reliability with analytical precision. You're both patient and thorough, excellent at following through on commitments with careful attention to detail. Your methodical approach ensures quality results in stable environments.",
            pt: "Você combina confiabilidade com precisão analítica. Você é paciente e minucioso, excelente em cumprir compromissos com cuidadosa atenção aos detalhes. Sua abordagem metódica garante resultados de qualidade em ambientes estáveis."
        }
    },
    "CS": {
        name: { en: "Conscientious-Steady", pt: "Consciencioso-Estável" },
        style: "bg-sky-100 border-sky-500 text-sky-700",
        description: {
            en: "You approach tasks with careful analysis and consistent follow-through. Your primary focus is accuracy and quality, supported by reliable work habits. You excel in roles that require both precision and persistence.",
            pt: "Você aborda tarefas com análise cuidadosa e acompanhamento consistente. Seu foco principal é precisão e qualidade, apoiado por hábitos de trabalho confiáveis. Você se destaca em funções que exigem precisão e persistência."
        }
    },
    "CD": {
        name: { en: "Conscientious-Driver", pt: "Consciencioso-Condutor" },
        style: "bg-violet-100 border-violet-500 text-violet-700",
        description: {
            en: "You blend analytical thinking with determined action. You're both precise and results-oriented, able to analyze situations thoroughly then drive toward solutions. Your combination of critical thinking and decisiveness makes you effective in complex problem-solving.",
            pt: "Você combina pensamento analítico com ação determinada. Você é preciso e orientado a resultados, capaz de analisar situações minuciosamente e depois conduzir em direção a soluções. Sua combinação de pensamento crítico e decisão torna você eficaz na resolução de problemas complexos."
        }
    },
    "DC": {
        name: { en: "Driver-Conscientious", pt: "Condutor-Consciencioso" },
        style: "bg-purple-100 border-purple-500 text-purple-700",
        description: {
            en: "You lead with determination supported by careful analysis. Your primary drive is achieving results, but you ensure they meet high standards of quality. You're effective at driving projects forward while maintaining attention to important details.",
            pt: "Você lidera com determinação apoiada por análise cuidadosa. Sua principal motivação é alcançar resultados, mas você garante que eles atendam a altos padrões de qualidade. Você é eficaz em conduzir projetos para frente enquanto mantém atenção a detalhes importantes."
        }
    }
};

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

// Global Accessibility Manager
let accessibilityManager;

// Virtual Scrollers Map
let virtualScrollers = new Map();

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
                        renderMBTIQuestion();
                    } else if (isBig5Test) {
                        renderBig5Question();
                    } else {
                        renderQuestion();
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
        if (isMBTITest) {
            document.getElementById('header-title').textContent = t('mbti_title');
            document.getElementById('header-subtitle').textContent = t('mbti_subtitle');
            document.getElementById('rating-guide').textContent = t('mbti_rating_guide');
        } else if (isBig5Test) {
            document.getElementById('header-title').textContent = t('big5_title');
            document.getElementById('header-subtitle').textContent = t('big5_subtitle');
            
            const ratingLabels = currentLang === 'en' 
                ? ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
                : ["Discordo Totalmente", "Discordo", "Neutro", "Concordo", "Concordo Totalmente"];
            
            for (let i = 1; i <= 5; i++) {
                const button = document.getElementById(`rating-${i}`);
                const label = document.getElementById(`label-${i}`);
                if (button) button.textContent = i;
                if (label) label.textContent = ratingLabels[i-1];
            }
            
            document.getElementById('rating-guide').textContent = currentLang === 'en' 
                ? "Tap or click a number to rate the statement (1=Strongly Disagree, 5=Strongly Agree)"
                : "Toque ou clique em um número para avaliar a afirmação (1=Discordo Totalmente, 5=Concordo Totalmente)";
        } else {
            document.getElementById('header-title').textContent = t('disc_title');
            document.getElementById('header-subtitle').textContent = t('disc_subtitle');
            document.getElementById('rating-1').textContent = t('rating_1');
            document.getElementById('rating-2').textContent = t('rating_2');
            document.getElementById('rating-3').textContent = t('rating_3');
            document.getElementById('rating-4').textContent = t('rating_4');
            document.getElementById('rating-guide').textContent = t('rating_guide');
        }
        
        const restartBtn = document.getElementById('restart-btn');
        const exportBtn = document.getElementById('export-btn');

        if (restartBtn) restartBtn.textContent = t('restart');
        if (exportBtn) exportBtn.textContent = t('export_pdf');
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
function renderQuestion() {
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
        console.error('Error rendering question:', error);
        showError(t('error_general'));
    }
}

function renderMBTIQuestion() {
    try {
        if (currentQuestionIndex >= currentTestQuestions.length) {
            showResults();
            return;
        }

        const currentQ = currentTestQuestions[currentQuestionIndex];
        const totalQuestions = currentTestQuestions.length;

        document.getElementById('option-a-text').textContent = currentQ.optionA[currentLang];
        document.getElementById('option-b-text').textContent = currentQ.optionB[currentLang];
        
        // Update ARIA labels
        document.getElementById('option-a').setAttribute('aria-label', `Option A: ${currentQ.optionA[currentLang]}`);
        document.getElementById('option-b').setAttribute('aria-label', `Option B: ${currentQ.optionB[currentLang]}`);
        
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
            renderQuestion();
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
            renderMBTIQuestion();
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

// Enhanced PDF Export with Accessibility
function exportToPDF() {
    const loading = showLoading(currentLang === 'en' ? 'Generating PDF...' : 'Gerando PDF...');
    
    try {
        const element = document.getElementById('results-container');
        
        let filename;
        if (isMBTITest) {
            filename = t('mbti_filename');
        } else if (isBig5Test) {
            filename = t('big5_filename');
        } else {
            filename = t('filename');
        }
        
        const options = {
            margin: 10,
            filename: filename + '.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 3, 
                logging: false, 
                useCORS: true,
                windowWidth: element.scrollWidth,
                windowHeight: element.scrollHeight
            }, 
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(options).from(element).save().then(() => {
            hideLoading();
            if (accessibilityManager) {
                accessibilityManager.announce('PDF exported successfully', 'assertive');
            }
        }).catch(error => {
            console.error('PDF generation failed:', error);
            hideLoading();
            showError(t('error_pdf'));
        });

    } catch (error) {
        console.error('Error exporting to PDF:', error);
        hideLoading();
        showError(t('error_pdf'));
    }
}

// Enhanced Restart Function with Accessibility
function restartTest() {
    try {
        // Cleanup virtual scrolling
        cleanupVirtualScrolling();
        
        currentQuestionIndex = 0;
        
        if (isMBTITest) {
            mbtiScores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
        } else if (isBig5Test) {
            big5Scores = { O: 0, C: 0, E: 0, A: 0, N: 0 };
        } else {
            scores = { D: 0, I: 0, S: 0, C: 0 };
        }
        
        userRatings = [];
        
        clearProgress();
        
        resultsContainer.classList.add('hidden');
        testContainer.classList.remove('hidden');
        
        document.getElementById('result-scores').innerHTML = '';
        document.getElementById('result-interpretation').innerHTML = '';
        
        if (isMBTITest) {
            const mbtiTypeDisplay = document.getElementById('mbti-type-display');
            if (mbtiTypeDisplay) mbtiTypeDisplay.innerHTML = '';
        }

        // Move focus back to test container
        testContainer.setAttribute('tabindex', '-1');
        testContainer.focus();
        
        // Announce restart
        if (accessibilityManager) {
            accessibilityManager.announce('Test restarted. Beginning from question one.', 'assertive');
        }

        if (isMBTITest) {
            renderMBTIQuestion();
        } else if (isBig5Test) {
            renderBig5Question();
        } else {
            renderQuestion();
        }
    } catch (error) {
        console.error('Error restarting test:', error);
        showError(t('error_general'));
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
        DISC: { en: 'DISC Personality', pt: 'Personalidade DISC' },
        MBTI: { en: 'MBTI Personality', pt: 'Personalidade MBTI' }, 
        BIG5: { en: 'Big Five Personality', pt: 'Personalidade Big Five' }
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
            resultHTML = generateDISCResultHTML(resultData);
            break;
        case 'MBTI':
            resultHTML = generateMBTIResultHTML(resultData);
            break;
        case 'BIG5':
            resultHTML = generateBig5ResultHTML(resultData);
            break;
    }
    
    container.innerHTML = resultHTML;
    
    // Re-attach event listeners for PDF export
    attachResultPageEventListeners(testType);
}

function generateDISCResultHTML(resultData) {
    const profileKey = resultData.profileKey;
    const profileData = blendedDescriptions[profileKey];
    const profileName = profileData ? profileData.name[currentLang] : 'Unknown Profile';
    const description = profileData ? profileData.description[currentLang] : '';
    
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
            <button onclick="restartTestFromResult('DISC')" class="px-8 py-3 bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-600 transition duration-300 shadow-lg">
                ${t('restart')}
            </button>
            <button onclick="exportResultToPDF('DISC')" class="px-8 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition duration-300 shadow-lg">
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
            <button onclick="restartTestFromResult('MBTI')" class="px-8 py-3 bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-600 transition duration-300 shadow-lg">
                ${t('restart')}
            </button>
            <button onclick="exportResultToPDF('MBTI')" class="px-8 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition duration-300 shadow-lg">
                ${t('export_pdf')}
            </button>
        </div>
    `;
}

function generateBig5ResultHTML(resultData) {
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
            <button onclick="restartTestFromResult('BIG5')" class="px-8 py-3 bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-600 transition duration-300 shadow-lg">
                ${t('restart')}
            </button>
            <button onclick="exportResultToPDF('BIG5')" class="px-8 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition duration-300 shadow-lg">
                ${t('export_pdf')}
            </button>
        </div>
    `;
}

function attachResultPageEventListeners(testType) {
    // PDF export functionality
    const exportButtons = document.querySelectorAll('button[onclick*="exportResultToPDF"]');
    exportButtons.forEach(button => {
        button.addEventListener('click', () => exportResultToPDF(testType));
    });

    // Restart test functionality
    const restartButtons = document.querySelectorAll('button[onclick*="restartTestFromResult"]');
    restartButtons.forEach(button => {
        button.addEventListener('click', () => restartTestFromResult(testType));
    });
}

function exportResultToPDF(testType) {
    const loading = showLoading(currentLang === 'en' ? 'Generating PDF...' : 'Gerando PDF...');
    
    try {
        const containerId = `${testType.toLowerCase()}-result-content`;
        const element = document.getElementById(containerId);
        
        let filename;
        if (testType === 'MBTI') {
            filename = t('mbti_filename');
        } else if (testType === 'BIG5') {
            filename = t('big5_filename');
        } else {
            filename = t('filename');
        }
        
        const options = {
            margin: 10,
            filename: filename + '.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 3, 
                logging: false, 
                useCORS: true,
                windowWidth: element.scrollWidth,
                windowHeight: element.scrollHeight
            }, 
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(options).from(element).save().then(() => {
            hideLoading();
            showSuccessMessage(currentLang === 'en' ? 'PDF exported successfully!' : 'PDF exportado com sucesso!');
        }).catch(error => {
            console.error('PDF generation failed:', error);
            hideLoading();
            showError(t('error_pdf'));
        });

    } catch (error) {
        console.error('Error exporting to PDF:', error);
        hideLoading();
        showError(t('error_pdf'));
    }
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
            if (savedLang && (savedLang === 'en' || savedLang === 'pt')) {
                currentLang = savedLang;
            }
        } catch (e) {
            console.warn('Could not load language preference');
        }

        // Set initial language
        document.documentElement.lang = currentLang;

        if (isIndexPage) {
            initIndexPage();
        } else if (!isResultPage) { // ALTERE ESTA LINHA (adicione o !isResultPage)
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
                renderMBTIQuestion();
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
                renderQuestion();
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