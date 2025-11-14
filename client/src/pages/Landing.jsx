import React from "react";
import Hero from '../assets/hero-landing.png'
import { Link } from "react-router-dom";
import Hero2 from '../assets/hero2-landing.png'

function Landing() {
  return (
    <>
      <div
        className="relative min-h-screen w-full px-6 py-0 text-[#5b3d25]"
        style={{
          backgroundColor: "#f3eadc",
          backgroundImage:
            "radial-gradient(circle, rgba(110, 76, 42, 0.18) 8%, rgba(243, 234, 220, 0) 9%)",
          backgroundSize: "14px 24px",
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
          {/* GRABDESK text */}
          <h1
            className="boldonse-bold relative top-30 rotate-[-4deg] z-0 text-[14vw] leading-[0.8] text-[#f0a224] lg:text-[12rem]"
            style={{
              textShadow:
                "12px 12px 0 #5b3d25, 24px 24px 0 rgba(91, 61, 37, 0.45)",
            }}
          >
            GRABDESK
          </h1>

          {/* Centered hero image */}
          <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-2/7">
            <img src={Hero} alt="hero" className="transform scale-175" />
          </div>

          {/* Hero2 image */}
        </div>
      </div>
      <div className="relative min-h-screen w-full px-6 m-0 text-[#5b3d25]"
        style={{
          backgroundColor: "#442314",
          backgroundImage:
            "radial-gradient(circle, rgba(110, 76, 42, 0.18) 8%, rgba(243, 234, 220, 0) 9%)",
          backgroundSize: "14px 24px",
        }}>
          <div className="absolute left-120 top-50 z-20 -translate-x-1/2 -translate-y-2/7">
            <img src={Hero2} alt="hero2" className="transform scale-180" />
          </div>
      </div>
      <div className="relative h-96 w-full px-6 py-3 m-0 text-[#FFEAD5] bg-[#4a3020]">
          {/* <div className="absolute left-120 top-50 z-20 -translate-x-1/2 -translate-y-2/7">
            <img src={Hero2} alt="hero2" className="transform scale-180" />
          </div> */}
          <div className="font-sans text-3xl leading-7 py-2">
            OUR MISSION IS TO BUILD A SHOPPING <br/>
            EXPERIENCE THAT FEELS PERSONAL,<br/>
            EFFORTLESS, AND INTUITIVE.
          </div>
          <div className="text-xs font-sans font-light">
            GrabDesk is designed to help users <br />
            discover products that match their taste,
            <br />needs, and lifestyle without endless scrolling.
          </div>
          <div className="absolute text-xs font-sans font-light bottom-4 left-6"> 
            At GrabDesk, we believe that shopping should be simple. <br />
            Every product suggestion is thoughtfully curated using user behavior, <br />
            preferences, and real-time trends — turning online <br />
            shopping into a tailored experience for every individual.
          </div>
          <div className="absolute text-right text-3xl font-sans leading-7 bottom-4 right-6">
            CREATING A PLATFORM THAT CONNECTS USERS <br/>
            WITH THE PRODUCTS THEY ACTUALLY <br/>
            WANT WHEN THEY WANT THEM.
          </div>
          <div className="absolute top-4 right-46 text-xs tracking-tighter font-sans font-normal">
            ESTABLISHED IN <br />
            2025
          </div>
          <div className="absolute top-4 right-6 text-xs tracking-tighter font-sans font-normal">
            ESTABLISHED IN <br />
            2025
          </div>

      </div>
    </>
  );
}

export default Landing;