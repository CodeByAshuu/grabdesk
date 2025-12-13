import React from 'react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children, title, subtitle, image }) => {
    return (
        <div
            className="min-h-screen w-full flex flex-col text-[#5b3d25] relative"
            style={{
                backgroundColor: "#f3eadc",
                backgroundImage:
                    "radial-gradient(circle, rgba(110, 76, 42, 0.18) 8%, rgba(243, 234, 220, 0) 9%)",
                backgroundSize: "14px 24px",
            }}
        >

            <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

                    {/* Left Side - Editorial Content (Desktop ka) */}
                    <div className="hidden lg:flex flex-col gap-6">
                        <div className="editorial-shape">
                            <h1 className="boldonse-bold text-5xl xl:text-5xl text-[#442314] mb-2" style={{ textShadow: "4px 4px 0 rgba(179, 142, 107, 0.3)" }}>
                                {title}
                            </h1>
                        </div>
                        <p className="text-xl text-[#7f5c3b] leading-relaxed max-w-lg gowun-dodum-regular">
                            {subtitle}
                        </p>
                        {image && (
                            <div className="relative mt-8 rounded-2xl overflow-hidden border-2 border-[#5b3d25] shadow-[8px_8px_0_#452215] max-w-md transform rotate-2 hover:rotate-0 transition-transform duration-500">
                                <img src={image} alt="Auth Visual" className="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                                <div className="absolute inset-0 bg-[#5b3d25]/10 mix-blend-multiply"></div>
                            </div>
                        )}
                    </div>

                    {/* Right Side - Form Card input */}
                    <div className="w-full mx-auto lg:mx-0 bg-[#fbf8f3] border-2 border-[#e6d0bc] rounded-2xl p-6 sm:p-8 shadow-xl relative z-10 backdrop-blur-sm bg-opacity-95">
                        {/* Mobile mei Heading andar hoga card ke*/}
                        <div className="lg:hidden mb-6 text-center">
                            <h1 className="boldonse-bold text-4xl text-[#442314] mb-2">{title}</h1>
                            <p className="text-[#7f5c3b] text-sm">{subtitle}</p>
                        </div>

                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
