import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ImageSlider from "./ImageSlider";
import SingleStar from "../components/SingleStar";
import { FaHeart } from "react-icons/fa";

import Button from "./Button";

function ProductCard(props) {
    const [liked, setLiked] = useState(false);
    const navigate = useNavigate();

    const handleCardClick = () => {
        if (props.id) {
            navigate(`/product/${props.id}`);
        }
    };

    const handleLikeClick = (e) => {
        e.stopPropagation();
        setLiked(!liked);
    };

    const handleBuyClick = (e) => {
        e.stopPropagation();
        // Add buy logic here
        console.log("Buy clicked");
    };

    return (
        <>
            <div
                onClick={handleCardClick}
                className="w-[310px] max-w-full sm:w-[300px] md:w-[310px] 
                h-auto sm:h-[500px] rounded-md p-3 bg-[#FFE9D5] relative border-2 border-[#452215] shadow-[4px_4px_0_#8F5E41] transition-all duration-300 hover:shadow-[6px_6px_0_#8F5E41] hover:-translate-y-1 mx-auto text-[#452215] cursor-pointer"
            >

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
                            onClick={handleLikeClick}
                            className="p-2 rounded-full transition-transform duration-200 active:scale-90"
                        >
                            <FaHeart
                                className={`text-2xl transition-all duration-300 ${liked ? "text-red-500 scale-110" : "text-white"
                                    }`}
                            />
                        </button>
                    </div>
                </div>

                <h3 className="text-[18px] nunito-exbold">{props.namee}</h3>

                <div className="flex flex-col">
                    <p className="text-sm">Price</p>
                    <p className="mb-2">{props.pricee}</p>
                    <div onClick={(e) => e.stopPropagation()}>
                        <Button labell="Buy Now" onClick={handleBuyClick} />
                    </div>
                </div>

            </div>
        </>
    );
}

export default ProductCard;