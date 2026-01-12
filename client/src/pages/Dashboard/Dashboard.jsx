import { useGetUserSwapsQuery, useMarkSwapCompleteMutation } from '../../store/api/swapsApi'
import { useSelector } from 'react-redux'
import { getImageUrl } from '../../utils/imageUtils'
import defaultProfilePic from '../../assets/images/default-profile-pic.png'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import './Dashboard.css'

const Dashboard = (props) => {
    const history = useHistory()
    const { user } = useSelector(state => state.auth)
    const [activeTab, setActiveTab] = useState(localStorage.getItem('dashboardActiveTab') || 'Accepted')

    useEffect(() => {
        localStorage.setItem('dashboardActiveTab', activeTab)
    }, [activeTab])

    const [selectedRequest, setSelectedRequest] = useState(null)
    const [showDetails, setShowDetails] = useState(false)

    const { data: swapsResponse, isLoading } = useGetUserSwapsQuery()
    const [markComplete] = useMarkSwapCompleteMutation()

    const tabItems = [
        { label: 'Accepted', status: 'ACCEPTED', path: '/dashboard' },
        { label: 'Rejected', status: 'REJECTED', path: '/dashboard' },
        { label: 'Completed', status: 'COMPLETED', path: '/dashboard' },
        { label: 'Pending', status: 'PENDING', path: '/swap-requests' },
    ]

    const swaps = swapsResponse?.data || []
    const filteredSwaps = swaps.filter(s => s.status === activeTab.toUpperCase())

    const handleMarkComplete = async (swapId) => {
        try {
            const result = await markComplete(swapId).unwrap();
            alert(result.message);
        } catch (err) {
            alert("Failed to mark complete: " + (err?.data?.message || err.message));
        }
    }

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
                                        <div key={index} className={`screen14-thq-depth6-frame${index}-elm${(index === 0 || index === 1) ? '2' : ''} cursor-pointer`}
                                            onClick={() => {
                                                setActiveTab(tab.label)
                                                history.push(tab.path)
                                            }}>
                                            <div className={`screen14-thq-depth7-frame0-elm${index + 1}`}>
                                                <span className={`screen14-thq-text-elm1${index + 6} ${activeTab === tab.label ? 'dashboard-tab-active' : 'dashboard-tab-inactive'}`}>
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

                            {isLoading ? (
                                <div className="dashboard-loading">Loading your swaps...</div>
                            ) : filteredSwaps.length === 0 ? (
                                <div className="dashboard-empty">No {activeTab.toLowerCase()} swaps found.</div>
                            ) : (
                                filteredSwaps.map((request, index) => {
                                    const isFromMe = request.requestFrom.id === user?.id
                                    const otherUser = isFromMe ? request.requestTo : request.requestFrom

                                    const cardClass = index % 2 === 0 ? 'screen14-thq-depth4-frame4-elm' : 'screen14-thq-depth4-frame3-elm'
                                    const innerFrameClass = index % 2 === 0 ? 'screen14-thq-depth5-frame0-elm5' : 'screen14-thq-depth5-frame0-elm6'
                                    const textFrameClass = index % 2 === 0 ? 'screen14-thq-depth6-frame0-elm3' : 'screen14-thq-depth6-frame0-elm4'
                                    const titleFrameClass = index % 2 === 0 ? 'screen14-thq-depth7-frame0-elm5' : 'screen14-thq-depth7-frame0-elm6'
                                    const msgFrameClass = index % 2 === 0 ? 'screen14-thq-depth8-frame2-elm1' : 'screen14-thq-depth8-frame2-elm2'
                                    const msgTextClass = index % 2 === 0 ? 'screen14-thq-text-elm23' : 'screen14-thq-text-elm27'
                                    const btnFrameClass = index % 2 === 0 ? 'screen14-thq-depth7-frame1-elm1' : 'screen14-thq-depth7-frame1-elm2'
                                    const btnInnerClass = index % 2 === 0 ? 'screen14-thq-depth8-frame0-elm2' : 'screen14-thq-depth8-frame0-elm4'
                                    const btnTextClass = index % 2 === 0 ? 'screen14-thq-text-elm24' : 'screen14-thq-text-elm28'
                                    const imgClass = index % 2 === 0 ? 'screen14-thq-depth6-frame1-elm3' : 'screen14-thq-depth6-frame1-elm4'

                                    return (
                                        <div key={request.id} className={cardClass}>
                                            <div className={innerFrameClass}>
                                                <div className={textFrameClass}>
                                                    <div className={titleFrameClass}>
                                                        <div className={index % 2 === 0 ? 'screen14-thq-depth8-frame1-elm1' : 'screen14-thq-depth8-frame1-elm2'}>
                                                            <span className={index % 2 === 0 ? 'screen14-thq-text-elm22' : 'screen14-thq-text-elm26'}>
                                                                Swap with {otherUser.user_name}
                                                            </span>
                                                        </div>
                                                        <div className={msgFrameClass}>
                                                            <span
                                                                className={`${msgTextClass} message-text3`}
                                                                ref={(el) => {
                                                                    if (el) {
                                                                        // Check if text overflows
                                                                        const isOverflowing = el.scrollHeight > el.clientHeight;
                                                                        const readMoreBtn = el.nextElementSibling;
                                                                        if (readMoreBtn && readMoreBtn.classList.contains('read-more-link')) {
                                                                            readMoreBtn.style.display = isOverflowing ? 'inline-block' : 'none';
                                                                        }
                                                                    }
                                                                }}
                                                            >
                                                                {request.message || "No message provided."}
                                                            </span>
                                                            <span
                                                                className="read-more-link"
                                                                style={{ display: 'none' }}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    const messageText = e.target.previousSibling;
                                                                    messageText.classList.toggle('message-expanded');
                                                                    e.target.textContent = messageText.classList.contains('message-expanded') ? 'Read less' : 'Read more';
                                                                }}
                                                            >
                                                                Read more
                                                            </span>
                                                        </div>
                                                        <div className="dashboard-skills-mini">
                                                            <span className="dashboard-skill-mini-tag dashboard-skill-offering">{request.offerSkill?.skill?.name}</span>
                                                            <span className="dashboard-swap-icon">⇌</span>
                                                            <span className="dashboard-skill-mini-tag dashboard-skill-wanting">{request.wantSkill?.skill?.name}</span>
                                                        </div>
                                                    </div>
                                                    <div className="dashboard-item-actions">
                                                        <div className={`${btnFrameClass} cursor-pointer`} onClick={() => handleViewDetails(request)}>
                                                            <div className={btnInnerClass}>
                                                                <span className={btnTextClass}>
                                                                    View details
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {request.status === "ACCEPTED" && (
                                                            <div
                                                                className={`${btnFrameClass} mark-complete-btn-custom`}
                                                                onClick={(e) => { e.stopPropagation(); handleMarkComplete(request.id); }}
                                                            >
                                                                <div className={btnInnerClass}>
                                                                    <span className={`${btnTextClass} mark-complete-text`}>
                                                                        {(isFromMe ? request.completed_by_from : request.completed_by_to) ? "Done" : "Mark as Complete"}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {(request.status === "ACCEPTED" || request.status === "COMPLETED") && request.chat_sessions?.[0] && (
                                                            <div
                                                                className={`${btnFrameClass} cursor-pointer`}
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    history.push(`/messages/${request.chat_sessions[0].id}`)
                                                                }}
                                                            >
                                                                <div className={btnInnerClass}>
                                                                    <span className={btnTextClass}>
                                                                        View Chat
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className={imgClass} style={{ backgroundImage: `url(${getImageUrl(otherUser.profile_pic_url, defaultProfilePic)})`, backgroundSize: 'cover' }}></div>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {showDetails && selectedRequest && (
                <div className="dashboard-modal-overlay" onClick={() => setShowDetails(false)}>
                    <div className="dashboard-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="dashboard-modal-header">
                            <h2 className="dashboard-modal-title">Request Details</h2>
                            <button className="dashboard-modal-close" onClick={() => setShowDetails(false)}>×</button>
                        </div>
                        <div className="dashboard-modal-body">
                            <div className="dashboard-detail-item">
                                <strong className="dashboard-detail-label">Requested By:</strong>
                                <span className="dashboard-detail-value">{selectedRequest.requestFrom.user_name}</span>
                            </div>
                            <div className="dashboard-detail-item">
                                <strong className="dashboard-detail-label">Requested To:</strong>
                                <span className="dashboard-detail-value">{selectedRequest.requestTo.user_name}</span>
                            </div>
                            <div className="dashboard-detail-item">
                                <strong className="dashboard-detail-label">Offering:</strong>
                                <span className="dashboard-skill-box">{selectedRequest.offerSkill.skill.name}</span>
                            </div>
                            <div className="dashboard-detail-item">
                                <strong className="dashboard-detail-label">Wanting:</strong>
                                <span className="dashboard-skill-box">{selectedRequest.wantSkill.skill.name}</span>
                            </div>
                            <div className="dashboard-detail-item">
                                <strong className="dashboard-detail-label">Message:</strong>
                                <p className="dashboard-message-box">{selectedRequest.message || "No message."}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Dashboard
