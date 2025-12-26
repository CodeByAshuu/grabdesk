import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import AuthInput from '../components/AuthInput';
import Button from '../components/Button';
import Hero from '../assets/hero-landing.png';
import api from '../api/axios';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    const validate = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
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

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        setServerError('');

        try {
            const response = await api.post('/auth/login', {
                email: formData.email,
                password: formData.password
            });

            if (response.data.success) {
                // Store token and user data
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));

                console.log('Login successful', response.data);

                // Redirect logic
                if (response.data.user.role === 'admin') {
                    navigate('/admindashbord');
                } else {
                    navigate('/home');
                }
            }
        } catch (err) {
            console.error('Login Error:', err);
            setServerError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="WELCOME BACK"
            subtitle="Sign in to access your curated shopping experience and saved items."
            image={Hero}
        >
            <form onSubmit={handleLogin} className="flex flex-col gap-5">
                {serverError && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center font-medium border border-red-200">
                        {serverError}
                    </div>
                )}
                <AuthInput
                    id="email"
                    label="Email Address"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                />

                <div className="flex flex-col gap-1.5">
                    <AuthInput
                        id="password"
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                    />
                    <div className="flex justify-between items-center px-1">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    id="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleChange}
                                    className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-[#8F5E41] checked:bg-[#8F5E41] checked:border-[#8F5E41] transition-all"
                                />
                                <svg
                                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-0 peer-checked:opacity-100 text-[#f3eadc] transition-opacity"
                                    viewBox="0 0 14 14"
                                    fill="none"
                                >
                                    <path d="M3 8L6 11L11 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <span className="text-sm text-[#7f5c3b] group-hover:text-[#5b3d25] transition-colors select-none">Remember me</span>
                        </label>

                        <Link to="#" className="text-sm font-semibold text-[#8F5E41] hover:text-[#5b3d25] hover:underline transition-all">
                            Forgot password?
                        </Link>
                    </div>
                </div>

                <div className="mt-4">
                    <Button
                        labell={loading ? "Signing In..." : "Log In"}
                        className={`w-full ${loading ? 'opacity-80 cursor-wait' : ''}`}
                        disabled={loading}
                    />
                </div>
{/* 
                <div className="relative flex items-center gap-4 py-2">
                    <div className="h-px bg-[#e6d0bc] flex-1"></div>
                    <span className="text-xs text-[#a89078] font-medium uppercase tracking-widest">Or continue with</span>
                    <div className="h-px bg-[#e6d0bc] flex-1"></div>
                </div> */}

                <p className="text-center text-sm text-[#7f5c3b] mt-2">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-bold text-[#8F5E41] hover:text-[#5b3d25] hover:underline">
                        Sign up free
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default Login;