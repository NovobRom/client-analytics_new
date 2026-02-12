// --- Notifications: Toast notification system (replaces alert()) ---

let toastContainer = null;
let toastIdCounter = 0;

function ensureContainer() {
    if (!toastContainer) {
        toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toastContainer';
            toastContainer.className = 'fixed top-4 right-4 z-[100] flex flex-col gap-2';
            document.body.appendChild(toastContainer);
        }
    }
}

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {string} type - 'error' | 'warning' | 'success' | 'info'
 * @param {number} duration - Duration in milliseconds (default 5000)
 */
export function showToast(message, type = 'info', duration = 5000) {
    ensureContainer();
    
    const toast = document.createElement('div');
    const toastId = `toast-${toastIdCounter++}`;
    toast.id = toastId;
    
    // Color schemes
    const styles = {
        error: 'bg-red-50 border-red-200 text-red-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        success: 'bg-green-50 border-green-200 text-green-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800'
    };
    
    const icons = {
        error: '❌',
        warning: '⚠️',
        success: '✅',
        info: 'ℹ️'
    };
    
    toast.className = `${styles[type]} border-2 rounded-lg shadow-lg p-4 min-w-[300px] max-w-[400px] flex items-start gap-3 transform transition-all duration-300 translate-x-0 opacity-100`;
    
    toast.innerHTML = `
        <span class="text-xl flex-shrink-0">${icons[type]}</span>
        <div class="flex-1 text-sm font-medium">${message}</div>
        <button class="text-gray-400 hover:text-gray-600 flex-shrink-0" onclick="this.parentElement.remove()">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
        </button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto-dismiss
    if (duration > 0) {
        setTimeout(() => {
            toast.style.transform = 'translateX(400px)';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
}

/**
 * Convenience methods
 */
export const toast = {
    error: (msg, duration) => showToast(msg, 'error', duration),
    warning: (msg, duration) => showToast(msg, 'warning', duration),
    success: (msg, duration) => showToast(msg, 'success', duration),
    info: (msg, duration) => showToast(msg, 'info', duration)
};
