import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";

import "./SwapRequestForm.css";

const SwapRequestForm = (props) => {
  const history = useHistory();
  const [selectedOfferedSkill, setSelectedOfferedSkill] = useState("");
  const [selectedWantedSkill, setSelectedWantedSkill] = useState("");
  const [message, setMessage] = useState("");

  const offerSkills = [
    "Graphic Design",
    "Web Development",
    "Photography",
    "Marketing",
  ];
  const waitingSkills = [
    "Copywriting",
    "Data Analysis",
    "UI/UX Design",
    "Project Management",
  ];

  const handleSubmit = () => {
    console.log({
      selectedOfferedSkill,
      selectedWantedSkill,
      message,
    });
  };
  return (
    <div className="screen13-container1">
      <Helmet>
        <title>SwapRequestForm - Skill Swap</title>
        <meta property="og:title" content="SwapRequestForm - Skill Swap" />
      </Helmet>
      <div className="screen13-thq-screen13-elm">
        <div className="screen13-thq-depth1-frame0-elm">
          <div className="screen13-thq-depth2-frame1-elm">
            <div className="screen13-thq-depth3-frame0-elm2">
              <div className="screen13-thq-depth4-frame0-elm">
                <div className="screen13-thq-depth5-frame0-elm2">
                  <span className="screen13-thq-text-elm2">
                    Skill Swap Request Form
                  </span>
                </div>
              </div>
              <div className="screen13-thq-depth4-frame1-elm2">
                <div className="screen13-thq-depth5-frame0-elm3">
                  <div className="screen13-thq-depth6-frame0-elm1">
                    <span className="screen13-thq-text-elm3">
                      Choose one of your offered skills
                    </span>
                  </div>
                  <div className="screen13-thq-depth6-frame1-elm1">
                    <select
                      value={selectedOfferedSkill}
                      onChange={(e) => setSelectedOfferedSkill(e.target.value)}
                    >
                      <option value="">Select a skill</option>
                      {offerSkills.map((skill) => (
                        <option key={skill} value={skill}>
                          {skill}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="screen13-thq-depth4-frame2-elm2">
                <div className="screen13-thq-depth5-frame0-elm4">
                  <div className="screen13-thq-depth6-frame0-elm2">
                    <span className="screen13-thq-text-elm5">
                      Choose one of their wanted skills
                    </span>
                  </div>
                  <div className="screen13-thq-depth6-frame1-elm2">
                    <select
                      value={selectedWantedSkill}
                      onChange={(e) => setSelectedWantedSkill(e.target.value)}
                    >
                      <option value="">Select a skill</option>
                      {waitingSkills.map((skill) => (
                        <option key={skill} value={skill}>
                          {skill}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="screen13-thq-depth4-frame3-elm">
                <div className="screen13-thq-depth5-frame0-elm5">
                  <div className="screen13-thq-depth6-frame0-elm3">
                    <span className="screen13-thq-text-elm7">Message</span>
                  </div>
                  <div className="screen13-thq-depth6-frame1-elm3">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Enter your message"
                      className="message-textarea"
                    />
                  </div>
                </div>
              </div>
              <div className="screen13-thq-depth4-frame4-elm">
                <div
                  className="screen13-thq-depth5-frame0-elm6"
                  onClick={handleSubmit}
                >
                  <div className="screen13-thq-depth6-frame0-elm4">
                    <span className="screen13-thq-text-elm8">Submit</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapRequestForm;
