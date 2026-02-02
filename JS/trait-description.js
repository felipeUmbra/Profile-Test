// Big Five trait descriptions for index page
export const big5TraitDescriptions = {
    'O': {
        name: { en: 'Openness', pt: 'Abertura', es: 'Apertura' },
        high: { 
            en: 'Imaginative, creative, curious, open to new experiences', 
            pt: 'Imaginativo, criativo, curioso, aberto a novas experiências',
            es: 'Imaginativo, creativo, curioso, abierto a nuevas experiencias'
        },
        moderate: { 
            en: 'Balanced between practicality and creativity', 
            pt: 'Equilibrado entre praticidade e criatividade',
            es: 'Equilibrado entre practicidad y creatividad'
        },
        low: { 
            en: 'Practical, conventional, prefers routine', 
            pt: 'Prático, convencional, prefere rotina',
            es: 'Práctico, convencional, prefiere la rutina'
        }
    },
    'C': {
        name: { en: 'Conscientiousness', pt: 'Conscienciosidade', es: 'Responsabilidad' },
        high: { 
            en: 'Organized, disciplined, reliable, goal-oriented', 
            pt: 'Organizado, disciplinado, confiável, orientado a objetivos',
            es: 'Organizado, disciplinado, confiable, orientado a objetivos'
        },
        moderate: { 
            en: 'Balanced between spontaneity and planning', 
            pt: 'Equilibrado entre espontaneidade e planejamento',
            es: 'Equilibrado entre espontaneidad y planificación'
        },
        low: { 
            en: 'Flexible, spontaneous, adaptable to change', 
            pt: 'Flexível, espontâneo, adaptável a mudanças',
            es: 'Flexible, espontáneo, adaptable a los cambios'
        }
    },
    'E': {
        name: { en: 'Extraversion', pt: 'Extroversão', es: 'Extraversión' },
        high: { 
            en: 'Sociable, energetic, enthusiastic, talkative', 
            pt: 'Sociável, energético, entusiástico, comunicativo',
            es: 'Sociable, enérgico, entusiasta, hablador'
        },
        moderate: { 
            en: 'Balanced between social and solitary activities', 
            pt: 'Equilibrado entre atividades sociais e solitárias',
            es: 'Equilibrado entre actividades sociales y solitarias'
        },
        low: { 
            en: 'Reserved, reflective, enjoys solitude', 
            pt: 'Reservado, reflexivo, aprecia solidão',
            es: 'Reservado, reflexivo, disfruta de la soledad'
        }
    },
    'A': {
        name: { en: 'Agreeableness', pt: 'Amabilidade', es: 'Amabilidad' },
        high: { 
            en: 'Compassionate, cooperative, trusting, empathetic', 
            pt: 'Compassivo, cooperativo, confiante, empático',
            es: 'Compasivo, cooperativo, confiado, empático'
        },
        moderate: { 
            en: 'Balanced between cooperation and assertiveness', 
            pt: 'Equilibrado entre cooperação e assertividade',
            es: 'Equilibrado entre cooperación y asertividad'
        },
        low: { 
            en: 'Analytical, straightforward, values independence', 
            pt: 'Analítico, direto, valoriza independência',
            es: 'Analítico, directo, valora la independencia'
        }
    },
    'N': {
        name: { en: 'Neuroticism', pt: 'Neuroticismo', es: 'Neuroticismo' },
        high: { 
            en: 'Sensitive to stress, experiences strong emotions', 
            pt: 'Sensível ao estresse, experimenta emoções fortes',
            es: 'Sensible al estrés, experimenta emociones fuertes'
        },
        moderate: { 
            en: 'Generally emotionally stable with occasional sensitivity', 
            pt: 'Geralmente estável emocionalmente com sensibilidade ocasional',
            es: 'Generalmente estable con sensibilidad ocasional'
        },
        low: { 
            en: 'Emotionally stable, resilient, calm under pressure', 
            pt: 'Estável emocionalmente, resiliente, calmo sob pressão',
            es: 'Emocionalmente estable, resiliente, tranquilo bajo presión'
        }
    }
};

