import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

import Button from "./Button";

function Notification({ message, onClose }) { // ADDED onClose prop

  const [notifications] = useState([
    {
      id: 1,
      date: "Today",
      time: "1h ago",
      title: "Drone Survey Results",
      description: "Your drone survey results are in, and we are uploading them to your dashboard",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 -960 960 960" fill="currentColor">
          <path d="M480-80q-83 0-156-31.5T196-196q-54-54-85-127T80-480q0-83 31.5-156T196-764q54-54 127-85t157-31q83 0 156 31t127 85q54 54 85 127t31 157q0 83-31 156t-85 127q-54 54-127 85T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93T160-480q0 134 93 227t227 93Zm0-120q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm0-120q17 0 28.5-11.5T520-440v-200q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640v200q0 17 11.5 28.5T480-520Z"/>
        </svg>
      ),
      read: false
    },
    {
      id: 2,
      date: "Today",
      time: "2h ago",
      title: "New Team Member on Foresight",
      description: "Rengoku Kyojorou has successfully joined your Foresight Team",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 -960 960 960" fill="currentColor">
          <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/>
        </svg>
      ),
      read: false
    },
    {
      id: 3,
      date: "Today",
      time: "4h ago",
      title: "New Farm Added Successfully",
      description: "Your new farm has been added successfully",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 -960 960 960" fill="currentColor">
          <path d="M200-120v-480l360-240 360 240v480H600v-280H360v280H200Zm80-80h80v-280h320v280h80v-334L480-734 280-534v334Zm120-80h160v-200H400v200Zm40-100v-60h80v60h-80Zm-200-90v-60h80v60h-80Zm560 0v-60h80v60h-80ZM480-590Z"/>
        </svg>
      ),
      read: false
    },
    {
      id: 4,
      date: "Today",
      time: "5h ago",
      title: "Weather Alert Update",
      description: "Rain forecasted for tomorrow in your region",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 -960 960 960" fill="currentColor">
          <path d="m400-320-80-80q-17-17-8-38.5t36-20.5h52v-220q0-25 17.5-42.5T480-720q25 0 42.5 17.5T540-660v220h52q29 0 36 20.5t-8 38.5l-80 80q-17 17-42 17t-42-17Zm80-320q-8 0-14 6t-6 14q0 8 6 14t14 6q8 0 14-6t6-14q0-8-6-14t-14-6Zm0-80q25 0 42.5-17.5T540-780q0-25-17.5-42.5T480-840q-25 0-42.5 17.5T420-780q0 25 17.5 42.5T480-720Z"/>
        </svg>
      ),
      read: true
    },
    {
      id: 5,
      date: "Yesterday",
      time: "Yesterday",
      title: "Drone Survey Request Sent",
      description: "Your drone survey request has been sent and is under review by our operations team",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 -960 960 960" fill="currentColor">
          <path d="M240-160q-50 0-85-35t-35-85v-120h120v-560l60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60v680q0 50-35 85t-85 35H240Zm480-80q17 0 28.5-11.5T760-280v-560H320v440h360v120q0 17 11.5 28.5T720-240ZM360-600v-80h240v80H360Zm0 120v-80h240v80H360Zm320-120q-17 0-28.5-11.5T640-620q0-17 11.5-28.5T680-660q17 0 28.5 11.5T720-620q0 17-11.5 28.5T680-580Zm0 120q-17 0-28.5-11.5T640-500q0-17 11.5-28.5T680-540q17 0 28.5 11.5T720-500q0 17-11.5 28.5T680-460ZM240-240h360v-80H240v40q0 17 11.5 28.5T280-240h-40Zm-40 0v-40 40Z"/>
        </svg>
      ),
      read: true
    },
    {
      id: 6,
      date: "Yesterday",
      time: "Yesterday",
      title: "Soil Analysis Completed",
      description: "Soil nutrient analysis for Farm 3B is now available",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 -960 960 960" fill="currentColor">
          <path d="M480-80 240-320l56-56 184 184 184-184 56 56L480-80Zm0-200L240-520l56-56 184 184 184-184 56 56L480-280Zm0-200L240-720l56-56 184 184 184-184 56 56L480-480Z"/>
        </svg>
      ),
      read: true
    },
    {
      id: 7,
      date: "Dec 2, 2025",
      time: "Dec 2",
      title: "Equipment Maintenance Due",
      description: "Scheduled maintenance for your irrigation system is due next week",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 -960 960 960" fill="currentColor">
          <path d="M320-680v-80h320v80H320Zm0 400v-80h320v80H320Zm0-200v-80h320v80H320Z"/>
        </svg>
      ),
      read: true
    },
    {
      id: 8,
      date: "Dec 1, 2025",
      time: "Dec 1",
      title: "Crop Health Report",
      description: "Monthly crop health assessment report generated",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 -960 960 960" fill="currentColor">
          <path d="M280-280h400v-80H280v80Zm0-120h400v-80H280v80ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-480H160v480Zm0 0v-480 480Z"/>
        </svg>
      ),
      read: true
    }
  ]);

  const [visibleCount, setVisibleCount] = useState(4);
  const scrollContainerRef = useRef(null);
  const [currentGroup, setCurrentGroup] = useState("Today");
  const notificationRef = useRef(null); // ADDED for click-outside detection

 
  const groupedNotifications = notifications.reduce((groups, notification) => {
    const date = notification.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(notification);
    return groups;
  }, {});

  
  const visibleNotifications = Object.keys(groupedNotifications).flatMap(date => 
    groupedNotifications[date].slice(0, date === currentGroup ? 4 : 0)
  ).slice(0, visibleCount);

  const handleViewMore = () => {
    
    window.location.href = "/messages";
  };

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 120; 
      const newScrollTop = scrollContainerRef.current.scrollTop + 
                          (direction === 'up' ? -scrollAmount : scrollAmount);
      
      scrollContainerRef.current.scrollTo({
        top: newScrollTop,
        behavior: 'smooth'
      });
    }
  };

 
  useEffect(() => {
    if (visibleCount < notifications.length) {
      const interval = setInterval(() => {
        if (scrollContainerRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
          
          if (scrollTop + clientHeight >= scrollHeight - 10) {
            
            scrollContainerRef.current.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          } else {
            
            scrollContainerRef.current.scrollBy({
              top: 120,
              behavior: 'smooth'
            });
          }
        }
      }, 8000);

      return () => clearInterval(interval);
    }
  }, [visibleCount, notifications.length]);

  
  useEffect(() => {
    const handleInteractionOutside = (event) => {
      if (notificationRef.current && 
          !notificationRef.current.contains(event.target) &&
          onClose) {
        onClose();
      }
    };


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
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);


  useEffect(() => {

    document.body.style.overflow = 'hidden';
    
    return () => {
      // Restore body scroll when notification closes
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="relative">
      {/* Main Notification Card - ADDED responsive classes and ref */}
      <div 
        ref={notificationRef}
        className="z-50 w-[380px] max-w-[95vw] bg-[#f3eadc] text-[#5b3d25] 
                   shadow-2xl shadow-[#442314]/20 rounded-2xl overflow-hidden
                   border border-[#ccafa5]/30
                   /* RESPONSIVE ADJUSTMENT ADDED */
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
            {/* Notifications grouped by date */}
            {Object.entries(groupedNotifications).map(([date, dateNotifications]) => (
              <div key={date}>
                {/* Date Header */}
                <div className="sticky top-0 z-10 px-6 py-2 bg-[#f3eadc]/95 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-[#ccafa5]/30"></div>
                    <span className="text-xs nunito-bold text-[#5b3d25]/70 px-3 py-1 bg-[#e8ddcd] rounded-full">
                      {date}
                    </span>
                    <div className="h-px flex-1 bg-[#ccafa5]/30"></div>
                  </div>
                </div>
                
                {/* Notifications for this date */}
                {dateNotifications.map((notification, index) => (
                  <div 
                    key={notification.id}
                    className={`px-6 py-4 border-b border-[#ccafa5]/20 transition-all duration-300 hover:bg-[#e8ddcd]/50 group ${
                      !notification.read ? 'bg-[#f0e6d8]' : ''
                    }`}
                  >
                    <div className="flex gap-4 items-start">
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        !notification.read 
                          ? 'bg-[#F0A322] text-white' 
                          : 'bg-[#d8cdbd] text-[#5b3d25]'
                      }`}>
                        {notification.icon}
                        {!notification.read && (
                          <div className="absolute -top-1 -right-1 w-3 h-3  rounded-full border-2 border-[#f3eadc] animate-pulse"></div>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className={`text-base font-semibold nunito-bold truncate ${
                            !notification.read ? 'text-[#442314]' : 'text-[#5b3d25]'
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
                    
                    {/* Hover Actions */}
                    <div className="flex justify-end mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button className="px-4 py-1.5 text-sm nunito-bold bg-[#F0A322] text-white rounded-lg hover:bg-[#e0931c] transition-colors border border-[#452215]/20">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

        </div>


        <div className="px-6 py-4 border-t border-[#ccafa5]/30 gradient-to-r from-[#f3eadc] to-[#e8ddcd]">
         <Link to='/profile#message'>
         <Button labell={"View All Messages"}/>
         </Link>
          <p className="text-xs text-center text-[#5b3d25]/60 mt-2 nunito">
            Showing {visibleCount} of {notifications.length} notifications
          </p>
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
        
        /* Mobile optimizations - ENHANCED for better small-screen display */
        @media (max-width: 640px) {
          .notification-card {
            width: calc(100vw - 2rem);
            margin: 0 1rem;
          }
        }
      `}</style>
    </div>
  );
}


function NotificationDark({ onClose }) {
  const [notifications] = useState([
   
    {
      id: 1,
      date: "Today",
      time: "1h ago",
      title: "Drone Survey Results",
      description: "Your drone survey results are in, and we are uploading them to your dashboard",
      read: false
    },
  
  ]);

  const notificationRef = useRef(null);


  useEffect(() => {
    const handleInteractionOutside = (event) => {
      if (notificationRef.current && 
          !notificationRef.current.contains(event.target) &&
          onClose) {
        onClose();
      }
    };

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
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="relative">
      <div 
        ref={notificationRef}
        className="z-50 w-[380px] max-w-[95vw] bg-[#2a1a0f] text-[#e8ddcd] 
                   shadow-2xl shadow-black/30 rounded-2xl overflow-hidden
                   border border-[#5b3d25]/30
                   /* RESPONSIVE ADJUSTMENT ADDED */
                   sm:max-w-[90vw] sm:w-[340px] md:w-[380px]"
      >
        
        <div className="px-6 py-4 border-b border-[#5b3d25]/30 gradient-to-r from-[#2a1a0f] to-[#352413]">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold nunito-exbold text-[#f0a224]">Notifications</h1>
            <span className="text-sm nunito-bold px-3 py-1 bg-[#F0A322]/20 text-[#f0a224] rounded-full">
              {notifications.filter(n => !n.read).length} new
            </span>
          </div>
         
        </div>
      </div>
    </div>
  );
}

export default Notification;