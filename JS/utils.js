import { currentLang, showLoading  } from '../script.js';

/**
 * Generates a PDF from a specific HTML element.
 * @param {string} elementId - The ID of the HTML element to convert.
 * @param {string} filename - The desired name for the PDF file.
 * @returns {Promise} Resolves when saved, rejects on error.
 */
export function exportResultToPDF(elementId, filename) {
    return new Promise((resolve, reject) => {
        const element = document.getElementById(elementId);
        
        if (!element) {
            return reject(new Error(`Element with ID "${elementId}" not found.`));
        }

        // Ensure html2pdf is loaded
        if (typeof html2pdf === 'undefined') {
            return reject(new Error("html2pdf library is not loaded."));
        }

        // Calculate true width to prevent cutting off right-side content
        const elementWidth = element.scrollWidth;

        const options = {
            margin: [10, 10, 10, 10], // Top, Right, Bottom, Left margins
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2, 
                useCORS: true, 
                logging: false,
                windowWidth: elementWidth, // IMPT: Ensures all horizontal content is captured
                scrollY: 0 // Resets scroll position to capture top of the element
            }, 
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
            // NEW: Prevent awkward page splits
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] } 
        };

        html2pdf()
            .set(options)
            .from(element)
            .save()
            .then(() => resolve())
            .catch(err => reject(err));
    });
}