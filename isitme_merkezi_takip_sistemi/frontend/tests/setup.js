/**
 * Jest Test Setup
 * Global test ortamı konfigürasyonu
 */

// Global test timeout
jest.setTimeout(10000);

// Console error'ları test sırasında gösterme
const originalError = console.error;
beforeAll(() => {
    console.error = (...args) => {
        if (
            typeof args[0] === 'string' &&
            args[0].includes('Warning: ReactDOM.render is deprecated')
        ) {
            return;
        }
        originalError.call(console, ...args);
    };
});

afterAll(() => {
    console.error = originalError;
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    observe() {
        return null;
    }
    disconnect() {
        return null;
    }
    unobserve() {
        return null;
    }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
    constructor() {}
    observe() {
        return null;
    }
    disconnect() {
        return null;
    }
    unobserve() {
        return null;
    }
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Mock getComputedStyle
Object.defineProperty(window, 'getComputedStyle', {
    value: () => ({
        getPropertyValue: () => '',
    }),
});

// Mock scrollTo
window.scrollTo = jest.fn();

// Mock requestAnimationFrame
global.requestAnimationFrame = callback => setTimeout(callback, 0);
global.cancelAnimationFrame = id => clearTimeout(id);

// Test utilities
global.testUtils = {
    // DOM element oluştur
    createElement: (tag, attributes = {}) => {
        const element = document.createElement(tag);
        Object.keys(attributes).forEach(key => {
            element.setAttribute(key, attributes[key]);
        });
        return element;
    },

    // Form oluştur
    createForm: (fields = []) => {
        const form = document.createElement('form');
        form.id = 'test-form';
        
        fields.forEach(field => {
            const div = document.createElement('div');
            div.className = 'form-group';
            
            const input = document.createElement('input');
            input.type = field.type || 'text';
            input.name = field.name;
            input.id = field.name;
            
            if (field.required) {
                input.required = true;
            }
            
            div.appendChild(input);
            form.appendChild(div);
        });
        
        return form;
    },

    // Event trigger
    triggerEvent: (element, eventType, options = {}) => {
        const event = new Event(eventType, { bubbles: true, ...options });
        element.dispatchEvent(event);
        return event;
    },

    // Async wait
    wait: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

    // Mock API response
    mockApiResponse: (data, status = 200) => {
        return {
            ok: status >= 200 && status < 300,
            status,
            json: async () => data,
            text: async () => JSON.stringify(data),
            headers: {
                get: (name) => {
                    if (name === 'content-type') {
                        return 'application/json';
                    }
                    return null;
                }
            }
        };
    },

    // Mock API error
    mockApiError: (status, message) => {
        return {
            ok: false,
            status,
            statusText: message,
            json: async () => ({ error: message }),
            text: async () => message,
            headers: {
                get: () => 'application/json'
            }
        };
    }
};

// Test environment variables
process.env.NODE_ENV = 'test';
process.env.API_BASE_URL = 'http://localhost:8000/api'; 