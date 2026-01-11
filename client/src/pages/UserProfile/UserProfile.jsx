import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import "./UserProfile.css";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const UserProfile = () => {
  const history = useHistory();

  const [userData, setUserData] = useState({
    name: "Sarah Miller",
    location: "Sathyamangalam",
    skillsOffered: ["Graphic Design", "Photography", "Social Media Marketing"],
    skillsWanted: ["Web Development", "Data Analysis"],
    slots: [
      {
        day_of_week: "MON",
        from_time: "2025-09-08T10:00:00Z",
        to_time: "2025-09-08T12:00:00Z",
      },
      {
        day_of_week: "WED",
        from_time: "2025-09-10T18:00:00Z",
        to_time: "2025-09-10T20:00:00Z",
      },
    ],
    profileVisibility: "public",
    availability: "",
    profileImage: require("../../assets/images/tq_vrm9rvrj0t-u3e9-200h.png"),
  });

  const [originalData, setOriginalData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [showSlotPicker, setShowSlotPicker] = useState(false);
  const [newSlot, setNewSlot] = useState({
    day_of_week: "MON",
    from_time: "",
    to_time: "",
  });
  const [showAddSkillOffered, setShowAddSkillOffered] = useState(false);
  const [showAddSkillWanted, setShowAddSkillWanted] = useState(false);

  // Skills master array
  const skillsMaster = [
    "Graphic Design",
    "Photography",
    "Social Media Marketing",
    "Web Development",
    "Data Analysis",
    "Content Writing",
    "Video Editing",
    "UI/UX Design",
    "Digital Marketing",
    "Mobile App Development",
    "Python Programming",
    "JavaScript",
    "Project Management",
    "SEO",
    "Copywriting",
    "Illustration",
    "3D Modeling",
    "Animation",
    "Public Speaking",
    "Teaching/Tutoring",
  ];

  useEffect(() => {
    setOriginalData(JSON.parse(JSON.stringify(userData)));
  }, []);

  useEffect(() => {
    if (originalData) {
      const changed = JSON.stringify(userData) !== JSON.stringify(originalData);
      setHasChanges(changed);
    }
  }, [userData, originalData]);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getDayName = (dayCode) => {
    const days = {
      MON: "Monday",
      TUE: "Tuesday",
      WED: "Wednesday",
      THU: "Thursday",
      FRI: "Friday",
      SAT: "Saturday",
      SUN: "Sunday",
    };
    return days[dayCode] || dayCode;
  };

  const handleSave = () => {
    console.log("Saved Profile Data:", userData);
    setOriginalData(JSON.parse(JSON.stringify(userData)));
    setHasChanges(false);
  };

  const handleVisibilityChange = (visibility) => {
    setUserData((prev) => ({ ...prev, profileVisibility: visibility }));
  };

  const removeSlot = (index) => {
    setUserData((prev) => ({
      ...prev,
      slots: prev.slots.filter((_, i) => i !== index),
    }));
  };

  const addSlot = () => {
    if (newSlot.from_time && newSlot.to_time) {
      const fromDate = new Date();
      const toDate = new Date();
      const [fromHour, fromMin] = newSlot.from_time.split(":");
      const [toHour, toMin] = newSlot.to_time.split(":");

      fromDate.setHours(parseInt(fromHour), parseInt(fromMin), 0, 0);
      toDate.setHours(parseInt(toHour), parseInt(toMin), 0, 0);

      setUserData((prev) => ({
        ...prev,
        slots: [
          ...prev.slots,
          {
            day_of_week: newSlot.day_of_week,
            from_time: fromDate.toISOString(),
            to_time: toDate.toISOString(),
          },
        ],
      }));

      setNewSlot({ day_of_week: "MON", from_time: "", to_time: "" });
      setShowSlotPicker(false);
    }
  };

  const removeSkillOffered = (index) => {
    setUserData((prev) => ({
      ...prev,
      skillsOffered: prev.skillsOffered.filter((_, i) => i !== index),
    }));
  };

  const removeSkillWanted = (index) => {
    setUserData((prev) => ({
      ...prev,
      skillsWanted: prev.skillsWanted.filter((_, i) => i !== index),
    }));
  };

  const addSkillOffered = (skill) => {
    if (skill && !userData.skillsOffered.includes(skill)) {
      setUserData((prev) => ({
        ...prev,
        skillsOffered: [...prev.skillsOffered, skill],
      }));
      setShowAddSkillOffered(false);
    }
  };

  const addSkillWanted = (skill) => {
    if (skill && !userData.skillsWanted.includes(skill)) {
      setUserData((prev) => ({
        ...prev,
        skillsWanted: [...prev.skillsWanted, skill],
      }));
      setShowAddSkillWanted(false);
    }
  };

  const getAvailableSkillsForOffering = () => {
    return skillsMaster.filter(
      (skill) => !userData.skillsOffered.includes(skill)
    );
  };

  const getAvailableSkillsForWanting = () => {
    return skillsMaster.filter(
      (skill) => !userData.skillsWanted.includes(skill)
    );
  };

  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prev) => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const navigate = (path) => {
    // console.log(`Navigating to: ${path}`);
    history.push(path);
    // In a real app, you'd use: history.push(path)
  };

  return (
    <div className="screen6-container1">
      <Helmet>
        <title>UserProfile - Skill Swap</title>
        <meta property="og:title" content="UserProfile - Skill Swap" />
      </Helmet>
      <div className="screen6-thq-screen6-elm">
        <div className="screen6-thq-depth1-frame0-elm">
          <div className="screen6-thq-depth2-frame0-elm">
            <div className="screen6-thq-depth3-frame0-elm1">
              <img
                src="/depth5frame02113-hgr.svg"
                alt="Depth5Frame02113"
                className="screen6-thq-depth5-frame0-elm1"
              />
              <div className="screen6-thq-depth4-frame1-elm1">
                <span className="screen6-thq-text-elm10">
                  Skill Swap Platform
                </span>
              </div>
            </div>
            <div className="screen6-thq-depth3-frame1-elm">
              <div className="screen6-thq-depth4-frame0-elm1">
                <div className="screen6-thq-depth5-frame0-elm2">
                  <span
                    className="screen6-thq-text-elm11"
                    onClick={() => navigate("/")}
                    style={{ cursor: "pointer" }}
                  >
                    Home
                  </span>
                </div>
              </div>
              <div
                className="screen6-thq-depth4-frame1-elm2"
                onClick={() => navigate("/swap-requests")}
                style={{ cursor: "pointer" }}
              >
                <div className="screen6-thq-depth5-frame0-elm3">
                  <span className="screen6-thq-text-elm12">Swap Request</span>
                </div>
              </div>
              <div
                className="screen6-thq-depth4-frame2-elm1"
                onClick={() => navigate("/profile")}
                style={{ cursor: "pointer" }}
              ></div>
            </div>
          </div>
          <div className="screen6-thq-depth2-frame1-elm">
            <div className="screen6-thq-depth3-frame0-elm2">
              <div className="screen6-thq-depth4-frame0-elm2">
                <div className="screen6-thq-depth5-frame0-elm4">
                  <span className="screen6-thq-text-elm13">User Profile</span>
                </div>
                {hasChanges && (
                  <div
                    className="screen6-thq-depth5-frame1-elm1"
                    onClick={handleSave}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="screen6-thq-depth6-frame0-elm10">
                      <span className="screen6-thq-text-elm14">Save</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="screen6-thq-depth4-frame1-elm3">
                <div className="screen6-thq-depth5-frame0-elm5">
                  <div className="screen6-thq-depth6-frame0-elm11">
                    <div
                      className="screen6-profile-image-wrapper"
                      onClick={() => fileInputRef.current.click()}
                      title="Change Profile Photo"
                    >
                      <div
                        className="screen6-thq-depth7-frame0-elm1"
                        style={{ backgroundImage: `url(${userData.profileImage})` }}
                      ></div>
                      <div className="screen6-profile-image-edit-overlay">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="screen6-profile-image-input"
                        style={{ display: "none" }}
                      />
                    </div>
                    <div className="screen6-thq-depth7-frame1-elm">
                      <div className="screen6-thq-depth8-frame0-elm">
                        <span className="screen6-thq-text-elm15">
                          {userData.name}
                        </span>
                      </div>
                      <div className="screen6-thq-depth8-frame1-elm">
                        <span className="screen6-thq-text-elm16">
                          Location: {userData.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Offered */}
              <div className="screen6-thq-depth4-frame2-elm2">
                <span className="screen6-thq-text-elm17">Skills Offered</span>
              </div>
              <div className="screen6-thq-depth4-frame3-elm">
                {userData.skillsOffered.map((skill, index) => (
                  <div key={index} className="screen6-skill-tag">
                    <div className="screen6-thq-depth6-frame0-elm12">
                      <span className="screen6-thq-text-elm18">{skill}</span>
                    </div>
                    <button
                      onClick={() => removeSkillOffered(index)}
                      className="screen6-skill-remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {!showAddSkillOffered ? (
                  <button
                    onClick={() => setShowAddSkillOffered(true)}
                    className="screen6-add-skill-btn"
                    disabled={getAvailableSkillsForOffering().length === 0}
                  >
                    + Add Skill
                  </button>
                ) : (
                  <div className="screen6-skill-dropdown-wrapper">
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          addSkillOffered(e.target.value);
                        }
                      }}
                      className="screen6-skill-select"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select a skill
                      </option>
                      {getAvailableSkillsForOffering().map((skill, index) => (
                        <option key={index} value={skill}>
                          {skill}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => setShowAddSkillOffered(false)}
                      className="screen6-add-skill-cancel"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              {/* Skills Wanted */}
              <div className="screen6-thq-depth4-frame4-elm">
                <span className="screen6-thq-text-elm21">Skills Wanted</span>
              </div>
              <div className="screen6-thq-depth4-frame5-elm">
                {userData.skillsWanted.map((skill, index) => (
                  <div key={index} className="screen6-skill-tag">
                    <div className="screen6-thq-depth6-frame0-elm15">
                      <span className="screen6-thq-text-elm22">{skill}</span>
                    </div>
                    <button
                      onClick={() => removeSkillWanted(index)}
                      className="screen6-skill-remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {!showAddSkillWanted ? (
                  <button
                    onClick={() => setShowAddSkillWanted(true)}
                    className="screen6-add-skill-btn"
                    disabled={getAvailableSkillsForWanting().length === 0}
                  >
                    + Add Skill
                  </button>
                ) : (
                  <div className="screen6-skill-dropdown-wrapper">
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          addSkillWanted(e.target.value);
                        }
                      }}
                      className="screen6-skill-select"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select a skill
                      </option>
                      {getAvailableSkillsForWanting().map((skill, index) => (
                        <option key={index} value={skill}>
                          {skill}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => setShowAddSkillWanted(false)}
                      className="screen6-add-skill-cancel"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              {/* Availability */}
              <div className="screen6-thq-depth4-frame6-elm">
                <span className="screen6-thq-text-elm24">Availability</span>
              </div>
              <div className="screen6-thq-depth4-frame7-elm">
                <div className="screen6-thq-depth5-frame0-elm8">
                  <div className="screen6-availability-slots">
                    {userData.slots.map((slot, index) => (
                      <div key={index} className="screen6-slot-item">
                        <div className="screen6-slot-content">
                          <div className="screen6-slot-day">
                            {getDayName(slot.day_of_week)}
                          </div>
                          <div className="screen6-slot-time">
                            {formatTime(slot.from_time)} -{" "}
                            {formatTime(slot.to_time)}
                          </div>
                        </div>
                        <button
                          onClick={() => removeSlot(index)}
                          className="screen6-slot-remove"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  {!showSlotPicker ? (
                    <button
                      onClick={() => setShowSlotPicker(true)}
                      className="screen6-add-slot-btn"
                    >
                      + Add Time Slot
                    </button>
                  ) : (
                    <div className="screen6-slot-picker">
                      <div className="screen6-slot-picker-field">
                        <label className="screen6-slot-label">Day</label>
                        <select
                          value={newSlot.day_of_week}
                          onChange={(e) =>
                            setNewSlot((prev) => ({
                              ...prev,
                              day_of_week: e.target.value,
                            }))
                          }
                          className="screen6-slot-select"
                        >
                          <option value="MON">Monday</option>
                          <option value="TUE">Tuesday</option>
                          <option value="WED">Wednesday</option>
                          <option value="THU">Thursday</option>
                          <option value="FRI">Friday</option>
                          <option value="SAT">Saturday</option>
                          <option value="SUN">Sunday</option>
                        </select>
                      </div>
                      <div className="screen6-slot-picker-times">
                        <div className="screen6-slot-picker-field">
                          <label className="screen6-slot-label">From</label>
                          <input
                            type="time"
                            value={newSlot.from_time}
                            onChange={(e) =>
                              setNewSlot((prev) => ({
                                ...prev,
                                from_time: e.target.value,
                              }))
                            }
                            className="screen6-slot-input"
                          />
                        </div>
                        <div className="screen6-slot-picker-field">
                          <label className="screen6-slot-label">To</label>
                          <input
                            type="time"
                            value={newSlot.to_time}
                            onChange={(e) =>
                              setNewSlot((prev) => ({
                                ...prev,
                                to_time: e.target.value,
                              }))
                            }
                            className="screen6-slot-input"
                          />
                        </div>
                      </div>
                      <div className="screen6-slot-picker-actions">
                        <button
                          onClick={addSlot}
                          className="screen6-slot-add-btn"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => setShowSlotPicker(false)}
                          className="screen6-slot-cancel-btn"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Visibility */}
              <div className="screen6-thq-depth4-frame8-elm">
                <span className="screen6-thq-text-elm26">
                  Profile Visibility
                </span>
              </div>
              <div className="screen6-thq-depth4-frame9-elm">
                <label className="screen6-thq-depth5-frame0-elm9">
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={userData.profileVisibility === "public"}
                    onChange={(e) => handleVisibilityChange(e.target.value)}
                    className="screen6-radio-input"
                  />
                  <div className="screen6-thq-depth6-frame1-elm2">
                    <div className="screen6-thq-depth7-frame0-elm2">
                      <span className="screen6-thq-text-elm27">Public</span>
                    </div>
                  </div>
                </label>
                <label className="screen6-thq-depth5-frame1-elm4">
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    checked={userData.profileVisibility === "private"}
                    onChange={(e) => handleVisibilityChange(e.target.value)}
                    className="screen6-radio-input"
                  />
                  <div className="screen6-thq-depth6-frame1-elm3">
                    <div className="screen6-thq-depth7-frame0-elm3">
                      <span className="screen6-thq-text-elm28">Private</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
