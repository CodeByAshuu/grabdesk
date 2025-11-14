import React from "react";
function Button(props){
    return (
        <>
        <button className="text-[#FFE9D5] uppercase w-full py-2 rounded-xl 
         border-2 border-[#452215]  bg-[#F0A322] 
         shadow-[4px_4px_0_#452215] 
         active:shadow-none active:translate-x-1 active:translate-y-1 
         transition-all duration-150">
                        <span className="text-lg nunito-bold text-[#FFE9D5]">{props.labell}</span>
                    </button>
        
        </>
    )
}
export default Button;