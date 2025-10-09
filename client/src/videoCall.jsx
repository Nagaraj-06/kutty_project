import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";

const SOCKET_SERVER_URL = "http://localhost:8080"; // change if needed

export default function VideoCall({ chatSessionId, userId }) {
  const [peers, setPeers] = useState({});
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  const socketRef = useRef();
  const myVideoRef = useRef();
  const peersRef = useRef({});

  const videoGridRef = useRef();

  useEffect(() => {
    // connect socket
    socketRef.current = io(SOCKET_SERVER_URL);

    // join chat_session room
    socketRef.current.emit("join", { chatSessionId });

    socketRef.current.on("new_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        myVideoRef.current.srcObject = stream;
        myVideoRef.current.muted = true;
        myVideoRef.current.play();

        // handle incoming calls
        socketRef.current.on(
          "webrtc_offer",
          ({ offer, userId: otherUserId }) => {
            const peer = new Peer({ initiator: false, trickle: false, stream });
            peer.signal(offer);

            peer.on("signal", (answer) => {
              socketRef.current.emit("webrtc_answer", {
                roomId: chatSessionId,
                answer,
                userId,
              });
            });

            peer.on("stream", (userVideoStream) => {
              addVideoStream(userVideoStream, otherUserId);
            });

            peersRef.current[otherUserId] = peer;
            setPeers({ ...peersRef.current });
          }
        );

        // handle answer
        socketRef.current.on(
          "webrtc_answer",
          ({ answer, userId: otherUserId }) => {
            peersRef.current[otherUserId].signal(answer);
          }
        );

        // handle new user connected
        socketRef.current.on("user-connected", (newUserId) => {
          connectToNewUser(newUserId, stream);
        });
      });

    return () => {
      socketRef.current.disconnect();
      Object.values(peersRef.current).forEach((peer) => peer.destroy());
    };
  }, [chatSessionId]);

  const connectToNewUser = (newUserId, stream) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (offer) => {
      socketRef.current.emit("webrtc_offer", {
        roomId: chatSessionId,
        offer,
        userId,
      });
    });

    peer.on("stream", (userVideoStream) => {
      addVideoStream(userVideoStream, newUserId);
    });

    peersRef.current[newUserId] = peer;
    setPeers({ ...peersRef.current });
  };

  const addVideoStream = (stream, userId) => {
    const video = document.createElement("video");
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });
    video.setAttribute("data-user-id", userId);
    videoGridRef.current.append(video);
  };

  const handleSendMessage = () => {
    if (!newMsg.trim()) return;
    const msgData = {
      chat_session_id: chatSessionId,
      sender_id: userId,
      message: newMsg,
    };
    socketRef.current.emit("send_message", msgData);
    setMessages((prev) => [...prev, msgData]);
    setNewMsg("");
  };

  // return (
  //   <div style={{ display: "flex", height: "100vh" }}>

  //     {/* Video Panel */}
  //     <div style={{ flex: 3, display: "flex", flexWrap: "wrap" }}>
  //       <video ref={myVideoRef} autoPlay muted style={{ width: "300px", margin: "5px" }} />
  //       <div ref={videoGridRef}></div>
  //     </div>

  //     {/* Chat Panel */}
  //     <div
  //       style={{
  //         flex: 1,
  //         borderLeft: "1px solid #ccc",
  //         display: "flex",
  //         flexDirection: "column",
  //         padding: "10px",
  //       }}
  //     >
  //       <div style={{ flex: 1, overflowY: "auto", marginBottom: "10px" }}>
  //         {messages.map((msg, idx) => (
  //           <div key={idx}>
  //             <strong>{msg.sender_id === userId ? "You" : msg.sender_id}:</strong> {msg.message}
  //           </div>
  //         ))}
  //       </div>
  //       <div style={{ display: "flex" }}>
  //         <input
  //           type="text"
  //           value={newMsg}
  //           onChange={(e) => setNewMsg(e.target.value)}
  //           style={{ flex: 1, padding: "5px" }}
  //           placeholder="Type a message..."
  //         />
  //         <button onClick={handleSendMessage} style={{ padding: "5px 10px" }}>
  //           Send
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // );
  return (
    <div>
      <h2>Video Call UI Loaded ✅</h2>
    </div>
  );
}
