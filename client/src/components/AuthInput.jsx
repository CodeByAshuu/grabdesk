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
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

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
            <div className="relative">
                <input
                    type={inputType}
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
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a89078] hover:text-[#8F5E41] transition-colors focus:outline-none"
                    >
                        {showPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        )}
                    </button>
                )}
            </div>
            {error && (
                <span className="text-red-500 text-xs ml-1 font-medium animate-pulse">
                    {error}
                </span>
            )}
        </div>
    );
};

export default AuthInput;
