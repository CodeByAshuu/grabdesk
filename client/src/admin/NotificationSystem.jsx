import React, { useState } from "react";

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'order', message: 'New order #1005 received', time: '5 min ago', read: false },
    { id: 2, type: 'stock', message: 'Low stock alert: Premium Leather Wallet', time: '1 hour ago', read: false },
    { id: 3, type: 'user', message: 'New user registration: Sarah Johnson', time: '2 hours ago', read: true },
    { id: 4, type: 'system', message: 'System backup completed', time: '1 day ago', read: true },
  ]);

  const [announcementModal, setAnnouncementModal] = useState(false);
  const [announcementText, setAnnouncementText] = useState("");

  // --------------------------------------------
  // REAL-TIME: Toggle Read / Unread
  // --------------------------------------------
  const toggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read: !n.read } : n
      )
    );
  };

  // --------------------------------------------
  // REAL-TIME: Delete Notification
  // --------------------------------------------
  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // --------------------------------------------
  // REAL-TIME: Create Announcement
  // --------------------------------------------
  const sendAnnouncement = () => {
    if (!announcementText.trim()) return;

    const newNotification = {
      id: Date.now(),
      type: "system",
      message: announcementText,
      time: "just now",
      read: false,
    };

    setNotifications([newNotification, ...notifications]);
    setAnnouncementText("");
    setAnnouncementModal(false);
  };

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6 gowun-dodum-regular px-3 sm:px-4 md:px-0">

      {/* HEADER */}
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 sm:gap-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-[#5b3d25] nunito-exbold">
          Notification Center
        </h2>

        <button
          onClick={() => setAnnouncementModal(true)}
          className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#5b3d25] text-white rounded-lg hover:bg-[#4a3120] transition-colors text-sm sm:text-base whitespace-nowrap w-full xs:w-auto"
        >
          Send Announcement
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3 sm:space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-3 sm:p-4 border rounded-lg sm:rounded-xl transition-all duration-150 hover:shadow-sm ${
              !notification.read ? "border-[#5b3d25] bg-[#5b3d25]/5" : "border-[#5b3d25]/30"
            }`}
          >
            <div className="flex flex-col xs:flex-row xs:justify-between xs:items-start gap-2 xs:gap-3">

              {/* Left Side */}
              <div className="flex items-start gap-2 sm:gap-3 min-w-0">
                <div
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 mt-1 rounded-full shrink-0 cursor-pointer ${
                    !notification.read ? "bg-[#5b3d25]" : "bg-[#5b3d25]/30"
                  }`}
                  onClick={() => toggleRead(notification.id)}
                ></div>

                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm sm:text-base truncate">
                    {notification.message}
                  </p>
                  <p className="text-xs sm:text-sm text-[#5b3d25]/70 mt-1">
                    {notification.time}
                  </p>
                </div>
              </div>

              {/* Right Section: Badge + Delete Button */}
              <div className="flex items-center gap-2">
                <span
                  className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs rounded whitespace-nowrap ${
                    notification.type === "order"
                      ? "bg-blue-100 text-blue-800"
                      : notification.type === "stock"
                      ? "bg-red-100 text-red-800"
                      : notification.type === "user"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {notification.type}
                </span>

                {/* Delete Button */}
                <button
                  className="text-red-600 hover:text-red-800 text-sm"
                  onClick={() => deleteNotification(notification.id)}
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Email/SMS Integration (Unchanged UI) */}
      <div className="mt-6 sm:mt-8 p-4 sm:p-5 bg-white border border-[#5b3d25]/20 rounded-lg sm:rounded-xl">
        <h3 className="font-semibold mb-4 nunito-exbold text-sm sm:text-base md:text-lg">
          Email/SMS Integration
        </h3>

        <div className="space-y-4">

          <div className="flex flex-col xs:flex-row xs:items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm sm:text-base">Email Notifications</p>
              <p className="text-xs sm:text-sm text-[#5b3d25]/70 truncate">
                Configure email templates
              </p>
            </div>
            <button className="px-4 py-2 border border-[#5b3d25] text-[#5b3d25] rounded-lg hover:bg-[#5b3d25]/10 text-xs sm:text-sm w-full xs:w-auto">
              Configure
            </button>
          </div>

          <div className="flex flex-col xs:flex-row xs:items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm sm:text-base">SMS Notifications</p>
              <p className="text-xs sm:text-sm text-[#5b3d25]/70 truncate">
                Set up SMS alerts
              </p>
            </div>
            <button className="px-4 py-2 border border-[#5b3d25] text-[#5b3d25] rounded-lg hover:bg-[#5b3d25]/10 text-xs sm:text-sm w-full xs:w-auto">
              Set Up
            </button>
          </div>

        </div>
      </div>

      {/* -------------------------------------------- */}
      {/* Announcement Modal */}
      {/* -------------------------------------------- */}
      {announcementModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={() => setAnnouncementModal(false)}
        >
          <div
            className="bg-white w-full max-w-sm rounded-xl p-5 shadow-xl animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-[#5b3d25] mb-3">
              Send Announcement
            </h3>

            <textarea
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              className="w-full border border-[#5b3d25]/40 rounded-lg p-3 h-28 resize-none"
              placeholder="Write announcement..."
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setAnnouncementModal(false)}
                className="px-4 py-2 border border-[#5b3d25] rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={sendAnnouncement}
                className="px-4 py-2 bg-[#5b3d25] text-white rounded-lg hover:bg-[#4a3120]"
              >
                Send
              </button>
            </div>
          </div>

          <style>{`
            @keyframes scaleIn {
              0% { transform: scale(0.85); opacity: 0; }
              100% { transform: scale(1); opacity: 1; }
            }
            .animate-scaleIn {
              animation: scaleIn 0.25s ease-out;
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
