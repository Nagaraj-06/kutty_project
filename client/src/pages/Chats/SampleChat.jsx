import React, { useState, useRef, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import defaultProfilePic from '../../assets/images/default-profile-pic.png'
import './Chats.css'

const SampleChat = () => {
    const user = {
        id: 1,
        user_name: 'You',
        profile_pic_url: null
    }

    const staticMessages = [
        {
            id: 1,
            message: 'Hi 👋',
            sender: {
                id: 2,
                user_name: 'Alex',
                profile_pic_url: null
            },
            created_at: new Date().toISOString()
        },
        {
            id: 2,
            message: 'Hello!',
            sender: {
                id: 1,
                user_name: 'You',
                profile_pic_url: null
            },
            created_at: new Date().toISOString()
        },
        {
            id: 3,
            message: 'How are you?',
            sender: {
                id: 2,
                user_name: 'Alex',
                profile_pic_url: null
            },
            created_at: new Date().toISOString()
        }
    ]

    const [allMessages, setAllMessages] = useState(staticMessages)
    const [newMessage, setNewMessage] = useState('')
    const messagesEndRef = useRef(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [allMessages])

    const handleSendMessage = () => {
        if (!newMessage.trim()) return

        const newMsg = {
            id: Date.now(),
            message: newMessage,
            sender: user,
            created_at: new Date().toISOString()
        }

        setAllMessages(prev => [...prev, newMsg])
        setNewMessage('')
    }

    const otherUser =
        allMessages.find(m => m.sender.id !== user.id)?.sender || {
            user_name: 'Chat',
            profile_pic_url: null
        }

    console.log(allMessages)

    return (
        <div className="screen19-container1">
            <Helmet>
                <title>UserChat - Skill Swap</title>
            </Helmet>

            <div className="screen19-thq-screen19-elm">
                <div className="screen19-thq-depth1-frame0-elm">
                    <div className="screen19-thq-depth2-frame1-elm">
                        <div className="screen19-thq-depth3-frame0-elm">

                            {/* Sticky Header */}
                            <div className="screen19-thq-depth4-frame0-elm">
                                <div className="screen19-thq-depth5-frame0-elm2">
                                    <span className="screen19-thq-text-elm11">
                                        {otherUser.user_name}
                                    </span>
                                </div>
                            </div>

                            {/* Scroll Area */}
                            <div className="chat-messages-scroll-area">
                                {allMessages.map((msg, index) => {
                                    const isMe = msg.sender.id === user.id

                                    return (
                                        <React.Fragment key={msg.id}>
                                            {!isMe ? (
                                                <div className="screen19-thq-depth4-frame3-elm">
                                                    <div
                                                        className="screen19-thq-depth5-frame0-elm4"
                                                        style={{
                                                            backgroundImage: `url(${defaultProfilePic})`
                                                        }}
                                                    />
                                                    <div className="screen19-thq-depth5-frame1-elm1">
                                                        <div className="screen19-thq-depth6-frame0-elm2">
                                                            <span className="screen19-thq-text-elm16">
                                                                {msg.sender.user_name}
                                                            </span>
                                                        </div>
                                                        <div className="screen19-thq-depth6-frame1-elm2">
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
                                                        <div className="screen19-thq-depth6-frame1-elm3">
                                                            <span className="screen19-thq-text-elm22">
                                                                {msg.message}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="screen19-thq-depth5-frame1-elm2"
                                                        style={{
                                                            backgroundImage: `url(${defaultProfilePic})`
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </React.Fragment>
                                    )
                                })}

                                <div ref={messagesEndRef} />
                            </div>

                            {/* Sticky Footer */}
                            <div className="screen19-thq-depth4-frame10-elm">
                                <div className="screen19-thq-depth5-frame0-elm8">
                                    <div className="screen19-thq-depth6-frame0-elm6">
                                        <div className="screen19-thq-depth7-frame0-elm4" style={{ flexGrow: 1 }}>
                                            <input
                                                type="text"
                                                className="screen19-thq-text-elm34"
                                                placeholder="Write a message..."
                                                value={newMessage}
                                                onChange={e => setNewMessage(e.target.value)}
                                                onKeyPress={e => {
                                                    if (e.key === 'Enter') handleSendMessage()
                                                }}
                                            />
                                        </div>

                                        <div
                                            className="screen19-thq-depth7-frame1-elm4"
                                            onClick={handleSendMessage}
                                        >
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

export default SampleChat
