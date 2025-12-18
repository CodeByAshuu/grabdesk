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

                <div className="relative flex items-center gap-4 py-2">
                    <div className="h-px bg-[#e6d0bc] flex-1"></div>
                    <span className="text-xs text-[#a89078] font-medium uppercase tracking-widest">Or continue with</span>
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
                    Google
                </button>

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