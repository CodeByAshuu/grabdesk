import React from 'react';

const AuthInput = ({
    label,
    type = "text",
    id,
    value,
    onChange,
    placeholder,
    error,
    required = false
}) => {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label
                    htmlFor={id}
                    className="text-sm font-bold text-[#5b3d25] uppercase tracking-wide nunito-bold ml-1"
                >
                    {label}
                </label>
            )}
            <input
                type={type}
                id={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className={`
                    w-full px-4 py-3 rounded-xl
                    bg-white border-2 
                    text-[#442314] placeholder-[#a89078]
                    transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-[#f0a224]/20
                    ${error
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-[#e6d0bc] focus:border-[#8F5E41] hover:border-[#cfb6a1]'
                    }
                `}
            />
            {error && (
                <span className="text-red-500 text-xs ml-1 font-medium animate-pulse">
                    {error}
                </span>
            )}
        </div>
    );
};

export default AuthInput;
