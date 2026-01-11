import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import './Dashboard.css'

const Dashboard = (props) => {
    const history = useHistory()
    const [activeTab, setActiveTab] = useState('Accepted')
    const [selectedRequest, setSelectedRequest] = useState(null)
    const [showDetails, setShowDetails] = useState(false)


    const navItems = [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Search', path: '/search' },
        { label: 'Profile', path: '/profile' }
    ]

    const tabItems = [
        { label: 'Accepted', path: '/dashboard' },
        { label: 'Rejected', path: '/dashboard' },
        { label: 'Pending', path: '/swap-requests' },
    ]

    const newRequests = [
        {
            id: 1,
            category: 'Web Development',
            title: 'Project collaboration',
            description: 'Looking for a partner to build a new website',
            offeredSkill: 'React.js',
            wantedSkill: 'Node.js',
            message: 'I have a great idea for a community platform and I need someone with backend expertise to help me build the API and database structure.',
            imageClass: 'screen14-thq-depth6-frame1-elm3'
        },
        {
            id: 2,
            category: 'Graphic Design',
            title: 'Logo design help',
            description: 'Need assistance with creating a logo for my brand',
            offeredSkill: 'UI/UX Design',
            wantedSkill: 'Graphic Design',
            message: 'I am launching a new startup and need a professional logo that represents our core values of innovation and sustainability.',
            imageClass: 'screen14-thq-depth6-frame1-elm4'
        }
    ]

    const handleViewDetails = (request) => {
        setSelectedRequest(request)
        setShowDetails(true)
    }


    return (
        <div className="screen14-container1">
            <Helmet>
                <title>Dashboard - Skill Swap</title>
                <meta property="og:title" content="Dashboard - Skill Swap" />
            </Helmet>
            <div className="screen14-thq-screen14-elm">
                <div className="screen14-thq-depth1-frame0-elm">
                    <div className="screen14-thq-depth2-frame0-elm">
                        <div className="screen14-thq-depth3-frame2-elm">
                            <div className="screen14-thq-depth4-frame1-elm1">
                                <span className="screen14-thq-text-elm10">
                                    Skill Swap Platform
                                </span>
                            </div>
                        </div>
                        <div className="screen14-thq-depth3-frame1-elm">
                            <div className="screen14-thq-depth4-frame0-elm1">
                                {navItems.map((item, index) => (
                                    <div key={index} className={`screen14-thq-depth5-frame${index}-elm${index === 0 ? '2' : ''}`}
                                        onClick={() => history.push(item.path)} style={{ cursor: 'pointer' }}>
                                        <span className={`screen14-thq-text-elm1${index + 1}`}>{item.label}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="screen14-thq-depth4-frame2-elm1" onClick={() => history.push('/profile')} style={{ cursor: 'pointer' }}></div>
                        </div>

                    </div>
                    <div className="screen14-thq-depth2-frame1-elm">
                        <div className="screen14-thq-depth3-frame0-elm">
                            <div className="screen14-thq-depth4-frame0-elm2">
                                <div className="screen14-thq-depth5-frame0-elm3">
                                    <div className="screen14-thq-depth6-frame0-elm1">
                                        <span className="screen14-thq-text-elm14">
                                            My Swaps Dashboard
                                        </span>
                                    </div>
                                    <div className="screen14-thq-depth6-frame1-elm1">
                                        <span className="screen14-thq-text-elm15">
                                            Check your notifications and stats
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="screen14-thq-depth4-frame1-elm2">
                                <div className="screen14-thq-depth5-frame0-elm4">
                                    {tabItems.map((tab, index) => (
                                        <div key={index} className={`screen14-thq-depth6-frame${index}-elm${(index === 0 || index === 1) ? '2' : ''}`}
                                            onClick={() => {
                                                setActiveTab(tab.label)
                                                history.push(tab.path)
                                            }} style={{ cursor: 'pointer' }}>
                                            <div className={`screen14-thq-depth7-frame0-elm${index + 1}`}>
                                                <span className={`screen14-thq-text-elm1${index + 6}`} style={{ color: activeTab === tab.label ? 'black' : 'rgba(76, 114, 153, 1)' }}>
                                                    {tab.label}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="screen14-thq-depth4-frame2-elm2">
                                <span className="screen14-thq-text-elm20">{activeTab} Requests</span>
                            </div>
                            {newRequests.map((request) => (
                                <div key={request.id} className={`screen14-thq-depth4-frame${request.id === 1 ? '4' : '3'}-elm`}>
                                    <div className={`screen14-thq-depth5-frame0-elm${request.id === 1 ? '5' : '6'}`}>
                                        <div className={`screen14-thq-depth6-frame0-elm${request.id === 1 ? '3' : '4'}`}>
                                            <div className={`screen14-thq-depth7-frame0-elm${request.id === 1 ? '5' : '6'}`}>
                                                <div className={`screen14-thq-depth8-frame0-elm${request.id === 1 ? '1' : '3'}`}>
                                                    <span className={`screen14-thq-text-elm2${request.id === 1 ? '1' : '5'}`}>
                                                        {request.category}
                                                    </span>
                                                </div>
                                                <div className={`screen14-thq-depth8-frame1-elm${request.id === 1 ? '1' : '2'}`}>
                                                    <span className={`screen14-thq-text-elm2${request.id === 1 ? '2' : '6'}`}>
                                                        {request.title}
                                                    </span>
                                                </div>
                                                <div className={`screen14-thq-depth8-frame2-elm${request.id === 1 ? '1' : '2'}`}>
                                                    <span className={`screen14-thq-text-elm2${request.id === 1 ? '3' : '7'}`}>
                                                        {request.description}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={`screen14-thq-depth7-frame1-elm${request.id === 1 ? '1' : '2'}`}
                                                onClick={() => handleViewDetails(request)} style={{ cursor: 'pointer' }}>
                                                <div className={`screen14-thq-depth8-frame0-elm${request.id === 1 ? '2' : '4'}`}>
                                                    <span className={`screen14-thq-text-elm2${request.id === 1 ? '4' : '8'}`}>
                                                        View details
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={request.imageClass}></div>
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>
                </div>
            </div>
            {showDetails && selectedRequest && (
                <div className="details-modal-overlay" onClick={() => setShowDetails(false)}>
                    <div className="details-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="details-modal-header">
                            <h2>Request Details</h2>
                            <button className="close-button" onClick={() => setShowDetails(false)}>×</button>
                        </div>
                        <div className="details-modal-body">
                            <div className="detail-item">
                                <strong>Skill Offering:</strong> <span className="skill-tag-offering">{selectedRequest.offeredSkill}</span>
                            </div>
                            <div className="detail-item">
                                <strong>Skill Wanting:</strong> <span className="skill-tag-wanting">{selectedRequest.wantedSkill}</span>
                            </div>
                            <div className="detail-item message-section">
                                <strong>Message:</strong>
                                <p>{selectedRequest.message}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Dashboard
