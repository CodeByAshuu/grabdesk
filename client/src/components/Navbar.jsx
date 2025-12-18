import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Notification from "./Notification";
import api from "../api/axios";
import { getInitials } from "../utils/stringUtils";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Fetch User Data
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await api.get('/users/me');
      setUser(response.data);

      const unread = (response.data.messages || []).filter(m => !m.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Error fetching user data for navbar:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Poll for updates (optional, or rely on page refreshes/actions)
  useEffect(() => {
    const interval = setInterval(fetchUserData, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = () => {
    setNotificationOpen(!notificationOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <>
      <nav className="w-full nunito-bold px-6 py-2 flex flex-col md:flex-row md:justify-between md:items-center bg-[#442314]/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-[#ccafa5]/20 transition-all duration-300">
        {/* Logo and Mobile Icons Container */}
        <div className="flex justify-between items-center w-full md:w-auto">
          {/* Logo */}
          <Link to="/home">
            <h1 className="boldonse-bold text-2xl md:text-3xl text-[#b8a180] cursor-pointer">
              GRAB<span className="text-[#f0a224]">DESK</span>
            </h1>
          </Link>

          {/* Mobile Icons (visible only on small screens) */}
          <div className="flex items-center gap-4 md:hidden">
            {/* Notification Icon */}
            <div className="relative cursor-pointer" onClick={handleNotificationClick}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="28px"
                viewBox="0 -960 960 960"
                width="28px"
                fill="#b8a180"
              >
                <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" />
              </svg>

              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>

            {/* Wishlist Icon */}
            <Link to="/wishlist">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="28px"
                width="28px"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#b8a180"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </Link>

            {/* Bag Icon */}
            <Link to="/cart">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="28px"
                viewBox="0 -960 960 960"
                width="28px"
                fill="#b8a180"
              >
                <path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z" />
              </svg>
            </Link>

            {/* Profile Avatar */}
            <Link to={user ? "/profile" : "/login"}>
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white flex items-center justify-center border border-[#442314]" >
                {user && user.profilePhotoUrl ? (
                  <img
                    src={user.profilePhotoUrl}
                    alt="User profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-semibold text-black">
                    {user && user.name ? getInitials(user.name) : "U"}
                  </span>
                )}
              </div>
            </Link>

            {/* Hamburger Menu Button */}
            <button
              className="flex flex-col space-y-1 focus:outline-none text-[#b8a180]"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <div
                className={`w-6 h-0.5 bg-[#b8a180] transition-all ${menuOpen ? "rotate-45 translate-y-1.5" : ""
                  }`}
              />
              <div
                className={`w-6 h-0.5 bg-[#b8a180] transition-all ${menuOpen ? "opacity-0" : ""
                  }`}
              />
              <div
                className={`w-6 h-0.5 bg-[#b8a180] transition-all ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""
                  }`}
              />
            </button>
          </div>
        </div>

        {/* Navigation Links + Icons (for desktop and mobile menu) */}
        <div
          className={`flex-col md:flex-row md:flex items-center gap-8 mt-4 md:mt-0 ${menuOpen ? "flex" : "hidden md:flex"
            }`}
        >
          {/* Nav Links */}
          <div className="flex flex-col md:flex-row items-center gap-6 text-[#b8a180] tracking-widest sm:text-left">
            {[
              { name: "HOME", path: "/home" },
              { name: "PRODUCT", path: "/product" },
              { name: "STUDIO", path: "/studio" },
              { name: "CONTACT", path: "/contact" },
            ].map((item) => (
              <Link
                to={item.path}
                key={item.name}
                className="relative text-lg cursor-pointer group"
              >
                {item.name}
                <span className="absolute left-1/2 -bottom-1 w-0 h-0.5 bg-[#fbdec0] transition-all duration-300 ease-in-out group-hover:w-full group-hover:left-0"></span>
              </Link>
            ))}
            {!user && (
              <Link
                to="/login"
                className="relative text-lg cursor-pointer group md:hidden"
              >
                LOGIN
              </Link>
            )}
            {user && (
              <button
                onClick={handleLogout}
                className="relative text-lg cursor-pointer group md:hidden text-[#b8a180]"
              >
                LOGOUT
              </button>
            )}
          </div>


          {/* Desktop Icons (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-6">
            {/* Notification Icon */}
            <div className="relative cursor-pointer" onClick={handleNotificationClick}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="28px"
                viewBox="0 -960 960 960"
                width="28px"
                fill="#b8a180"
              >
                <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" />
              </svg>

              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>

            {/* Wishlist Icon */}
            <Link to="/wishlist">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="28px"
                width="28px"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#b8a180"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </Link>

            {/* Bag Icon */}
            <Link to='/cart'>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="28px"
                viewBox="0 -960 960 960"
                width="28px"
                fill="#b8a180"
              >
                <path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z" />
              </svg>
            </Link>

            {/* Profile Avatar */}
            <Link to={user ? "/profile" : "/login"}>
              <div className="w-14 h-14 rounded-full overflow-hidden bg-white flex items-center justify-center border border-[#b8a180]">
                {user && user.profilePhotoUrl ? (
                  <img
                    src={user.profilePhotoUrl}
                    alt="User profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-semibold text-black">
                    {user && user.name ? getInitials(user.name) : <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 -960 960 960" fill="currentColor"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z" /></svg>}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </div>
      </nav>

      {/* Notification Component */}
      {notificationOpen && (
        <div className="fixed top-20 right-6 z-50">
          <Notification
            onClose={() => setNotificationOpen(false)}
            initialMessages={user?.messages || []}
            onMessageRead={fetchUserData}
          />
        </div>
      )}
    </>
  );
}

export default Navbar;