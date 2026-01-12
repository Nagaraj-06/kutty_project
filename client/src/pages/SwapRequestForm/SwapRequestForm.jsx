import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useHistory, useParams } from "react-router-dom";
import { useGetUserProfileQuery, useGetUserPublicProfileQuery } from "../../store/api/userApi";
import { useCreateSwapMutation } from "../../store/api/swapsApi";
import "./SwapRequestForm.css";

const SwapRequestForm = (props) => {
  const history = useHistory();
  const { userId } = useParams(); // Target user's ID

  const [selectedOfferedSkillId, setSelectedOfferedSkillId] = useState("");
  const [selectedWantedSkillId, setSelectedWantedSkillId] = useState("");
  const [message, setMessage] = useState("");

  const { data: currentUserProfile, isLoading: currentLoading } = useGetUserProfileQuery();
  const { data: targetUserProfile, isLoading: targetLoading } = useGetUserPublicProfileQuery(userId);
  const [createSwap, { isLoading: isSubmitting }] = useCreateSwapMutation();

  const handleSubmit = async () => {
    if (!selectedOfferedSkillId || !selectedWantedSkillId) {
      alert("Please select both an offered skill and a wanted skill.");
      return;
    }

    try {
      await createSwap({
        request_to: userId,
        offer_user_skill_id: selectedOfferedSkillId,
        want_user_skill_id: selectedWantedSkillId,
        message: message || "Let's swap skills!"
      }).unwrap();

      alert("Swap request sent successfully!");
      history.push("/dashboard");
    } catch (err) {
      console.error("Failed to create swap request:", err);
      alert(err?.data?.message || "Failed to send swap request. Ensure mutual skills match.");
    }
  };

  if (currentLoading || targetLoading) return <div className="loading">Loading form...</div>;

  const myOfferSkills = currentUserProfile?.data?.skills?.filter(s => s.skill_type === "OFFERING") || [];
  const theirOfferSkills = targetUserProfile?.data?.skills?.filter(s => s.skill_type === "OFFERING") || [];

  // To match the backend req: createSwapRequest expects:
  // offer_user_skill_id: id of current user skill (OFFERING) that they want to offer
  // want_user_skill_id: id of current user skill (WANTED) that they want help with 
  // IMPORTANT: The backend THEN checks if the target user HAS those skills in inverse.

  const myWantSkills = currentUserProfile?.data?.skills?.filter(s => s.skill_type === "WANTED") || [];

  return (
    <div className="screen13-container1">
      <Helmet>
        <title>Swap Request - Skill Swap</title>
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
                      value={selectedOfferedSkillId}
                      onChange={(e) => setSelectedOfferedSkillId(e.target.value)}
                      className="skill-select"
                    >
                      <option value="">Select a skill</option>
                      {myOfferSkills.map((s) => (
                        <option key={s.user_skill_id} value={s.user_skill_id}>
                          {s.skill_name}
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
                      Choose what you want in return
                    </span>
                  </div>
                  <div className="screen13-thq-depth6-frame1-elm2">
                    <select
                      value={selectedWantedSkillId}
                      onChange={(e) => setSelectedWantedSkillId(e.target.value)}
                      className="skill-select"
                    >
                      <option value="">Select a skill</option>
                      {myWantSkills.map((s) => (
                        <option key={s.user_skill_id} value={s.user_skill_id}>
                          {s.skill_name}
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
                      placeholder="Let's swap skills! I can help you with my expertise."
                      className="message-textarea"
                    />
                  </div>
                </div>
              </div>

              <div className="screen13-thq-depth4-frame4-elm">
                <div
                  className={`screen13-thq-depth5-frame0-elm6 ${isSubmitting ? 'submitting' : ''}`}
                  onClick={!isSubmitting ? handleSubmit : null}
                  style={{ cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                >
                  <div className="screen13-thq-depth6-frame0-elm4">
                    <span className="screen13-thq-text-elm8">
                      {isSubmitting ? "Sending..." : "Submit Request"}
                    </span>
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

