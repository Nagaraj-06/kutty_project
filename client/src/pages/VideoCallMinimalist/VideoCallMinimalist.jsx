import React, { useState } from 'react';
import './VideoCallMinimalist.css';

const VideoCallMinimalist = () => {
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [message, setMessage] = useState('');

    return (
        <div className="video-call-minimalist-container">
            {/* Header Info Overlay */}
            <div className="minimalist-header">
                <div className="header-info">
                    <div className="connection-status">
                        <div className="connection-indicator"></div>
                        <span className="connection-label">Secure Connection</span>
                    </div>
                    <div className="participant-info">
                        <h2 className="participant-name">Alexander Pierce</h2>
                        <p className="call-duration">14:22</p>
                    </div>
                </div>
            </div>

            {/* Local Video PiP Overlay */}
            <div className="local-pip-overlay">
                <div className="local-pip-container">
                    <div className="local-pip-video"></div>
                    <div className="local-pip-label">
                        <span className="material-icons pip-icon">person</span>
                        You
                    </div>
                </div>
            </div>

            {/* Centered Primary Video Feed */}
            <div className="primary-video-wrapper">
                <div className="primary-video-container">
                    <div className="primary-video-feed"></div>

                    {/* Signal Overlay */}
                    <div className="signal-overlay">
                        <div className="signal-badge">
                            <span className="material-icons">signal_cellular_alt</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Pill-Shaped Control Bar */}
            <div className="floating-controls">
                <div className="controls-pill">
                    {/* Microphone Toggle */}
                    <button
                        className="pill-button"
                        onClick={() => setIsMicOn(!isMicOn)}
                        data-tooltip={isMicOn ? "Mute Mic" : "Unmute Mic"}
                    >
                        <span className="material-icons">
                            {isMicOn ? 'mic' : 'mic_off'}
                        </span>
                        <span className="tooltip">{isMicOn ? "Mute Mic" : "Unmute Mic"}</span>
                    </button>

                    {/* Camera Toggle */}
                    <button
                        className="pill-button"
                        onClick={() => setIsCameraOn(!isCameraOn)}
                        data-tooltip={isCameraOn ? "Stop Video" : "Start Video"}
                    >
                        <span className="material-icons">
                            {isCameraOn ? 'videocam' : 'videocam_off'}
                        </span>
                        <span className="tooltip">{isCameraOn ? "Stop Video" : "Start Video"}</span>
                    </button>

                    <div className="pill-divider"></div>

                    {/* Chat Toggle */}
                    <button
                        className="pill-button chat-button"
                        onClick={() => setIsChatOpen(!isChatOpen)}
                        data-tooltip="Messages"
                    >
                        <span className="material-icons">chat_bubble</span>
                        <span className="chat-notification">
                            <span className="ping"></span>
                            <span className="dot"></span>
                        </span>
                        <span className="tooltip">Messages</span>
                    </button>

                    {/* Screen Share */}
                    <button className="pill-button" data-tooltip="Share Screen">
                        <span className="material-icons">present_to_all</span>
                        <span className="tooltip">Share Screen</span>
                    </button>

                    {/* Settings */}
                    <button className="pill-button" data-tooltip="Settings">
                        <span className="material-icons">more_vert</span>
                        <span className="tooltip">Settings</span>
                    </button>

                    {/* End Call Button */}
                    <button className="end-call-pill" data-tooltip="Leave Call">
                        <span className="material-icons">call_end</span>
                        <span className="tooltip">Leave Call</span>
                    </button>
                </div>
            </div>

            {/* Chat Panel */}
            <div className={`chat-panel ${isChatOpen ? 'open' : ''}`}>
                <div className="chat-container">
                    <div className="chat-header">
                        <h3 className="chat-title">Messages</h3>
                        <button
                            className="chat-close"
                            onClick={() => setIsChatOpen(false)}
                        >
                            <span className="material-icons">close</span>
                        </button>
                    </div>

                    <div className="chat-messages">
                        <div className="message-group">
                            <p className="message-sender">Alexander • 14:20</p>
                            <div className="message-bubble">
                                <p className="message-text">
                                    Can you hear me alright? The connection seems stable today.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="chat-input-container">
                        <input
                            type="text"
                            className="chat-input"
                            placeholder="Type a message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoCallMinimalist;