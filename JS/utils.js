import { currentLang, showLoading  } from '../script.js';

// Enhanced PDF Export with Accessibility
export function exportToPDF() {
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