// Base descriptions for DISC factors
export const discDescriptions = {
    D: { title: { en: "Dominance (D)", pt: "Dominância (D)", es: "Dominancia (D)" }, style: "bg-red-100 border-red-500 text-red-700", icon: "⚡" },
    I: { title: { en: "Influence (I)", pt: "Influência (I)", es: "Influencia (I)" }, style: "bg-yellow-100 border-yellow-500 text-yellow-700", icon: "✨" },
    S: { title: { en: "Steadiness (S)", pt: "Estabilidade (S)", es: "Estabilidad (S)" }, style: "bg-green-100 border-green-500 text-green-700", icon: "🌿" },
    C: { title: { en: "Conscientiousness (C)", pt: "Conscienciosidade (C)", es: "Cumplimiento (C)" }, style: "bg-blue-100 border-blue-500 text-blue-700", icon: "🔬" }
};

// MBTI Dimension descriptions
export const mbtiDimensions = {
    E: { title: { en: "Extraversion", pt: "Extroversão", es: "Extraversión" }, style: "bg-blue-100 border-blue-500 text-blue-700", icon: "🗣️", description: { en: "Energized by social interaction", pt: "Energizado por interação social", es: "Energizado por interacción social"} },
    I: { title: { en: "Introversion", pt: "Introversão", es: "Introversión" }, style: "bg-indigo-100 border-indigo-500 text-indigo-700", icon: "🤫", description: { en: "Energized by solitude and reflection", pt: "Energizado por solidão e reflexão", es: "Energizado por soledad y reflexión"} },
    S: { title: { en: "Sensing", pt: "Sensação", es: "Sensación" }, style: "bg-green-100 border-green-500 text-green-700", icon: "🔍", description: { en: "Focus on concrete, practical details", pt: "Foco em detalhes concretos e práticos", es: "Foco en detalles concretos y prácticos"} },
    N: { title: { en: "Intuition", pt: "Intuição",es: "Intuición" }, style: "bg-purple-100 border-purple-500 text-purple-700", icon: "💡", description: { en: "Focus on patterns and possibilities", pt:"Foco em padrões e possibilidades" , es:"Foco en patrones y posibilidades"} },
    T:{ title:{en:"Thinking" ,pt:"Pensamento" ,es:"Pensamiento"},style:"bg-orange-100 border-orange-500 text-orange-700" ,icon:"⚖️" ,description:{en:"Decisions based on logic and objectivity" ,pt:"Decisões baseadas em lógica e objetividade" ,es:"Decisión basado en la lógica y objetividad"}},
    F: { title: { en: "Feeling", pt: "Sentimento", es: "Sentimiento"}, style: "bg-pink-100 border-pink-500 text-pink-700", icon: "❤️", description: { en: "Decisions based on values and harmony", pt: "Decisões baseadas em valores e harmonia", es: "Decisión basado en valores y harmonía"} },
    J: { title: { en: "Judging", pt: "Julgamento", es: "Juicio"}, style: "bg-teal-100 border-teal-500 text-teal-700", icon: "📋", description: { en: "Prefer structure and decidedness", pt: "Prefere estrutura e decisões tomadas", es: "Prefer estructura y decisiones tomadas"} },
    P: { title: { en: "Perceiving", pt: "Percepção", es: "Percepción"}, style: "bg-amber-100 border-amber-500 text-amber-700", icon: "🔄", description: { en: "Prefer flexibility and spontaneity", pt: "Prefere flexibilidade e espontaneidade", es: "Prefer flexibilidad y estigmatismo"} }
};

