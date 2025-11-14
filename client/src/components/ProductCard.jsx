import React, { useState } from "react";
import { Link } from "react-router-dom";
import ImageSlider from "./ImageSlider";
import SingleStar from "../components/SingleStar";
import { FaHeart } from "react-icons/fa";
import paper2 from '../assets/paper2.png';
import Button from "./Button";

function ProductCard(props) {
    const [liked, setLiked] = useState(false);

    return (
        <>
            <div className="w-[310px] max-w-full sm:w-[300px] md:w-[310px] 
                h-auto sm:h-[500px] rounded-md p-3 bg-[#FFE9D5] relative border-2 border-[#452215] shadow-[4px_4px_0_#8F5E41] transition-all duration-300 hover:shadow-[6px_6px_0_#8F5E41] hover:-translate-y-1">

                {props.tagg && (
                    <div className="nunito-exbold absolute -top-1 -left-6 bg-[#d19a2c] text-white px-8 py-2 text-sm rounded-xs rotate-[-13deg] shadow-md z-20">
                        {props.tagg}
                    </div>
                )}

                {/* image */}
                <ImageSlider images={props.images} />

                <div className="flex justify-end items-baseline ">
                    <div className="flex flex-row gap-5">
                        <SingleStar />
                        <button
                            onClick={() => setLiked(!liked)}
                            className="p-2 rounded-full transition-transform duration-200 active:scale-90"
                        >
                            <FaHeart
                                className={`text-2xl transition-all duration-300 ${
                                    liked ? "text-red-500 scale-110" : "text-white"
                                }`}
                            />
                        </button>
                    </div>
                </div>

                <h3 className="text-[18px] nunito-exbold">{props.namee}</h3>

                <div className="flex flex-col">
                    <p className="text-sm">Price</p>
                    <p className="mb-2">{props.pricee}</p>

                    {/* <button className="text-[#FFE9D5] uppercase w-full py-2 rounded-xl 
         border-2 border-[#452215]  bg-[#F0A322] 
         shadow-[4px_4px_0_#452215] 
         active:shadow-none active:translate-x-1 active:translate-y-1 
         transition-all duration-150">
                        <span className="text-lg nunito-bold text-[#FFE9D5]">Buy Now</span>
                    </button> */}
                    <Button labell="Buy Now"/>
                </div>

            </div>
        </>
    );
}

export default ProductCard;
