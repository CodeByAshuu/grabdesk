import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import AuthInput from '../components/AuthInput';
import Button from '../components/Button';
import Hero2 from '../assets/hero2-landing.png';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        terms: false
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
            // Basic validation: checks for 10 digits
            newErrors.phone = 'Please enter a valid phone number';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.terms) {
            newErrors.terms = 'You must agree to the terms';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: type === 'checkbox' ? checked : value
        }));
        if (errors[id]) {
            setErrors(prev => ({ ...prev, [id]: null }));
        }
    };

    const handleSignup = (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        // simulating API call
        setTimeout(() => {
            setLoading(false);
            console.log('Signup successful', formData);
            // Redirect to login or home
            navigate('/home');
        }, 1500);
    };

    return (
        <AuthLayout
            title="JOIN THE CLUB"
            subtitle="Create an account to start your curated journey with GrabDesk today."
            image={Hero2}
        >
            <form onSubmit={handleSignup} className="flex flex-col gap-4">
                <AuthInput
                    id="email"
                    label="Email Address"
                    type="email"
                    placeholder="user@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <AuthInput
                        id="fullName"
                        label="Full Name"
                        placeholder="New User"
                        value={formData.fullName}
                        onChange={handleChange}
                        error={errors.fullName}
                    />
                    <AuthInput
                        id="phone"
                        label="Phone Number"
                        type="tel"
                        placeholder="(+91) XXXXX-XXXXX"
                        value={formData.phone}
                        onChange={handleChange}
                        error={errors.phone}
                    />
                </div>
                

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <AuthInput
                        id="password"
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                    />
                    <AuthInput
                        id="confirmPassword"
                        label="Confirm"
                        type="password"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={errors.confirmPassword}
                    />
                </div>

                <div className="flex flex-col gap-1 mt-2">
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative flex items-center mt-1">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={formData.terms}
                                onChange={handleChange}
                                className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-[#8F5E41] checked:bg-[#8F5E41] checked:border-[#8F5E41] transition-all"
                            />
                            <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-0 peer-checked:opacity-100 text-[#f3eadc] transition-opacity" viewBox="0 0 14 14" fill="none">
                                <path d="M3 8L6 11L11 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="text-sm text-[#7f5c3b] leading-tight select-none">
                            I agree to the <Link to="/terms" className="font-bold text-[#8F5E41] hover:underline">Terms & Conditions</Link> and <Link to="/privacy" className="font-bold text-[#8F5E41] hover:underline">Privacy Policy</Link>
                        </span>
                    </label>
                    {errors.terms && <span className="text-red-500 text-xs ml-7 font-medium">{errors.terms}</span>}
                </div>

                <div className="mt-4">
                    <Button
                        labell={loading ? "Creating Account..." : "Create Account"}
                        className={`w-full ${loading ? 'opacity-80 cursor-wait' : ''}`}
                        disabled={loading}
                    />
                </div>

                <div className="relative flex items-center gap-4 py-2">
                    <div className="h-px bg-[#e6d0bc] flex-1"></div>
                    <span className="text-xs text-[#a89078] font-medium uppercase tracking-widest">Or</span>
                    <div className="h-px bg-[#e6d0bc] flex-1"></div>
                </div>

                <button
                    type="button"
                    className="flex justify-center items-center gap-3 w-full py-3 px-4 bg-white border border-[#e6d0bc] rounded-xl text-[#5b3d25] font-semibold hover:bg-[#faf6f1] hover:border-[#cfb6a1] transition-all shadow-sm active:shadow-inner"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Sign up with Google
                </button>

                <p className="text-center text-sm text-[#7f5c3b] mt-2">
                    Already have an account?{' '}
                    <Link to="/login" className="font-bold text-[#8F5E41] hover:text-[#5b3d25] hover:underline">
                        Log In
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default Signup;
