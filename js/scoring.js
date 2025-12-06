import { CONFIG, big5Descriptions } from './data.js';

// --- DISC Logic ---

export function calculateDISCScore(scores) {
    // Convert object {D:10, I:5...} to sorted array [{factor:'D', score:10}, ...]
    const factorScores = Object.entries(scores)
        .map(([factor, score]) => ({ factor, score }))
        .sort((a, b) => b.score - a.score);

    return getProfileKey(factorScores);
}

function getProfileKey(factorScores) {
    try {
        const primary = factorScores[0];
        const secondary = factorScores[1];
        const PURE_THRESHOLD = CONFIG.DISC.pureThreshold || 4;

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

// --- MBTI Logic ---

export function calculateMBTIType(scores) {
    try {
        // Use the passed 'scores' object, not global mbtiScores
        const eiType = scores.E >= scores.I ? 'E' : 'I';
        const snType = scores.S >= scores.N ? 'S' : 'N';
        const tfType = scores.T >= scores.F ? 'T' : 'F';
        const jpType = scores.J >= scores.P ? 'J' : 'P';
        
        return eiType + snType + tfType + jpType;
    } catch (error) {
        console.error('Error calculating MBTI type:', error);
        return 'UNKN';
    }
}

// --- Big5 Logic ---

export function calculateBig5Score(scores) {
    // Big5 doesn't produce a single "type" string like MBTI.
    // We return 'completed' to satisfy the profileKey requirement in main.js
    return 'completed';
}

export function analyzeBig5(scores, maxScores = 40) {
    const analysis = {};
    const factors = ['O', 'C', 'E', 'A', 'N'];
    
    // Safety check for maxScores being an object or number
    const getMax = (f) => (typeof maxScores === 'object' ? maxScores[f] : maxScores);

    factors.forEach(factor => {
        const score = scores[factor] || 0;
        const max = getMax(factor);
        const percentage = (score / max) * 100;
        
        let level, description;
        
        if (percentage >= 70) {
            level = 'high';
            description = big5Descriptions[factor].high;
        } else if (percentage >= 40) {
            level = 'moderate';
            description = big5Descriptions[factor].moderate;
        } else {
            level = 'low';
            description = big5Descriptions[factor].low;
        }
        
        analysis[factor] = {
            name: big5Descriptions[factor].name,
            score: score,
            maxScore: max,
            percentage: Math.round(percentage),
            level: level,
            description: description
        };
    });
    
    return analysis;
}