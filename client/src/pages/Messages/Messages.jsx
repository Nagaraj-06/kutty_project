import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import './Messages.css'

import AlexImg from "../../assets/images/tq_uc4e4cdbzy-lvmj-200h.png"
import OliviaImg from "../../assets/images/tq_lmsrdu5xwm-8gq9-200h.png"
import NoahImg from "../../assets/images/tq_6tn6n4iht--vtkt-200h.png"
import SophiaImg from "../../assets/images/tq_4qugh1dq25-gykp-200h.png"
import LiamImg from "../../assets/images/tq_iam9e-lw4s-fx9-200h.png"
import UserProfileImg from "../../assets/images/tq_axxqdx3cqk-n5oc-200h.png"
import EthanCarterImg from "../../assets/images/tq_lp9_4etwck-4tnq-200h.png"

const Messages = (props) => {
    const history = useHistory()
    const [searchQuery, setSearchQuery] = useState('')

    const navigate = (path) => {
        history.push(path)
    }

    const [messages, setMessages] = useState([
        {
            id: 1,
            name: 'Alex',
            lastMessage: "I'm available for a session tomorrow.",
            img: AlexImg,
        },
        {
            id: 2,
            name: 'Olivia',
            lastMessage: "Let's schedule our next session.",
            img: OliviaImg,
        },
        {
            id: 3,
            name: 'Ethan Carter',
            lastMessage: "I've sent you the resources.",
            img: EthanCarterImg,
        },
        {
            id: 4,
            name: 'Sophia',
            lastMessage: 'Looking forward to our session!',
            img: SophiaImg,
        },
        {
            id: 5,
            name: 'Liam',
            lastMessage: "I'm available for a session tomorrow.",
            img: LiamImg,
        },
    ])

    const filteredMessages = messages.filter((msg) =>
        msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="screen18-container1">
            <Helmet>
                <title>ExploreMessages - Skill Swap</title>
                <meta property="og:title" content="ExploreMessages - Skill Swap" />
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
                            {filteredMessages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className="screen18-thq-depth4-frame1-elm3"
                                    onClick={() => navigate('/chat')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div
                                        className="screen18-thq-depth5-frame0-elm15"
                                        style={{ backgroundImage: `url(${msg.img})` }}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            navigate('/profile')
                                        }}
                                    ></div>
                                    <div className="screen18-thq-depth5-frame1-elm1">
                                        <div
                                            className="screen18-thq-depth6-frame0-elm2"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                navigate('/profile')
                                            }}
                                        >
                                            <span className="screen18-thq-text-elm15 screen18-username-clickable">
                                                {msg.name}
                                            </span>
                                        </div>
                                        <div className="screen18-thq-depth6-frame1-elm1">
                                            <span className="screen18-thq-text-elm16">
                                                {msg.lastMessage}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Messages
