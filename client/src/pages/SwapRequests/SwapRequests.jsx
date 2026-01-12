import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { useGetUserSwapsQuery, useUpdateSwapStatusMutation } from "../../store/api/swapsApi";
import { getImageUrl } from "../../utils/imageUtils";
import defaultProfilePic from "../../assets/images/default-profile-pic.png";
import "./SwapRequests.css";

const SwapRequests = (props) => {
  const history = useHistory();
  const { user } = useSelector(state => state.auth);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Pending");

  const { data: swapsResponse, isLoading } = useGetUserSwapsQuery();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateSwapStatusMutation();

  const handleAccept = async (id) => {
    try {
      await updateStatus({ id, status: "ACCEPTED" }).unwrap();
      alert("Swap request accepted! You can now start chatting.");
    } catch (err) {
      alert("Failed to accept request: " + (err?.data?.message || err.message));
    }
  };

  const handleReject = async (id) => {
    try {
      if (window.confirm("Are you sure you want to reject this swap request?")) {
        await updateStatus({ id, status: "REJECTED" }).unwrap();
        alert("Swap request rejected.");
      }
    } catch (err) {
      alert("Failed to reject request: " + (err?.data?.message || err.message));
    }
  };

  const navigateToProfile = (userId) => {
    if (userId) history.push(`/feedbacks/${userId}`);
  };

  const allSwaps = swapsResponse?.data || [];
  const myReceivedRequests = allSwaps.filter(req => req.requestTo.id === user?.id);

  const filteredRequests = myReceivedRequests.filter((req) => {
    const requesterName = req.requestFrom.user_name || "";
    const matchesSearch = requesterName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = req.status === "PENDING";
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="screen17-container1">
      <Helmet>
        <title>Swap Requests - Skill Swap</title>
      </Helmet>
      <div className="screen17-thq-screen17-elm">
        <div className="screen17-thq-depth1-frame0-elm">
          <div className="screen17-thq-depth2-frame1-elm">
            <div className="screen17-thq-depth3-frame0-elm2">
              <div className="screen17-thq-depth4-frame0-elm3">
                <div className="screen17-thq-depth5-frame0-elm10">
                  <span className="screen17-thq-text-elm11">Pending Swap Requests</span>
                </div>
              </div>
              <div className="screen17-thq-depth4-frame1-elm2">
                <div className="screen17-thq-depth5-frame0-elm11">
                  <div className="screen17-thq-depth6-frame0-elm10">
                    <div className="screen17-thq-depth7-frame0-elm10">
                      <img
                        src="/depth8frame0942-gdpp.svg"
                        alt="Depth8Frame0942"
                        className="screen17-thq-depth8-frame0-elm"
                      />
                    </div>
                    <div className="screen17-thq-depth7-frame1-elm1">
                      <input
                        type="text"
                        placeholder="Search by requester name"
                        className="screen17-thq-text-elm12 swap-search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {isLoading ? (
                <div className="swap-list-loading">Loading requests...</div>
              ) : filteredRequests.length === 0 ? (
                <div className="swap-list-empty">No {statusFilter.toLowerCase()} requests found.</div>
              ) : (
                filteredRequests.map((request, index) => {
                  const avatarClass = `screen17-thq-depth6-frame0-elm${12 + (index % 4) * 3}`;
                  return (
                    <React.Fragment key={request.id}>
                      <div className="screen17-thq-depth4-frame3-elm">
                        <div className="screen17-thq-depth5-frame0-elm13">
                          <div
                            className={`${avatarClass} cursor-pointer`}
                            onClick={() => navigateToProfile(request.requestFrom.id)}
                            style={{
                              backgroundImage: `url(${getImageUrl(request.requestFrom.profile_pic_url, defaultProfilePic)})`,
                              backgroundSize: 'cover'
                            }}
                          ></div>
                          <div className="screen17-thq-depth6-frame1-elm2">
                            <div className="screen17-thq-depth7-frame0-elm12">
                              <span
                                className="screen17-thq-text-elm14 cursor-pointer"
                                onClick={() => navigateToProfile(request.requestFrom.id)}
                              >
                                {request.requestFrom.user_name}
                              </span>
                            </div>
                            <div className="screen17-thq-depth7-frame1-elm2">
                              <span className="screen17-thq-text-elm15 italic-text message-text">
                                "{request.message || "Hi, I'd like to swap skills with you!"}"
                              </span>
                              <span
                                className="read-more-link"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.target.previousSibling.classList.toggle('message-expanded');
                                  e.target.textContent = e.target.textContent === 'Read more' ? 'Read less' : 'Read more';
                                }}
                              >
                                Read more
                              </span>
                            </div>
                            <div className="screen17-thq-depth7-frame2-elm1">
                              <span className="screen17-thq-text-elm16">
                                Offers: {request.offerSkill?.skill?.name}, Wants: {request.wantSkill?.skill?.name}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="screen17-thq-depth5-frame1-elm2">
                          <div className="screen17-thq-depth6-frame0-elm13">
                            <div
                              className={`screen17-thq-depth7-frame0-elm13 ${request.status === "ACCEPTED" ? "status-dot-accepted" :
                                request.status === "REJECTED" ? "status-dot-rejected" : "status-dot-pending"
                                }`}
                            ></div>
                          </div>
                        </div>
                        {request.status === "PENDING" ? (
                          <div className="screen17-thq-depth4-frame4-elm">
                            <div className="screen17-thq-depth5-frame0-elm14">
                              <div
                                className={`screen17-thq-depth6-frame0-elm14 cursor-pointer ${isUpdating ? 'action-btn-disabled' : ''}`}
                                onClick={() => handleReject(request.id)}
                              >
                                <div className="screen17-thq-depth7-frame0-elm14">
                                  <span className="screen17-thq-text-elm17">Reject</span>
                                </div>
                              </div>
                              <div
                                className={`screen17-thq-depth6-frame1-elm3 cursor-pointer ${isUpdating ? 'action-btn-disabled' : ''}`}
                                onClick={() => handleAccept(request.id)}
                              >
                                <div className="screen17-thq-depth7-frame0-elm15">
                                  <span className="screen17-thq-text-elm18">Accept</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="screen17-thq-depth4-frame4-elm">
                            <div className="screen17-thq-depth5-frame0-elm14">
                              <span className="screen17-thq-text-elm15">
                                Status: {request.status}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </React.Fragment>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default SwapRequests;
