import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { useGetChatListQuery } from '../../store/api/chatApi'
import { getImageUrl } from '../../utils/imageUtils'
import defaultProfilePic from '../../assets/images/default-profile-pic.png'
import './Messages.css'

const Messages = (props) => {
    const history = useHistory()
    const [searchQuery, setSearchQuery] = useState('')
    const { data: chatListResponse, isLoading } = useGetChatListQuery()

    const navigate = (path) => {
        history.push(path)
    }
    const [showArchived, setShowArchived] = useState(false)

    const chats = chatListResponse?.data || []

    const activeChats = chats.filter(c => !c.is_archived)
    const archivedChats = chats.filter(c => c.is_archived)

    const chatsToDisplay = showArchived ? archivedChats : activeChats

    const filteredChats = chatsToDisplay.filter((chat) =>
        chat.oppositeUser?.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.oppositeUser?.last_message?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="screen18-container1">
            <Helmet>
                <title>Messages - Skill Swap</title>
                <meta property="og:title" content="Messages - Skill Swap" />
            </Helmet>
            <div className="screen18-thq-screen18-elm">
                <div className="screen18-thq-depth1-frame0-elm">
                    <div className="screen18-thq-depth2-frame1-elm">
                        <div className="screen18-thq-depth3-frame0-elm">
                            <div className="screen18-thq-depth4-frame0-elm2">
                                <div className="screen18-thq-depth5-frame0-elm13">
                                    <span className="screen18-thq-text-elm13">Messages</span>
                                </div>
                            </div>
                            <div className="screen18-thq-depth4-frame6-elm">
                                <div className="screen18-thq-depth5-frame0-elm14">
                                    <div className="screen18-thq-depth6-frame0-elm1">
                                        <div className="screen18-thq-depth7-frame0-elm">
                                            <img
                                                src="/depth8frame02258-gfv.svg"
                                                alt="Depth8Frame02258"
                                                className="screen18-thq-depth8-frame0-elm"
                                            />
                                        </div>
                                        <div className="screen18-thq-depth7-frame1-elm">
                                            <input
                                                type="text"
                                                placeholder="Search in chat"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="screen18-thq-text-elm14"
                                                style={{
                                                    border: 'none',
                                                    background: 'transparent',
                                                    outline: 'none',
                                                    width: '100%',
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {!showArchived && archivedChats.length > 0 && !searchQuery && (
                                <div className="archived-row" onClick={() => setShowArchived(true)}>
                                    <div className="archived-icon-container">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20 5H4V19H20V5Z" stroke="#4C7299" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M10 12H14" stroke="#4C7299" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M1 5H23" stroke="#4C7299" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div className="archived-info">
                                        <span className="archived-text">Archived</span>
                                        <span className="archived-count">{archivedChats.length}</span>
                                    </div>
                                </div>
                            )}

                            {showArchived && (
                                <div className="back-actions-row" onClick={() => setShowArchived(false)}>
                                    <span>← Back to Messages</span>
                                </div>
                            )}
                            {isLoading ? (
                                <div style={{ padding: '20px', textAlign: 'center', color: '#4c7299' }}>Loading chats...</div>
                            ) : filteredChats.length === 0 ? (
                                <div style={{ padding: '20px', textAlign: 'center', color: '#4c7299' }}>No chats found.</div>
                            ) : (
                                filteredChats.map((chat) => (
                                    <div
                                        key={chat.chat_session_id}
                                        className="screen18-thq-depth4-frame1-elm3"
                                        onClick={() => navigate(`/messages/${chat.chat_session_id}`)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div
                                            className="screen18-thq-depth5-frame0-elm15"
                                            style={{
                                                backgroundImage: `url(${getImageUrl(chat.oppositeUser?.profile_pic_url, defaultProfilePic)})`,
                                                backgroundSize: 'cover'
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                // navigate('/profile') // Assuming we might want to go to their profile later, but for now specific ID is tricky without user ID in chat object sometimes. 
                                                // Actually the API response example doesn't explicitly show oppositeUserId, just oppositeUser object. 
                                                // Assuming we stick to chat navigation for now.
                                            }}
                                        ></div>
                                        <div className="screen18-thq-depth5-frame1-elm1">
                                            <div
                                                className="screen18-thq-depth6-frame0-elm2"
                                            >
                                                <span className="screen18-thq-text-elm15 screen18-username-clickable">
                                                    {chat.oppositeUser?.user_name || "Unknown User"}
                                                </span>
                                            </div>
                                            <div className="screen18-thq-depth6-frame1-elm1">
                                                <span className="screen18-thq-text-elm16">
                                                    {chat.oppositeUser?.last_message || "Start chatting..."}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Messages
