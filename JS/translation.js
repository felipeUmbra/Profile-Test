import { currentLang } from '/script.js';


export const interfaceTranslations = {
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
    }, 
    'de': {
        disc_title: "DISC-Persönlichkeitstest",
        disc_subtitle: "Bewerten Sie, wie sehr jede Aussage auf Sie zutrifft (1 = Minimum, 4 = Maximum)",
        progress_q_of_total: "Frage {q} von {total}",
        rating_1: "1 - Trifft nicht auf mich zu",
        rating_2: "2 - Trifft kaum auf mich zu",
        rating_3: "3 - Trifft teilweise auf mich zu",
        rating_4: "4 - Trifft auf mich zu",
        rating_guide: "Tippen oder klicken Sie auf eine Zahl, um die Aussage zu bewerten (1 = Minimum, 4 = Maximum)",
        main_result_title: "Ihr Persönlichkeitsprofil:",
        result_subtitle: "Unten finden Sie Ihre Punktzahlen für die vier DISC-Faktoren, gefolgt von einer detaillierten Interpretation Ihres kombinierten Stils.",
        interpretation_title: "Detaillierte Profilinterpretation",
        points: "Punkte",
        restart: "Test neu starten",
        export_pdf: "Als PDF exportieren 📄",
        filename: "DISC_Personality_Results_DE",
        back_to_home: "← Zurück zur Startseite",

        mbti_title: "MBTI-Persönlichkeitstest",
        mbti_subtitle: "Wählen Sie für jede Aussage die Option, die Sie am besten beschreibt",
        mbti_rating_guide: "Wählen Sie die Aussage, die Ihre natürliche Präferenz besser beschreibt",
        mbti_main_result_title: "Ihr MBTI-Persönlichkeitstyp:",
        mbti_result_subtitle: "Ihr MBTI-Persönlichkeitstyp und eine detaillierte Interpretation",
        mbti_interpretation_title: "Detaillierte Typinterpretation",
        mbti_filename: "MBTI_Persönlichkeitsresultate_DE",

        big5_title: "Big-Five-Persönlichkeitstest",
        big5_subtitle: "Bewerten Sie, wie sehr jede Aussage auf Sie zutrifft (1 = Stimme überhaupt nicht zu, 5 = Stimme voll und ganz zu)",
        big5_main_result_title: "Ihre Big-Five-Persönlichkeitsmerkmale:",
        big5_result_subtitle: "Unten sehen Sie Ihre Ergebnisse für die fünf wichtigsten Persönlichkeitsfaktoren",
        big5_interpretation_title: "Merkmalsinterpretationen",
        big5_filename: "Big5_Persönlichkeitsresultate_DE",

        // Big Five factor names
        big5_openness: "Offenheit",
        big5_conscientiousness: "Gewissenhaftigkeit",
        big5_extraversion: "Extraversion",
        big5_agreeableness: "Verträglichkeit",
        big5_neuroticism: "Neurotizismus",

        error_general: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
        error_pdf: "PDF konnte nicht erstellt werden. Bitte versuchen Sie es erneut.",
        loading: "Wird geladen...",
        resuming_test: "Vorherigen Test wird fortgesetzt...",
        test_data_invalid: "Die Testdaten scheinen ungültig zu sein. Ein neuer Test wird gestartet.",
        error_fetch_questions: "Fragen konnten nicht vom Server geladen werden. Bitte überprüfen Sie Ihre Verbindung."
    }
};

// Index Page Translations
export const indexInterfaceTranslations = {
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
    },
    'de': {
        mainTitle: "Persönlichkeitstest-Zentrale",
        subtitle: "Wählen Sie einen Persönlichkeitstest, um mehr über sich selbst zu erfahren:",
        discTest: "DISC-Persönlichkeitstest",
        discSubtitle: "Verstehen Sie Ihren Kommunikations- und Arbeitsstil",
        mbtiTest: "MBTI-Persönlichkeitstest",
        mbtiSubtitle: "Entdecken Sie Ihren psychologischen Typ",
        big5Test: "Big-Five-Persönlichkeitstest",
        big5Subtitle: "Erkunden Sie die fünf wichtigsten Persönlichkeitsdimensionen",
        resultsTitle: "Ihre Testergebnisse",
        clearResults: "Alle Ergebnisse löschen",
        footerText1: "Alle Tests sind auf Englisch, Portugiesisch und Spanisch verfügbar",
        footerText2: "Ihre Ergebnisse werden automatisch gespeichert und können hier jederzeit eingesehen werden",
        confirmDelete: "Sind Sie sicher, dass Sie dieses Ergebnis löschen möchten?",
        confirmClearAll: "Sind Sie sicher, dass Sie alle Ihre Testergebnisse löschen möchten?",
        // Big Five trait descriptions
        strongCharacteristics: "🌟 Starke Eigenschaften:",
        balancedCharacteristics: "⚖️ Ausgewogene Eigenschaften:",
        developingCharacteristics: "🌱 Sich entwickelnde Eigenschaften:",
        personalityProfile: "Ihr Persönlichkeitsprofil",
        basedOnAssessment: "Basierend auf Ihrer Big-Five-Bewertung"
    },
    
};

// Index page translation function
export function translateUtilIndex(key, replacements = {}) {
    try {
        let text = indexInterfaceTranslations[currentLang][key] || indexInterfaceTranslations['en'][key] || key;
        for (const [k, v] of Object.entries(replacements)) {
            text = text.replace(`{${k}}`, v);
        }
        return text;
    } catch (error) {
        console.error('Index translation error:', error);
        return key;
    }
}