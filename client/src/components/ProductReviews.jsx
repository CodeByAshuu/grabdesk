import React, { useState } from 'react';

const ProductReviews = ({ productId }) => {
    const [isWriting, setIsWriting] = useState(false);
    const [reviews, setReviews] = useState([
        {
            id: 1,
            name: "Sarah Jenkins",
            date: "2023-11-15",
            rating: 5,
            verified: true,
            comment: "Absolutely love these! The color is exactly as shown and the comfort is unmatched. Use them for my daily walks and haven't had a single blister.",
            helpful: 24
        },
        {
            id: 2,
            name: "Michael Chen",
            date: "2023-10-02",
            rating: 4,
            verified: true,
            comment: "Great quality materials. The sizing runs slightly small though, so I'd recommend going half a size up if you have wide feet. Delivery was super fast.",
            helpful: 12
        },
        {
            id: 3,
            name: "Priya Sharma",
            date: "2023-09-28",
            rating: 5,
            verified: false,
            comment: "Bought these as a gift for my brother and he loves them. The packaging was premium and they look even better in person. 10/10 would buy again.",
            helpful: 8
        }
    ]);

    const [newReview, setNewReview] = useState({
        name: '',
        rating: 0,
        comment: ''
    });

    const calculateAverage = () => {
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
        return (sum / reviews.length).toFixed(1);
    };

    const countStars = (star) => {
        return reviews.filter(r => r.rating === star).length;
    };

    const handleVote = (id) => {
        setReviews(reviews.map(r => r.id === id ? { ...r, helpful: r.helpful + 1 } : r));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newReview.rating === 0 || !newReview.name || !newReview.comment) return;

        const reviewToAdd = {
            id: reviews.length + 1,
            name: newReview.name,
            date: new Date().toISOString().split('T')[0],
            rating: newReview.rating,
            verified: true, // Assuming new submissions are verified for demo
            comment: newReview.comment,
            helpful: 0
        };

        setReviews([reviewToAdd, ...reviews]);
        setIsWriting(false);
        setNewReview({ name: '', rating: 0, comment: '' });
    };

    return (
        <div className="mt-12 border-t border-[#8F5E41]/20 pt-10 pb-10">
            <h2 className="text-3xl font-bold text-[#452215] mb-8">Customer Reviews</h2>

            <div className="flex flex-col lg:flex-row gap-10">

                {/* Rating Overview */}
                <div className="lg:w-1/3">
                    <div className="bg-[#fff8f0] p-6 rounded-xl border border-[#e6d0bc]">
                        <div className="flex items-center gap-4 mb-6">
                            <h3 className="text-5xl font-bold text-[#452215]">{calculateAverage()}</h3>
                            <div>
                                <div className="flex text-yellow-500 mb-1">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 ${i < Math.round(calculateAverage()) ? 'fill-current' : 'text-gray-300 fill-current'}`} viewBox="0 0 24 24">
                                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-[#6b4c35] text-sm">{reviews.length} Verified Reviews</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {[5, 4, 3, 2, 1].map(star => {
                                const count = countStars(star);
                                const percentage = reviews.length ? (count / reviews.length) * 100 : 0;
                                return (
                                    <div key={star} className="flex items-center gap-3">
                                        <span className="text-sm font-medium text-[#452215] w-8">{star} ★</span>
                                        <div className="flex-1 h-2 bg-[#e6d0bc] rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[#8F5E41]"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-[#6b4c35] w-6 text-right">{count}</span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-8 pt-6 border-t border-[#e6d0bc]">
                            <h4 className="font-semibold text-[#452215] mb-2">Review this product</h4>
                            <p className="text-sm text-[#6b4c35] mb-4">Share your thoughts with other customers</p>
                            <button
                                onClick={() => setIsWriting(!isWriting)}
                                className="w-full py-2 bg-white border border-[#452215] text-[#452215] rounded-lg font-bold hover:bg-[#452215] hover:text-[#E3D5C3] transition-all"
                            >
                                {isWriting ? 'Cancel Review' : 'Write a Review'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Reviews List & Form */}
                <div className="flex-1">

                    {/* Write Review Form */}
                    {isWriting && (
                        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-[#fff8f0] rounded-xl border border-[#452215] animate-fadeIn">
                            <h3 className="text-xl font-bold text-[#452215] mb-4">Write a Review</h3>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-[#452215] mb-1">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setNewReview({ ...newReview, rating: star })}
                                            className="focus:outline-none"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className={`w-8 h-8 ${star <= newReview.rating ? 'text-yellow-500 fill-current' : 'text-gray-300 fill-current'}`} viewBox="0 0 24 24">
                                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                            </svg>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-[#452215] mb-1">Your Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newReview.name}
                                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                                    className="w-full border border-[#e6d0bc] rounded-lg px-3 py-2 focus:border-[#8F5E41] focus:outline-none bg-white"
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-[#452215] mb-1">Review</label>
                                <textarea
                                    required
                                    rows="4"
                                    value={newReview.comment}
                                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                    className="w-full border border-[#e6d0bc] rounded-lg px-3 py-2 focus:border-[#8F5E41] focus:outline-none bg-white"
                                    placeholder="Tell us what you liked or disliked..."
                                />
                            </div>

                            <button type="submit" className="px-6 py-2 bg-[#452215] text-[#E3D5C3] rounded-lg font-bold hover:bg-[#5b3d25] transition-all">
                                Submit Review
                            </button>
                        </form>
                    )}

                    {/* List */}
                    <div className="space-y-6">
                        {reviews.map(review => (
                            <div key={review.id} className="border-b border-[#e6d0bc] pb-6 last:border-none">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 bg-[#e6d0bc] rounded-full flex items-center justify-center text-[#452215] font-bold">
                                            {review.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-[#452215] text-sm">{review.name}</h4>
                                            <p className="text-xs text-[#6b4c35]">{review.date}</p>
                                        </div>
                                    </div>
                                    {review.verified && (
                                        <span className="px-2 py-1 bg-[#452215]/10 text-[#452215] text-[10px] font-bold uppercase tracking-wider rounded-full">
                                            Verified Purchase
                                        </span>
                                    )}
                                </div>

                                <div className="flex text-yellow-500 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300 fill-current'}`} viewBox="0 0 24 24">
                                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                        </svg>
                                    ))}
                                </div>

                                <p className="text-[#6b4c35] text-sm leading-relaxed mb-4">
                                    {review.comment}
                                </p>

                                <div className="flex items-center gap-4">
                                    <p className="text-xs text-[#8F5E41]">Was this review helpful?</p>
                                    <button
                                        onClick={() => handleVote(review.id)}
                                        className="flex items-center gap-1 text-xs text-[#452215] hover:text-[#8F5E41] font-medium"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                        </svg>
                                        Yes ({review.helpful})
                                    </button>
                                    <button className="flex items-center gap-1 text-xs text-[#452215] hover:text-[#8F5E41] font-medium">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                                        </svg>
                                        No
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductReviews;
