// Empty objects to maintain export references for other files
export const big5TraitDescriptions = {};
export const discDescriptions = {};
export const mbtiDimensions = {};
export const big5Descriptions = {};
export const mbtiTypeDescriptions = {};
export const blendedDescriptions = {};
export const unifiedProfiles = {};

// Flag to prevent multiple fetches
let descriptionsLoaded = false;

// Async function to fetch from DB and fallback to JSON
export async function fetchTraitDescriptions() {
    if (descriptionsLoaded) return true; 
    
    let data = null;
    
    try {
        // Use the same environment URL logic you use for questions
        const apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://localhost:3000/api/trait-descriptions'
            : '/api/trait-descriptions'; // Adjust this to your production URL if needed
            
        console.log('Fetching trait descriptions from API...');
        const response = await fetch(apiUrl);
        
        if (response.ok) {
            data = await response.json();
            console.log('✅ Trait descriptions loaded from MongoDB');
        } else {
            throw new Error(`API responded with status ${response.status}`);
        }
    } catch (error) {
        console.warn('⚠️ API fetch failed, falling back to JSON:', error.message);
        try {
            // Fallback to local JSON file
            const fallbackResponse = await fetch('/JSON/fallback-trait-description.json');
            if (!fallbackResponse.ok) throw new Error('Fallback JSON not found');
            data = await fallbackResponse.json();
            console.log('✅ Trait descriptions loaded from fallback JSON');
        } catch (fallbackError) {
            console.error('❌ Failed to load trait descriptions completely:', fallbackError);
            return false;
        }
    }

    // Populate the exported constants with the fetched data
    if (data) {
        if (data.big5TraitDescriptions) Object.assign(big5TraitDescriptions, data.big5TraitDescriptions);
        if (data.discDescriptions) Object.assign(discDescriptions, data.discDescriptions);
        if (data.mbtiDimensions) Object.assign(mbtiDimensions, data.mbtiDimensions);
        if (data.big5Descriptions) Object.assign(big5Descriptions, data.big5Descriptions);
        if (data.mbtiTypeDescriptions) Object.assign(mbtiTypeDescriptions, data.mbtiTypeDescriptions);
        if (data.blendedDescriptions) Object.assign(blendedDescriptions, data.blendedDescriptions);
        if (data.unifiedProfiles) Object.assign(unifiedProfiles, data.unifiedProfiles);
        
        descriptionsLoaded = true;
        return true;
    }
    
    return false;
}