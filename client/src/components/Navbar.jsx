import React, { useState, useEffect } from "react";


function Navbar() {
  const [profileImage, setProfileImage] = useState(null);
  // const [userName, setUserName] = useState("Harshit");
  // const [unreadCount, setUnreadCount] = useState(3);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const storedImage = localStorage.getItem("profileImage");
    if (storedImage) setProfileImage(storedImage);
  }, []);

  return (
    <>
      <nav className="w-full bg-[#F3EADC] nunito-bold p-5 flex flex-col md:flex-row md:justify-between md:items-center shadow-lg ">
        {/* Logo and Mobile Icons Container */}
        <div className="flex justify-between items-center w-full md:w-auto">
          {/* Logo */}
          <h1 className="boldonse-bold text-2xl md:text-3xl text-[#442314] cursor-default">
            GRAB<span className="text-[#e09b4b]">DESK</span>
          </h1>

          {/* Mobile Icons (visible only on small screens) */}
          <div className="flex items-center gap-4 md:hidden">
            {/* Notification Icon */}
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="28px"
                viewBox="0 -960 960 960"
                width="28px"
                fill="#442314"
              >
                <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" />
              </svg>

              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>

            {/* Bag Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="28px"
              viewBox="0 -960 960 960"
              width="28px"
              fill="#442314"
            >
              <path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z" />
            </svg>

            {/* Profile Avatar */}
            <div className="w-10 h-10 rounded-full overflow-hidden bg-white flex items-center justify-center border border-[#442314]">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="User profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg font-semibold text-black">
                  {userName ? userName.charAt(0).toUpperCase() : "U"}
                </span>
              )}
            </div>

            {/* Hamburger Menu Button */}
            <button
              className="flex flex-col space-y-1 focus:outline-none text-[#442314]"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <div
                className={`w-6 h-0.5 bg-[#442314] transition-all ${
                  menuOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
              />
              <div
                className={`w-6 h-0.5 bg-[#442314] transition-all ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <div
                className={`w-6 h-0.5 bg-[#442314] transition-all ${
                  menuOpen ? "-rotate-45 -translate-y-1.5" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Navigation Links + Icons (for desktop and mobile menu) */}
        <div
          className={`flex-col md:flex-row md:flex items-center gap-8 mt-4 md:mt-0 ${
            menuOpen ? "flex" : "hidden md:flex"
          }`}
        >
          {/* Nav Links */}
          <div className="flex flex-col md:flex-row items-center gap-6 text-[#442314] tracking-widest sm:text-left">
            {["HOME", "PRODUCT", "STUDIO", "CONTACT"].map((item) => (
              <a
                key={item}
                className="relative text-lg cursor-pointer group"
              >
                {item}
                <span className="absolute left-1/2 -bottom-1 w-0 h-0.5 bg-[#442314] transition-all duration-300 ease-in-out group-hover:w-full group-hover:left-0"></span>
              </a>
            ))}
          </div>

          {/* Desktop Icons (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-6">
            {/* Notification Icon */}
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="28px"
                viewBox="0 -960 960 960"
                width="28px"
                fill="#442314"
              >
                <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" />
              </svg>

              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>

            {/* Bag Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="28px"
              viewBox="0 -960 960 960"
              width="28px"
              fill="#442314"
            >
              <path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z" />
            </svg>

            {/* Profile Avatar */}
            <div className="w-14 h-14 rounded-full overflow-hidden bg-white flex items-center justify-center border border-[#442314]">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="User profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl font-semibold text-black">
                  {userName ? userName.charAt(0).toUpperCase() : "U"}
                </span>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;