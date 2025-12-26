import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import AuthInput from '../components/AuthInput';
import Button from '../components/Button';
import Hero2 from '../assets/hero2-landing.png';
import api from '../api/axios';

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
    const [serverError, setServerError] = useState('');

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
        if (serverError) setServerError('');
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        setServerError('');

        try {
            const response = await api.post('/auth/signup', {
                name: formData.fullName,
                email: formData.email,
                password: formData.password,
                phone: formData.phone || '0000000000' // Default if empty or handle in backend
            });

            if (response.data.success) {
                // Store token and user data
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));

                console.log('Signup successful', response.data);
                navigate('/home');
            }
        } catch (err) {
            console.error('Signup Error:', err);
            setServerError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="JOIN THE CLUB"
            subtitle="Create an account to start your curated journey with GrabDesk today."
            image={Hero2}
        >
            <form onSubmit={handleSignup} className="flex flex-col gap-4">
                {serverError && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center font-medium border border-red-200">
                        {serverError}
                    </div>
                )}
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
                        type="number"
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

                {/* <div className="relative flex items-center gap-4 py-2">
                    <div className="h-px bg-[#e6d0bc] flex-1"></div>
                    <span className="text-xs text-[#a89078] font-medium uppercase tracking-widest">Or</span>
                    <div className="h-px bg-[#e6d0bc] flex-1"></div>
                </div> */}

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
