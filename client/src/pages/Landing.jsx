import React from "react";
import Hero from '../assets/hero-landing.png'
import { Link } from "react-router-dom";
import Hero2 from '../assets/hero2-landing.png'
import Mission from '../assets/miss.png'
import Paper from '../assets/paper.png'
import Button from '../components/Button'
import { ButtonLight } from "../components/ButtonLight";

function Landing() {
  return (
    <>
      <div
        className="relative lg:min-h-screen h-screen w-full px-6 py-0 text-[#5b3d25]"
        style={{
          backgroundColor: "#f3eadc",
          backgroundImage:
            "radial-gradient(circle, rgba(110, 76, 42, 0.18) 8%, rgba(243, 234, 220, 0) 9%)",
          backgroundSize: "14px 24px",
        }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute lg:top-6 lg:left-8 top-6 left-6 uppercase tracking-[0.45em] text-[0.4rem] lg:text-[0.7rem] font-semibold text-[#7d5834]">
            Shop Now Style 2005
          </div>
          <div className="absolute top-6 right-8 z-50 flex gap-4 pointer-events-auto">
            <Link to="/login" className="w-25">
              <Button labell="Login" />
            </Link>
          </div>
          <div className="absolute lg:-left-20 lg:bottom-32 -left-25 bottom-40 -rotate-90 uppercase tracking-[0.6em] text-[0.65rem] text-[#907056]">
            Laptops Mobile Phone
          </div>
          <div className="absolute lg:bottom-40 lg:right-6 bottom-70 right-25 max-w-xs text-sm leading-relaxed text-[#7f5c3b]">
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
            className="boldonse-bold relative lg:top-45 top-70 lg:rotate-[-4deg] z-0 text-[14vw] leading-[0.8] text-[#f0a224] lg:text-[12rem]"
            style={{ textShadow: "var(--grabdesk-shadow)" }}
          >
            GRABDESK
          </h1>

          {/* Centered hero image */}
          <div className="absolute lg:left-1/2 left-1/2 lg:top-90  top-85 z-10 -translate-x-1/2 -translate-y-2/7 hidden md:block">
            <img src={Hero} alt="hero" className="transform lg:scale-175 scale-275" />
          </div>

          {/* Hero2 image */}
        </div>
      </div>

      <div className="relative lg:min-h-screen h-140 w-full px-6 m-0 text-[#5b3d25]"
        style={{
          backgroundColor: "#442314",
          backgroundImage:
            "radial-gradient(circle, rgba(110, 76, 42, 0.18) 8%, rgba(243, 234, 220, 0) 9%)",
          backgroundSize: "14px 24px",
        }}>
        <div className="absolute left-120 top-50 z-20 -translate-x-1/2 -translate-y-2/7 hidden md:block">
          <img src={Hero2} alt="hero2" className="transform scale-180" />
        </div>
        <div className="absolute top-6 right-8 text-right uppercase tracking-[0.45em] text-[0.7rem] font-semibold text-[#FFEAD5]">
          UNLOCK
          <br />
          STATIONARY
        </div>
        <div className="absolute lg:top-120 lg:right-16 top-120 right-13 flex gap-4 pointer-events-auto">
          <Link to="/product">
            <ButtonLight label="Explore" className="lg:w-md w-md" />
          </Link>
        </div>

        {/* <div className="absolute right-15 font-sans text-lg leading-7 py-2 text-[#FFEAD5] text-right">
            <span className="text-[#FFFFF3] text-3xl">A smarter way</span> to explore products you’ll actually love. <br />
            Every recommendation on GrabDesk <br /> 
            is crafted from taste, trends, <br /> 
            and thoughtful design — giving you <br /> 
            a shopping experience that respects <br /> 
            your time and your style.
          </div> */}
        <div className="absolute lg:top-55 lg:right-15 top-40 text-right max-w-md">
          {/* Title that text wraps around */}
          <div className="editorial-shape">
            <div className="text-5xl font-normal leading-none tracking-tighter ">
              <span className="text-[#FFEAD5]">smarter</span><br />
              <span className="text-[#F0A322] ml-1">way</span><br />
            </div>
          </div>

          {/* Paragraph */}
          <p className="md:text-xl text-lg leading-6 text-[#dab590] text-left tracking-tighter lg:p-0 p-2">
            to explore products you’ll actually love.
            Every recommendation on GrabDesk is crafted from taste, trends,
            and thoughtful design, giving you a shopping experience that respects
            your time and your style.
            Instead of overwhelming you with countless choices, GrabDesk narrows
            the field to what truly matters.
            From tech to lifestyle essentials, every product is hand-picked to enhance
            your workflow and reflect your personal taste.
          </p>
        </div>
      </div>
      <div className="relative lg:h-96 h-120 w-full px-6 py-3 m-0 text-[#FFEAD5] bg-[#4a3020]">
        <div className="font-sans lg:text-3xl text-sm lg:leading-7 leading-4 py-2">
          OUR MISSION IS TO BUILD A SHOPPING <br />
          EXPERIENCE THAT FEELS PERSONAL,<br />
          EFFORTLESS, AND INTUITIVE.
        </div>
        <img
          src={Mission}
          alt="Mission image"
          className="absolute top-25 lg:top-0 right-60 lg:right-140 w-72 h-72 sm:w-88 sm:h-88 mb-4 object-contain"
        />
        <div className="lg:text-xs text-[0.6rem] font-sans font-light">
          GrabDesk is designed to help users <br />
          discover products that match their taste,
          <br />needs, and lifestyle without endless scrolling.
        </div>
        <div className="absolute lg:text-xs text-[0.6rem] font-sans font-light lg:bottom-4 lg:left-6 bottom-4 right-6 text-right lg:text-left">
          At GrabDesk, we believe that shopping should be simple. <br />
          Every product suggestion is thoughtfully curated using user behavior, <br />
          preferences, and real-time trends — turning online <br />
          shopping into a tailored experience for every individual.
        </div>
        <div className="absolute text-right lg:text-3xl text-sm font-sans lg:leading-7 leading-4 lg:bottom-4 lg:right-6 bottom-20 right-6">
          CREATING A PLATFORM THAT CONNECTS USERS <br />
          WITH THE PRODUCTS THEY ACTUALLY <br />
          WANT WHEN THEY WANT THEM.
        </div>
        <div className="absolute lg:text-left text-right lg:top-4 lg:right-46 top-65 right-6  lg:text-xs text-[0.6rem] tracking-tighter font-sans font-normal uppercase">
          Best Emerging E-Commerce<br />
          Brand 2025
        </div>
        <div className="absolute lg:text-left text-right lg:top-4 lg:right-6 top-50 right-6 lg:text-xs text-[0.6rem] tracking-tighter font-sans font-normal">
          ESTABLISHED IN <br />
          2025
        </div>
      </div>

      <div
        className="relative h-350 w-full px-6 py-0 text-[#5b3d25]"
        style={{
          backgroundColor: "#f3eadc",
          backgroundImage:
            "radial-gradient(circle, rgba(110, 76, 42, 0.18) 8%, rgba(243, 234, 220, 0) 9%)",
          backgroundSize: "14px 24px",
        }}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute lg:top-154 lg:right-63 top-130 right-40 max-w-xs font-sans font-normal text-xs lg:text-sm leading-3.5 text-[#694230] tracking-tight">
            Instead of overwhelming <br />
            shoppers with endless <br />
            choices, GD offers <br />
            a curated, thoughtful <br />
            approach to discovery.
          </div>
          <div
            className="absolute boldonse-bold top-45 -right-30 rotate-90 text-[6.5rem] lg:text-[8.5rem] text-[#f4bc62] leading-snug">
            MODERN <br />
            DESIGN
          </div>
          <div className="absolute lg:top-148 lg:left-10 top-180 left-12 font-sans text-5xl lg:text-7xl text-[#442314] leading-14 tracking-tighter">
            the new <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;vintage
          </div>
          <div
            className="absolute boldonse-bold lg:bottom-50 lg:-left-35 bottom-50 -left-31 -rotate-90 text-[6.5rem] lg:text-[8.5rem] text-[#f4bc62] leading-snug">
            CURATED <br />
            BUYING
          </div>
        </div>
      </div>

      
      {/* ========== WHY GRABDESK? ========== */}
        <section className="py-20 bg-[#e8dcc8] px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="boldonse-bold text-3xl md:text-5xl mb-16 text-center text-[#5b3d25]">
              WHY <span className="text-[#f0a224]">GRABDESK?</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="bg-[#f3eadc] p-8 rounded-2xl shadow-md hover:-translate-y-2 transition-transform duration-300 border border-[#d4c5b0]">
                <div className="w-16 h-16 bg-[#5b3d25] rounded-full flex items-center justify-center mb-6 text-[#f0a224]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="32"
                    viewBox="0 -960 960 960"
                    width="32"
                    fill="currentColor"
                  >
                    <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#5b3d25]">
                  Smart Shopping
                </h3>
                <p className="text-[#7f5c3b]">
                  Products curated to match your lifestyle. We filter the noise
                  so you find exactly what you need.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-[#f3eadc] p-8 rounded-2xl shadow-md hover:-translate-y-2 transition-transform duration-300 border border-[#d4c5b0]">
                <div className="w-16 h-16 bg-[#5b3d25] rounded-full flex items-center justify-center mb-6 text-[#f0a224]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="32"
                    viewBox="0 -960 960 960"
                    width="32"
                    fill="currentColor"
                  >
                    <path d="M240-160h360v-80H200v-280h440v240h80v-440h-80v120H200v-120h-80v480h120v80Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#5b3d25]">
                  Fast Checkout
                </h3>
                <p className="text-[#7f5c3b]">
                  Smooth, secure, and effortless buying. Experience a seamless
                  checkout process designed for speed.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-[#f3eadc] p-8 rounded-2xl shadow-md hover:-translate-y-2 transition-transform duration-300 border border-[#d4c5b0]">
                <div className="w-16 h-16 bg-[#5b3d25] rounded-full flex items-center justify-center mb-6 text-[#f0a224]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="32"
                    viewBox="0 -960 960 960"
                    width="32"
                    fill="currentColor"
                  >
                    <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-32q0-34 17.5-62.5T224-306q54-27 109-40.5T480-360q57 0 111 13.5T700-306q31 17 48.5 45.5T766-192v32H160Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#5b3d25]">
                  Personalized Experience
                </h3>
                <p className="text-[#7f5c3b]">
                  Less noise, more relevance. Get recommendations that actually
                  matter to you.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="relative w-full h-96 bg-cover bg-center bg-no-repeat text-[#FFEAD5] pt-16 pl-8"
        style={{ backgroundImage: `url(${Paper})` }}
      >
        <div className="boldonse-bold text-5xl lg:text-7xl leading-normal ">
          THANKS <br />
          FOR WATCHING
        </div>
        <div className="font-sans text-md leading-4 pt-2 text-[#dab590]">
          This project is non-commercial. <br />
          It was made for educational purpose only.
        </div>
      </div>
    </>
  );
}

export default Landing;