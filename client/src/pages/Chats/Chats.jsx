import React, { useState, useEffect, useRef } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import { Paperclip, Copy, FileText, Check, X } from 'lucide-react'
import {
    useGetChatListQuery,
    useGetChatMessagesQuery,
    useUploadChatFileMutation
} from '../../store/api/chatApi'
import { getImageUrl } from '../../utils/imageUtils'
import defaultProfilePic from '../../assets/images/default-profile-pic.png'
import { SOCKET_URL, BACKEND_URL } from '../../config/constants'
import './Chats.css'

const Chats = (props) => {
    const { chatId } = useParams()
    const history = useHistory()
    const { user } = useSelector(state => state.auth)
    const { data: messagesResponse, isLoading } = useGetChatMessagesQuery(chatId)
    const [uploadChatFile] = useUploadChatFileMutation()

    const [newMessage, setNewMessage] = useState("")
    const [allMessages, setAllMessages] = useState([])
    const [isUploading, setIsUploading] = useState(false)
    const [copiedId, setCopiedId] = useState(null)
    const [selectedImage, setSelectedImage] = useState(null)

    const messagesEndRef = useRef(null)
    const socketRef = useRef(null)
    const fileInputRef = useRef(null)

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

    // Handle Escape key to close fullscreen image
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setSelectedImage(null)
            }
        }

        if (selectedImage) {
            window.addEventListener('keydown', handleKeyDown)
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [selectedImage])

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

    const handleSendMessage = (content = null, fileUrl = null) => {
        const messageText = content || newMessage.trim()
        if (!messageText && !fileUrl) return
        if (!user || !chatId) return

        const messagePayload = {
            chat_session_id: chatId,
            sender_id: user.id,
            message: messageText,
            file_url: fileUrl
        }

        // Optimistically update UI
        const optimisticMessage = {
            id: Date.now().toString(), // Temp ID
            message: messageText,
            file_url: fileUrl,
            sender: {
                id: user.id,
                user_name: user.user_name || "You",
                profile_pic_url: user.profile_pic_url
            },
            send_at: new Date().toISOString(),
            created_at: new Date().toISOString()
        }

        setAllMessages(prev => [...prev, optimisticMessage])
        if (!content) setNewMessage("")

        // Emit to backend
        if (socketRef.current) {
            socketRef.current.emit('send_message', messagePayload)
        }
    }

    const handleFileClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        const formData = new FormData()
        formData.append('file', file)

        setIsUploading(true)
        try {
            const response = await uploadChatFile(formData).unwrap()
            if (response.success) {
                // If there's no text in newMessage, we use original filename as the message content
                // to preserve the filename for display.
                handleSendMessage(newMessage || response.data.original_name, response.data.file_url)
            }
        } catch (err) {
            console.error("Upload failed:", err)
            alert("Failed to upload file.")
        } finally {
            setIsUploading(false)
            e.target.value = null // Reset input
        }
    }

    const handleCopy = (id, text, fileUrl) => {
        const content = text || (fileUrl ? `${BACKEND_URL}${fileUrl}` : "")
        if (!content) return

        navigator.clipboard.writeText(content).then(() => {
            setCopiedId(id)
            setTimeout(() => setCopiedId(null), 2000)
        })
    }

    const renderMessageContent = (msg) => {
        const isImage = msg.file_url?.match(/\.(jpeg|jpg|png|gif)$/i)
        const isVideo = msg.file_url?.match(/\.(mp4|mov|avi)$/i)
        const isMedia = isImage || isVideo

        const formattedTime = new Date(msg.send_at || msg.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })

        // Determine file label (original name or message)
        const fileLabel = msg.message || (msg.file_url ? msg.file_url.split('-').pop() : "File")

        return (
            <div className={`message-content-wrapper ${isMedia ? 'media-content' : ''}`}>
                {msg.message && !msg.file_url && (
                    <span className="message-item">
                        <span className='message-text'>{msg.message}</span>
                        <span className="message-time">{formattedTime}</span>
                    </span>
                )}
                {msg.file_url && (
                    <div className="message-media">
                        {isImage ? (
                            <div className="chat-image-container">
                                <img
                                    src={`${BACKEND_URL}${msg.file_url}`}
                                    alt="Shared image"
                                    className="chat-image"
                                    loading="lazy"
                                    onClick={() => setSelectedImage(`${BACKEND_URL}${msg.file_url}`)}
                                />
                            </div>
                        ) : isVideo ? (
                            <video
                                controls
                                playsInline
                                className="chat-video"
                                preload="metadata"
                                key={msg.file_url}
                            >
                                <source
                                    src={`${BACKEND_URL}${msg.file_url}`}
                                    type={msg.file_url.endsWith('.mov') || msg.file_url.endsWith('.qt') ? 'video/quicktime' : 'video/mp4'}
                                />
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <a
                                href={`${BACKEND_URL}${msg.file_url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="chat-file-link message-item"
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                                    <FileText size={20} />
                                    <span>{fileLabel}</span>
                                </div>
                                <span className="message-time">{formattedTime}</span>
                            </a>
                        )}
                        {msg.message && (isImage || isVideo) && (
                            <div className="media-caption message-item">
                                <span className="message-text">{msg.message}</span>
                                <span className="message-time">{formattedTime}</span>
                            </div>
                        )}
                        {!(msg.message && (isImage || isVideo)) && isMedia && (
                            <span className="message-time media-time-overlay">{formattedTime}</span>
                        )}
                    </div>
                )}
                {/* {(isImage || (msg.message && !msg.file_url)) && (
                    <button
                        className="copy-btn"
                        onClick={() => handleCopy(msg.id, msg.message, msg.file_url)}
                        title="Copy message"
                    >
                        {copiedId === msg.id ? <Check size={14} color="#4CAF50" /> : <Copy size={14} />}
                    </button>
                )} */}
            </div>
        )
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

                    <div className="screen19-thq-depth5-frame0-elm2">
                        <span className="screen19-thq-text-elm11">{otherUser.user_name}</span>
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
                        <div
                            className="screen19-thq-depth6-frame1-elm1 cursor-pointer"
                            onClick={() => history.push(`/video-call-main?room=${chatId}`)}
                            style={{ cursor: "pointer" }}
                        >
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
                                                <div
                                                    className={`screen19-thq-depth6-frame1-elm2 ${msg.file_url ? 'file-bubble' : ''}`}
                                                    style={{ height: 'auto', minHeight: 'fit-content' }}
                                                >
                                                    {renderMessageContent(msg)}
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
                                                <div
                                                    className={`screen19-thq-depth6-frame1-elm3 ${msg.file_url ? 'file-bubble' : ''}`}
                                                    style={{ height: 'auto', minHeight: 'fit-content' }}
                                                >
                                                    {renderMessageContent(msg)}
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
                            <div className="screen19-thq-depth7-frame0-elm4" style={{ flexGrow: 1, position: 'relative' }}>
                                <button
                                    className="attachment-btn"
                                    onClick={handleFileClick}
                                    disabled={isUploading}
                                    title="Attach a file"
                                >
                                    <Paperclip size={20} />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                />
                                <textarea
                                    className="screen19-thq-text-elm34 chat-input-field"
                                    placeholder={isUploading ? "Uploading file..." : "Write a message..."}
                                    value={newMessage}
                                    rows={1}
                                    onChange={(e) => {
                                        setNewMessage(e.target.value)
                                        // Auto-resize height
                                        e.target.style.height = 'auto'
                                        e.target.style.height = (e.target.scrollHeight) + 'px'
                                    }}
                                    disabled={isUploading}
                                    style={{
                                        width: '100%',
                                        border: 'none',
                                        background: 'transparent',
                                        outline: 'none',
                                        paddingLeft: '44px',
                                        paddingTop: '6px',
                                        paddingBottom: '6px',
                                        resize: 'none',
                                        maxHeight: '120px',
                                        overflowY: 'auto',
                                        lineHeight: '20px',
                                        height: '32px'
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault()
                                            handleSendMessage()
                                            // Reset height
                                            e.target.style.height = '32px'
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

            {/* Fullscreen Image Modal */}
            {selectedImage && (
                <div className="fullscreen-modal" onClick={() => setSelectedImage(null)}>
                    <button className="modal-close-btn" onClick={() => setSelectedImage(null)}>
                        <X size={32} />
                    </button>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <img src={selectedImage} alt="Fullscreen preview" />
                    </div>
                </div>
            )}
        </div>
    )
}

export default Chats
