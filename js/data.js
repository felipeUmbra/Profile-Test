// data.js
export const CONFIG = {
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

export const translations = {
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

export const indexTranslations = {

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

// Also move discDescriptions, mbtiTypeDescriptions, big5TraitDescriptions here
export const discDescriptions = {
    D: { title: { en: "Dominance (D)", pt: "Dominância (D)", es: "Dominancia (D)" }, style: "bg-red-100 border-red-500 text-red-700", icon: "⚡" },
    I: { title: { en: "Influence (I)", pt: "Influência (I)", es: "Influencia (I)" }, style: "bg-yellow-100 border-yellow-500 text-yellow-700", icon: "✨" },
    S: { title: { en: "Steadiness (S)", pt: "Estabilidade (S)", es: "Estabilidad (S)" }, style: "bg-green-100 border-green-500 text-green-700", icon: "🌿" },
    C: { title: { en: "Conscientiousness (C)", pt: "Conscienciosidade (C)", es: "Cumplimiento (C)" }, style: "bg-blue-100 border-blue-500 text-blue-700", icon: "🔬" }
};

export const mbtiDimensions = {
    E: { title: { en: "Extraversion", pt: "Extroversão", es: "Extraversión" }, style: "bg-blue-100 border-blue-500 text-blue-700", icon: "🗣️", description: { en: "Energized by social interaction", pt: "Energizado por interação social", es: "Energizado por interacción social"} },
    I: { title: { en: "Introversion", pt: "Introversão", es: "Introversión" }, style: "bg-indigo-100 border-indigo-500 text-indigo-700", icon: "🤫", description: { en: "Energized by solitude and reflection", pt: "Energizado por solidão e reflexão", es: "Energizado por soledad y reflexión"} },
    S: { title: { en: "Sensing", pt: "Sensação", es: "Sensación" }, style: "bg-green-100 border-green-500 text-green-700", icon: "🔍", description: { en: "Focus on concrete, practical details", pt: "Foco em detalhes concretos e práticos", es: "Foco en detalles concretos y prácticos"} },
    N: { title: { en: "Intuition", pt: "Intuição",es: "Intuición" }, style: "bg-purple-100 border-purple-500 text-purple-700", icon: "💡", description: { en: "Focus on patterns and possibilities", pt: "Foco em padrões e possibilidades", es: "Foco en patrones y posibilidades"} },
    T: { title: { en: "Thinking", pt: "Pensamento", es: "Pensamiento"}, style: "bg-orange-100 border-orange-500 text-orange-700", icon: "⚖️", description: { en: "Decisions based on logic and objectivity", pt: "Decisões baseadas em lógica e objetividade", es: "Decisión basado en la lógica y objetividad"} },
    F: { title: { en: "Feeling", pt: "Sentimento", es: "Sentimiento"}, style: "bg-pink-100 border-pink-500 text-pink-700", icon: "❤️", description: { en: "Decisions based on values and harmony", pt: "Decisões baseadas em valores e harmonia", es: "Decisión basado en valores y harmonía"} },
    J: { title: { en: "Judging", pt: "Julgamento", es: "Juicio"}, style: "bg-teal-100 border-teal-500 text-teal-700", icon: "📋", description: { en: "Prefer structure and decidedness", pt: "Prefere estrutura e decisões tomadas", es: "Prefer estructura y decisiones tomadas"} },
    P: { title: { en: "Perceiving", pt: "Percepção", es: "Percepción"}, style: "bg-amber-100 border-amber-500 text-amber-700", icon: "🔄", description: { en: "Prefer flexibility and spontaneity", pt: "Prefere flexibilidade e espontaneidade", es: "Prefer flexibilidad y estigmatismo"} }
};

export const mbtiTypeDescriptions = {
    "ISTJ": {
        name: { en: "The Inspector", pt: "O Inspetor", es: "El Inspector" },
        description: {
            en: "Practical, fact-minded, and reliable. You value tradition, order, and stability.",
            pt: "Prático, centrado em fatos e confiável. Você valoriza tradição, ordem e estabilidade.",
            es: "Práctico, orientado a los hechos y confiable. Valoras la tradición, el orden y la estabilidad."
        }
    },
    "ISFJ": {
        name: { en: "The Protector", pt: "O Protetor", es: "El Protector" },
        description: {
            en: "Warm, caring, and responsible. You are committed to your duties and loyal to your relationships.",
            pt: "Caloroso, cuidadoso e responsável. Você é comprometido com seus deveres e leal aos seus relacionamentos.",
            es: "Cálido, cariñoso y responsable. Estás comprometido con tus deberes y leal a tus relaciones."
        }
    },
    "INFJ": {
        name: { en: "The Advocate", pt: "O Advogado", es: "El Abogado" },
        description: {
            en: "Insightful, principled, and organized. You have a strong sense of purpose and work towards your ideals.",
            pt: "Perspicaz, principista e organizado. Você tem um forte senso de propósito e trabalha em direção aos seus ideais.",
            es: "Perspicaz, principista y organizado. Tienes un fuerte sentido de propósito y trabajas hacia tus ideales."
        }
    },
    "INTJ": {
        name: { en: "The Architect", pt: "O Arquiteto", es: "El Arquitecto" },
        description: {
            en: "Strategic, independent, and determined. You have a vision for the future and work systematically to achieve it.",
            pt: "Estratégico, independente e determinado. Você tem uma visão para o futuro e trabalha sistematicamente para alcançá-la.",
            es: "Estratégico, independiente y determinado. Tienes una visión para el futuro y trabajas sistemáticamente para lograrla."
        }
    },
    "ISTP": {
        name: { en: "The Craftsman", pt: "O Artesão", es: "El Artesano" },
        description: {
            en: "Practical, observant, and flexible. You enjoy understanding how things work and solving practical problems.",
            pt: "Prático, observador e flexível. Você gosta de entender como as coisas funcionam e resolver problemas práticos.",
            es: "Práctico, observador y flexible. Te gusta entender cómo funcionan las cosas y resolver problemas prácticos."
        }
    },
    "ISFP": {
        name: { en: "The Artist", pt: "O Artista", es: "El Artista" },
        description: {
            en: "Gentle, sensitive, and artistic. You value harmony and enjoy creating beauty in your surroundings.",
            pt: "Gentil, sensível e artístico. Você valoriza harmonia e gosta de criar beleza em seu entorno.",
            es: "Gentil, sensible y artístico. Valoras la armonía y disfrutas creando belleza en tu entorno."
        }
    },
    "INFP": {
        name: { en: "The Mediator", pt: "O Mediador", es: "El Mediador" },
        description: {
            en: "Idealistic, creative, and empathetic. You are guided by your strong values and desire to make the world better.",
            pt: "Idealista, criativo e empático. Você é guiado por seus fortes valores e desejo de tornar o mundo melhor.",
            es: "Idealista, creativo y empático. Estás guiado por tus fuertes valores y deseo de hacer del mundo un lugar mejor."
        }
    },
    "INTP": {
        name: { en: "The Thinker", pt: "O Pensador", es: "El Pensador" },
        description: {
            en: "Analytical, innovative, and curious. You enjoy theoretical problems and exploring complex ideas.",
            pt: "Analítico, inovador e curioso. Você gosta de problemas teóricos e explorar ideias complexas.",
            es: "Analítico, innovador y curioso. Disfrutas de problemas teóricos y explorar ideas complejas."
        }
    },
    "ESTP": {
        name: { en: "The Persuader", pt: "O Persuador", es: "El Persuasor" },
        description: {
            en: "Energetic, practical, and spontaneous. You enjoy action and are skilled at navigating immediate challenges.",
            pt: "Energético, prático e espontâneo. Você gosta de ação e é habilidoso em navegar desafios imediatos.",
            es: "Enérgico, práctico y espontáneo. Disfrutas de la acción y eres hábil para navegar desafíos inmediatos."
        }
    },
    "ESFP": {
        name: { en: "The Performer", pt: "O Performista", es: "El Intérprete" },
        description: {
            en: "Outgoing, friendly, and enthusiastic. You enjoy bringing energy and fun to social situations.",
            pt: "Extrovertido, amigável e entusiástico. Você gosta de trazer energia e diversão para situações sociais.",
            es: "Extrovertido, amigable y entusiasta. Disfrutas de aportar energía y diversión a las situaciones sociales."
        }
    },
    "ENFP": {
        name: { en: "The Champion", pt: "O Campeão", es: "El Campeón" },
        description: {
            en: "Enthusiastic, creative, and sociable. You see possibilities everywhere and enjoy inspiring others.",
            pt: "Entusiástico, criativo e sociável. Você vê possibilidades em todos os lugares e gosta de inspirar os outros.",
            es: "Entusiasta, creativo y sociable. Ves posibilidades en todas partes y disfrutas inspirando a los demás."
        }
    },
    "ENTP": {
        name: { en: "The Debater", pt: "O Debatedor", es: "El Debateador" },
        description: {
            en: "Innovative, quick-witted, and outspoken. You enjoy intellectual challenges and debating ideas.",
            pt: "Inovador, perspicaz e franco. Você gosta de desafios intelectuais e debater ideias.",
            es: "Innovador, ingenioso y franco. Disfrutas de desafíos intelectuales y debatir ideas."
        }
    },
    "ESTJ": {
        name: { en: "The Supervisor", pt: "O Supervisor", es: "El Supervisor" },
        description: {
            en: "Practical, traditional, and organized. You value order and structure in your environment.",
            pt: "Prático, tradicional e organizado. Você valoriza ordem e estrutura em seu ambiente.",
            es: "Práctico, tradicional y organizado. Valoras el orden y la estructura en tu entorno."
        }
    },
    "ESFJ": {
        name: { en: "The Caregiver", pt: "O Cuidador", es: "El Cuidador" },
        description: {
            en: "Sociable, caring, and popular. You enjoy helping others and creating harmonious environments.",
            pt: "Sociável, cuidadoso e popular. Você gosta de ajudar os outros e criar ambientes harmoniosos.",
            es: "Sociable, cariñoso y popular. Disfrutas ayudando a los demás y creando ambientes armoniosos."
        }
    },
    "ENFJ": {
        name: { en: "The Teacher", pt: "O Professor", es: "El Maestro" },
        description: {
            en: "Empathetic, organized, and inspiring. You are skilled at understanding others and motivating them.",
            pt: "Empático, organizado e inspirador. Você é habilidoso em entender os outros e motivá-los.",
            es: "Empático, organizado e inspirador. Eres hábil para entender a los demás y motivarlos."
        }
    },
    "ENTJ": {
        name: { en: "The Commander", pt: "O Comandante", es: "El Comandante" },
        description: {
            en: "Strategic, assertive, and efficient. You are a natural leader who enjoys organizing people and resources.",
            pt: "Estratégico, assertivo e eficiente. Você é um líder natural que gosta de organizar pessoas e recursos.",
            es: "Estratégico, asertivo y eficiente. Eres un líder natural que disfruta organizando personas y recursos."
        }
    }
};

export const big5TraitDescriptions = {
    "Openness": {
        "en": "Reflects imagination, intellectual curiosity, and willingness to experiment with new things.",
        "pt": "Reflete a imaginação, curiosidade intelectual e vontade de experimentar novas coisas.",
        "es": "Refleja la imaginación, la curiosidad intelectual y la voluntad de experimentar cosas nuevas."
    },
    "Conscientiousness": {
        "en": "Reflects self-discipline, organization, and the drive to achieve goals.",
        "pt": "Reflete a autodisciplina, organização e a motivação para alcançar objetivos.",
        "es": "Refleja la autodisciplina, la organización y la motivación para alcanzar metas."
    },
    "Extraversion": {
        "en": "Reflects the pursuit of social stimulation, assertiveness, and energy levels.",
        "pt": "Reflete a busca por estimulação social, assertividade e o nível de energia.",
        "es": "Refleja la búsqueda de estimulación social, asertividad y niveles de energía."
    },
    "Agreeableness": {
        "en": "Reflects the tendency to be compassionate, cooperative, and trusting of others.",
        "pt": "Reflete a tendência a ser compassivo, cooperativo e confiável em relação aos outros.",
        "es": "Refleja la tendencia a ser compasivo, cooperativo y confiado con los demás."
    },
    "Neuroticism": {
        "en": "Reflects the tendency to experience negative emotions such as anxiety, anger, or depression.",
        "pt": "Reflete a tendência a experienciar emoções negativas, como ansiedade, raiva ou depressão.",
        "es": "Refleja la tendencia a experimentar emociones negativas como ansiedad, ira o depresión."
    }
};

export const big5Descriptions = {
    "Openness": {
        "High": {
            "en": "You tend to be creative, curious, and open to new experiences. You enjoy abstract concepts and intellectual challenges.",
            "pt": "Você tende a ser criativo, curioso e aberto a novas experiências. Gosta de conceitos abstratos e desafios intelectuais.",
            "es": "Tiendes a ser creativo, curioso y abierto a nuevas experiencias. Disfrutas de conceptos abstractos y desafíos intelectuales."
        },
        "Low": {
            "en": "You tend to be practical, conventional, and prefer familiar routines. You focus on the concrete and the known.",
            "pt": "Você tende a ser prático, convencional e prefere rotinas familiares. Foca no concreto e no que já é conhecido.",
            "es": "Tiendes a ser práctico, convencional y prefieres rutinas familiares. Te enfocas en lo concreto y lo conocido."
        }
    },
    "Conscientiousness": {
        "High": {
            "en": "You are organized, reliable, and disciplined. You tend to plan ahead and focus on long-term achievements.",
            "pt": "Você é organizado, confiável e disciplinado. Tende a planejar com antecedência e foca em conquistas de longo prazo.",
            "es": "Eres organizado, confiable y disciplinado. Tiendes a planificar con anticipación y te enfocas en logros a largo plazo."
        },
        "Low": {
            "en": "You may be more spontaneous and flexible, but might struggle with organization and strict deadlines.",
            "pt": "Você pode ser mais espontâneo e flexível, mas pode ter dificuldade com organização e cumprimento de prazos rigorosos.",
            "es": "Puedes ser más espontáneo y flexible, pero podrías tener dificultades con la organización y los plazos estrictos."
        }
    },
    "Extraversion": {
        "High": {
            "en": "You get energized by being around others. You are sociable, talkative, and generally assertive in groups.",
            "pt": "Você se energiza ao estar com outras pessoas. É sociável, falante e geralmente assertivo em grupos.",
            "es": "Te llenas de energía al estar con otras personas. Eres sociable, hablador y generalmente asertivo en grupos."
        },
        "Low": {
            "en": "You are more reserved and prefer solitude or small groups. Excessive social interaction can be draining for you.",
            "pt": "Você é mais reservado e prefere a solidão ou grupos pequenos. Interações sociais excessivas podem ser cansativas para você.",
            "es": "Eres más reservado y prefieres la soledad o grupos pequeños. La interacción social excesiva puede ser agotadora para ti."
        }
    },
    "Agreeableness": {
        "High": {
            "en": "You are empathetic, helpful, and cooperative. You value social harmony and tend to trust people.",
            "pt": "Você é empático, prestativo e cooperativo. Valoriza a harmonia social e tende a confiar nas pessoas.",
            "es": "Eres empático, servicial y cooperativo. Valoras la armonía social y tiendes a confiar en las personas."
        },
        "Low": {
            "en": "You may be more competitive or skeptical of others' intentions. You prioritize logic or self-interest over harmony.",
            "pt": "Você pode ser mais competitivo ou cético em relação às intenções dos outros. Prioriza a lógica ou o interesse próprio sobre a harmonia.",
            "es": "Puedes ser más competitivo o escéptico sobre las intenciones de los demás. Priorizas la lógica o el interés propio sobre la armonía."
        }
    },
    "Neuroticism": {
        "High": {
            "en": "You tend to feel stress and negative emotions more easily. You may frequently worry about what could go wrong.",
            "pt": "Você tende a sentir estresse e emoções negativas com mais facilidade. Pode se preocupar frequentemente com o que pode dar errado.",
            "es": "Tiendes a sentir estrés y emociones negativas con más facilidad. Puedes preocuparte frecuentemente por lo que podría salir mal."
        },
        "Low": {
            "en": "You are emotionally stable, calm, and resilient. You are rarely shaken by stressful situations.",
            "pt": "Você é emocionalmente estável, calmo e resiliente. Dificilmente se abala com situações estressantes.",
            "es": "Eres emocionalmente estable, tranquilo y resiliente. Rara vez te afectan las situaciones estresantes."
        }
    }
};

export const big5Metadata = {
    "O": { 
        key: "Openness", 
        title: { en: "Openness", pt: "Abertura", es: "Apertura" }, 
        style: "bg-blue-100 border-blue-500 text-blue-700", 
        icon: "🔮" 
    },
    "C": { 
        key: "Conscientiousness", 
        title: { en: "Conscientiousness", pt: "Conscienciosidade", es: "Responsabilidad" }, 
        style: "bg-green-100 border-green-500 text-green-700", 
        icon: "📅" 
    },
    "E": { 
        key: "Extraversion", 
        title: { en: "Extraversion", pt: "Extroversão", es: "Extraversión" }, 
        style: "bg-yellow-100 border-yellow-500 text-yellow-700", 
        icon: "🗣️" 
    },
    "A": { 
        key: "Agreeableness", 
        title: { en: "Agreeableness", pt: "Amabilidade", es: "Amabilidad" }, 
        style: "bg-pink-100 border-pink-500 text-pink-700", 
        icon: "🤝" 
    },
    "N": { 
        key: "Neuroticism", 
        title: { en: "Neuroticism", pt: "Neuroticismo", es: "Neuroticismo" }, 
        style: "bg-red-100 border-red-500 text-red-700", 
        icon: "🌩️" 
    }
};

export const blendedDescriptions = {
    "D": {
        name: { en: "Dominant", pt: "Dominante", es: "Dominante" },
        style: "bg-red-100 border-red-500 text-red-700",
        description: {
            en: "You are direct, results-oriented, and assertive. You thrive on challenges and take charge in situations. Your natural confidence and determination help you overcome obstacles quickly. You prefer environments where you can make decisions and see immediate progress.",
            pt: "Você é direto, orientado a resultados e assertivo. Você prospera em desafios e assume o comando em situações. Sua confiança natural e determinação ajudam você a superar obstáculos rapidamente. Você prefere ambientes onde pode tomar decisões e ver progresso imediato.",
            es: "Eres directo, orientado a resultados y asertivo. Prosperas ante los desafíos y tomas el mando en las situaciones. Tu confianza natural y determinación te ayudan a superar obstáculos rápidamente. Prefieres entornos donde puedas tomar decisiones y ver un progreso inmediato."
        }
    },
    "I": {
        name: { en: "Influential", pt: "Influente", es: "Influyente" },
        style: "bg-yellow-100 border-yellow-500 text-yellow-700",
        description: {
            en: "You are outgoing, enthusiastic, and persuasive. You excel at building relationships and motivating others. Your optimism and communication skills make you effective in social and team settings. You thrive in environments that value collaboration and positive energy.",
            pt: "Você é extrovertido, entusiástico e persuasivo. Você se destaca em construir relacionamentos e motivar os outros. Seu otimismo e habilidades de comunicação tornam você eficaz em ambientes sociais e de equipe. Você prospera em ambientes que valorizam colaboração e energia positiva.",
            es: "Eres extrovertido, entusiasta y persuasivo. Te destacas en la construcción de relaciones y en motivar a los demás. Tu optimismo y habilidades de comunicación te hacen efectivo en entornos sociales y de equipo. Prosperas en entornos que valoran la colaboración y la energía positiva."
        }
    },
    "S": {
        name: { en: "Steady", pt: "Estável", es: "Estable" },
        style: "bg-green-100 border-green-500 text-green-700",
        description: {
            en: "You are patient, reliable, and supportive. You value stability and work well in consistent environments. Your calm demeanor and listening skills make you an excellent team player. You excel in roles that require persistence, cooperation, and attention to established processes.",
            pt: "Você é paciente, confiável e solidário. Você valoriza estabilidade e trabalha bem em ambientes consistentes. Sua serenidade e habilidades de escuta tornam você um excelente membro de equipe. Você se destaca em funções que exigem persistência, cooperação e atenção aos processos estabelecidos.",
            es: "Eres paciente, confiable y solidario. Valoras la estabilidad y trabajas bien en entornos consistentes. Tu comportamiento tranquilo y habilidades de escucha te convierten en un excelente miembro de equipo. Te destacas en roles que requieren persistencia, cooperación y atención a procesos establecidos."
        }
    },
    "C": {
        name: { en: "Conscientious", pt: "Consciencioso", es: "Concienzudo" },
        style: "bg-blue-100 border-blue-500 text-blue-700",
        description: {
            en: "You are analytical, precise, and quality-focused. You value accuracy and enjoy working with detailed information. Your systematic approach and high standards ensure excellent results. You thrive in environments that require careful analysis, planning, and attention to detail.",
            pt: "Você é analítico, preciso e focado na qualidade. Você valoriza precisão e gosta de trabalhar com informações detalhadas. Sua abordagem sistemática e altos padrões garantem resultados excelentes. Você prospera em ambientes que exigem análise cuidadosa, planejamento e atenção aos detalhes.",
            es: "Eres analítico, preciso y centrado en la calidad. Valoras la exactitud y disfrutas trabajando con información detallada. Tu enfoque sistemático y altos estándares aseguran resultados excelentes. Prosperas en entornos que requieren análisis cuidadoso, planificación y atención al detalle."
        }
    },
    "DI": {
        name: { en: "Driver-Influencer", pt: "Condutor-Influenciador", es: "Conductor-Influyente" },
        style: "bg-orange-100 border-orange-500 text-orange-700",
        description: {
            en: "You combine determination with social energy. You're both goal-oriented and people-focused, able to drive results while maintaining positive relationships. Your blend of assertiveness and enthusiasm makes you effective in leadership and sales roles.",
            pt: "Você combina determinação com energia social. Você é orientado a objetivos e focado em pessoas, capaz de conduzir resultados mantendo relacionamentos positivos. Sua mistura de assertividade e entusiasmo torna você eficaz em funções de liderança e vendas.",
            es: "Combinas determinación con energía social. Estás orientado tanto a objetivos como a personas, capaz de impulsar resultados manteniendo relaciones positivas. Tu mezcla de asertividad y entusiasmo te hace efectivo en roles de liderazgo y ventas."
        }
    },
    "ID": {
        name: { en: "Influencer-Driver", pt: "Influenciador-Condutor", es: "Influyente-Conductor" },
        style: "bg-amber-100 border-amber-500 text-amber-700",
        description: {
            en: "You lead with enthusiasm backed by determination. Your primary focus is on relationships and inspiration, but you can be decisive when needed. You excel at motivating teams while ensuring progress toward objectives.",
            pt: "Você lidera com entusiasmo apoiado por determinação. Seu foco principal está em relacionamentos e inspiração, mas você pode ser decisivo quando necessário. Você se destaca em motivar equipes enquanto garante progresso em direção aos objetivos.",
            es: "Lideras con entusiasmo respaldado por determinación. Tu enfoque principal está en las relaciones y la inspiración, pero puedes ser decisivo cuando es necesario. Te destacas motivando equipos mientras aseguras el progreso hacia los objetivos."
        }
    },
    "IS": {
        name: { en: "Influencer-Steady", pt: "Influenciador-Estável", es: "Influyente-Estable" },
        style: "bg-lime-100 border-lime-500 text-lime-700",
        description: {
            en: "You blend social energy with supportive stability. You're great at building lasting relationships and creating harmonious environments. Your combination of enthusiasm and reliability makes you a trusted team member who balances optimism with practical support.",
            pt: "Você combina energia social com estabilidade solidária. Você é ótimo em construir relacionamentos duradouros e criar ambientes harmoniosos. Sua combinação de entusiasmo e confiabilidade torna você um membro da equipe confiável que equilibra otimismo com suporte prático.",
            es: "Mezclas energía social con estabilidad de apoyo. Eres excelente construyendo relaciones duraderas y creando entornos armoniosos. Tu combinación de entusiasmo y confiabilidad te convierte en un miembro de equipo de confianza que equilibra el optimismo con el apoyo práctico."
        }
    },
    "SI": {
        name: { en: "Steady-Influencer", pt: "Estável-Influenciador", es: "Estable-Influyente" },
        style: "bg-emerald-100 border-emerald-500 text-emerald-700",
        description: {
            en: "You provide stable support with warm enthusiasm. Your primary strength is reliability and patience, complemented by good people skills. You create comfortable environments where people feel supported and valued.",
            pt: "Você fornece suporte estável com entusiasmo caloroso. Sua principal força é confiabilidade e paciência, complementada por boas habilidades com pessoas. Você cria ambientes confortáveis onde as pessoas se sentem apoiadas e valorizadas.",
            es: "Proporcionas apoyo estable con un entusiasmo cálido. Tu principal fortaleza es la confiabilidad y la paciencia, complementada con buenas habilidades interpersonales. Creas entornos cómodos donde las personas se sienten apoyadas y valoradas."
        }
    },
    "SC": {
        name: { en: "Steady-Conscientious", pt: "Estável-Consciencioso", es: "Estable-Concienzudo" },
        style: "bg-cyan-100 border-cyan-500 text-cyan-700",
        description: {
            en: "You combine reliability with analytical precision. You're both patient and thorough, excellent at following through on commitments with careful attention to detail. Your methodical approach ensures quality results in stable environments.",
            pt: "Você combina confiabilidade com precisão analítica. Você é paciente e minucioso, excelente em cumprir compromissos com cuidadosa atenção aos detalhes. Sua abordagem metódica garante resultados de qualidade em ambientes estáveis.",
            es: "Combinas confiabilidad con precisión analítica. Eres paciente y minucioso, excelente para cumplir compromisos con cuidadosa atención al detalle. Tu enfoque metódico asegura resultados de calidad en entornos estables."
        }
    },
    "CS": {
        name: { en: "Conscientious-Steady", pt: "Consciencioso-Estável", es: "Concienzudo-Estable" },
        style: "bg-sky-100 border-sky-500 text-sky-700",
        description: {
            en: "You approach tasks with careful analysis and consistent follow-through. Your primary focus is accuracy and quality, supported by reliable work habits. You excel in roles that require both precision and persistence.",
            pt: "Você aborda tarefas com análise cuidadosa e acompanhamento consistente. Seu foco principal é precisão e qualidade, apoiado por hábitos de trabalho confiáveis. Você se destaca em funções que exigem precisão e persistência.",
            es: "Abordas las tareas con un análisis cuidadoso y un seguimiento constante. Tu enfoque principal es la exactitud y la calidad, respaldado por hábitos de trabajo confiables. Te destacas en roles que requieren tanto precisión como persistencia."
        }
    },
    "CD": {
        name: { en: "Conscientious-Driver", pt: "Consciencioso-Condutor", es: "Concienzudo-Conductor" },
        style: "bg-violet-100 border-violet-500 text-violet-700",
        description: {
            en: "You blend analytical thinking with determined action. You're both precise and results-oriented, able to analyze situations thoroughly then drive toward solutions. Your combination of critical thinking and decisiveness makes you effective in complex problem-solving.",
            pt: "Você combina pensamento analítico com ação determinada. Você é preciso e orientado a resultados, capaz de analisar situações minuciosamente e depois conduzir em direção a soluções. Sua combinação de pensamento crítico e decisão torna você eficaz na resolução de problemas complexos.",
            es: "Mezclas pensamiento analítico con acción determinada. Eres preciso y orientado a resultados, capaz de analizar situaciones a fondo y luego impulsar soluciones. Tu combinación de pensamiento crítico y decisión te hace efectivo en la resolución de problemas complejos."
        }
    },
    "DC": {
        name: { en: "Driver-Conscientious", pt: "Condutor-Consciencioso", es: "Conductor-Concienzudo" },
        style: "bg-purple-100 border-purple-500 text-purple-700",
        description: {
            en: "You lead with determination supported by careful analysis. Your primary drive is achieving results, but you ensure they meet high standards of quality. You're effective at driving projects forward while maintaining attention to important details.",
            pt: "Você lidera com determinação apoiada por análise cuidadosa. Sua principal motivação é alcançar resultados, mas você garante que eles atendam a altos padrões de qualidade. Você é eficaz em conduzir projetos para frente enquanto mantém atenção a detalhes importantes.",
            es: "Lideras con determinación respaldada por un análisis cuidadoso. Tu principal impulso es lograr resultados, pero aseguras que cumplan con altos estándares de calidad. Eres efectivo impulsando proyectos mientras mantienes atención a los detalles importantes."
        }
    }
};