// Big Five Dimension descriptions
export const big5Descriptions = {
    O: { title: { en: "Openness", pt: "Abertura", es: "Apertura"}, style: "bg-purple-100 border-purple-500 text-purple-700", icon: "🌈", description: { en: "Imagination, creativity, curiosity", pt: "Imaginação, criatividade, curiosidade", es: "Imaginación, creatividad, curiosidad"} },
    C: { title: { en: "Conscientiousness", pt: "Conscienciosidade", es: "Responsabilidad"}, style: "bg-blue-100 border-blue-500 text-blue-700", icon: "📊", description: { en: "Organization, diligence, reliability", pt: "Organização, diligência, confiabilidade", es: "Organización, diligencia, fiabilidad"} },
    E: { title: { en: "Extraversion", pt: "Extroversão", es: "Extraversión"}, style: "bg-yellow-100 border-yellow-500 text-yellow-700", icon: "🌟", description: { en: "Sociability, assertiveness, energy", pt: "Sociabilidade, assertividade, energia", es: "Sociabilidad, assertividad, energía"} },
    A: { title: { en: "Agreeableness", pt: "Amabilidade", es: "Amistabilidad"}, style: "bg-green-100 border-green-500 text-green-700", icon: "🤝", description: { en: "Compassion, cooperation, trust", pt: "Compaixão, cooperação, confiança", es: "Compación, colaboración, confianza"} },
    N: { title: { en: "Neuroticism", pt: "Neuroticismo", es: "Neuroticismo"}, style: "bg-red-100 border-red-500 text-red-700", icon: "🌊", description: { en: "Anxiety, moodiness, emotional sensitivity", pt: "Ansiedade, instabilidade emocional, sensibilidade", es:"Ansiedad, cambios de humor, sensibilidad emocional" } }
};

