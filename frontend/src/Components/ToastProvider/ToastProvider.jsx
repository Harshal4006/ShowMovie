import React from "react";
import { Toaster } from "react-hot-toast";

/**
 * ToastProvider component that encapsulates the Toaster configuration
 * This component provides consistent toast styling across the application
 * All styles are inline to avoid separate CSS file dependency
 */
const ToastProvider = () => {
  const baseToastStyle = {
    background: "linear-gradient(135deg, rgba(18,18,18,0.94), rgba(38,10,10,0.94))",
    color: "#f8fafc",
    borderRadius: "18px",
    padding: "12px 16px",
    fontSize: "14px",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 18px 45px rgba(0,0,0,0.38)",
    backdropFilter: "blur(16px)",
    minWidth: "280px",
    letterSpacing: "0.01em",
  };

  const successToastStyle = {
    ...baseToastStyle,
    background: "linear-gradient(135deg, rgba(24, 10, 10, 0.96), rgba(73, 14, 14, 0.94))",
    border: "1px solid rgba(248,113,113,0.28)",
    boxShadow: "0 18px 45px rgba(127,29,29,0.28)",
  };

  const errorToastStyle = {
    ...baseToastStyle,
    background: "linear-gradient(135deg, rgba(28, 8, 8, 0.98), rgba(92, 14, 14, 0.95))",
    border: "1px solid rgba(239,68,68,0.45)",
    boxShadow: "0 18px 45px rgba(127,29,29,0.34)",
  };

  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 2800,
        style: baseToastStyle,
        success: {
          style: successToastStyle,
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fff5f5",
          },
        },
        error: {
          style: errorToastStyle,
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fff5f5",
          },
        },
      }}
    />
  );
};

export default ToastProvider;