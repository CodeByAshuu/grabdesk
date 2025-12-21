import React, { useState } from 'react';
import api from '../api/axios';

const Icons = {
    Send: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
    ),
    User: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    ),
};

const UserMessaging = () => {
    const [formData, setFormData] = useState({
        emailOrUsername: '',
        title: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState({ type: '', message: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.emailOrUsername || !formData.title || !formData.message) {
            setFeedback({ type: 'error', message: 'All fields are required' });
            return;
        }

        setLoading(true);
        setFeedback({ type: '', message: '' });

        try {
            const response = await api.post('/admin/send-message', formData);

            if (response.data.success) {
                setFeedback({
                    type: 'success',
                    message: response.data.message
                });
                // Reset form
                setFormData({ emailOrUsername: '', title: '', message: '' });
            }
        } catch (error) {
            setFeedback({
                type: 'error',
                message: error.response?.data?.message || 'Failed to send message'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="space-y-6 px-2 sm:px-0 gowun-dodum-regular">
            <div className="bg-[#FFE9D5] border border-[#452215] shadow-[4px_4px_0_#8F5E41] transition-all hover:shadow-[6px_6px_0_#8F5E41] rounded-xl p-6">

                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-[#F0A322] rounded-full flex items-center justify-center">
                        <Icons.User />
                    </div>
                    <div>
                        <h2 className="text-2xl nunito-exbold text-[#442314]">Send Message to User</h2>
                        <p className="text-sm text-[#5b3d25]/70">Send direct messages to specific users</p>
                    </div>
                </div>

                {feedback.message && (
                    <div className={`mb-4 p-4 rounded-lg ${feedback.type === 'success'
                            ? 'bg-green-100 text-green-800 border border-green-300'
                            : 'bg-red-100 text-red-800 border border-red-300'
                        }`}>
                        {feedback.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email or Username Input */}
                    <div>
                        <label className="block text-sm nunito-bold text-[#442314] mb-2">
                            User Email or Username *
                        </label>
                        <input
                            type="text"
                            name="emailOrUsername"
                            value={formData.emailOrUsername}
                            onChange={handleChange}
                            placeholder="Enter email or username"
                            className="w-full px-4 py-3 bg-white border border-[#ccafa5] rounded-lg text-[#442314] 
                focus:outline-none focus:ring-2 focus:ring-[#F0A322] focus:border-transparent
                placeholder:text-[#5b3d25]/50"
                        />
                    </div>

                    {/* Message Title */}
                    <div>
                        <label className="block text-sm nunito-bold text-[#442314] mb-2">
                            Message Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter message title"
                            className="w-full px-4 py-3 bg-white border border-[#ccafa5] rounded-lg text-[#442314] 
                focus:outline-none focus:ring-2 focus:ring-[#F0A322] focus:border-transparent
                placeholder:text-[#5b3d25]/50"
                        />
                    </div>

                    {/* Message Body */}
                    <div>
                        <label className="block text-sm nunito-bold text-[#442314] mb-2">
                            Message *
                        </label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="6"
                            placeholder="Enter your message..."
                            className="w-full px-4 py-3 bg-white border border-[#ccafa5] rounded-lg text-[#442314] 
                focus:outline-none focus:ring-2 focus:ring-[#F0A322] focus:border-transparent
                placeholder:text-[#5b3d25]/50 resize-none"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full px-6 py-3 bg-[#F0A322] text-[#452215] nunito-bold rounded-lg 
              border-2 border-[#452215] shadow-[4px_4px_0_#8F5E41] 
              transition-all duration-300 
              ${loading
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:shadow-[6px_6px_0_#8F5E41] hover:-translate-y-1 active:translate-y-0'
                            }
              flex items-center justify-center gap-2`}
                    >
                        {loading ? (
                            <>
                                <span className="animate-spin">⏳</span>
                                Sending...
                            </>
                        ) : (
                            <>
                                <Icons.Send />
                                Send Message
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 p-4 bg-[#f0e6d8]/50 rounded-lg border border-[#ccafa5]/30">
                    <p className="text-xs text-[#5b3d25]/70">
                        <span className="nunito-bold">Note:</span> Messages are delivered in real-time to online users
                        and will appear in their notification center. Offline users will see the message when they log in.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserMessaging;
