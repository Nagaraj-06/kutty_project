import React from "react";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import "./UserFeedbacks.css";

const UserFeedbacks = (props) => {
  const history = useHistory();

  const navigate = (path) => {
    // console.log(`Navigating to: ${path}`);
    history.push(path);
    // In a real app, you'd use: history.push(path)
  };

  const feedbacks = [
    {
      name: "Emily Davis",
      time: "2 days ago",
      stars: 5,
      text: "Great experience swapping skills with Michael! Very professional and knowledgeable.",
    },
    {
      name: "Daniel Wilson",
      time: "1 week ago",
      stars: 5,
      text: "Highly recommended! Learned a lot about Project Management.",
    },
    {
      name: "Sarah Johnson",
      time: "2 weeks ago",
      stars: 5,
      text: "Michael is a fantastic mentor. Patient and clear in explanations.",
    },
  ];
  return (
    <div className="screen7-container1">
      <Helmet>
        <title>UserFeedbacks - Skill Swap</title>
        <meta property="og:title" content="UserFeedbacks - Skill Swap" />
      </Helmet>
      <div className="screen7-thq-screen7-elm">
        <div className="screen7-thq-depth1-frame0-elm">
          <div className="screen7-thq-depth2-frame0-elm">
            <div className="screen7-thq-depth3-frame0-elm1">
              <div className="screen7-thq-depth4-frame0-elm1">
                <img
                  src={require("../../assets/images/depth5frame22114-nnnv.svg")}
                  alt="Depth5Frame12228"
                  className="screen7-thq-depth5-frame1-elm1"
                />
              </div>
              <div className="screen7-thq-depth4-frame1-elm1">
                <span className="screen7-thq-text-elm10">
                  Skill Swap Platform
                </span>
              </div>
            </div>
            <div className="screen7-thq-depth3-frame1-elm">
              <div
                className="screen7-thq-depth4-frame1-elm2"
                onClick={() => navigate("/profile")}
                style={{ cursor: "pointer" }}
              ></div>
            </div>
          </div>
          <div className="screen7-thq-depth2-frame1-elm">
            <div className="screen7-thq-depth3-frame0-elm2">
              <div className="screen7-thq-depth4-frame0-elm2">
                <div className="screen7-thq-depth5-frame0-elm1">
                  <div className="screen7-thq-depth6-frame2-elm1">
                    <div className="screen7-thq-depth7-frame0-elm1">
                      <div
                        className="screen7-thq-depth8-frame0-elm10"
                        onClick={() => navigate("/profile")}
                        style={{ cursor: "pointer" }}
                      ></div>
                      <div className="screen7-thq-depth7-frame1-elm1">
                        <div className="screen7-thq-depth8-frame0-elm11">
                          <span
                            className="screen7-thq-text-elm11"
                            onClick={() => navigate("/profile")}
                            style={{ cursor: "pointer" }}
                          >
                            Michael Smith
                          </span>
                        </div>
                        <div className="screen7-thq-depth8-frame1-elm1">
                          <span className="screen7-thq-text-elm12">
                            Skills Offered: Project Management | Skills Wanted:
                            UI/UX Design
                          </span>
                          <span className="screen7-rating">
                            Rating: 4.7 (200 reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="screen7-thq-depth6-frame1-elm1"
                    onClick={() => navigate("/swap-request-form")}
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
                {feedbacks.map((feedback, index) => (
                  <div
                    className={`screen7-thq-depth5-frame${index}-elm${index === 2 ? "" : "2"
                      }`}
                    key={index}
                  >
                    <div
                      className={`screen7-thq-depth6-frame0-elm${index + 1}`}
                    >
                      <div
                        className={`screen7-thq-depth7-frame0-elm${3 + index * 2
                          }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/profile");
                        }}
                        style={{ cursor: "pointer" }}
                      ></div>

                      <div className="screen7-thq-depth7-frame1-elm2">
                        <div
                          className={`screen7-thq-depth8-frame0-elm${12 + index * 6
                            }`}
                        >
                          <span
                            className={`screen7-thq-text-elm${17 + index * 3} screen7-username-clickable`}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate("/profile");
                            }}
                          >
                            {feedback.name}
                          </span>
                        </div>
                        <div
                          className={`screen7-thq-depth8-frame1-elm${2 + index
                            }`}
                        >
                          <span
                            className={`screen7-thq-text-elm${18 + index * 3}`}
                          >
                            {feedback.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`screen7-thq-depth6-frame1-elm${2 + index}`}
                    >
                      <span className="screen7-stars">
                        {"★".repeat(feedback.stars)}
                      </span>
                    </div>
                    <div
                      className={`screen7-thq-depth6-frame2-elm${2 + index}`}
                    >
                      <span className={`screen7-thq-text-elm${19 + index * 3}`}>
                        {feedback.text}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserFeedbacks;
