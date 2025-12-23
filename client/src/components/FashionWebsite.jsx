import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import Navbar from './Navbar';
import Footer from './Footer';
import blogHero from '../assets/blog_hero.png';
import banner from '../assets/banner/b17.jpg'
import { Link } from "react-router-dom";
import Button from '../components/Button'
import { ButtonLight } from './ButtonLight';

export default function FashionWebsite() {
  const navigate = useNavigate();

  const blogPosts = [
    {
      id: 1,
      title: "The Art of Minimalist Dressing",
      excerpt: "Discover how to build a timeless wardrobe with fewer, better pieces that reflect your unique personality.",
      date: "Dec 22, 2025",
      category: "STYLE GUIDE",
      image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&h=500&fit=crop",
      featured: true
    },
    {
      id: 2,
      title: "Seasonal Color Palette: Winter 2025",
      excerpt: "From deep burgundies to icy blues, explore the colors defining this season's most iconic looks.",
      date: "Dec 18, 2025",
      category: "TRENDS",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=800&fit=crop"
    },
    {
      id: 3,
      title: "Sustainable Fabrics You Should Know",
      excerpt: "An in-depth look at the innovative materials shaping the future of eco-conscious fashion.",
      date: "Dec 15, 2025",
      category: "SUSTAINABILITY",
      image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&h=800&fit=crop"
    },
    {
      id: 4,
      title: "How to Style Oversized Blazers",
      excerpt: "Master the art of proportions with our guide to making the oversized blazer work for any occasion.",
      date: "Dec 10, 2025",
      category: "TUTORIAL",
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop"
    },
    {
      id: 5,
      title: "The Return of Vintage Accessories",
      excerpt: "Why 90s minimalism and 70s flair are making a massive comeback in the accessory world.",
      date: "Dec 05, 2025",
      category: "VINTAGE",
      image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=800&fit=crop"
    }
  ];

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen text-[#5b3d25]" style={{ backgroundColor: '#f3eadc' }}>
      {/* Editorial Header */}
      <section className="py-20 px-6 max-w-7xl mx-auto text-center">
        <h1 className="boldonse-bold text-5xl md:text-8xl mb-6 tracking-tight uppercase">
          BLOG & <span className="text-[#f0a224]">STYLE</span>
        </h1>
        <img
            src="/page-emo/blog-emo.png"
            alt="Product Page Icon"
            className="absolute top-33 lg:top-32 right-5 lg:right-56  w-22 h-22 sm:w-52 sm:h-52 mb-4 object-contain"
          />
        <p className="text-lg md:text-xl text-[#8F5E41] max-w-2xl mx-auto italic font-serif">
          "Elegance is not standing out, but being remembered."
        </p>
        <div className="mt-8 flex justify-center gap-4 items-center">
          <div className="h-1px w-12 bg-[#5a2f1f]"></div>
          <span className="text-xs tracking-[0.4em] uppercase font-bold text-[#5a2f1f]">Volume III, Issue II</span>
          <div className="h-1px w-12 bg-[#5a2f1f]"></div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="px-6 mb-20">
          <div className="max-w-7xl mx-auto group cursor-pointer overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500">
            <div className="grid md:grid-cols-2">
              <div className="relative h-[400px] md:h-[550px] overflow-hidden">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />
                <div className="absolute top-6 left-6 bg-[#f0a224] text-[#442314] px-4 py-1 text-xs font-bold tracking-widest uppercase">
                  Featured
                </div>
              </div>
              <div className="p-12 flex flex-col justify-center">
                <span className="text-[#f0a224] font-bold tracking-[0.2em] text-xs mb-4 uppercase">{featuredPost.category}</span>
                <h2 className="boldonse-bold text-4xl md:text-6xl mb-6 leading-tight group-hover:text-[#f0a224] transition-colors line-clamp-2">
                  {featuredPost.title}
                </h2>
                <p className="text-[#8F5E41] mb-8 text-lg font-serif italic leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-sm text-gray-500 font-medium">{featuredPost.date}</span>
                  <button className="text-[#5a2f1f] font-bold tracking-widest text-sm hover:translate-x-2 transition-transform uppercase flex items-center gap-2">
                    Read Article <span className="text-xl">→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Article Grid */}
      <section className="px-6 py-20 bg-white/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-16 border-b border-[#5a2f1f]/10 pb-6">
            <h3 className="boldonse-bold text-3xl uppercase tracking-widest">Latest Stories</h3>
            <div className="flex gap-4">
              {['All', 'Trends', 'Style', 'Life'].map(cat => (
                <button key={cat} className="text-xs font-bold tracking-widest uppercase hover:text-[#f0a224] transition-colors">
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-12 gap-y-20">
            {regularPosts.map((post) => (
              <div key={post.id} className="group cursor-pointer">
                <div className="relative aspect-16/10 overflow-hidden rounded-2xl mb-8 shadow-lg group-hover:shadow-2xl transition-all duration-500">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                </div>
                <div className="px-2">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-[#f0a224] font-bold tracking-widest text-[10px] uppercase border border-[#f0a224] px-2 py-0.5 rounded">
                      {post.category}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{post.date}</span>
                  </div>
                  <h4 className="boldonse-bold text-3xl md:text-3xl mb-4 leading-tight group-hover:text-[#f0a224] transition-colors">
                    {post.title}
                  </h4>
                  <p className="text-[#8F5E41] text-sm leading-relaxed mb-6 line-clamp-2 gowun-dodum-regular">
                    {post.excerpt}
                  </p>
                  <button className="text-[#5a2f1f] font-bold tracking-widest text-xs uppercase flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                    Keep Reading <span className="text-lg">→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter / Call to Action */}
      <section className="py-24 px-6 text-center bg-[#442314] text-[#f3eadc]">
        <div className="max-w-3xl mx-auto">
          <h3 className="boldonse-bold text-4xl mb-6">Stay in the Loop</h3>
          <p className="mb-10 text-[#dab590] gowun-dodum-regular">
            Subscribe to our newsletter for exclusive editorial content, trend reports, and a touch of elegance in your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Your email address"
              className="bg-transparent border border-[#dab590]/30 px-6 py-4 rounded-lg focus:outline-none focus:border-[#f0a224] transition-colors sm:w-80"
            />
            <button className="bg-[#f0a224] text-[#442314] font-bold px-10 py-4 rounded-lg hover:bg-white transition-all tracking-widest uppercase text-sm">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}