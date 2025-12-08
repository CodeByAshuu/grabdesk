import React from "react";
import b2 from "../assets/banner/b2.jpg";
import b17 from "../assets/banner/b17.jpg";
import b10 from "../assets/banner/b10.jpg";
import b7 from "../assets/banner/b7.jpg";
import b4 from "../assets/banner/b4.jpg";
import b18 from "../assets/banner/b18.jpg";

function Banner() {
    return (
        <>
            {/* Small Banner Section (2 Columns) */}
            <section className="flex flex-wrap justify-between gap-5 px-6 py-12 max-w-7xl mx-auto">
                {/* Banner Box 1 */}
                <div
                    className="flex flex-col justify-center items-start text-left bg-cover bg-center min-h-[40vh] min-w-[300px] flex-1 p-8 rounded-xl shadow-[4px_4px_0_#8F5E41] border-2 border-[#452215] transition-all hover:-translate-y-1 group"
                    style={{ backgroundImage: `url(${b17})` }}
                >
                    <h4 className="text-white text-xl font-light">crazy deals</h4>
                    <h2 className="text-white text-2xl md:text-4xl font-extrabold my-2 boldonse-bold">buy 1 get 1 free</h2>
                    <span className="text-white text-sm font-medium mb-4">The best classic dress is on sale at grabdesk</span>
                    <button className="px-4 py-2 bg-transparent border border-white text-white font-semibold cursor-pointer transition-all duration-300 group-hover:bg-[#5B3D25] group-hover:border-[#f0a224]">
                        Learn More
                    </button>
                </div>

                {/* Banner Box 2 */}
                <div
                    className="flex flex-col justify-center items-start text-left bg-cover bg-center min-h-[40vh] min-w-[300px] flex-1 p-8 rounded-xl shadow-[4px_4px_0_#8F5E41] border-2 border-[#452215] transition-all hover:-translate-y-1 group"
                    style={{ backgroundImage: `url(${b10})` }}
                >
                    <h4 className="text-white text-xl font-light">spring/summer</h4>
                    <h2 className="text-white text-2xl md:text-4xl font-extrabold my-2 boldonse-bold">Upcoming season</h2>
                    <span className="text-white text-sm font-medium mb-4 ">The best classic dress is on sale at grabdesk</span>
                    <button className="px-4 py-2 bg-transparent border border-white text-white font-semibold cursor-pointer transition-all duration-300 group-hover:bg-[#f0a224] group-hover:border-[#f0a224]">
                        Collection
                    </button>
                </div>
            </section>

            {/* Text Banner Section (3 Columns) */}
            <section className="flex flex-wrap justify-between gap-4 px-6 mb-12 max-w-7xl mx-auto">
                {/* Banner Box 3 */}
                <div
                    className="flex flex-col justify-center items-start bg-cover bg-center min-h-[30vh] min-w-[30%] flex-1 p-6 rounded-xl shadow-md border border-[#452215]/30 transform hover:scale-[1.02] transition-all"
                    style={{ backgroundImage: `url(${b7})` }}
                >
                    <h2 className="text-white text-xl font-black mb-1 boldonse-bold">SEASONAL SALE</h2>
                    <h3 className="text-[#ec544e] text-lg font-extrabold">Winter Collection -50% OFF</h3>
                </div>

                {/* Banner Box 4 */}
                <div
                    className="flex flex-col justify-center items-start bg-cover bg-center min-h-[30vh] min-w-[30%] flex-1 p-6 rounded-xl shadow-md border border-[#452215]/30 transform hover:scale-[1.02] transition-all"
                    style={{ backgroundImage: `url(${b4})` }}
                >
                    <h2 className="text-white lg:text-xl sm:text-xs font-black mb-1 boldonse-bold">NEW FOOTWEAR COLLECTION</h2>
                    <h3 className="text-[#ec544e] text-lg font-extrabold">Spring / Summer 2025</h3>
                </div>

                {/* Banner Box 5 */}
                <div
                    className="flex flex-col justify-center items-start bg-cover bg-center min-h-[30vh] min-w-[30%] flex-1 p-6 rounded-xl shadow-md border border-[#452215]/30 transform hover:scale-[1.02] transition-all"
                    style={{ backgroundImage: `url(${b18})` }}
                >
                    <h2 className="text-white text-xl font-black mb-1 boldonse-bold">T-SHIRTS</h2>
                    <h3 className="text-[#ec544e] text-lg font-extrabold">New Trendy Prints</h3>
                </div>
            </section>

            {/* Wide Banner Section */}
            {/* <section
                className="flex flex-col justify-center items-center text-center bg-cover bg-center w-full min-h-[40vh] py-10 mb-8"
                style={{ backgroundImage: `url(${b2})` }}
            >
                <h4 className="text-white text-xl font-bold mb-2">Repair Service</h4>
                <h2 className="text-white text-4xl md:text-5xl font-extrabold mb-6">
                    Up to <span className="text-[#f0a224]">70% off</span> - All t-Shirts & Accessories
                </h2>
                <button className="px-6 py-3 bg-white text-black font-bold uppercase rounded-sm hover:bg-[#f0a224] hover:text-white transition-colors">
                    Explore more
                </button>
            </section> */}
        </>
    );
}

export default Banner;
