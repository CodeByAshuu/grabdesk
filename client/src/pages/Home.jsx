import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import Nike1 from '../assets/Nike1.png';
import Nike2 from '../assets/Nike2.png';
import Nike3 from '../assets/Nike3.png';
import Hero from '../assets/hero-banner.png';
import Button from '../components/Button';

function Home() {
    return (
        <>
            <section
                className="min-h-screen w-full overflow-hidden text-[#5b3d25]"
                style={{
                    backgroundColor: "#442314",
                    backgroundImage:
                        "radial-gradient(circle, rgba(110, 76, 42, 0.18) 8%, rgba(243, 234, 220, 0) 9%)",
                    backgroundSize: "14px 14px",
                }}
            >
                <Navbar />
                <div className="relative w-full h-screen bg-cover bg-center bg-no-repeat text-[#FFEAD5] pt-16 pl-8"
                style={{ backgroundImage: `url(${Hero})` }}
                >   
                    <div className="absolute inset-0 bg-gradient-to-b from-yellow-950/80 via-amber/40 to-transparent"></div>
                    <div className="absolute my-12 mx-4 z-10 top-2">
                        <h1 className="boldonse-bold text-[#F0A322] text-4xl sm:text-6xl md:text-7xl lg:text-9xl p-4 text-left"
                        style={{
                            textShadow:
                            "12px 12px 0 #5b3d25, 24px 24px 0 rgba(91, 61, 37, 0.45)",  
                        }}>
                            GRABDESK
                        </h1>
                        <p className="absolute left-8 top-45 text-left w-1/3 text-[#f4bc62]" >
                            Your curated vintage and workspace essentials. Find desks, chairs, 
                            lighting and unique decor that tell a story.
                        </p>
                    </div>
                    {/* OPEN CATALOG BUTTON  */}
                    <div className="absolute top-90 left-18 flex gap-4 pointer-events-auto z-10">
                        <Link to="/product">
                            <Button labell="OPEN CATALOG" className="w-md"/>
                        </Link>
                    </div>
                </div>

                {/* RESPONSIVE CARDS GRID */}
                <div
                    className="
                        m-10 
                        grid 
                        grid-cols-1 
                        sm:grid-cols-2 
                        lg:grid-cols-3 
                        gap-10 
                        justify-items-center
                    "
                >
                    <ProductCard
                        images={[Nike1, Nike2, Nike3]}
                        tagg="NEW DROP"
                        rating={4.56}
                        namee="Nike Dunk Low Retro SE"
                        pricee="₹ 10 257.00"
                    />

                    <ProductCard
                        images={[Nike1, Nike2, Nike3]}
                        tagg="NEW DROP"
                        rating={4.56}
                        namee="Nike Dunk Low Retro SE"
                        pricee="₹ 10 257.00"
                    />

                    <ProductCard
                        images={[Nike1, Nike2, Nike3]}
                        tagg="NEW DROP"
                        rating={4.56}
                        namee="Nike Dunk Low Retro SE"
                        pricee="₹ 10 257.00"
                    />
                </div>
            </section>
        </>
    );
}

export default Home;
