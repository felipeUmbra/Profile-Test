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

export function exportResultToPDF(testType) {
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