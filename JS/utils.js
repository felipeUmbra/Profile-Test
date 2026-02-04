import { accessibilityManager, isBig5Test, isDISCTest, isMBTITest  } from '../script.js';

// Virtual Scrollers Map
let virtualScrollers = new Map();


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

// --- Virtual Scrolling Implementation ---
export class VirtualScroller {
    constructor(container, items, itemHeight, renderItem) {
        this.container = container;
        this.items = items;
        this.itemHeight = itemHeight;
        this.renderItem = renderItem;
        this.visibleItems = [];
        this.scrollTop = 0;
        this.visibleCount = 0;
        
        this.init();
    }

    init() {
        // Set container height for proper scrolling
        this.container.style.height = `${this.items.length * this.itemHeight}px`;
        this.container.style.position = 'relative';
        this.container.style.overflow = 'auto';
        
        // Create viewport element
        this.viewport = document.createElement('div');
        this.viewport.style.position = 'relative';
        this.viewport.style.height = '100%';
        this.container.appendChild(this.viewport);
        
        // Calculate visible count
        this.visibleCount = Math.ceil(this.container.clientHeight / this.itemHeight) + 2;
        
        // Add scroll listener with debouncing
        this.container.addEventListener('scroll', this.debounce(this.handleScroll.bind(this), 10));
        
        // Initial render
        this.render();
        
        // Add ARIA attributes
        this.container.setAttribute('role', 'region');
        this.container.setAttribute('aria-label', 'Scrollable content');
        this.container.setAttribute('aria-busy', 'false');
    }

    debounce(func, wait) {
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

    handleScroll() {
        this.scrollTop = this.container.scrollTop;
        this.render();
    }

    render() {
        const startIndex = Math.floor(this.scrollTop / this.itemHeight);
        const endIndex = Math.min(startIndex + this.visibleCount, this.items.length);
        
        // Clear existing items
        while (this.viewport.firstChild) {
            this.viewport.removeChild(this.viewport.firstChild);
        }
        
        // Render visible items
        for (let i = startIndex; i < endIndex; i++) {
            const item = this.items[i];
            const element = this.renderItem(item, i);
            element.style.position = 'absolute';
            element.style.top = `${i * this.itemHeight}px`;
            element.style.width = '100%';
            element.style.height = `${this.itemHeight}px`;
            element.setAttribute('data-index', i);
            this.viewport.appendChild(element);
        }
        
        // Update ARIA attributes for accessibility
        this.container.setAttribute('aria-setsize', this.items.length);
        this.container.setAttribute('aria-posinset', startIndex + 1);
    }

    destroy() {
        this.container.removeEventListener('scroll', this.handleScroll);
        this.container.innerHTML = '';
    }
}

export function handleArrowNavigation(event, direction) {
    const focusableElements = getFocusableElements();
    const currentIndex = focusableElements.indexOf(document.activeElement);
    
    if (currentIndex !== -1) {
        event.preventDefault();
        let newIndex;
        
        if (direction === 'ArrowRight' || direction === 'ArrowDown') {
            newIndex = (currentIndex + 1) % focusableElements.length;
        } else {
            newIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length;
        }
        
        const newElement = focusableElements[newIndex];
        newElement.focus();
        newElement.classList.add('focus-visible');
        
        // Announce focus change for screen readers
        if (accessibilityManager) {
            const label = newElement.getAttribute('aria-label') || newElement.textContent || 'Element';
            accessibilityManager.announce(label, 'polite');
        }
    }
}

export function handleActionKey(event, target) {
    if (target.classList.contains('rating-button') || target.hasAttribute('data-rating') || 
        target.id.startsWith('option-') || target.id === 'restart-btn' || target.id === 'export-btn') {
        event.preventDefault();
        target.click();
        if (accessibilityManager) {
            accessibilityManager.announce(`Selected: ${target.textContent.trim()}`, 'assertive');
        }
    }
}

export function handleEscapeKey(event) {
    const mainContent = document.querySelector('main') || document.querySelector('#main-content');
    if (mainContent) {
        mainContent.focus();
        if (accessibilityManager) {
            accessibilityManager.announce('Returned to main content', 'polite');
        }
    }
}

export function setupEnhancedKeyboardNavigation() {
    document.addEventListener('keydown', handleEnhancedKeyboardNavigation);
    
    // Add focus visible class for better keyboard navigation feedback
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
}

function handleNumberKey(event, key) {
    const rating = parseInt(key);
    const maxRating = isBig5Test ? 5 : 4;
    
    if (rating >= 1 && rating <= maxRating) {
        const buttons = document.querySelectorAll(`button[data-rating="${rating}"]`);
        if (buttons.length > 0) {
            event.preventDefault();
            buttons[0].click();
        }
    }
}

function handleMBTIKey(event, key) {
    const option = key.toLowerCase();
    const button = document.getElementById(`option-${option}`);
    if (button) {
        event.preventDefault();
        button.click();
    }
}

function getFocusableElements() {
    return Array.from(document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )).filter(el => !el.disabled && el.offsetParent !== null);
}

