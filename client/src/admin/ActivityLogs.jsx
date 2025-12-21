import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import api from "../api/axios"; // Import authenticated API instance


const ActivityLogs = () => {
  const [logs, setLogs] = useState([
    // Dummy logs — visible until backend sends real data
    { message: "System initialized", type: "system", time: new Date().toLocaleTimeString() },
    { message: "Admin logged in", type: "auth", time: new Date().toLocaleTimeString() },
  ]);

  const wsRef = useRef(null);
  const logsEndRef = useRef(null);

  // Auto-scroll to bottom smoothly
  const scrollToBottom = () => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(scrollToBottom, [logs]); // scroll only when logs change

  useEffect(() => {
    // --- Fetch Initial Logs from Backend ---
    const fetchInitialLogs = async () => {
      try {
        const response = await api.get('/admin/activity-logs');
        if (response.data) {
          const backendLogs = response.data;
          // Append backend logs after dummy logs
          setLogs((prev) => [...prev, ...backendLogs]);
        }
      } catch (err) {
        console.warn('Failed to fetch initial activity logs:', err);
      }
    };


    fetchInitialLogs();

    // --- Socket.IO Connection (replaces native WebSocket) ---
    let socket = null;
    try {
      socket = io('http://localhost:5000/activity', {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });

      wsRef.current = socket;

      socket.on('connect', () => {
        console.log('Connected to activity logs via Socket.IO');
      });

      socket.on('newLog', (data) => {
        // Expected format: { message, type, time }
        if (data.message) {
          setLogs((prev) => [...prev, data]);
        }
      });

      socket.on('connect_error', (err) => {
        console.warn('Socket.IO connection error:', err.message);
      });

      socket.on('disconnect', () => {
        console.warn('Disconnected from Socket.IO — polling fallback active');
      });
    } catch (err) {
      console.warn('Socket.IO not available:', err);
    }

    // --- Polling Fallback (enhanced with real backend endpoint) ---
    const fallback = setInterval(async () => {
      try {
        const response = await api.get('/admin/activity-logs/latest');
        if (response.data) {
          const latestLogs = response.data;
          if (latestLogs.length > 0) {
            setLogs((prev) => [...prev, ...latestLogs]);
          }
        }
      } catch (err) {
        // Silent fail - fallback should not spam console
      }
    }, 15000);


    return () => {
      clearInterval(fallback);
      if (socket) socket.disconnect();
    };
  }, []);

  return (
    <div className="space-y-6 gowun-dodum-regular">
      <div className="bg-[#E3D5C3] border relative  border-[#452215] shadow-[4px_4px_0_#8F5E41] transition-all  hover:shadow-[6px_6px_0_#8F5E41] duration-300  hover:-translate-y-1 rounded-xl p-6">

        {/* Scrollable container (height NOT changed) */}
        <div className="max-h-64 overflow-y-auto pr-2 scrollbar-hide">
          {logs.map((log, index) => (
            <div key={index} className="mb-3">
              <p className="text-[#5b3d25] text-sm">
                <span className="font-semibold">{log.time} — </span>
                {log.message}
              </p>
            </div>
          ))}

          {/* Invisible element used for auto-scroll */}
          <div ref={logsEndRef}></div>
        </div>

      </div>
    </div>
  );
};

export default ActivityLogs;
