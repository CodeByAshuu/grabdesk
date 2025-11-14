import React from "react";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import Nike1 from '../assets/Nike1.png';
import Nike2 from '../assets/Nike2.png';
import Nike3 from '../assets/Nike3.png';

function Product() {
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

                {/* TITLE */}
                <div className="my-12 mx-4">
                    <h1 className="boldonse-bold text-[#E3D5C3] text-5xl sm:text-7xl md:text-8xl lg:text-9xl">
                        PRODUCT
                    </h1>
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

export default Product;
