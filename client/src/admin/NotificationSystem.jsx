import React, { useState, useEffect } from "react";
import api from "../api/axios";

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'order', message: 'New order #1005 received', time: '5 min ago', read: false },
    { id: 2, type: 'stock', message: 'Low stock alert: Premium Leather Wallet', time: '1 hour ago', read: false },
    { id: 3, type: 'user', message: 'New user registration: Sarah Johnson', time: '2 hours ago', read: true },
    { id: 4, type: 'system', message: 'System backup completed', time: '1 day ago', read: true },
  ]);

  const [announcementModal, setAnnouncementModal] = useState(false);
  const [announcementText, setAnnouncementText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch notifications from backend on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/admin/notifications');
        if (response.data) {
          setNotifications(response.data);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // --------------------------------------------
  // REAL-TIME: Toggle Read / Unread with backend
  // --------------------------------------------
  const toggleRead = async (id) => {
    const previousNotifications = notifications;

    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read: !n.read } : n
      )
    );

    try {
      await api.patch(`/admin/notifications/${id}/read`);
    } catch (error) {
      console.error('Error toggling read status:', error);
      // Rollback on error
      setNotifications(previousNotifications);
    }
  };

  // --------------------------------------------
  // REAL-TIME: Delete Notification with backend
  // --------------------------------------------
  const deleteNotification = async (id) => {
    const previousNotifications = notifications;

    // Optimistic update
    setNotifications((prev) => prev.filter((n) => n.id !== id));

    try {
      await api.delete(`/admin/notifications/${id}`);
    } catch (error) {
      console.error('Error deleting notification:', error);
      // Rollback on error
      setNotifications(previousNotifications);
      alert('Failed to delete notification');
    }
  };

  // --------------------------------------------
  // REAL-TIME: Create Announcement with backend
  // --------------------------------------------
  const sendAnnouncement = async () => {
    if (!announcementText.trim()) return;

    const tempNotification = {
      id: Date.now(),
      type: "system",
      message: announcementText,
      time: "just now",
      read: false,
    };

    // Optimistic update
    setNotifications([tempNotification, ...notifications]);
    setAnnouncementText("");
    setAnnouncementModal(false);

    try {
      const response = await api.post('/admin/notifications/announcement', {
        message: announcementText
      });

      if (response.data.success && response.data.notification) {
        // Replace temp with real backend data
        setNotifications((prev) =>
          prev.map((n) => (n.id === tempNotification.id ? response.data.notification : n))
        );
      }
    } catch (error) {
      console.error('Error sending announcement:', error);
      // Rollback on error
      setNotifications((prev) => prev.filter((n) => n.id !== tempNotification.id));
      alert('Failed to send announcement. Please try again.');
      setAnnouncementModal(true);
      setAnnouncementText(announcementText);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6 gowun-dodum-regular px-3 sm:px-4 md:px-0">

      {/* HEADER */}
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 sm:gap-4">

        <button
          onClick={() => setAnnouncementModal(true)}
          className="px-3 sm:px-4 py-1.5 sm:py-2  rounded-lg text-sm sm:text-base whitespace-nowrap w-full xs:w-auto bg-[#F0A322] active:translate-y-1  border relative  border-[#452215] shadow-[4px_4px_0_#8F5E41] transition-all  hover:shadow-[6px_6px_0_#8F5E41] text-[#452215]  duration-300  hover:-translate-y-1 cursor-pointer"
        >
          Send Announcement
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3 sm:space-y-4 ">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-3 sm:p-4 border rounded-lg    bg-[#E3D5C3] sm:rounded-xl  relative  border-[#452215] shadow-[4px_4px_0_#8F5E41] transition-all  hover:shadow-[6px_6px_0_#8F5E41] text-[#452215]  duration-300  hover:-translate-y-1 cursor-pointer ${!notification.read ? "border-[#452215] bg-[#E3D5C3]/70" : "border-[#452215]/30"
              }`}
          >
            <div className="flex flex-col xs:flex-row xs:justify-between xs:items-start gap-2 xs:gap-3">

              {/* Left Side */}
              <div className="flex items-start gap-2 sm:gap-3 min-w-0">
                <div
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 mt-1 rounded-full shrink-0 cursor-pointer ${!notification.read ? "bg-[#5b3d25]" : "bg-[#5b3d25]/30"
                    }`}
                  onClick={() => toggleRead(notification.id)}
                ></div>

                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm sm:text-base truncate gowun-dodum-regular">
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
                  className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs rounded whitespace-nowrap ${notification.type === "order"
                      ? "bg-blue-100 text-[#5B6E8C]"
                      : notification.type === "stock"
                        ? "bg-[#F7EFE6] text-[#D18B1F]"
                        : notification.type === "user"
                          ? "bg-green-100 text-[#3E7C59]"
                          : "bg-gray-100 text-[#9E3A2E]"
                    }`}
                >
                  {notification.type}
                </span>

                {/* Delete Button */}
                <button
                  className="text-[#452215] hover:text-[#452215]/70 text-sm"
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
      <div className="mt-6 sm:mt-8 p-4 sm:p-5 bg-[#E3D5C3] text-[#452215] border border-[#5b3d25]/20 rounded-lg sm:rounded-xl">
        <h3 className="font-semibold mb-4 nunito-exbold text-sm sm:text-base md:text-lg">
          Email/SMS Integration
        </h3>

        <div className="space-y-4">

          <div className="flex flex-col xs:flex-row xs:items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm sm:text-base gowun-dodum-regular">Email Notifications</p>
              <p className="text-xs sm:text-sm text-[#5b3d25]/70 truncate ">
                Configure email templates
              </p>
            </div>
            <button className="px-4 py-2 rounded-lg  text-xs sm:text-sm w-full xs:w-auto bg-[#F0A322] active:translate-y-1  border relative  border-[#452215] shadow-[4px_4px_0_#8F5E41] transition-all  hover:shadow-[6px_6px_0_#8F5E41] text-[#452215]  duration-300  hover:-translate-y-1 cursor-pointer">
              Configure
            </button>
          </div>

          <div className="flex flex-col xs:flex-row xs:items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm sm:text-base gowun-dodum-regular">SMS Notifications</p>
              <p className="text-xs sm:text-sm text-[#5b3d25]/70 truncate">
                Set up SMS alerts
              </p>
            </div>
            <button className="px-4 py-2 rounded-lg  text-xs sm:text-sm w-full xs:w-auto bg-[#F0A322] active:translate-y-1  border relative  border-[#452215] shadow-[4px_4px_0_#8F5E41] transition-all  hover:shadow-[6px_6px_0_#8F5E41] text-[#452215]  duration-300  hover:-translate-y-1 cursor-pointer">
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
