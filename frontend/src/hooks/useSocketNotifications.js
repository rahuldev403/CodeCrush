import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { createSocket } from "@/lib/socket";

export const useSocketNotifications = () => {
  const socketRef = useRef(null);

  useEffect(() => {
    // Create socket connection
    const socket = createSocket();
    socketRef.current = socket;

    // New connection request
    socket.on("new-connection-request", (data) => {
      const senderName = data.sender?.name || "Someone";
      toast.info("New connection request 📬", {
        description: `${senderName} wants to connect with you`,
        duration: 5000,
      });
    });

    // Connection accepted
    socket.on("connection-accepted", (data) => {
      const receiverName = data.receiver?.name || "Someone";
      toast.success("Connection accepted! 🎉", {
        description: `${receiverName} accepted your request`,
        duration: 5000,
      });
    });

    // Connection rejected
    socket.on("connection-rejected", () => {
      toast.info("Connection declined", {
        description: "Your request was declined",
        duration: 3000,
      });
    });

    // Compatibility score ready
    socket.on("compatibility-ready", (data) => {
      toast.success("Match score ready! ✨", {
        description: `Compatibility: ${data.compatibilityScore?.overallScore || data.compatibilityScore || "N/A"}%`,
        duration: 4000,
      });
    });

    // Compatibility error
    socket.on("compatibility-error", (data) => {
      toast.error("Match score unavailable", {
        description: "Could not calculate compatibility score",
        duration: 3000,
      });
    });

    // New message received (global notification, not for current chat)
    socket.on("receive-message", (message) => {
      // Only show notification if not the sender
      const currentPath = window.location.pathname;
      const isInChat = currentPath.includes("/chat/");

      if (message.senderId?._id !== socket.userId && !isInChat) {
        const senderName = message.senderId?.name || "Someone";
        toast.success("New message 💬", {
          description: `${senderName}: ${message.content.slice(0, 50)}${message.content.length > 50 ? "..." : ""}`,
          duration: 4000,
        });
      }
    });

    // Message deleted
    socket.on("message-deleted", () => {
      toast.info("Message deleted", {
        description: "A message was removed",
        duration: 2000,
      });
    });

    // Cleanup on unmount
    return () => {
      socket.off("new-connection-request");
      socket.off("connection-accepted");
      socket.off("connection-rejected");
      socket.off("compatibility-ready");
      socket.off("compatibility-error");
      socket.off("receive-message");
      socket.off("message-deleted");
      socket.disconnect();
    };
  }, []);

  return socketRef;
};
