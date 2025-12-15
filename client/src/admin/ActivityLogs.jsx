import React, { useEffect, useRef, useState } from "react";

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
    // --- WebSocket Connection (Replace URL with your backend WebSocket URL) ---
    try {
      wsRef.current = new WebSocket("ws://localhost:5000/activity");

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          // Expected format:
          // { message: "Product added", type: "product", time: "12:30 PM" }

          if (data.message) {
            setLogs((prev) => [...prev, data]);
          }
        } catch (err) {
          console.warn("Invalid WS Activity Log Format:", event.data);
        }
      };

      wsRef.current.onerror = () => {
        console.warn("WebSocket failed — falling back to dummy updates.");
      };
    } catch (err) {
      console.warn("WebSocket not available:", err);
    }

    // OPTIONAL: Polling fallback (only if needed)
    const fallback = setInterval(() => {
      setLogs((prev) => [
        ...prev,
        {
          message: "Background sync check",
          type: "system",
          time: new Date().toLocaleTimeString(),
        },
      ]);
    }, 15000);

    return () => {
      clearInterval(fallback);
      if (wsRef.current) wsRef.current.close();
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
