// utils.js
import { translations, indexTranslations } from './data.js';

// Simple translation helper
export function t(key, lang = 'en', replacements = {}) {
    try {
        let text = translations[lang]?.[key] || translations['en']?.[key] || key;
        for (const [k, v] of Object.entries(replacements)) {
            text = text.replace(`{${k}}`, v);
        }
        return text;
    } catch (e) { return key; }
}

export function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

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