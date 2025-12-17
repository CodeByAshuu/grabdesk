import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success', duration = 3000) => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, message, type, duration }]);

        // Auto remove after duration
        setTimeout(() => {
            removeToast(id);
        }, duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="fixed top-24 right-5 z-[9999] flex flex-col gap-3 pointer-events-none">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
            ))}
        </div>
    );
};

const ToastItem = ({ toast, removeToast }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Small delay to trigger animation
        const timer = setTimeout(() => setIsVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);

    const handleRemove = () => {
        setIsVisible(false);
        setTimeout(() => {
            removeToast(toast.id);
        }, 300); // Wait for exit animation
    };

    // Styles based on type
    const typeStyles = {
        success: 'bg-[#452215] border-[#8F5E41] text-[#FFE9D5]',
        error: 'bg-[#5c1c1c] border-[#ff4d4d] text-[#ffe6e6]',
        info: 'bg-[#5a2f1f] border-[#d4a574] text-[#FFE9D5]',
    };

    const iconParams = {
        success: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />,
        error: <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />,
        info: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
    };

    return (
        <div
            className={`
        pointer-events-auto
        flex items-center gap-3 px-6 py-4 rounded-lg border-l-4 shadow-xl backdrop-blur-md
        transition-all duration-300 ease-in-out transform
        ${typeStyles[toast.type] || typeStyles.info}
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'}
      `}
            role="alert"
        >
            <svg className="w-6 h-6 fill-current shrink-0" viewBox="0 0 24 24">
                {iconParams[toast.type] || iconParams.info}
            </svg>
            <div className="flex-1 font-semibold text-sm tracking-wide">
                {toast.message}
            </div>
            <button
                onClick={handleRemove}
                className="ml-4 opacity-70 hover:opacity-100 transition-opacity"
            >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
            </button>
        </div>
    );
};
