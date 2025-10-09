// videoCall.jsx
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "peerjs";

const SOCKET_SERVER_URL = "http://localhost:8080";

export default function VideoCall({ chatSessionId, userId }) {
  console.log(chatSessionId + " " + userId);

  const [peers, setPeers] = useState({});
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  const socketRef = useRef();
  const myVideoRef = useRef();
  const myPeerRef = useRef();
  const peersRef = useRef({});
  const videoGridRef = useRef();
  const myStreamRef = useRef();

  useEffect(() => {
    // Initialize Socket.IO
    socketRef.current = io(SOCKET_SERVER_URL);

    // ✅ Fixed: PeerJS configuration to match server
    myPeerRef.current = new Peer(undefined, {
      host: "localhost",
      port: 8080, // Same port as your server
      path: "/peerjs", // Match the path in server.js
    });

    // Join chat session
    // socketRef.current.emit("join", chatSessionId);

    // // Handle chat messages
    // socketRef.current.on("new_message", (msg) => {
    //   setMessages((prev) => [...prev, msg]);
    // });

    // Get user media
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        myStreamRef.current = stream;

        // Add my video stream
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = stream;
          myVideoRef.current.muted = true;
        }

        // Handle incoming calls
        myPeerRef.current.on("call", (call) => {
          console.log("Receiving call from:", call.peer);
          call.answer(stream);
          const video = document.createElement("video");

          call.on("stream", (userVideoStream) => {
            console.log("Receiving stream from:", call.peer);
            addVideoStream(video, userVideoStream, call.peer);
          });

          call.on("close", () => {
            console.log("Call closed with:", call.peer);
            video.remove();
          });

          peersRef.current[call.peer] = call;
        });

        // ✅ Fixed: Correct event name
        socketRef.current.on("user-connected", (newUserId) => {
          console.log("New user connected:", newUserId);
          connectToNewUser(newUserId, stream);
        });

        // Handle user disconnection
        socketRef.current.on("user-disconnected", (disconnectedUserId) => {
          console.log("User disconnected:", disconnectedUserId);
          if (peersRef.current[disconnectedUserId]) {
            peersRef.current[disconnectedUserId].close();
            delete peersRef.current[disconnectedUserId];
          }
        });
      })
      .catch((err) => {
        console.error("Error accessing media devices:", err);
        alert("Could not access camera/microphone");
      });

    // When peer connection is established
    myPeerRef.current.on("open", (peerId) => {
      console.log("My peer ID:", peerId);
      socketRef.current.emit("join-room", chatSessionId, peerId);
    });

    // ✅ Added: Error handling for PeerJS
    myPeerRef.current.on("error", (err) => {
      console.error("PeerJS error:", err);
    });

    // Cleanup
    return () => {
      if (myStreamRef.current) {
        myStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (myPeerRef.current) {
        myPeerRef.current.destroy();
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      Object.values(peersRef.current).forEach((peer) => {
        if (peer && peer.close) peer.close();
      });
    };
  }, [chatSessionId, userId]);

  const connectToNewUser = (newUserId, stream) => {
    console.log("Calling new user:", newUserId);
    const call = myPeerRef.current.call(newUserId, stream);
    const video = document.createElement("video");

    call.on("stream", (userVideoStream) => {
      console.log("Receiving stream from new user:", newUserId);
      addVideoStream(video, userVideoStream, newUserId);
    });

    call.on("close", () => {
      console.log("Call closed with new user:", newUserId);
      video.remove();
    });

    call.on("error", (err) => {
      console.error("Call error with:", newUserId, err);
    });

    peersRef.current[newUserId] = call;
  };

  const addVideoStream = (video, stream, userId) => {
    video.srcObject = stream;
    video.setAttribute("data-user-id", userId);
    video.style.width = "100%";
    video.style.height = "100%";
    video.style.objectFit = "cover";
    video.style.borderRadius = "8px";
    video.style.backgroundColor = "#000";

    video.addEventListener("loadedmetadata", () => {
      video.play();
    });

    if (videoGridRef.current) {
      videoGridRef.current.appendChild(video);
    }
  };

  const sendMessage = () => {
    if (newMsg.trim()) {
      socketRef.current.emit("send_message", {
        chat_session_id: chatSessionId,
        user_id: userId,
        message: newMsg,
      });
      setNewMsg("");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>
      {/* Video Panel */}
      <div
        style={{
          flex: 3,
          backgroundColor: "#1a1a1a",
          padding: "20px",
          overflow: "auto",
        }}
      >
        <h2 style={{ color: "white", marginBottom: "20px" }}>Video Call</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, 300px)",
            gridAutoRows: "300px",
            gap: "10px",
          }}
        >
          <video
            ref={myVideoRef}
            autoPlay
            muted
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "8px",
              backgroundColor: "#000",
            }}
          />
          <div
            ref={videoGridRef}
            style={{
              display: "contents",
            }}
          />
        </div>
      </div>

      {/* Chat Panel */}
      <div
        style={{
          flex: 1,
          borderLeft: "2px solid #ccc",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f5f5f5",
        }}
      >
        <div
          style={{
            padding: "15px",
            borderBottom: "1px solid #ccc",
            backgroundColor: "white",
          }}
        >
          <h3 style={{ margin: 0 }}>Chat</h3>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "15px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                padding: "10px",
                backgroundColor: msg.user_id === userId ? "#007bff" : "#e9ecef",
                color: msg.user_id === userId ? "white" : "black",
                borderRadius: "8px",
                maxWidth: "70%",
                alignSelf: msg.user_id === userId ? "flex-end" : "flex-start",
                wordWrap: "break-word",
              }}
            >
              <div
                style={{ fontSize: "12px", opacity: 0.8, marginBottom: "4px" }}
              >
                {msg.user_id === userId ? "You" : `User ${msg.user_id}`}
              </div>
              {msg.message}
            </div>
          ))}
        </div>

        <div
          style={{
            padding: "15px",
            borderTop: "1px solid #ccc",
            backgroundColor: "white",
            display: "flex",
            gap: "10px",
          }}
        >
          <input
            type="text"
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
