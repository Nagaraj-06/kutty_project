import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import io from 'socket.io-client';
import Peer from 'peerjs';
import { SOCKET_URL } from '../../config/constants';
import './VideoCallMain.css';

const VideoCallMain = () => {
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [remoteStream, setRemoteStream] = useState(null);
    const [localStream, setLocalStream] = useState(null);

    // Refs
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerInstance = useRef(null);
    const socketInstance = useRef(null);

    const location = useLocation();
    const history = useHistory();

    // Get roomId from query params or generate one
    const queryParams = new URLSearchParams(location.search);
    const roomId = queryParams.get('room') || 'default-room';

    useEffect(() => {
        const socket = io(SOCKET_URL);
        socketInstance.current = socket;

        // Use cloud peerjs for simplicity unless backend strictly has peer server
        const peer = new Peer();
        peerInstance.current = peer;

        // Get User Media
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then(stream => {
            setLocalStream(stream);
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }

            // Answer calls
            peer.on('call', call => {
                call.answer(stream); // Answer with our stream
                call.on('stream', userVideoStream => {
                    setRemoteStream(userVideoStream);
                });
            });

            // Handle user connected (Socket signal)
            socket.on('user-connected', (userId) => {
                console.log("User connected: " + userId);
                // Connect to new user
                const call = peer.call(userId, stream);

                call.on('stream', userVideoStream => {
                    setRemoteStream(userVideoStream);
                });

                call.on('close', () => {
                    setRemoteStream(null);
                });
            });
        }).catch(err => {
            console.error("Failed to get local stream", err);
        });

        // Socket Join Room after peer opens
        peer.on('open', id => {
            console.log("My Peer ID: " + id);
            socket.emit('join-room', roomId, id);
        });

        // Handle user disconnect
        socket.on('user-disconnected', userId => {
            console.log("User disconnected: " + userId);
            setRemoteStream(null); // Simple handling for 1-on-1
        });

        return () => {
            socket.disconnect();
            peer.destroy();
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [roomId]);

    // Update remote video ref when stream changes
    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);


    // Toggle Mic
    useEffect(() => {
        if (localStream && localStream.getAudioTracks().length > 0) {
            localStream.getAudioTracks()[0].enabled = isMicOn;
        }
    }, [isMicOn, localStream]);

    // Toggle Camera
    useEffect(() => {
        if (localStream && localStream.getVideoTracks().length > 0) {
            localStream.getVideoTracks()[0].enabled = isCameraOn;
        }
    }, [isCameraOn, localStream]);

    // Screen Share Logic
    const handleScreenShare = () => {
        if (isScreenSharing) {
            // Stop sharing - revert to camera
            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
                const videoTrack = stream.getVideoTracks()[0];
                if (localStream) {
                    const sender = peerInstance.current.connections[Object.keys(peerInstance.current.connections)[0]]?.[0]?.peerConnection.getSenders().find(s => s.track.kind === 'video');
                    if (sender) sender.replaceTrack(videoTrack);

                    localStream.removeTrack(localStream.getVideoTracks()[0]);
                    localStream.addTrack(videoTrack);
                    if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
                }
                setIsScreenSharing(false);
            });
        } else {
            // Start sharing
            navigator.mediaDevices.getDisplayMedia({ video: true }).then(stream => {
                const screenTrack = stream.getVideoTracks()[0];

                if (localStream) {
                    // Replace track in peer connection if exists
                    const connections = peerInstance.current.connections;
                    const connectionKeys = Object.keys(connections);
                    if (connectionKeys.length > 0) {
                        const connection = connections[connectionKeys[0]][0];
                        const sender = connection.peerConnection.getSenders().find(s => s.track.kind === 'video');
                        if (sender) sender.replaceTrack(screenTrack);
                    }

                    // Handle screen sharing stop via browser UI
                    screenTrack.onended = () => {
                        handleScreenShare(); // Revert logic needs state awareness, might be tricky here, simplified for now
                        setIsScreenSharing(false);
                    };

                    localStream.removeTrack(localStream.getVideoTracks()[0]);
                    localStream.addTrack(screenTrack);
                    if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
                }
                setIsScreenSharing(true);
            });
        }
    };

    const endCall = () => {
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
        }
        if (socketInstance.current) socketInstance.current.disconnect();
        if (peerInstance.current) peerInstance.current.destroy();
        history.push('/'); // Go home or back
    };

    return (
        <div className="video-call-main-container">
            {/* Header Overlay */}
            <div className="video-call-header">
                <div className="header-left">
                    <div className="recording-badge">
                        <div className="recording-dot"></div>
                        <span className="recording-time">Room: {roomId}</span>
                    </div>
                    <div className="connection-badge">
                        <span className="material-icons">signal_cellular_alt</span>
                        <span className="connection-text">Connected</span>
                    </div>
                </div>
                <div className="header-right">
                    <div className="settings-button">
                        <span className="material-icons">settings</span>
                    </div>
                    <div className="user-avatar"></div>
                </div>
            </div>

            {/* Remote Participant Video */}
            <div className="remote-video-container">
                {remoteStream ? (
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="remote-video-feed"
                    />
                ) : (
                    <div className="remote-video-placeholder" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'white' }}>
                        <p>Waiting for participant...</p>
                        <p style={{ fontSize: '0.8em', opacity: 0.7 }}>Share Room ID: {roomId}</p>
                    </div>
                )}

                {remoteStream && (
                    <div className="remote-user-badge">
                        <p className="remote-user-name">Remote User</p>
                    </div>
                )}
            </div>

            {/* Local Video PiP */}
            <div className="local-video-pip">
                <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="local-video-feed"
                />
                <div className="local-video-gradient"></div>
                <div className="local-video-label">
                    <span className="you-label">YOU</span>
                </div>
            </div>

            {/* Control Toolbar */}
            <div className="control-toolbar">
                <div className="toolbar-panel">
                    {/* Mic Button */}
                    <button
                        className={`control-button ${isMicOn ? 'active' : 'inactive'}`}
                        onClick={() => setIsMicOn(!isMicOn)}
                        style={{ backgroundColor: isMicOn ? 'rgba(255,255,255,0.2)' : 'rgba(255,0,0,0.7)' }}
                    >
                        <span className="material-icons">
                            {isMicOn ? 'mic' : 'mic_off'}
                        </span>
                    </button>

                    {/* Camera Button */}
                    <button
                        className={`control-button ${isCameraOn ? 'active' : 'inactive'}`}
                        onClick={() => setIsCameraOn(!isCameraOn)}
                        style={{ backgroundColor: isCameraOn ? 'rgba(255,255,255,0.2)' : 'rgba(255,0,0,0.7)' }}
                    >
                        <span className="material-icons">
                            {isCameraOn ? 'videocam' : 'videocam_off'}
                        </span>
                    </button>

                    {/* Screen Share Button */}
                    <button
                        className={`control-button ${isScreenSharing ? 'active' : ''}`}
                        onClick={handleScreenShare}
                        style={{ backgroundColor: isScreenSharing ? '#4CAF50' : 'rgba(255,255,255,0.2)' }}
                    >
                        <span className="material-icons">screen_share</span>
                    </button>

                    <div className="toolbar-divider"></div>

                    {/* Chat Button */}
                    <div className="control-button-wrapper">
                        <button className="control-button">
                            <span className="material-icons">chat</span>
                        </button>
                    </div>

                    <div className="toolbar-divider"></div>

                    {/* End Call Button */}
                    <button className="end-call-button" onClick={endCall}>
                        <span className="material-icons">call_end</span>
                        <span className="end-call-text">End Call</span>
                    </button>
                </div>
            </div>

            {/* Floating Reaction Buttons */}
            <div className="reaction-buttons">
                <button className="reaction-button">👋</button>
                <button className="reaction-button">❤️</button>
                <button className="reaction-button">🔥</button>
            </div>
        </div>
    );
};

export default VideoCallMain;