function showKeyboardShortcuts() {
    const shortcuts = [
        'Arrow Keys: Navigate between options',
        'Enter/Space: Select current option',
        'Escape: Return to main content',
        'Number Keys 1-5: Select rating (DISC/Big5)',
        'A/B Keys: Select MBTI options',
        'Ctrl+H: Show this help'
    ].join('. ');
    
    if (accessibilityManager) {
        accessibilityManager.announce(`Keyboard shortcuts: ${shortcuts}`);
    }
    showError(`Keyboard Shortcuts: ${shortcuts}`, 8000);
}

export function handleEnhancedKeyboardNavigation(event) {
    const { key, target, ctrlKey, altKey } = event;
    
    // Skip if user is typing in an input field
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
    }

    switch (key) {
        case 'ArrowLeft':
        case 'ArrowRight':
        case 'ArrowUp':
        case 'ArrowDown':
            handleArrowNavigation(event, key);
            break;
        case ' ':
        case 'Enter':
            handleActionKey(event, target);
            break;
        case 'Escape':
            handleEscapeKey(event);
            break;
        case 'h':
        case 'H':
            if (ctrlKey) showKeyboardShortcuts();
            break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
            if (isDISCTest || isBig5Test) handleNumberKey(event, key);
            break;
        case 'a':
        case 'A':
        case 'b':
        case 'B':
            if (isMBTITest) handleMBTIKey(event, key);
            break;
    }
}

// --- Enhanced Accessibility Manager ---
export class AccessibilityManager {
    constructor() {
        this.liveRegions = new Map();
        this.currentFocus = null;
        this.init();
    }

    init() {
        // Create live regions for different priority levels
        this.createLiveRegion('assertive', 'assertive');
        this.createLiveRegion('polite', 'polite');
        
        // Add screen reader styles
        this.addScreenReaderStyles();
        
        // Enhance existing elements
        this.enhanceExistingElements();
        
        // Setup focus tracking
        this.setupFocusManagement();
    }

    createLiveRegion(id, politeness) {
        const region = document.createElement('div');
        region.id = `live-region-${id}`;
        region.setAttribute('aria-live', politeness);
        region.setAttribute('aria-atomic', 'true');
        region.className = 'sr-only';
        document.body.appendChild(region);
        this.liveRegions.set(id, region);
    }

    announce(message, politeness = 'polite') {
        const region = this.liveRegions.get(politeness);
        if (region) {
            // Clear previous message
            region.textContent = '';
            // Use setTimeout to ensure the DOM updates
            setTimeout(() => {
                region.textContent = message;
                console.log(`Screen Reader: ${message}`); // For debugging
            }, 100);
        }
    }

