// --- Configuration Object ---
const CONFIG = {
    DISC: {
        totalQuestions: 30,
        minRating: 1,
        maxRating: 4,
        factors: ['D', 'I', 'S', 'C'],
        pureThreshold: 4,
        progressKey: 'personalityTest_disc'
    },
    MBTI: {
        totalQuestions: 28,
        dimensions: ['EI', 'SN', 'TF', 'JP'],
        questionsPerDimension: 7,
        progressKey: 'personalityTest_mbti'
    },
    BIG5: {
        totalQuestions: 40,
        minRating: 1,
        maxRating: 5,
        factors: ['O', 'C', 'E', 'A', 'N'],
        questionsPerFactor: 8,
        maxScorePerFactor: 40, // 8 questions × 5 points
        progressKey: 'personalityTest_big5'
    },
    localStorageTimeout: 3600000 // 1 hour in milliseconds
};

// --- Test Type Detection ---
const currentPage = window.location.pathname.split('/').pop();
const isMBTITest = currentPage === 'mbti.html';
const isDISCTest = currentPage === 'disc.html' || currentPage === 'DISC.html';
const isBig5Test = currentPage === 'big5.html';

// --- Language State and Translations ---
let currentLang = 'en'; // Default language

const translations = {
    'en': {
        // DISC Test Translations
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
        
        // MBTI Test Translations
        mbti_title: "MBTI Personality Test",
        mbti_subtitle: "Choose the option that best describes you for each statement",
        mbti_rating_guide: "Choose the statement that better describes your natural preference",
        mbti_main_result_title: "Your MBTI Personality Type:",
        mbti_result_subtitle: "Your MBTI personality type and detailed interpretation",
        mbti_interpretation_title: "Detailed Type Interpretation",
        mbti_filename: "MBTI_Personality_Results_EN",
        mbti_dimension_e: "Extraversion",
        mbti_dimension_i: "Introversion", 
        mbti_dimension_s: "Sensing",
        mbti_dimension_n: "Intuition",
        mbti_dimension_t: "Thinking",
        mbti_dimension_f: "Feeling",
        mbti_dimension_j: "Judging",
        mbti_dimension_p: "Perceiving",
        
        // Big5 Test Translations
        big5_title: "Big Five Personality Test",
        big5_subtitle: "Rate how much each statement describes you (1 = Strongly Disagree, 5 = Strongly Agree)",
        big5_main_result_title: "Your Big Five Personality Traits:",
        big5_result_subtitle: "Below are your scores for the five major personality factors",
        big5_interpretation_title: "Trait Interpretations",
        big5_filename: "Big5_Personality_Results_EN",
        big5_openness: "Openness",
        big5_conscientiousness: "Conscientiousness",
        big5_extraversion: "Extraversion",
        big5_agreeableness: "Agreeableness",
        big5_neuroticism: "Neuroticism",

        // Common/Error Messages
        error_general: "An error occurred. Please try again.",
        error_pdf: "Failed to generate PDF. Please try again.",
        loading: "Loading...",
        resuming_test: "Resuming previous test...",
        test_data_invalid: "Test data appears to be invalid. Starting fresh test."
    },
    'pt': {
        // DISC Test Translations
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
        
        // MBTI Test Translations
        mbti_title: "Teste de Personalidade MBTI",
        mbti_subtitle: "Escolha a opção que melhor descreve você para cada afirmação",
        mbti_rating_guide: "Escolha a afirmação que melhor descreve sua preferência natural",
        mbti_main_result_title: "Seu Tipo de Personalidade MBTI:",
        mbti_result_subtitle: "Seu tipo de personalidade MBTI e interpretação detalhada",
        mbti_interpretation_title: "Interpretação Detalhada do Tipo",
        mbti_filename: "MBTI_Personality_Results_PT",
        mbti_dimension_e: "Extroversão",
        mbti_dimension_i: "Introversão",
        mbti_dimension_s: "Sensação",
        mbti_dimension_n: "Intuição", 
        mbti_dimension_t: "Pensamento",
        mbti_dimension_f: "Sentimento",
        mbti_dimension_j: "Julgamento",
        mbti_dimension_p: "Percepção",
        
        // Big5 Test Translations
        big5_title: "Teste de Personalidade Big Five",
        big5_subtitle: "Avalie o quanto cada afirmação o descreve (1 = Discordo Totalmente, 5 = Concordo Totalmente)",
        big5_main_result_title: "Seus Traços de Personalidade Big Five:",
        big5_result_subtitle: "Abaixo estão suas pontuações para os cinco principais fatores de personalidade",
        big5_interpretation_title: "Interpretações dos Traços",
        big5_filename: "Big5_Personality_Results_PT",
        big5_openness: "Abertura",
        big5_conscientiousness: "Conscienciosidade",
        big5_extraversion: "Extroversão",
        big5_agreeableness: "Amabilidade",
        big5_neuroticism: "Neuroticismo",

        // Common/Error Messages
        error_general: "Ocorreu um erro. Por favor, tente novamente.",
        error_pdf: "Falha ao gerar PDF. Por favor, tente novamente.",
        loading: "Carregando...",
        resuming_test: "Continuando teste anterior...",
        test_data_invalid: "Os dados do teste parecem inválidos. Iniciando novo teste."
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

// --- Performance Optimization: Debounce Function ---
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

// --- Local Storage Management ---
function getStorageKey() {
    if (isMBTITest) return CONFIG.MBTI.progressKey;
    if (isBig5Test) return CONFIG.BIG5.progressKey;
    return CONFIG.DISC.progressKey;
}

function saveProgress() {
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

function loadProgress() {
    try {
        const saved = localStorage.getItem(getStorageKey());
        if (saved) {
            const progress = JSON.parse(saved);
            
            // Check if progress is still valid (within timeout)
            if (Date.now() - progress.timestamp < CONFIG.localStorageTimeout) {
                console.log(t('resuming_test'));
                return progress;
            } else {
                // Clear expired progress
                localStorage.removeItem(getStorageKey());
            }
        }
    } catch (error) {
        console.warn('Could not load progress from localStorage:', error);
    }
    return null;
}

function clearProgress() {
    try {
        localStorage.removeItem(getStorageKey());
    } catch (error) {
        console.warn('Could not clear progress from localStorage:', error);
    }
}

// --- Data Validation ---
function validateTestData() {
    try {
        if (isMBTITest && mbtiQuestions.length !== CONFIG.MBTI.totalQuestions) {
            console.warn(`MBTI questions count mismatch: expected ${CONFIG.MBTI.totalQuestions}, got ${mbtiQuestions.length}`);
            return false;
        }
        if (isDISCTest && discQuestions.length !== CONFIG.DISC.totalQuestions) {
            console.warn(`DISC questions count mismatch: expected ${CONFIG.DISC.totalQuestions}, got ${discQuestions.length}`);
            return false;
        }
        if (isBig5Test && big5Questions.length !== CONFIG.BIG5.totalQuestions) {
            console.warn(`Big5 questions count mismatch: expected ${CONFIG.BIG5.totalQuestions}, got ${big5Questions.length}`);
            return false;
        }
        return true;
    } catch (error) {
        console.error('Error validating test data:', error);
        return false;
    }
}

// --- Error Handling Utilities ---
function showError(message = t('error_general'), duration = 5000) {
    // Create or get error container
    let errorContainer = document.getElementById('error-container');
    if (!errorContainer) {
        errorContainer = document.createElement('div');
        errorContainer.id = 'error-container';
        errorContainer.className = 'fixed top-4 right-4 z-50 max-w-sm';
        document.body.appendChild(errorContainer);
    }

    const errorElement = document.createElement('div');
    errorElement.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg mb-2';
    errorElement.innerHTML = `
        <div class="flex items-center">
            <span class="text-red-500 mr-2">⚠</span>
            <span>${message}</span>
        </div>
    `;

    errorContainer.appendChild(errorElement);

    // Auto remove after duration
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
        <div class="bg-white p-6 rounded-lg shadow-xl flex items-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-3"></div>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(loadingElement);
    return loadingElement;
}

function hideLoading() {
    const loadingElement = document.getElementById('loading-overlay');
    if (loadingElement && loadingElement.parentNode) {
        loadingElement.parentNode.removeChild(loadingElement);
    }
}

// --- Accessibility Enhancements ---
function enhanceAccessibility() {
    try {
        // Add ARIA labels to rating buttons
        if (isDISCTest || isBig5Test) {
            const ratingButtons = document.querySelectorAll('button[data-rating]');
            ratingButtons.forEach(button => {
                const rating = button.getAttribute('data-rating');
                const label = isBig5Test ? 
                    `${rating} - ${['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'][rating-1]}` :
                    `${rating} - ${['Least Like Me', 'Less Like Me', 'More Like Me', 'Most Like Me'][rating-1]}`;
                button.setAttribute('aria-label', label);
            });
        }

        // Add keyboard navigation
        document.addEventListener('keydown', handleKeyboardNavigation);

        // Ensure focus management for screen readers
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.setAttribute('role', 'main');
            mainContent.setAttribute('aria-live', 'polite');
        }

    } catch (error) {
        console.warn('Accessibility enhancements failed:', error);
    }
}

function handleKeyboardNavigation(event) {
    // Handle number keys for ratings
    if ((isDISCTest || isBig5Test) && event.key >= '1' && event.key <= (isBig5Test ? '5' : '4')) {
        const rating = parseInt(event.key);
        const buttons = document.querySelectorAll(`button[data-rating="${rating}"]`);
        if (buttons.length > 0) {
            event.preventDefault();
            buttons[0].click();
        }
    }

    // Handle A/B keys for MBTI
    if (isMBTITest && (event.key === 'a' || event.key === 'A' || event.key === 'b' || event.key === 'B')) {
        const option = event.key.toLowerCase();
        const button = document.getElementById(`option-${option}`);
        if (button) {
            event.preventDefault();
            button.click();
        }
    }

    // Handle Enter key for selected buttons
    if (event.key === 'Enter') {
        const focused = document.activeElement;
        if (focused && (focused.hasAttribute('data-rating') || focused.id.startsWith('option-'))) {
            event.preventDefault();
            focused.click();
        }
    }
}

// --- Print-Friendly Styles ---
function addPrintStyles() {
    if (!document.getElementById('print-styles')) {
        const style = document.createElement('style');
        style.id = 'print-styles';
        style.textContent = `
            @media print {
                .no-print { display: none !important; }
                body { font-size: 12pt; }
                .bg-gray-100 { background: white !important; }
                .shadow-lg { box-shadow: none !important; }
                .border-2 { border: 1px solid #000 !important; }
                .text-6xl { font-size: 2.5rem !important; }
                .text-3xl { font-size: 1.5rem !important; }
                .p-6 { padding: 1rem !important; }
                .mb-4 { margin-bottom: 0.5rem !important; }
            }
        `;
        document.head.appendChild(style);
    }
}

// --- DISC Test Data (30 Questions) ---
const discQuestions = [
    // D - Dominance (8 Questions total)
    { text: { en: "I prioritize getting measurable results quickly.", pt: "Eu priorizo a obtenção de resultados mensuráveis rapidamente." }, factor: "D" },
    { text: { en: "I am direct and assertive in my communication style.", pt: "Eu sou direto e assertivo no meu estilo de comunicação." }, factor: "D" },
    { text: { en: "I enjoy taking charge and leading group activities.", pt: "Eu gosto de assumir o comando e liderar atividades em grupo." }, factor: "D" },
    { text: { en: "I thrive on challenge and competitive environments.", pt: "Eu prospero em ambientes desafiadores e competitivos." }, factor: "D" },
    { text: { en: "I feel comfortable making decisions without extensive consultation.", pt: "Sinto-me à vontade para tomar decisões sem consulta extensa." }, factor: "D" },
    { text: { en: "I am focused on overcoming obstacles and achieving immediate goals.", pt: "Estou focado em superar obstáculos e alcançar objetivos imediatos." }, factor: "D" },
    { text: { en: "I appreciate an environment where speed is valued over thoroughness.", pt: "Eu aprecio um ambiente onde a velocidade é mais valorizada do que a exaustividade." }, factor: "D" },
    { text: { en: "I confront issues and people directly when conflict arises.", pt: "Eu confronto problemas e pessoas diretamente quando surge um conflito." }, factor: "D" },

    // I - Influence (7 Questions total)
    { text: { en: "I am outgoing and enjoy meeting new people frequently.", pt: "Eu sou extrovertido e gosto de conhecer novas pessoas frequentemente." }, factor: "I" },
    { text: { en: "I use enthusiasm and positive language to motivate others.", pt: "Eu uso entusiasmo e linguagem positiva para motivar os outros." }, factor: "I" },
    { text: { en: "I am naturally optimistic and look for the best in situations.", pt: "Eu sou naturalmente otimista e procuro o melhor nas situações." }, factor: "I" },
    { text: { en: "I like to talk and express my ideas freely and openly.", pt: "Eu gosto de conversar e expressar minhas ideias livre e abertamente." }, factor: "I" },
    { text: { en: "I enjoy being the center of attention in a social setting.", pt: "Eu gosto de ser o centro das atenções em um ambiente social." }, factor: "I" },
    { text: { en: "I am skilled at persuading others to adopt my ideas.", pt: "Sou hábil em persuadir os outros a adotarem minhas ideias." }, factor: "I" },
    { text: { en: "I often rely on intuition and feelings rather than facts.", pt: "Muitas vezes, confio na intuição e nos sentimentos em vez de em fatos." }, factor: "I" },

    // S - Steadiness (8 Questions total)
    { text: { en: "I am patient and prefer a predictable, stable work environment.", pt: "Eu sou paciente e prefiro um ambiente de trabalho previsível e estável." }, factor: "S" },
    { text: { en: "I am supportive and value harmony in my team and relationships.", pt: "Eu sou prestativo e valorizo a harmonia na minha equipe e relacionamentos." }, factor: "S" },
    { text: { en: "I am a reliable team player who follows through on commitments.", pt: "Eu sou um membro de equipe confiável que cumpre os compromissos." }, factor: "S" },
    { text: { en: "I prefer to work at a steady, deliberate, and consistent pace.", pt: "Eu prefiro trabalhar em um ritmo constante, deliberado e consistente." }, factor: "S" },
    { text: { en: "I value maintaining a secure and familiar routine.", pt: "Eu valorizo a manutenção de uma rotina segura e familiar." }, factor: "S" },
    { text: { en: "I am empathetic and a good listener for others' concerns.", pt: "Eu sou empático e um bom ouvinte para as preocupações dos outros." }, factor: "S" },
    { text: { en: "I dislike sudden, unexpected changes to plans or schedules.", pt: "Eu não gosto de mudanças repentinas e inesperadas nos planos ou horários." }, factor: "S" },
    { text: { en: "I tend to be quite cautious when approaching new tasks or risks.", pt: "Eu tento a ser bastante cauteloso ao abordar novas tarefas ou riscos." }, factor: "S" },

    // C - Conscientiousness (7 Questions total)
    { text: { en: "I am highly analytical and focused on details and accuracy.", pt: "Eu sou altamente analítico e focado em detalhes e precisão." }, factor: "C" },
    { text: { en: "I enjoy following established rules, procedures, and high standards.", pt: "Eu gosto de seguir regras estabelecidas, procedimentos e altos padrões." }, factor: "C" },
    { text: { en: "I approach problems logically, systematically, and critically.", pt: "Eu abordo problemas de forma lógica, sistemática e crítica." }, factor: "C" },
    { text: { en: "I take time to carefully review and critique all my work.", pt: "Eu dedico tempo para revisar e criticar cuidadosamente todo o meu trabalho." }, factor: "C" },
    { text: { en: "I am highly organized and meticulous about my workspace.", pt: "Eu sou altamente organizado e meticuloso com meu espaço de trabalho." }, factor: "C" },
    { text: { en: "I strive for perfection in everything I do, even minor tasks.", pt: "Eu me esforço para a perfeição em tudo o que faço, mesmo em tarefas menores." }, factor: "C" },
    { text: { en: "I base my decisions primarily on verifiable facts and data.", pt: "Eu baseio minhas decisões principalmente em fatos e dados verificáveis." }, factor: "C" },
];

// --- MBTI Test Data (28 Questions - 7 per dimension) ---
const mbtiQuestions = [
    // E/I Questions (7 total)
    { 
        optionA: { en: "You enjoy being the center of attention at social gatherings", pt: "Você gosta de ser o centro das atenções em encontros sociais" }, 
        optionB: { en: "You prefer observing from the sidelines in social situations", pt: "Você prefere observar de fora em situações sociais" },
        dimension: "EI",
        aValue: "E",
        bValue: "I"
    },
    { 
        optionA: { en: "You feel energized after spending time with large groups", pt: "Você se sente energizado depois de passar tempo com grandes grupos" }, 
        optionB: { en: "You need alone time to recharge after social interactions", pt: "Você precisa de tempo sozinho para recarregar após interações sociais" },
        dimension: "EI",
        aValue: "E", 
        bValue: "I"
    },
    { 
        optionA: { en: "You think out loud and process ideas through conversation", pt: "Você pensa em voz alta e processa ideias através da conversa" }, 
        optionB: { en: "You prefer to think things through quietly before speaking", pt: "Você prefere pensar nas coisas quieto antes de falar" },
        dimension: "EI",
        aValue: "E",
        bValue: "I"
    },
    { 
        optionA: { en: "You enjoy meeting new people and making new friends", pt: "Você gosta de conhecer novas pessoas e fazer novos amigos" }, 
        optionB: { en: "You prefer spending time with a few close friends", pt: "Você prefere passar o tempo com alguns amigos próximos" },
        dimension: "EI",
        aValue: "E",
        bValue: "I"
    },
    { 
        optionA: { en: "You are often described as outgoing and sociable", pt: "Você é frequentemente descrito como extrovertido e sociável" }, 
        optionB: { en: "You are often described as reserved and private", pt: "Você é frequentemente descrito como reservado e discreto" },
        dimension: "EI",
        aValue: "E",
        bValue: "I"
    },
    { 
        optionA: { en: "You enjoy group activities and collaborative projects", pt: "Você gosta de atividades em grupo e projetos colaborativos" }, 
        optionB: { en: "You prefer working alone or in very small groups", pt: "Você prefere trabalhar sozinho ou em grupos muito pequenos" },
        dimension: "EI",
        aValue: "E",
        bValue: "I"
    },
    { 
        optionA: { en: "You frequently initiate social plans and gatherings", pt: "Você frequentemente inicia planos sociais e encontros" }, 
        optionB: { en: "You usually wait for others to invite you to social events", pt: "Você geralmente espera que outros o convidem para eventos sociais" },
        dimension: "EI",
        aValue: "E",
        bValue: "I"
    },
    
    // S/N Questions (7 total)
    { 
        optionA: { en: "You focus on concrete facts and practical realities", pt: "Você se concentra em fatos concretos e realidades práticas" }, 
        optionB: { en: "You enjoy thinking about abstract concepts and future possibilities", pt: "Você gosta de pensar em conceitos abstratos e possibilidades futuras" },
        dimension: "SN",
        aValue: "S",
        bValue: "N"
    },
    { 
        optionA: { en: "You prefer clear, step-by-step instructions", pt: "Você prefere instruções claras, passo a passo" }, 
        optionB: { en: "You like to improvise and figure things out as you go", pt: "Você gosta de improvisar e descobrir as coisas no caminho" },
        dimension: "SN",
        aValue: "S",
        bValue: "N"
    },
    { 
        optionA: { en: "You trust past experiences and proven methods", pt: "Você confia em experiências passadas e métodos comprovados" }, 
        optionB: { en: "You get excited about new ideas and innovative approaches", pt: "Você fica animado com novas ideias e abordagens inovadoras" },
        dimension: "SN",
        aValue: "S",
        bValue: "N"
    },
    { 
        optionA: { en: "You notice specific details in your environment", pt: "Você percebe detalhes específicos no seu ambiente" }, 
        optionB: { en: "You tend to see the big picture and overall patterns", pt: "Você tende a ver o panorama geral e os padrões totais" },
        dimension: "SN",
        aValue: "S",
        bValue: "N"
    },
    { 
        optionA: { en: "You prefer dealing with actual experiences", pt: "Você prefere lidar com experiências reais" }, 
        optionB: { en: "You enjoy imagining what could be in the future", pt: "Você gosta de imaginar o que poderia ser no futuro" },
        dimension: "SN",
        aValue: "S",
        bValue: "N"
    },
    { 
        optionA: { en: "You are very present-oriented and practical", pt: "Você é muito orientado para o presente e prático" }, 
        optionB: { en: "You are often thinking about future possibilities", pt: "Você frequentemente pensa sobre possibilidades futuras" },
        dimension: "SN",
        aValue: "S",
        bValue: "N"
    },
    { 
        optionA: { en: "You prefer literal and straightforward communication", pt: "Você prefere comunicação literal e direta" }, 
        optionB: { en: "You enjoy metaphorical and symbolic meanings", pt: "Você gosta de significados metafóricos e simbólicos" },
        dimension: "SN",
        aValue: "S",
        bValue: "N"
    },
    
    // T/F Questions (7 total)
    { 
        optionA: { en: "You make decisions based on logic and objective analysis", pt: "Você toma decisões baseadas em lógica e análise objetiva" }, 
        optionB: { en: "You consider people's feelings and values when deciding", pt: "Você considera os sentimentos e valores das pessoas ao decidir" },
        dimension: "TF",
        aValue: "T",
        bValue: "F"
    },
    { 
        optionA: { en: "You value truth and fairness above harmony", pt: "Você valoriza a verdade e justiça acima da harmonia" }, 
        optionB: { en: "You prioritize maintaining harmony in relationships", pt: "Você prioriza manter a harmonia nos relacionamentos" },
        dimension: "TF",
        aValue: "T",
        bValue: "F"
    },
    { 
        optionA: { en: "You prefer direct, straightforward communication", pt: "Você prefere comunicação direta e objetiva" }, 
        optionB: { en: "You consider how your words might affect others emotionally", pt: "Você considera como suas palavras podem afetar outros emocionalmente" },
        dimension: "TF",
        aValue: "T",
        bValue: "F"
    },
    { 
        optionA: { en: "You tend to be more critical than compassionate", pt: "Você tende a ser mais crítico do que compassivo" }, 
        optionB: { en: "You tend to be more compassionate than critical", pt: "Você tende a ser mais compassivo do que crítico" },
        dimension: "TF",
        aValue: "T",
        bValue: "F"
    },
    { 
        optionA: { en: "You believe consistency and fairness are most important", pt: "Você acredita que consistência e justiça são mais importantes" }, 
        optionB: { en: "You believe empathy and circumstances should be considered", pt: "Você acredita que empatia e circunstâncias devem ser consideradas" },
        dimension: "TF",
        aValue: "T",
        bValue: "F"
    },
    { 
        optionA: { en: "You focus on objective criteria when evaluating situations", pt: "Você se concentra em critérios objetivos ao avaliar situações" }, 
        optionB: { en: "You focus on human values and needs when evaluating situations", pt: "Você se concentra em valores humanos e necessidades ao avaliar situações" },
        dimension: "TF",
        aValue: "T",
        bValue: "F"
    },
    { 
        optionA: { en: "You prefer constructive criticism to help others improve", pt: "Você prefere críticas construtivas para ajudar outros a melhorar" }, 
        optionB: { en: "You prefer gentle encouragement to support others", pt: "Você prefere incentivo gentil para apoiar os outros" },
        dimension: "TF",
        aValue: "T",
        bValue: "F"
    },
    
    // J/P Questions (7 total)
    { 
        optionA: { en: "You like to have decisions made and plans settled", pt: "Você gosta de ter decisões tomadas e planos estabelecidos" }, 
        optionB: { en: "You prefer to keep your options open as long as possible", pt: "Você prefere manter suas opções abertas o máximo possível" },
        dimension: "JP",
        aValue: "J",
        bValue: "P"
    },
    { 
        optionA: { en: "You work best with deadlines and clear schedules", pt: "Você trabalha melhor com prazos e cronogramas claros" }, 
        optionB: { en: "You feel constrained by too much structure and planning", pt: "Você se sente limitado por muita estrutura e planejamento" },
        dimension: "JP",
        aValue: "J",
        bValue: "P"
    },
    { 
        optionA: { en: "You enjoy completing tasks and checking them off your list", pt: "Você gosta de completar tarefas e marcá-las na sua lista" }, 
        optionB: { en: "You enjoy starting new projects more than finishing them", pt: "Você gosta mais de começar novos projetos do que terminá-los" },
        dimension: "JP",
        aValue: "J",
        bValue: "P"
    },
    { 
        optionA: { en: "You prefer to make decisions quickly and move forward", pt: "Você prefere tomar decisões rapidamente e seguir em frente" }, 
        optionB: { en: "You prefer to gather more information before deciding", pt: "Você prefere coletar mais informações antes de decidir" },
        dimension: "JP",
        aValue: "J",
        bValue: "P"
    },
    { 
        optionA: { en: "You like to have a clear plan before starting projects", pt: "Você gosta de ter um plano claro antes de começar projetos" }, 
        optionB: { en: "You prefer to be spontaneous and adapt as you go", pt: "Você prefere ser espontâneo e se adaptar no caminho" },
        dimension: "JP",
        aValue: "J",
        bValue: "P"
    },
    { 
        optionA: { en: "You feel more comfortable when things are decided", pt: "Você se sente mais confortável quando as coisas estão decididas" }, 
        optionB: { en: "You feel more comfortable leaving things flexible", pt: "Você se sente mais confortável deixando as coisas flexíveis" },
        dimension: "JP",
        aValue: "J",
        bValue: "P"
    },
    { 
        optionA: { en: "You prefer to finish projects well before deadlines", pt: "Você prefere terminar projetos bem antes dos prazos" }, 
        optionB: { en: "You often work best under pressure near deadlines", pt: "Você frequentemente trabalha melhor sob pressão perto dos prazos" },
        dimension: "JP",
        aValue: "J",
        bValue: "P"
    }
];

// --- Big Five Test Data (40 Questions) ---
const big5Questions = [
    // Openness (8 questions)
    { text: { en: "I have a rich vocabulary.", pt: "Eu tenho um vocabulário rico." }, factor: "O", reverse: false },
    { text: { en: "I have a vivid imagination.", pt: "Eu tenho uma imaginação vívida." }, factor: "O", reverse: false },
    { text: { en: "I have difficulty understanding abstract ideas.", pt: "Eu tenho dificuldade em entender ideias abstratas." }, factor: "O", reverse: true },
    { text: { en: "I am not interested in abstract ideas.", pt: "Eu não me interesso por ideias abstratas." }, factor: "O", reverse: true },
    { text: { en: "I have excellent ideas.", pt: "Eu tenho excelentes ideias." }, factor: "O", reverse: false },
    { text: { en: "I do not have a good imagination.", pt: "Eu não tenho uma boa imaginação." }, factor: "O", reverse: true },
    { text: { en: "I am quick to understand things.", pt: "Eu entendo as coisas rapidamente." }, factor: "O", reverse: false },
    { text: { en: "I use difficult words.", pt: "Eu uso palavras difíceis." }, factor: "O", reverse: false },
    
    // Conscientiousness (8 questions)
    { text: { en: "I am always prepared.", pt: "Eu estou sempre preparado." }, factor: "C", reverse: false },
    { text: { en: "I pay attention to details.", pt: "Eu presto atenção aos detalhes." }, factor: "C", reverse: false },
    { text: { en: "I get chores done right away.", pt: "Eu faço as tarefas imediatamente." }, factor: "C", reverse: false },
    { text: { en: "I like order.", pt: "Eu gosto de ordem." }, factor: "C", reverse: false },
    { text: { en: "I often forget to put things back in their proper place.", pt: "Eu frequentemente esqueço de colocar as coisas no lugar certo." }, factor: "C", reverse: true },
    { text: { en: "I make a mess of things.", pt: "Eu bagunço as coisas." }, factor: "C", reverse: true },
    { text: { en: "I often forget my obligations.", pt: "Eu frequentemente esqueço minhas obrigações." }, factor: "C", reverse: true },
    { text: { en: "I shirk my duties.", pt: "Eu evito meus deveres." }, factor: "C", reverse: true },
    
    // Extraversion (8 questions)
    { text: { en: "I am the life of the party.", pt: "Eu sou a alma da festa." }, factor: "E", reverse: false },
    { text: { en: "I feel comfortable around people.", pt: "Eu me sinto confortável perto de pessoas." }, factor: "E", reverse: false },
    { text: { en: "I start conversations.", pt: "Eu inicio conversas." }, factor: "E", reverse: false },
    { text: { en: "I talk to a lot of different people at parties.", pt: "Eu converso com muitas pessoas diferentes em festas." }, factor: "E", reverse: false },
    { text: { en: "I don't talk a lot.", pt: "Eu não falo muito." }, factor: "E", reverse: true },
    { text: { en: "I keep in the background.", pt: "Eu fico no fundo." }, factor: "E", reverse: true },
    { text: { en: "I have little to say.", pt: "Eu tenho pouco a dizer." }, factor: "E", reverse: true },
    { text: { en: "I don't like to draw attention to myself.", pt: "Eu não gosto de chamar atenção para mim mesmo." }, factor: "E", reverse: true },
    
    // Agreeableness (8 questions)
    { text: { en: "I am interested in people.", pt: "Eu me interesso por pessoas." }, factor: "A", reverse: false },
    { text: { en: "I sympathize with others' feelings.", pt: "Eu simpatizo com os sentimentos dos outros." }, factor: "A", reverse: false },
    { text: { en: "I have a soft heart.", pt: "Eu tenho um coração mole." }, factor: "A", reverse: false },
    { text: { en: "I take time out for others.", pt: "Eu reservo tempo para os outros." }, factor: "A", reverse: false },
    { text: { en: "I feel others' emotions.", pt: "Eu sinto as emoções dos outros." }, factor: "A", reverse: false },
    { text: { en: "I make people feel at ease.", pt: "Eu faço as pessoas se sentirem à vontade." }, factor: "A", reverse: false },
    { text: { en: "I am not really interested in others.", pt: "Eu não estou realmente interessado nos outros." }, factor: "A", reverse: true },
    { text: { en: "I insult people.", pt: "Eu insulte pessoas." }, factor: "A", reverse: true },
    
    // Neuroticism (8 questions)
    { text: { en: "I get stressed out easily.", pt: "Eu fico estressado facilmente." }, factor: "N", reverse: false },
    { text: { en: "I worry about things.", pt: "Eu me preocupo com as coisas." }, factor: "N", reverse: false },
    { text: { en: "I am easily disturbed.", pt: "Eu me perturbo facilmente." }, factor: "N", reverse: false },
    { text: { en: "I get upset easily.", pt: "Eu fico chateado facilmente." }, factor: "N", reverse: false },
    { text: { en: "I change my mood a lot.", pt: "Eu mudo meu humor frequentemente." }, factor: "N", reverse: false },
    { text: { en: "I have frequent mood swings.", pt: "Eu tenho mudanças de humor frequentes." }, factor: "N", reverse: false },
    { text: { en: "I get irritated easily.", pt: "Eu fico irritado facilmente." }, factor: "N", reverse: false },
    { text: { en: "I often feel blue.", pt: "Eu frequentemente me sinto triste." }, factor: "N", reverse: false }
];

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

// --- Global State ---
let currentQuestionIndex = 0;
let scores = { D: 0, I: 0, S: 0, C: 0 }; // For DISC
let mbtiScores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }; // For MBTI
let big5Scores = { O: 0, C: 0, E: 0, A: 0, N: 0 }; // For Big Five
let userRatings = [];

// --- DOM Elements ---
let testContainer;
let resultsContainer;
let questionTextElement;
let progressTextElement;
let ratingButtonsContainer;
let progressBarElement;

// --- Debounced Handlers ---
const debouncedHandleRating = debounce(handleRating, 300);
const debouncedHandleMBTIRating = debounce(handleMBTIRating, 300);
const debouncedHandleBig5Rating = debounce(handleBig5Rating, 300);

/**
 * Sets the application language and updates the UI text.
 * @param {string} lang 'en' or 'pt'
 */
function setLanguage(lang) {
    try {
        if (lang === currentLang) return;
        currentLang = lang;
        updateStaticText();
        
        // Save language preference
        try {
            localStorage.setItem('personalityTest_language', lang);
        } catch (e) {
            console.warn('Could not save language preference');
        }
        
        // Re-render the current view
        if (resultsContainer && resultsContainer.classList.contains('hidden')) {
            if (isMBTITest) {
                renderMBTIQuestion();
            } else if (isBig5Test) {
                renderBig5Question();
            } else {
                renderQuestion();
            }
        } else if (resultsContainer) {
            showResults(true); // Re-render results immediately
        }
    } catch (error) {
        console.error('Error setting language:', error);
        showError(t('error_general'));
    }
}

/**
 * Updates all non-dynamic text in the UI based on currentLang.
 */
function updateStaticText() {
    try {
        if (isMBTITest) {
            document.getElementById('header-title').textContent = t('mbti_title');
            document.getElementById('header-subtitle').textContent = t('mbti_subtitle');
            document.getElementById('rating-guide').textContent = t('mbti_rating_guide');
        } else if (isBig5Test) {
            document.getElementById('header-title').textContent = t('big5_title');
            document.getElementById('header-subtitle').textContent = t('big5_subtitle');
            
            // Update rating button labels for Big Five
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

// --- MBTI Specific Functions ---

/**
 * Renders the current MBTI question
 */
function renderMBTIQuestion() {
    try {
        if (currentQuestionIndex >= mbtiQuestions.length) {
            showResults();
            return;
        }

        const currentQ = mbtiQuestions[currentQuestionIndex];
        const totalQuestions = mbtiQuestions.length;

        // Update question options
        document.getElementById('option-a-text').textContent = currentQ.optionA[currentLang];
        document.getElementById('option-b-text').textContent = currentQ.optionB[currentLang];
        
        // Update progress
        const progress = (currentQuestionIndex / totalQuestions) * 100;
        progressTextElement.textContent = t('progress_q_of_total', { q: currentQuestionIndex + 1, total: totalQuestions });
        progressBarElement.style.width = `${progress}%`;

        // Reset button styles
        document.getElementById('option-a').classList.remove('selected', 'bg-blue-200', 'border-blue-500');
        document.getElementById('option-b').classList.remove('selected', 'bg-purple-200', 'border-purple-500');
        
        document.getElementById('option-a').classList.add('bg-gray-100', 'border-gray-300');
        document.getElementById('option-b').classList.add('bg-gray-100', 'border-gray-300');

        // Save progress after rendering question
        saveProgress();
    } catch (error) {
        console.error('Error rendering MBTI question:', error);
        showError(t('error_general'));
    }
}

/**
 * Handles MBTI rating selection
 */
function handleMBTIRating(option, buttonElement) {
    try {
        if (currentQuestionIndex >= mbtiQuestions.length) return;

        const currentQ = mbtiQuestions[currentQuestionIndex];
        const selectedValue = option === 'A' ? currentQ.aValue : currentQ.bValue;

        // Visual feedback
        document.getElementById('option-a').classList.remove('selected', 'bg-blue-200', 'border-blue-500', 'bg-gray-100');
        document.getElementById('option-b').classList.remove('selected', 'bg-purple-200', 'border-purple-500', 'bg-gray-100');
        
        if (option === 'A') {
            buttonElement.classList.add('selected', 'bg-blue-200', 'border-blue-500');
        } else {
            buttonElement.classList.add('selected', 'bg-purple-200', 'border-purple-500');
        }

        // Update score
        mbtiScores[selectedValue] += 1;
        userRatings.push({ dimension: currentQ.dimension, choice: option, value: selectedValue });

        // Save progress
        saveProgress();

        // Advance to next question
        setTimeout(() => {
            currentQuestionIndex++;
            renderMBTIQuestion();
        }, 500);
    } catch (error) {
        console.error('Error handling MBTI rating:', error);
        showError(t('error_general'));
    }
}

/**
 * Calculates final MBTI type
 */
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

/**
 * Shows MBTI specific results with percentage display
 */
function showMBTIResults(resultScores, resultInterpretation) {
    try {
        // Calculate MBTI type
        const mbtiType = calculateMBTIType();
        const typeData = mbtiTypeDescriptions[mbtiType];

        if (!typeData) {
            showError(t('test_data_invalid'));
            return;
        }

        // Set the main result header
        const mainResultTitle = document.getElementById('main-result-title');
        mainResultTitle.innerHTML = `${t('mbti_main_result_title')} <span class="text-purple-600 font-extrabold">${mbtiType}</span>`;
        document.getElementById('result-subtitle').textContent = t('mbti_result_subtitle');
        document.getElementById('interpretation-title').textContent = t('mbti_interpretation_title');

        // Create MBTI type display
        const mbtiTypeDisplay = document.getElementById('mbti-type-display');
        mbtiTypeDisplay.innerHTML = `
            <div class="text-6xl font-bold mb-4">${mbtiType}</div>
            <div class="text-2xl font-semibold">${typeData.name[currentLang]}</div>
        `;

        // Create dimension score cards with percentages
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

        resultScores.innerHTML = scoreCardsHTML;

        // Create detailed interpretation
        const mainInterpretationHTML = `
            <div class="mb-6 p-6 rounded-xl border-l-4 border-purple-500 shadow-md bg-white">
                <h4 class="text-2xl font-bold text-gray-800 mb-2 flex items-center">
                    <span class="text-3xl mr-3">${mbtiDimensions[mbtiType[0]].icon}</span>
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

// --- Big Five Specific Functions ---

/**
 * Renders the current Big Five question
 */
function renderBig5Question() {
    try {
        if (currentQuestionIndex >= big5Questions.length) {
            showResults();
            return;
        }

        const currentQ = big5Questions[currentQuestionIndex];
        const totalQuestions = big5Questions.length;

        // Update question text
        questionTextElement.textContent = currentQ.text[currentLang];
        
        // Update progress
        const progress = (currentQuestionIndex / totalQuestions) * 100;
        progressTextElement.textContent = t('progress_q_of_total', { q: currentQuestionIndex + 1, total: totalQuestions });
        progressBarElement.style.width = `${progress}%`;

        // Reset button styles
        Array.from(ratingButtonsContainer.children).forEach(btn => btn.classList.remove('selected'));

        // Save progress after rendering question
        saveProgress();
    } catch (error) {
        console.error('Error rendering Big5 question:', error);
        showError(t('error_general'));
    }
}

/**
 * Handles Big Five rating selection
 */
function handleBig5Rating(rating, buttonElement) {
    try {
        if (currentQuestionIndex >= big5Questions.length) return;

        const currentQ = big5Questions[currentQuestionIndex];

        // Visually select the button
        Array.from(ratingButtonsContainer.children).forEach(btn => btn.classList.remove('selected'));
        buttonElement.classList.add('selected');

        // Calculate score (reverse if needed)
        const finalScore = currentQ.reverse ? (6 - rating) : rating;
        
        // Update score
        big5Scores[currentQ.factor] += finalScore;
        userRatings.push({ factor: currentQ.factor, rating: rating, finalScore: finalScore });

        // Save progress
        saveProgress();

        // Advance to next question
        setTimeout(() => {
            currentQuestionIndex++;
            renderBig5Question();
        }, 300);
    } catch (error) {
        console.error('Error handling Big5 rating:', error);
        showError(t('error_general'));
    }
}

/**
 * Shows Big Five specific results
 */
function showBig5Results(resultScores, resultInterpretation) {
    try {
        // Set the main result header
        const mainResultTitle = document.getElementById('main-result-title');
        mainResultTitle.innerHTML = `${t('big5_main_result_title')}`;
        document.getElementById('result-subtitle').textContent = t('big5_result_subtitle');
        document.getElementById('interpretation-title').textContent = t('big5_interpretation_title');

        // Create Big Five score cards
        let scoreCardsHTML = '';
        const dimensions = ['O', 'C', 'E', 'A', 'N'];

        dimensions.forEach(factor => {
            const desc = big5Descriptions[factor];
            const score = big5Scores[factor];
            const maxScore = CONFIG.BIG5.maxScorePerFactor;
            const percentage = Math.round((score / maxScore) * 100);

            // Determine interpretation based on score
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
                <div class="p-6 rounded-xl border-2 ${desc.style} shadow-lg transition duration-300">
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
                        ${interpretation[currentLang]}
                    </p>
                </div>
            `;
        });

        resultScores.innerHTML = scoreCardsHTML;

        // Create detailed interpretation
        const mainInterpretationHTML = `
            <div class="mb-6 p-6 rounded-xl border-l-4 border-indigo-500 shadow-md bg-white">
                <h4 class="text-2xl font-bold text-gray-800 mb-2">${currentLang === 'en' ? 'Understanding Your Big Five Results' : 'Entendendo Seus Resultados Big Five'}</h4>
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
        `;
        
        resultInterpretation.innerHTML = mainInterpretationHTML;
    } catch (error) {
        console.error('Error showing Big5 results:', error);
        showError(t('error_general'));
    }
}

// --- Common Logic Functions ---

/**
 * Initializes the application and renders the first question.
 */
function init() {
    try {
        testContainer = document.getElementById('test-container');
        resultsContainer = document.getElementById('results-container');
        questionTextElement = document.getElementById('question-text');
        progressTextElement = document.getElementById('progress-text');
        progressBarElement = document.getElementById('progress-bar-inner');
        ratingButtonsContainer = document.getElementById('rating-buttons');

        // Validate test data
        if (!validateTestData()) {
            console.warn(t('test_data_invalid'));
        }

        // Load language preference
        try {
            const savedLang = localStorage.getItem('personalityTest_language');
            if (savedLang && (savedLang === 'en' || savedLang === 'pt')) {
                currentLang = savedLang;
            }
        } catch (e) {
            console.warn('Could not load language preference');
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
        
        // Add print styles
        addPrintStyles();
        
        // Enhance accessibility
        enhanceAccessibility();
        
        // Render initial question based on test type
        if (isMBTITest) {
            if (currentQuestionIndex < mbtiQuestions.length) {
                renderMBTIQuestion();
            } else {
                showResults();
            }
        } else if (isBig5Test) {
            if (currentQuestionIndex < big5Questions.length) {
                renderBig5Question();
            } else {
                showResults();
            }
        } else {
            if (currentQuestionIndex < discQuestions.length) {
                renderQuestion();
            } else {
                showResults();
            }
        }
    } catch (error) {
        console.error('Error initializing application:', error);
        showError(t('error_general'));
    }
}

/**
 * Renders the current DISC question text and updates the progress bar.
 */
function renderQuestion() {
    try {
        if (currentQuestionIndex >= discQuestions.length) {
            showResults();
            return;
        }

        const currentQ = discQuestions[currentQuestionIndex];
        const totalQuestions = discQuestions.length;

        // Update question text using the selected language
        questionTextElement.textContent = currentQ.text[currentLang];
        
        // Update progress
        const progress = (currentQuestionIndex / totalQuestions) * 100;
        progressTextElement.textContent = t('progress_q_of_total', { q: currentQuestionIndex + 1, total: totalQuestions });
        progressBarElement.style.width = `${progress}%`;

        // Reset button styles
        Array.from(ratingButtonsContainer.children).forEach(btn => btn.classList.remove('selected'));

        // Save progress after rendering question
        saveProgress();
    } catch (error) {
        console.error('Error rendering question:', error);
        showError(t('error_general'));
    }
}

/**
 * Handles the user rating for DISC, updates scores, and advances to the next question.
 * @param {number} rating The score (1-4) selected by the user.
 * @param {HTMLElement} buttonElement The button element that was clicked.
 */
function handleRating(rating, buttonElement) {
    try {
        // Check if the test is already finished (shouldn't happen, but safe check)
        if (currentQuestionIndex >= discQuestions.length) return; 

        const currentQ = discQuestions[currentQuestionIndex];

        // 1. Visually select the button
        Array.from(ratingButtonsContainer.children).forEach(btn => btn.classList.remove('selected'));
        buttonElement.classList.add('selected');

        // 2. Update the score and history (rating = score)
        scores[currentQ.factor] += rating;
        userRatings.push({ factor: currentQ.factor, rating: rating });
        
        // 3. Save progress
        saveProgress();

        // 4. Delay slightly before advancing for visual feedback
        setTimeout(() => {
            currentQuestionIndex++;
            renderQuestion();
        }, 300);
    } catch (error) {
        console.error('Error handling rating:', error);
        showError(t('error_general'));
    }
}

/**
 * Determines the final DISC profile key (D, I, S, C, DI, ID, SC, etc.)
 * based on the two highest scores.
 * @param {Array<Object>} factorScores Sorted array of scores [{factor: 'D', score: 25}, ...]
 * @returns {string} The profile key (e.g., 'DI', 'C')
 */
function getProfileKey(factorScores) {
    try {
        const primary = factorScores[0];
        const secondary = factorScores[1];
        
        // Threshold for considering a score 'Pure' vs 'Blended'
        const PURE_THRESHOLD = CONFIG.DISC.pureThreshold;

        if (primary.score - secondary.score > PURE_THRESHOLD) {
            return primary.factor; // Pure Style (e.g., 'D', 'I', 'S', 'C')
        } else {
            return primary.factor + secondary.factor; // Blended Style (e.g., 'DI', 'IS', 'SC')
        }
    } catch (error) {
        console.error('Error getting profile key:', error);
        return 'UNKN';
    }
}

/**
 * Calculates final results, determines the primary style, and renders the results UI.
 * @param {boolean} forceRerender If true, just re-render results without hiding/showing containers.
 */
function showResults(forceRerender = false) {
    try {
        if (!forceRerender) {
            testContainer.classList.add('hidden');
            resultsContainer.classList.remove('hidden');
        }

        const resultScores = document.getElementById('result-scores');
        const resultInterpretation = document.getElementById('result-interpretation');

        // Clear progress when test is completed
        clearProgress();

        if (isMBTITest) {
            showMBTIResults(resultScores, resultInterpretation);
        } else if (isBig5Test) {
            showBig5Results(resultScores, resultInterpretation);
        } else {
            showDISCResults(resultScores, resultInterpretation);
        }
    } catch (error) {
        console.error('Error showing results:', error);
        showError(t('error_general'));
    }
}

/**
 * Shows DISC specific results
 */
function showDISCResults(resultScores, resultInterpretation) {
    try {
        // --- Dynamic Scoring Setup ---
        const factorCounts = discQuestions.reduce((acc, q) => {
            acc[q.factor] = (acc[q.factor] || 0) + 1;
            return acc;
        }, {});

        let factorScores = [
            { factor: 'D', score: scores.D },
            { factor: 'I', score: scores.I },
            { factor: 'S', score: scores.S },
            { factor: 'C', score: scores.C },
        ];
        
        // 1. Sort scores to find Primary and Secondary
        factorScores.sort((a, b) => b.score - a.score);
        
        // 2. Determine the Profile Key (e.g., 'DI', 'C')
        const profileKey = getProfileKey(factorScores);
        const profileData = blendedDescriptions[profileKey];
        
        if (!profileData) {
            showError(t('test_data_invalid'));
            return;
        }

        // Set the main result header using the blended profile name
        const mainResultTitle = document.getElementById('main-result-title');
        mainResultTitle.innerHTML = `${t('main_result_title')} <span class="text-indigo-600 font-extrabold">${profileData.name[currentLang]}</span>`;

        document.getElementById('result-subtitle').textContent = t('result_subtitle');
        document.getElementById('interpretation-title').textContent = t('interpretation_title');

        // --- Render Score Cards (Always show all 4 base factors) ---
        let scoreCardsHTML = '';
        
        // Find the two highest score factors for visual emphasis (regardless of the pure/blended split)
        const primaryStyles = [factorScores[0].factor, factorScores[1].factor]; 

        // Sort by factor letter (D, I, S, C) for consistent display in the score cards
        const factorOrder = ['D', 'I', 'S', 'C'];
        const sortedForDisplay = factorOrder.map(f => factorScores.find(s => s.factor === f));
        
        sortedForDisplay.forEach(item => {
            const desc = discDescriptions[item.factor];
            
            const factorCount = factorCounts[item.factor]; 
            const maxScore = factorCount * 4;             
            const minScore = factorCount * 1;             
            const range = maxScore - minScore;            

            const percentage = range > 0 
                ? Math.round(((item.score - minScore) / range) * 100)
                : 0;

            // Highlight the top two factors
            const isPrimary = primaryStyles.includes(item.factor);

            // Score Card HTML
            scoreCardsHTML += `
                <div class="p-6 rounded-xl border-2 ${desc.style} shadow-lg transition duration-300 ${isPrimary ? 'scale-[1.02] ring-4 ring-offset-2 ring-indigo-500' : ''}">
                    <div class="flex items-center mb-4">
                        <span class="text-3xl mr-3">${desc.icon}</span>
                        <h3 class="text-xl font-bold">${desc.title[currentLang]}</h3>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                        <div class="h-2.5 rounded-full ${isPrimary ? 'bg-indigo-600' : 'bg-gray-500'}" style="width: ${percentage}%"></div>
                    </div>
                    <p class="text-sm font-semibold mt-2">${item.score} / ${maxScore} ${t('points')} (${percentage}%)</p>
                </div>
            `;
        });

        resultScores.innerHTML = scoreCardsHTML;

        // --- Render Detailed Blended Interpretation ---
        const mainInterpretationHTML = `
            <div class="mb-6 p-6 rounded-xl border-l-4 ${profileData.style} shadow-md bg-white">
                <h4 class="text-2xl font-bold text-gray-800 mb-2 flex items-center">
                    <span class="text-3xl mr-3">${discDescriptions[profileKey.charAt(0)].icon}</span>
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

/**
 * Exports the results container content as a PDF file.
 */
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

/**
 * Resets the test state and restarts the quiz.
 */
function restartTest() {
    try {
        // Reset state variables to zero
        currentQuestionIndex = 0;
        
        if (isMBTITest) {
            mbtiScores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
        } else if (isBig5Test) {
            big5Scores = { O: 0, C: 0, E: 0, A: 0, N: 0 };
        } else {
            scores = { D: 0, I: 0, S: 0, C: 0 };
        }
        
        userRatings = [];
        
        // Clear progress
        clearProgress();
        
        // Hide results and show the test container
        resultsContainer.classList.add('hidden');
        testContainer.classList.remove('hidden');
        
        // Clear the dynamically generated HTML results
        document.getElementById('result-scores').innerHTML = '';
        document.getElementById('result-interpretation').innerHTML = '';
        
        if (isMBTITest) {
            const mbtiTypeDisplay = document.getElementById('mbti-type-display');
            if (mbtiTypeDisplay) mbtiTypeDisplay.innerHTML = '';
        }

        // Render the first question and update the progress bar to 0%
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

// Initialize the app when the window loads
window.onload = init;