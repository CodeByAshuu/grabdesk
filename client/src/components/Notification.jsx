import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";
import api from "../api/axios";

function Notification({ onClose, initialMessages = [], onMessageRead }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const scrollContainerRef = useRef(null);
  const [currentGroup, setCurrentGroup] = useState("Today");
  const notificationRef = useRef(null);

  // Sync with props and format messages
  useEffect(() => {
    const formatted = initialMessages.map(msg => ({
      id: msg._id,
      date: new Date(msg.createdAt).toLocaleDateString(),
      // Calculate relative time roughly
      time: getRelativeTime(new Date(msg.createdAt)),
      title: msg.title,
      description: msg.description,
      read: msg.read,
      // Default icon
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 -960 960 960" fill="currentColor">
          <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" />
        </svg>
      )
    })).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by newest

    setNotifications(formatted);
  }, [initialMessages]);

  const getRelativeTime = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  // Grouping logic
  const groupedNotifications = notifications.reduce((groups, notification) => {
    const date = notification.date === new Date().toLocaleDateString() ? "Today" : notification.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(notification);
    return groups;
  }, {});

  const handleInteractionOutside = (event) => {
    if (notificationRef.current &&
      !notificationRef.current.contains(event.target) &&
      onClose) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleInteractionOutside);
    document.addEventListener('touchstart', handleInteractionOutside);
    document.addEventListener('pointerdown', handleInteractionOutside);
    return () => {
      document.removeEventListener('mousedown', handleInteractionOutside);
      document.removeEventListener('touchstart', handleInteractionOutside);
      document.removeEventListener('pointerdown', handleInteractionOutside);
    };
  }, [onClose]);

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && onClose) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleViewAll = () => {
    onClose();
    navigate('/profile#message');
  };

  return (
    <div className="relative">
      <div
        ref={notificationRef}
        className="z-50 w-[380px] max-w-[95vw] bg-[#f3eadc] text-[#5b3d25] 
                   shadow-2xl shadow-[#442314]/20 rounded-2xl overflow-hidden
                   border border-[#ccafa5]/30
                   sm:max-w-[90vw] sm:w-[340px] md:w-[380px]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#ccafa5]/30 gradient-to-r from-[#f3eadc] to-[#e8ddcd]">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold nunito-exbold text-[#442314]">Notifications</h1>
            <span className="text-sm nunito-bold px-3 py-1 bg-[#F0A322]/20 text-[#452215] rounded-full">
              {notifications.filter(n => !n.read).length} new
            </span>
          </div>
        </div>

        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="max-h-[480px] overflow-y-auto scrollbar-hide"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-[#5b3d25]/60">
                <p>No notifications yet</p>
              </div>
            ) : (
              Object.entries(groupedNotifications).map(([date, dateNotifications]) => (
                <div key={date}>
                  <div className="sticky top-0 z-10 px-6 py-2 bg-[#f3eadc]/95 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-px flex-1 bg-[#ccafa5]/30"></div>
                      <span className="text-xs nunito-bold text-[#5b3d25]/70 px-3 py-1 bg-[#e8ddcd] rounded-full">
                        {date}
                      </span>
                      <div className="h-px flex-1 bg-[#ccafa5]/30"></div>
                    </div>
                  </div>

                  {dateNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-6 py-4 border-b border-[#ccafa5]/20 transition-all duration-300 hover:bg-[#e8ddcd]/50 group ${!notification.read ? 'bg-[#f0e6d8]' : ''
                        }`}
                    >
                      <div className="flex gap-4 items-start">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${!notification.read
                            ? 'bg-[#F0A322] text-white'
                            : 'bg-[#d8cdbd] text-[#5b3d25]'
                          }`}>
                          {notification.icon}
                          {!notification.read && (
                            <div className="absolute -top-1 -right-1 w-3 h-3  rounded-full border-2 border-[#f3eadc] animate-pulse"></div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h3 className={`text-base font-semibold nunito-bold truncate ${!notification.read ? 'text-[#442314]' : 'text-[#5b3d25]'
                              }`}>
                              {notification.title}
                            </h3>
                            <span className="text-xs text-[#5b3d25]/60 nunito ml-2 shrink-0">
                              {notification.time}
                            </span>
                          </div>
                          <p className="text-sm text-[#5b3d25]/80 mt-1 line-clamp-2">
                            {notification.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-[#ccafa5]/30 gradient-to-r from-[#f3eadc] to-[#e8ddcd] flex justify-center">
          <button onClick={handleViewAll}>
            <Button labell={"View All Messages"} />
          </button>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default Notification;