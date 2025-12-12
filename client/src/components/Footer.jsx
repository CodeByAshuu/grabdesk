import React from "react";
import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="w-full bg-[#f3eadc] text-[#5b3d25] pt-16 pb-8 px-6 border-t border-[#d4c5b0]">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                {/* Brand Section */}
                <div className="space-y-6">
                    <h2 className="boldonse-bold text-3xl">
                        GRAB<span className="text-[#f0a224]">DESK</span>
                    </h2>
                    <p className="text-sm leading-relaxed max-w-xs">
                        Curating the finest vintage and modern workspace essentials.
                        We believe your desk should be a reflection of your creativity and style.
                    </p>
                    <div className="flex gap-4">
                        {/* Social Icons Placeholder */}
                        {['Instagram', 'Twitter', 'Pinterest'].map((social) => (
                            <a key={social} href="#" className="w-10 h-10 rounded-full border border-[#5b3d25] flex items-center justify-center hover:bg-[#5b3d25] hover:text-[#f3eadc] transition-colors">
                                <span className="sr-only">{social}</span>
                                <span className="text-xs font-bold">{social[0]}</span>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="font-bold mb-6 tracking-widest text-sm uppercase">Shop</h3>
                    <ul className="space-y-4 text-sm">
                        {['New Arrivals', 'Best Sellers', 'Furniture', 'Lighting', 'Accessories'].map((item) => (
                            <li key={item}>
                                <Link to="/product" className="hover:text-[#f0a224] transition-colors">
                                    {item}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Support */}
                <div>
                    <h3 className="font-bold mb-6 tracking-widest text-sm uppercase">Support</h3>
                    <ul className="space-y-4 text-sm">
                        {['Contact Us', 'Shipping Policy', 'Returns', 'FAQ', 'Terms of Service'].map((item) => (
                            <li key={item}>
                                <Link to="/contact" className="hover:text-[#f0a224] transition-colors">
                                    {item}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h3 className="font-bold mb-6 tracking-widest text-sm uppercase">Stay Updated</h3>
                    <p className="text-sm mb-4">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
                    <div className="flex flex-col gap-3">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="px-4 py-3 bg-transparent border border-[#5b3d25] focus:outline-none focus:border-[#f0a224] text-sm"
                        />
                        <button className="px-6 py-3 bg-[#5b3d25] text-[#f3eadc] text-sm font-bold hover:bg-[#4a3020] transition-colors uppercase tracking-wider">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="max-w-7xl mx-auto pt-8 border-t border-[#d4c5b0] flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-80">
                <p>&copy; 2025 GrabDesk. All rights reserved.</p>
                <div className="flex gap-6">
                    <a href="#" className="hover:underline">Privacy Policy</a>
                    <a href="#" className="hover:underline">Terms of Use</a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
