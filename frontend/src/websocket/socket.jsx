import { toast } from "react-toastify";

const WEBSOCKET_URL = "ws://localhost:8000/ws/leads/";

let socket = null;
let reconnectAttempts = 0;
const maxReconnectAttempts = 10;
const listeners = new Set();
let toastId = null; // Track the notification
const retryTime = 3000 // 3 sec

const connectWebSocket = () => {
  if (socket) {
    socket.close(); // Prevent duplicate connections
  }

  console.log("🔌 Connecting WebSocket...");
  socket = new WebSocket(WEBSOCKET_URL);

  socket.onopen = () => {
    console.log("✅ WebSocket Connected");
    reconnectAttempts = 0; // Reset retry counter

    // Remove persistent error toast if it exists
    if (toastId) {
      toast.update(toastId, { render: "Reconnected!", type: "success", autoClose: 2000 });
      toastId = null;
    }

    // Reattach stored listeners
    listeners.forEach((listener) => {
      socket.addEventListener("message", listener);
    });
  };

  socket.onerror = (error) => {
    console.error("❌ WebSocket Error:", error);
  };

  socket.onclose = (event) => {
    console.warn("⚠️ WebSocket Disconnected:", event.reason);

    // Show a persistent notification if the connection drops
    if (!toastId) {
      toastId = toast.warn("Connection lost! Trying to reconnect...", { autoClose: false });
    }

    if (reconnectAttempts < maxReconnectAttempts) {
      setTimeout(() => {
        reconnectAttempts++;
        connectWebSocket();
      }, retryTime);
    } else {
      // Remove persistent error toast if it exists
      if (toastId) {
        toast.update(toastId, { render: "Unable to reconnect. Please refresh the page.", type: "error", autoClose: false });
        toastId = null;
      }
    }
  };
};

// Function to add event listeners & reattach them after reconnecting
const addMessageListener = (callback) => {
  listeners.add(callback);
  if (socket) {
    socket.addEventListener("message", callback);
  }
};

// Initialize WebSocket on module load
connectWebSocket();

export { socket, connectWebSocket, addMessageListener };
