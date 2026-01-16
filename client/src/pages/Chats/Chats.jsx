import React, { useState, useEffect, useRef } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import { useGetChatListQuery, useGetChatMessagesQuery } from '../../store/api/chatApi'
import { getImageUrl } from '../../utils/imageUtils'
import defaultProfilePic from '../../assets/images/default-profile-pic.png'
import './Chats.css'

// Backend sockert server url
const SOCKET_URL = 'http://localhost:8080'

const Chats = (props) => {
    const { chatId } = useParams()
    const history = useHistory()
    const { user } = useSelector(state => state.auth)
    const { data: messagesResponse, isLoading } = useGetChatMessagesQuery(chatId)
    const [newMessage, setNewMessage] = useState("")
    const [allMessages, setAllMessages] = useState([])
    const messagesEndRef = useRef(null)
    const socketRef = useRef(null)

    // Sync RTK Query messages to local state when they load
    useEffect(() => {
        if (messagesResponse?.data) {
            setAllMessages(messagesResponse.data)
        }
    }, [messagesResponse])

    // Socket.IO Integration
    useEffect(() => {
        // Initialize Socket
        socketRef.current = io(SOCKET_URL, {
            transports: ['websocket'], // Use websocket only to avoid pooling issues
            reconnectionAttempts: 5
        })

        // Join Chat Room
        if (chatId) {
            socketRef.current.emit('join', { chatSessionId: chatId })
            console.log(`Joined room: ${chatId}`)
        }

        // Listen for new messages
        socketRef.current.on('new_message', (message) => {
            console.log("Received new message:", message)

            // Append incoming message to state
            // Ensure no duplicates if backend echoes back (which existing code said it broadcasts to others only, but good to be safe)
            setAllMessages((prevMessages) => {
                // Check if message ID already exists to prevent duplication
                if (prevMessages.some(m => m.id === message.id)) {
                    return prevMessages
                }
                return [...prevMessages, message]
            })
        })

        socketRef.current.on('error', (err) => {
            console.error("Socket error:", err)
        })

        // Cleanup on unmount
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect()
            }
        }
    }, [chatId]) // Re-run if chatId changes

    const isFirstLoad = useRef(true)

    useEffect(() => {
        if (allMessages.length > 0) {
            if (isFirstLoad.current) {
                messagesEndRef.current?.scrollIntoView({ behavior: "auto" })
                isFirstLoad.current = false
            } else {
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
            }
        }
    }, [allMessages])

    const handleSendMessage = () => {
        if (!newMessage.trim() || !user || !chatId) return

        const messagePayload = {
            chat_session_id: chatId,
            sender_id: user.id,
            message: newMessage.trim()
        }

        // Optimistically update UI
        // We create a temporary message object. Backend usually returns a real ID and timestamp.
        // For now we assume success or fetch refreshed data later.
        // Or better: Wait for socket "new_message" if backend echoed it. 
        // BUT backend says: socket.broadcast.to(...).emit(...) -> Excludes sender.
        // So we MUST add it locally.

        const optimisticMessage = {
            id: Date.now().toString(), // Temp ID
            message: newMessage,
            sender: {
                id: user.id,
                user_name: user.user_name || "You",
                profile_pic_url: user.profile_pic_url
            },
            send_at: new Date().toISOString(),
            created_at: new Date().toISOString()
        }

        setAllMessages(prev => [...prev, optimisticMessage])
        setNewMessage("")

        // Emit to backend
        if (socketRef.current) {
            socketRef.current.emit('send_message', messagePayload)
        }
    }

    // For more reliable participant info (especially on empty chats), get from chat list
    const { data: chatListResponse } = useGetChatListQuery()
    const chatInfo = chatListResponse?.data?.find(c => c.chat_session_id === chatId)
    const otherUser = chatInfo?.oppositeUser || allMessages.find(m => m.sender.id !== user?.id)?.sender || { user_name: "Chat", profile_pic_url: null }

    return (
        <div className="page-wrapper">
            <Helmet>
                <title>UserChat - Skill Swap</title>
                <meta property="og:title" content="UserChat - Skill Swap" />
            </Helmet>
            <div className="chat-page">
                {/* Sticky Header */}
                <div className="chat-header">
                    <div
                        className="screen19-thq-depth5-frame0-elm2 cursor-pointer"
                        onClick={() => {
                            const targetId = otherUser?.id || otherUser?.user_id;
                            console.log("Navigating to profile for user:", targetId);
                            if (targetId) {
                                history.push(`/profile/${targetId}`);
                            } else {
                                alert("Could not find user ID for navigation.");
                            }
                        }}
                        style={{ cursor: "pointer" }}
                    >
                        <span className="screen19-thq-text-elm11 click-username">{otherUser.user_name}</span>
                    </div>
                    <div className="screen19-thq-depth5-frame0-elm3">
                        <div className="screen19-thq-depth6-frame0-elm1">
                            <div className="screen19-thq-depth7-frame0-elm1">
                                <div className="screen19-thq-depth8-frame0-elm1">
                                    <img src="/depth9frame02263-qg1d.svg" alt="Call" className="screen19-thq-depth9-frame0-elm1" />
                                </div>
                            </div>
                            <div className="screen19-thq-depth7-frame1-elm1">
                                <span className="screen19-thq-text-elm12">Call</span>
                            </div>
                        </div>
                        <div className="screen19-thq-depth6-frame1-elm1">
                            <div className="screen19-thq-depth7-frame0-elm2">
                                <div className="screen19-thq-depth8-frame0-elm2">
                                    <img src="/depth9frame02264-msnw.svg" alt="Video" className="screen19-thq-depth9-frame0-elm2" />
                                </div>
                            </div>
                            <div className="screen19-thq-depth7-frame1-elm2">
                                <span className="screen19-thq-text-elm13">Video</span>
                            </div>
                        </div>
                        <div className="screen19-thq-depth6-frame2-elm">
                            <div className="screen19-thq-depth7-frame0-elm3">
                                <div className="screen19-thq-depth8-frame0-elm3">
                                    <img src="/depth9frame02265-fbiw.svg" alt="Schedule" className="screen19-thq-depth9-frame0-elm3" />
                                </div>
                            </div>
                            <div className="screen19-thq-depth7-frame1-elm3">
                                <span className="screen19-thq-text-elm14">Schedule</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scrollable Message Area Wrapper */}
                <div className="chat-body">

                    {/* Messages List */}
                    {isLoading && allMessages.length === 0 ? (
                        <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
                    ) : (
                        allMessages.map((msg, index) => {
                            const key = msg.id || index
                            const isMe = msg.sender.id === user?.id

                            // Date Logic
                            const messageDate = new Date(msg.send_at || msg.created_at || Date.now())
                            const dateString = messageDate.toDateString()

                            let showDateHeader = false
                            if (index === 0) {
                                showDateHeader = true
                            } else {
                                const prevMsg = allMessages[index - 1]
                                const prevDate = new Date(prevMsg.send_at || prevMsg.created_at || Date.now())
                                if (prevDate.toDateString() !== dateString) {
                                    showDateHeader = true
                                }
                            }

                            // Format Date Label
                            let dateLabel = dateString
                            const today = new Date()
                            const yesterday = new Date()
                            yesterday.setDate(yesterday.getDate() - 1)

                            if (dateString === today.toDateString()) {
                                dateLabel = "Today"
                            } else if (dateString === yesterday.toDateString()) {
                                dateLabel = "Yesterday"
                            } else {
                                dateLabel = messageDate.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
                            }

                            return (
                                <React.Fragment key={key}>
                                    {showDateHeader && (
                                        <div className="screen19-thq-depth4-frame2-elm">
                                            <span className="screen19-thq-text-elm15">{dateLabel}</span>
                                        </div>
                                    )}

                                    {/* Message Bubble */}
                                    {!isMe ? (
                                        <div className="screen19-thq-depth4-frame3-elm">
                                            <div
                                                className="screen19-thq-depth5-frame0-elm4 cursor-pointer"
                                                onClick={() => msg.sender.id && history.push(`/profile/${msg.sender.id}`)}
                                                style={{
                                                    backgroundImage: `url(${getImageUrl(msg.sender.profile_pic_url, defaultProfilePic)})`,
                                                    cursor: "pointer"
                                                }}
                                            ></div>
                                            <div className="screen19-thq-depth5-frame1-elm1">
                                                <div className="screen19-thq-depth6-frame0-elm2 cursor-pointer"
                                                    onClick={() => msg.sender.id && history.push(`/profile/${msg.sender.id}`)}
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    <span className="screen19-thq-text-elm16">
                                                        {msg.sender.user_name}
                                                    </span>
                                                </div>
                                                <div className="screen19-thq-depth6-frame1-elm2" style={{ height: 'auto', minHeight: 'fit-content' }}>
                                                    <span className="screen19-thq-text-elm17">
                                                        {msg.message}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="screen19-thq-depth4-frame4-elm">
                                            <div className="screen19-thq-depth5-frame0-elm5">
                                                <div className="screen19-thq-depth6-frame0-elm3">
                                                    <span className="screen19-thq-text-elm21">
                                                        You
                                                    </span>
                                                </div>
                                                <div className="screen19-thq-depth6-frame1-elm3" style={{ height: 'auto', minHeight: 'fit-content' }}>
                                                    <span className="screen19-thq-text-elm22">
                                                        {msg.message}
                                                    </span>
                                                </div>
                                            </div>
                                            <div
                                                className="screen19-thq-depth5-frame1-elm2"
                                                style={{
                                                    backgroundImage: `url(${getImageUrl(user?.profile_pic_url, defaultProfilePic)})`
                                                }}
                                            ></div>
                                        </div>
                                    )}
                                </React.Fragment>
                            )
                        })
                    )}

                    <div className="screen19-thq-depth4-frame7-elm"></div>
                    <div ref={messagesEndRef} />
                </div>

                {/* Sticky Footer */}
                <div className="chat-footer">
                    <div className="screen19-thq-depth5-frame0-elm8">
                        <div className="screen19-thq-depth6-frame0-elm6">
                            <div className="screen19-thq-depth7-frame0-elm4" style={{ flexGrow: 1 }}>
                                <input
                                    type="text"
                                    className="screen19-thq-text-elm34"
                                    placeholder="Write a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    style={{
                                        width: '100%',
                                        border: 'none',
                                        background: 'transparent',
                                        outline: 'none'
                                    }}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSendMessage()
                                        }
                                    }}
                                />
                            </div>
                            <div className="screen19-thq-depth7-frame1-elm4" style={{ cursor: 'pointer' }}
                                onClick={handleSendMessage}
                            >
                                <div className="screen19-thq-depth8-frame0-elm4">
                                    <div className="screen19-thq-depth9-frame1-elm">
                                        <div className="screen19-thq-depth10-frame0-elm2">
                                            <span className="screen19-thq-text-elm35">
                                                Send
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Chats
