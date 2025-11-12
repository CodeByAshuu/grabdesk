import React from "react";
import Hero from '../assets/hero-landing.png'

function Landing() {
  return (
    <>
      <div
        className="relative min-h-screen w-full overflow-hidden px-6 py-10 text-[#5b3d25]"
        style={{
          backgroundColor: "#f3eadc",
          backgroundImage:
            "radial-gradient(circle, rgba(110, 76, 42, 0.18) 8%, rgba(243, 234, 220, 0) 9%)",
          backgroundSize: "14px 14px",
        }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-6 left-8 uppercase tracking-[0.45em] text-[0.7rem] font-semibold text-[#7d5834]">
            Shop Now Style 2005
          </div>
          <div className="absolute top-6 right-8 text-right uppercase tracking-[0.45em] text-[0.7rem] font-semibold text-[#7d5834]">
            UNLOCK
            <br />
            STATIONARY
          </div>
          <div className="absolute left-0 bottom-32 -rotate-90 uppercase tracking-[0.6em] text-[0.65rem] text-[#907056]">
            Laptops Mobile Phone
          </div>
          <div className="absolute bottom-40 right-6 max-w-xs text-sm leading-relaxed text-[#7f5c3b]">
            A mannequin muse styled with olive tailoring, gold accents, and a
            caramel satchel — the 2005 icon reimagined for today's creative
            desk scene.
          </div>
          {/* <div className="absolute top-40 left-4  max-w-xs leading-relaxed text-xs text-[#6c4c30]">
            PERSONLIZED RECOMMENDATION
          </div> */}
        </div>

        <div className="relative mx-auto flex min-h-[80vh] max-w-6xl justify-center">
          {/* GRABDESK text - behind the image */}
          <h1
            className="boldonse-bold relative top-30 rotate-[-4deg] z-0 text-[14vw] leading-[0.8] text-[#f0a224] lg:text-[12rem]"
            style={{
              textShadow:
                "12px 12px 0 #5b3d25, 24px 24px 0 rgba(91, 61, 37, 0.45)",
            }}
          >
            GRABDESK
          </h1>

          {/* Centered hero image - in front of text */}
          <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-2/7">
            <img src={Hero} alt="hero" className="transform scale-175" />
          </div>
        </div>

        {/* Moved paragraph to bottom center */}
        <div className="mx-auto mt-16 max-w-2xl text-center">
          
        </div>
      </div>
    </>
  );
}

export default Landing;