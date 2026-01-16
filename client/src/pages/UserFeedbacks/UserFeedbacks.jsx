import React from "react";
import { Helmet } from "react-helmet";
import { useHistory, useParams } from "react-router-dom";
import "./UserFeedbacks.css";
import { useGetUserPublicProfileQuery } from "../../store/api/userApi";
import { useGetFeedbacksQuery } from "../../store/api/feedbackApi";
import { getImageUrl } from "../../utils/imageUtils";
import defaultProfilePic from "../../assets/images/default-profile-pic.png";

const UserFeedbacks = (props) => {
  const history = useHistory();
  const { userId } = useParams();

  const { data: profileResponse, isLoading: profileLoading } = useGetUserPublicProfileQuery(userId);
  const { data: feedbackResponse, isLoading: feedbackLoading } = useGetFeedbacksQuery({ userId });

  const navigate = (path) => {
    history.push(path);
  };

  if (profileLoading || feedbackLoading) return <div className="loading">Loading feedbacks...</div>;

  const profile = profileResponse?.data;
  const feedbacks = feedbackResponse?.data || [];

  const user = profile?.user || {};
  const skills = profile?.skills || [];
  const skillsOffered = skills.filter(s => s.skill_type === "OFFERING").map(s => s.skill_name).join(", ") || "None";
  const skillsWanted = skills.filter(s => s.skill_type === "WANTED").map(s => s.skill_name).join(", ") || "None";

  // Calculate average rating if not provided by backend
  const averageRating = feedbacks.length > 0
    ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length).toFixed(1)
    : "0.0";

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  return (
    <div className="screen7-container1">
      <Helmet>
        <title>Feedbacks - Skill Swap</title>
      </Helmet>
      <div className="user-feedback-wrapper">
        <div className="screen7-thq-depth4-frame0-elm2">
          <div className="screen7-thq-depth5-frame0-elm1">
            <div className="screen7-thq-depth6-frame2-elm1">
              <div className="screen7-thq-depth7-frame0-elm1">
                <div
                  className="screen7-thq-depth8-frame0-elm10"
                  style={{
                    backgroundImage: `url(${getImageUrl(user.profile_pic_url, defaultProfilePic)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                ></div>
                <div className="screen7-thq-depth7-frame1-elm1">
                  <div className="screen7-thq-depth8-frame0-elm11">
                    <span className="screen7-thq-text-elm11">
                      {user.user_name || "User"}
                    </span>
                  </div>
                  <div className="screen7-thq-depth8-frame1-elm1">
                    <span className="screen7-thq-text-elm12">
                      Skills Offered: {skillsOffered} | Skills Wanted: {skillsWanted}
                    </span>
                    <span className="screen7-rating">
                      Rating: {averageRating} ({feedbacks.length} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="screen7-thq-depth6-frame1-elm1"
              onClick={() => navigate(`/swap-request-form/${userId}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="screen7-thq-depth7-frame0-elm2">
                <span className="screen7-thq-text-elm15">Request</span>
              </div>
            </div>
          </div>
        </div>
        <div className="screen7-thq-depth4-frame1-elm3">
          <span className="screen7-thq-text-elm16">Feedback</span>
        </div>
        <div className="screen7-thq-depth4-frame2-elm">
          {feedbacks.length === 0 ? (
            <div className="no-feedbacks">No feedbacks yet for this user.</div>
          ) : (
            feedbacks.map((feedback, index) => (
              <div
                className={`feedback-item`}
                key={feedback.id}
                style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}
              >
                <div className="screen7-thq-depth6-frame0-elm">
                  <div
                    className="screen7-feedback-avatar cursor-pointer"
                    onClick={() => feedback.givenBy?.id && history.push(`/profile/${feedback.givenBy.id}`)}
                    style={{
                      backgroundImage: `url(${getImageUrl(feedback.givenBy?.profile_pic_url, defaultProfilePic)})`,
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundSize: 'cover',
                      marginRight: '12px',
                      cursor: 'pointer'
                    }}
                  ></div>

                  <div className="screen7-thq-depth7-frame1-elm2">
                    <div className="screen7-thq-depth8-frame0-elm cursor-pointer"
                      onClick={() => feedback.givenBy?.id && history.push(`/profile/${feedback.givenBy.id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <span className="screen7-thq-text-elm17 screen7-username-clickable">
                        {feedback.givenBy?.user_name || "Anonymous"}
                      </span>
                    </div>
                    <div className="screen7-thq-depth8-frame1-elm">
                      <span className="screen7-thq-text-elm18">
                        {formatRelativeTime(feedback.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="screen7-thq-depth6-frame1-elm">
                  <span className="screen7-stars">
                    {"★".repeat(feedback.rating)}{"☆".repeat(5 - feedback.rating)}
                  </span>
                </div>
                <div className="screen7-thq-depth6-frame2-elm">
                  <span className="screen7-thq-text-elm19">
                    {feedback.feedback_text}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserFeedbacks;

