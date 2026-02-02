import { big5Descriptions, blendedDescriptions, discDescriptions } from '/JS/trait-description.js';
import { currentLang } from '/script.js';


export function generateDISCResultHTML(resultData, clang) {
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
                    <h3 class="text-xl font-bold">${desc.title[clang]}</h3>
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
            <h1 class="text-4xl font-extrabold text-gray-800 mb-4">${t('disc_title', clang)}</h1>
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
            <h3 class="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">${t('interpretation_title')}</h3>
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
            <button id="restart-btn" class="px-8 py-3 bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-600 transition duration-300 shadow-lg">
                ${t('restart')}
            </button>
            <button id="export-btn" class="px-8 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition duration-300 shadow-lg">
                ${t('export_pdf')}
            </button>
        </div>
    `;
}