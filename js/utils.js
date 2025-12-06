import { translations } from './data.js';

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
        // Check if document is ready before init
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        this.createLiveRegion('assertive', 'assertive');
        this.createLiveRegion('polite', 'polite');
        this.addScreenReaderStyles();
        this.enhanceExistingElements();
        this.setupFocusManagement();
    }

    createLiveRegion(id, politeness) {
        if (document.getElementById(`live-region-${id}`)) return;
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
            region.textContent = '';
            setTimeout(() => {
                region.textContent = message;
            }, 100);
        }
    }

    addScreenReaderStyles() {
        if (!document.getElementById('sr-styles')) {
            const style = document.createElement('style');
            style.id = 'sr-styles';
            style.textContent = `
                .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
                .focus-visible { outline: 3px solid #4f46e5; outline-offset: 2px; border-radius: 8px; }
            `;
            document.head.appendChild(style);
        }
    }

    enhanceExistingElements() {
        document.querySelectorAll('[id*="progress"]').forEach(bar => {
            if (!bar.getAttribute('role')) bar.setAttribute('role', 'progressbar');
        });
        document.querySelectorAll('.rating-button').forEach(btn => {
            btn.setAttribute('role', 'button');
            btn.setAttribute('tabindex', '0');
        });
    }

    setupFocusManagement() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') document.body.classList.add('keyboard-navigation');
        });
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }
}