// MBTI Type Descriptions
export const mbtiTypeDescriptions = {
    "ISTJ": {
        name: { en: "The Inspector", pt: "O Inspetor", es: "El Inspector" },
        description: {
            en: "Practical, fact-minded, and reliable. You value tradition, order, and stability. You are thorough and dutiful, following through on commitments. Your strength is your reliability and attention to detail, but you may be resistant to change and overly focused on established procedures.",
            pt: "Prático, centrado em fatos e confiável. Você valoriza tradição, ordem e estabilidade. Você é minucioso e cumpre seus deveres, honrando compromissos. Sua força é sua confiabilidade e atenção aos detalhes, mas você pode ser resistente a mudanças e excessivamente focado em procedimentos estabelecidos.",
            es: "Práctico, orientado a los hechos y confiable. Valoras la tradición, el orden y la estabilidad. Eres minucioso y cumplidor, cumpliendo con tus compromisos. Tu fortaleza es tu fiabilidad y atención al detalle, pero puedes ser resistente al cambio y demasiado enfocado en los procedimientos establecidos."
        }
    },
    "ISFJ": {
        name: { en: "The Protector", pt: "O Protetor", es: "El Protector" },
        description: {
            en: "Warm, caring, and responsible. You are committed to your duties and loyal to your relationships. You have a strong sense of responsibility and work well in structured environments. Your strength is your dedication and practicality, but you may be overly sensitive to criticism and resistant to change.",
            pt: "Caloroso, cuidadoso e responsável. Você é comprometido com seus deveres e leal aos seus relacionamentos. Você tem um forte senso de responsabilidade e trabalha bem em ambientes estruturados. Sua força é sua dedicação e praticidade, mas você pode ser excessivamente sensível a críticas e resistente a mudanças.",
            es: "Cálido, cariñoso y responsable. Estás comprometido con tus deberes y leal a tus relaciones. Tienes un fuerte sentido de responsabilidad y trabajas bien en entornos estructurados. Tu fortaleza es tu dedicación y practicidad, pero puedes ser demasiado sensible a las críticas y resistente al cambio."
        }
    },
    "INFJ": {
        name: { en: "The Advocate", pt: "O Advogado", es: "El Abogado" },
        description: {
            en: "Insightful, principled, and organized. You have a strong sense of purpose and work towards your ideals with determination. You are creative and deeply caring about others. Your strength is your insight and conviction, but you may be perfectionistic and sensitive to conflict.",
            pt: "Perspicaz, principista e organizado. Você tem um forte senso de propósito e trabalha em direção aos seus ideais com determinação. Você é criativo e profundamente preocupado com os outros. Sua força é sua percepção e convicção, mas você pode ser perfeccionista e sensível a conflitos.",
            es: "Perspicaz, principista y organizado. Tienes un fuerte sentido de propósito y trabajas hacia tus ideales con determinación. Eres creativo y profundamente preocupado por los demás. Tu fortaleza es tu percepción y convicción, pero puedes ser perfeccionista y sensible a los conflictos."
        }
    },
    "INTJ": {
        name: { en: "The Architect", pt: "O Arquiteto", es: "El Arquitecto" },
        description: {
            en: "Strategic, independent, and determined. You have a vision for the future and work systematically to achieve your goals. You are analytical and value competence and knowledge. Your strength is your strategic thinking and independence, but you may be overly critical and dismissive of others' input.",
            pt: "Estratégico, independente e determinado. Você tem uma visão para o futuro e trabalha sistematicamente para alcançar seus objetivos. Você é analítico e valoriza competência e conhecimento. Sua força é seu pensamento estratégico e independência, mas você pode ser excessivamente crítico e desdenhoso das contribuições dos outros.",
            es: "Estratégico, independiente y determinado. Tienes una visión para el futuro y trabajas sistemáticamente para lograr tus objetivos. Eres analítico y valoras la competencia y el conocimiento. Tu fortaleza es tu pensamiento estratégico e independencia, pero puedes ser demasiado crítico y desdeñoso con las aportaciones de los demás."
        }
    },
    "ISTP": {
        name: { en: "The Craftsman", pt: "O Artesão", es: "El Artesano" },
        description: {
            en: "Practical, observant, and flexible. You enjoy understanding how things work and are skilled at solving practical problems. You are adaptable and prefer hands-on learning. Your strength is your resourcefulness and calm under pressure, but you may be risk-prone and easily bored.",
            pt: "Prático, observador e flexível. Você gosta de entender como as coisas funcionam e é habilidoso em resolver problemas práticos. Você é adaptável e prefere aprendizado prático. Sua força é sua capacidade de improvisação e calma sob pressão, mas você pode ser propenso a riscos e facilmente entediado.",
            es: "Práctico, observador y flexible. Te gusta entender cómo funcionan las cosas y eres hábil para resolver problemas prácticos. Eres adaptable y prefieres el aprendizaje práctico. Tu fortaleza es tu ingenio y calma bajo presión, pero puedes ser propenso al riesgo y aburrirte fácilmente."
        }
    },
    "ISFP": {
        name: { en: "The Artist", pt: "O Artista", es: "El Artista" },
        description: {
            en: "Gentle, sensitive, and artistic. You value harmony and enjoy creating beauty in your surroundings. You are loyal to your values and attentive to others' needs. Your strength is your compassion and aesthetic sense, but you may be overly self-critical and avoid conflict.",
            pt: "Gentil, sensível e artístico. Você valoriza harmonia e gosta de criar beleza em seu entorno. Você é leal aos seus valores e atento às necessidades dos outros. Sua força é sua compaixão e senso estético, mas você pode ser excessivamente autocrítico e evitar conflitos.",
            es: "Gentil, sensible y artístico. Valorás la armonía y disfrutás creando belleza en tu entorno. Sos leal a tus valores y atento a las necesidades de los demás. Tu fortaleza es tu compasión y sentido estético, pero podés ser demasiado autocrítico y evitar el conflicto."
        }
    },
    "INFP": {
        name: { en: "The Mediator", pt: "O Mediador", es: "El Mediador" },
        description: {
            en: "Idealistic, creative, and empathetic. You are guided by your strong values and desire to make the world a better place. You are adaptable and supportive of others. Your strength is your empathy and idealism, but you may be overly idealistic and sensitive to criticism.",
            pt: "Idealista, criativo e empático. Você é guiado por seus fortes valores e desejo de tornar o mundo um lugar melhor. Você é adaptável e apoia os outros. Sua força é sua empatia e idealismo, mas você pode ser excessivamente idealista e sensível a críticas.",
            es: "Idealista, creativo y empático. Estás guiado por tus fuertes valores y deseo de hacer del mundo un lugar mejor. Eres adaptable y apoyas a los demás. Tu fortaleza es tu empatía e idealismo, pero puedes ser demasiado idealista y sensible a las críticas."
        }
    },
    "INTP": {
        name: { en: "The Thinker", pt: "O Pensador", es: "El Pensador" },
        description: {
            en: "Analytical, innovative, and curious. You enjoy theoretical problems and exploring complex ideas. You are logical and value precision in thought. Your strength is your intellectual curiosity and objectivity, but you may be overly abstract and inattentive to practical matters.",
            pt: "Analítico, inovador e curioso. Você gosta de problemas teóricos e explorar ideias complexas. Você é lógico e valoriza precisão no pensamento. Sua força é sua curiosidade intelectual e objetividade, mas você pode ser excessivamente abstrato e desatento a questões práticas.",
            es: "Analítico, innovador y curioso. Disfrutas de problemas teóricos y explorar ideas complejas. Eres lógico y valoras la precisión en el pensamiento. Tu fortaleza es tu curiosidad intelectual y objetividad, pero puedes ser demasiado abstracto y desatento a asuntos prácticos."
        }
    },
    "ESTP": {
        name: { en: "The Persuader", pt: "O Persuador", es: "El Persuasor" },
        description: {
            en: "Energetic, practical, and spontaneous. You enjoy action and are skilled at navigating immediate challenges. You are observant and adaptable in the moment. Your strength is your practicality and boldness, but you may be impulsive and impatient with theory.",
            pt: "Energético, prático e espontâneo. Você gosta de ação e é habilidoso em navegar desafios imediatos. Você é observador e adaptável no momento. Sua força é sua praticidade e ousadia, mas você pode ser impulsivo e impaciente com a teoria.",
            es: "Enérgico, práctico y espontáneo. Disfrutas de la acción y eres hábil para navegar desafíos inmediatos. Eres observador y adaptable en el momento. Tu fortaleza es tu practicidad y audacia, pero puedes ser impulsivo e impaciente con la teoría."
        }
    },
    "ESFP": {
        name: { en: "The Performer", pt: "O Performista", es: "El Intérprete" },
        description: {
            en: "Outgoing, friendly, and enthusiastic. You enjoy bringing energy and fun to social situations. You are practical and observant of your environment. Your strength is your spontaneity and people skills, but you may be easily distracted and dislike routine.",
            pt: "Extrovertido, amigável e entusiástico. Você gosta de trazer energia e diversão para situações sociais. Você é prático e observador do seu ambiente. Sua força é sua espontaneidade e habilidades com pessoas, mas você pode ser facilmente distraído e não gostar de rotina.",
            es: "Extrovertido, amigable y entusiasta. Disfrutas de aportar energía y diversión a las situaciones sociales. Eres práctico y observador de tu entorno. Tu fortaleza es tu espontaneidad y habilidades sociales, pero puedes distraerte fácilmente y no te gusta la rutina."
        }
    },
    "ENFP": {
        name: { en: "The Champion", pt: "O Campeão", es: "El Campeón" },
        description: {
            en: "Enthusiastic, creative, and sociable. You see possibilities everywhere and enjoy inspiring others. You are adaptable and value deep connections. Your strength is your enthusiasm and creativity, but you may be overly optimistic and struggle with follow-through.",
            pt: "Entusiástico, criativo e sociável. Você vê possibilidades em todos os lugares e gosta de inspirar os outros. Você é adaptável e valoriza conexões profundas. Sua força é seu entusiasmo e criatividade, mas você pode ser excessivamente otimista e ter dificuldade com a implementação.",
            es: "Entusiasta, creativo y sociable. Ves posibilidades en todas partes y disfrutas inspirando a los demás. Eres adaptable y valoras las conexiones profundas. Tu fortaleza es tu entusiasmo y creatividad, pero puedes ser demasiado optimista y tener dificultades para llevar las cosas a cabo."
        }
    },
    "ENTP": {
        name: { en: "The Debater", pt: "O Debatedor", es: "El Debateador" },
        description: {
            en: "Innovative, quick-witted, and outspoken. You enjoy intellectual challenges and debating ideas. You are energetic and value knowledge. Your strength is your ingenuity and verbal skill, but you may be argumentative and inattentive to details.",
            pt: "Inovador, perspicaz e franco. Você gosta de desafios intelectuais e debater ideias. Você é energético e valoriza conhecimento. Sua força é sua engenhosidade e habilidade verbal, mas você pode ser argumentativo e desatento a detalhes.",
            es: "Innovador, ingenioso y franco. Disfrutas de desafíos intelectuales y debatir ideas. Eres enérgico y valoras el conocimiento. Tu fortaleza es tu ingenio y habilidad verbal, pero puedes ser argumentativo y desatento a los detalles."
        }
    },
    "ESTJ": {
        name: { en: "The Supervisor", pt: "O Supervisor", es: "El Supervisor" },
        description: {
            en: "Practical, traditional, and organized. You value order and structure in your environment. You are dependable and take your responsibilities seriously. Your strength is your reliability and decisiveness, but you may be inflexible and judgmental.",
            pt: "Prático, tradicional e organizado. Você valoriza ordem e estrutura em seu ambiente. Você é confiável e leva suas responsabilidades a sério. Sua força é sua confiabilidade e decisão, mas você pode ser inflexível e crítico.",
            es: "Práctico, tradicional y organizado. Valoras el orden y la estructura en tu entorno. Eres confiable y tomas tus responsabilidades en serio. Tu fortaleza es tu fiabilidad y capacidad de decisión, pero puedes ser inflexible y crítico."
        }
    },
    "ESFJ": {
        name: { en: "The Caregiver", pt: "O Cuidador", es: "El Cuidador" },
        description: {
            en: "Sociable, caring, and popular. You enjoy helping others and creating harmonious environments. You are conscientious and value cooperation. Your strength is your warmth and practicality, but you may be overly sensitive and need approval from others.",
            pt: "Sociável, cuidadoso e popular. Você gosta de ajudar os outros e criar ambientes harmoniosos. Você é consciencioso e valoriza cooperação. Sua força é seu calor e praticidade, mas você pode ser excessivamente sensível e precisar de aprovação dos outros.",
            es: "Sociable, cariñoso y popular. Disfrutas ayudando a los demás y creando ambientes armoniosos. Eres consciente y valoras la cooperación. Tu fortaleza es tu calidez y practicidad, pero puedes ser demasiado sensible y necesitar la aprobación de los demás."
        }
    },
    "ENFJ": {
        name: { en: "The Teacher", pt: "O Professor", es: "El Maestro" },
        description: {
            en: "Empathetic, organized, and inspiring. You are skilled at understanding others and motivating them towards growth. You value harmony and personal development. Your strength is your charisma and insight, but you may be overly idealistic and sensitive to conflict.",
            pt: "Empático, organizado e inspirador. Você é habilidoso em entender os outros e motivá-los para o crescimento. Você valoriza harmonia e desenvolvimento pessoal. Sua força é seu carisma e percepção, mas você pode ser excessivamente idealista e sensível a conflitos.",
            es: "Empático, organizado e inspirador. Eres hábil para entender a los demás y motivarlos hacia el crecimiento. Valoras la armonía y el desarrollo personal. Tu fortaleza es tu carisma y percepción, pero puedes ser demasiado idealista y sensible a los conflictos."
        }
    },
    "ENTJ": {
        name: { en: "The Commander", pt: "O Comandante", es: "El Comandante" },
        description: {
            en: "Strategic, assertive, and efficient. You are a natural leader who enjoys organizing people and resources towards goals. You value competence and long-term planning. Your strength is your leadership and strategic thinking, but you may be impatient and overly critical.",
            pt: "Estratégico, assertivo e eficiente. Você é um líder natural que gosta de organizar pessoas e recursos para atingir objetivos. Você valoriza competência e planejamento de longo prazo. Sua força é sua liderança e pensamento estratégico, mas você pode ser impaciente e excessivamente crítico.",
            es: "Estratégico, asertivo y eficiente. Eres un líder natural que disfruta organizando personas y recursos hacia metas. Valoras la competencia y la planificación a largo plazo. Tu fortaleza es tu liderazgo y pensamiento estratégico, pero puedes ser impaciente y demasiado crítico."
        }
    }
};

// Detailed Blended Profile Descriptions for DISC
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