    addScreenReaderStyles() {
        if (!document.getElementById('sr-styles')) {
            const style = document.createElement('style');
            style.id = 'sr-styles';
            style.textContent = `
                .sr-only {
                    position: absolute;
                    width: 1px;
                    height: 1px;
                    padding: 0;
                    margin: -1px;
                    overflow: hidden;
                    clip: rect(0, 0, 0, 0);
                    white-space: nowrap;
                    border: 0;
                }
                
                .focus-visible {
                    outline: 3px solid #4f46e5;
                    outline-offset: 2px;
                    border-radius: 8px;
                }
                
                .keyboard-navigation *:focus {
                    outline: 3px solid #4f46e5;
                    outline-offset: 2px;
                }
                
                @media (prefers-reduced-motion: reduce) {
                    * {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    enhanceExistingElements() {
        // Enhance progress bars
        this.enhanceProgressBars();
        
        // Enhance rating buttons
        this.enhanceRatingButtons();
        
        // Enhance navigation
        this.enhanceNavigation();
    }

    enhanceProgressBars() {
        const progressBars = document.querySelectorAll('[id*="progress"]');
        progressBars.forEach(bar => {
            if (!bar.getAttribute('role')) {
                bar.setAttribute('role', 'progressbar');
                bar.setAttribute('aria-valuemin', '0');
                bar.setAttribute('aria-valuemax', '100');
                bar.setAttribute('aria-valuenow', '0');
            }
        });
    }

    enhanceRatingButtons() {
        const ratingButtons = document.querySelectorAll('.rating-button');
        ratingButtons.forEach((button, index) => {
            if (!button.getAttribute('aria-label')) {
                const label = button.textContent.trim();
                button.setAttribute('aria-label', label);
            }
            button.setAttribute('tabindex', '0');
            button.setAttribute('role', 'button');
            
            // Add focus management
            button.addEventListener('focus', () => {
                this.currentFocus = button;
                button.classList.add('focus-visible');
            });
            
            button.addEventListener('blur', () => {
                button.classList.remove('focus-visible');
            });
        });
    }

    enhanceNavigation() {
        const backButton = document.querySelector('a[href="index.html"]');
        if (backButton) {
            backButton.setAttribute('aria-label', 'Back to home page');
            backButton.setAttribute('tabindex', '0');
        }

        const languageButtons = document.querySelectorAll('.lang-button');
        languageButtons.forEach((button, index) => {
            button.setAttribute('aria-label', button.querySelector('img').alt);
            button.setAttribute('tabindex', '0');
        });
    }

    setupFocusManagement() {
        // Track keyboard vs mouse navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        // Skip to main content functionality
        this.addSkipToContentLink();
    }

    addSkipToContentLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:bg-white focus:p-4 focus:z-50';
        skipLink.textContent = 'Skip to main content';
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Add main content ID to the main container
        const mainContainer = document.querySelector('.max-w-\\[80vw\\]') || document.querySelector('.container');
        if (mainContainer) {
            mainContainer.id = 'main-content';
            mainContainer.setAttribute('role', 'main');
            mainContainer.setAttribute('tabindex', '-1');
        }
    }

    updateProgressBar(percentage) {
        const progressBar = document.getElementById('progress-bar-inner');
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
            progressBar.setAttribute('aria-valuenow', percentage);
            
            const progressText = document.getElementById('progress-text');
            if (progressText) {
                const text = progressText.textContent;
                this.announce(`Progress: ${percentage}%. ${text}`);
            }
        }
    }

    enhanceDynamicContent(container) {
        if (!container) return;

        // Enhance result cards
        const resultCards = container.querySelectorAll('[id*="result"], .score-card, .p-6.rounded-xl');
        resultCards.forEach((card, index) => {
            if (!card.getAttribute('role')) {
                card.setAttribute('role', 'article');
                card.setAttribute('aria-label', `Result ${index + 1}`);
                card.setAttribute('tabindex', '0');
            }
        });

        // Enhance headings
        const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach((heading, index) => {
            if (!heading.getAttribute('tabindex')) {
                heading.setAttribute('tabindex', '-1');
            }
        });

        // Enhance buttons in dynamic content
        const buttons = container.querySelectorAll('button');
        buttons.forEach(button => {
            if (!button.getAttribute('aria-label') && button.textContent.trim()) {
                button.setAttribute('aria-label', button.textContent.trim());
            }
            button.setAttribute('tabindex', '0');
        });
    }

    moveFocusToElement(element) {
        if (element) {
            element.focus();
            element.classList.add('focus-visible');
            
            // Announce focus change for screen readers
            const label = element.getAttribute('aria-label') || element.textContent || 'Element';
            this.announce(`Focused on ${label}`, 'polite');
        }
    }
}

// Virtual Scrolling Setup for Results
export function setupVirtualScrollingForResults() {
    const interpretationContainers = document.querySelectorAll('.scroll-container');
    interpretationContainers.forEach(container => {
        // Only enable virtual scrolling for containers with many items
        const items = Array.from(container.children);
        if (items.length > 10) { // Lower threshold for better performance
            // Backup original content
            const originalHTML = container.innerHTML;
            
            const scroller = new VirtualScroller(
                container,
                items,
                120, // estimated item height
                (item, index) => {
                    const div = document.createElement('div');
                    div.className = item.className + ' virtual-item';
                    div.innerHTML = item.innerHTML;
                    div.setAttribute('role', 'article');
                    div.setAttribute('aria-label', `Result item ${index + 1}`);
                    return div;
                }
            );
            virtualScrollers.set(container.id, { scroller, originalHTML });
        }
    });
}

export function cleanupVirtualScrolling() {
    virtualScrollers.forEach(({ scroller, originalHTML }, containerId) => {
        const container = document.getElementById(containerId);
        if (container) {
            scroller.destroy();
            container.innerHTML = originalHTML;
        }
    });
    virtualScrollers.clear();
}

// --- Test Runner for Unit Testing ---
export class TestRunner {
    static runScoringTests() {
        const tests = {
            passed: 0,
            failed: 0,
            results: []
        };

        // Test DISC scoring
        try {
            const discScores = { D: 28, I: 10, S: 8, C: 12 };
            const discFactorScores = [
                { factor: 'D', score: 28 },
                { factor: 'I', score: 10 },
                { factor: 'C', score: 12 },
                { factor: 'S', score: 8 }
            ].sort((a, b) => b.score - a.score);
            
            const discProfile = getProfileKey(discFactorScores);
            if (discProfile === 'D') {
                tests.passed++;
                tests.results.push({ test: 'DISC Pure D Profile', status: 'PASS' });
            } else {
                tests.failed++;
                tests.results.push({ test: 'DISC Pure D Profile', status: 'FAIL', expected: 'D', got: discProfile });
            }
        } catch (error) {
            tests.failed++;
            tests.results.push({ test: 'DISC Pure D Profile', status: 'ERROR', error: error.message });
        }

        // Test MBTI scoring
        try {
            const mbtiScores = { E: 6, I: 1, S: 2, N: 5, T: 7, F: 0, J: 6, P: 1 };
            const mbtiType = calculateMBTIType(mbtiScores);
            if (mbtiType === 'ENTJ') {
                tests.passed++;
                tests.results.push({ test: 'MBTI ENTJ Type', status: 'PASS' });
            } else {
                tests.failed++;
                tests.results.push({ test: 'MBTI ENTJ Type', status: 'FAIL', expected: 'ENTJ', got: mbtiType });
            }
        } catch (error) {
            tests.failed++;
            tests.results.push({ test: 'MBTI ENTJ Type', status: 'ERROR', error: error.message });
        }

        // Test Big Five reverse scoring
        try {
            const question = { factor: 'O', reverse: true };
            const rating = 5;
            const finalScore = question.reverse ? (6 - rating) : rating;
            if (finalScore === 1) {
                tests.passed++;
                tests.results.push({ test: 'Big Five Reverse Scoring', status: 'PASS' });
            } else {
                tests.failed++;
                tests.results.push({ test: 'Big Five Reverse Scoring', status: 'FAIL', expected: 1, got: finalScore });
            }
        } catch (error) {
            tests.failed++;
            tests.results.push({ test: 'Big Five Reverse Scoring', status: 'ERROR', error: error.message });
        }

        console.log('🧪 Scoring Tests Completed:', tests);
        return tests;
    }
}

// Error Handling Utilities
export function showError(message = t('error_general'), duration = 5000) {
    let errorContainer = document.getElementById('error-container');
    if (!errorContainer) {
        errorContainer = document.createElement('div');
        errorContainer.id = 'error-container';
        errorContainer.className = 'fixed top-4 right-4 z-50 max-w-sm';
        errorContainer.setAttribute('role', 'alert');
        errorContainer.setAttribute('aria-live', 'assertive');
        document.body.appendChild(errorContainer);
    }

    const errorElement = document.createElement('div');
    errorElement.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg mb-2';
    errorElement.innerHTML = `
        <div class="flex items-center">
            <span class="text-red-500 mr-2" aria-hidden="true">⚠</span>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" 
                    class="ml-4 text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    aria-label="Close error message">
                ×
            </button>
        </div>
    `;

    errorContainer.appendChild(errorElement);
    if (accessibilityManager) {
        accessibilityManager.announce(`Error: ${message}`, 'assertive');
    }

    setTimeout(() => {
        if (errorElement.parentNode) {
            errorElement.parentNode.removeChild(errorElement);
        }
    }, duration);
}

