import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import "./UserProfile.css";
import { useHistory } from "react-router-dom";
import { useGetSkillsQuery } from "../../store/api/skillsApi";
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from "../../store/api/userApi";
import defaultProfilePic from "../../assets/images/default-profile-pic.png";
import { getImageUrl } from "../../utils/imageUtils";
import { useDispatch } from 'react-redux';
import { updateUserInfo } from '../../store/slices/authSlice';

const UserProfile = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { data: skillsData, isLoading: skillsLoading } = useGetSkillsQuery();
  const { data: profileResponse, isLoading: profileLoading, refetch } = useGetUserProfileQuery();
  const [updateProfile, { isLoading: updating }] = useUpdateUserProfileMutation();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    bio: "",
    skillsOffered: [],
    skillsWanted: [],
    slots: [],
    profileVisibility: "PUBLIC",
    profileImage: null,
    selectedFile: null,
    previewUrl: null,
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

  // Skills master array from API
  const skillsMaster = skillsData?.data || [];

  useEffect(() => {
    if (profileResponse?.success && profileResponse?.data) {
      const { user, availability, skills } = profileResponse.data;

      const fetchedData = {
        name: user.user_name || "User",
        email: user.email || "",
        bio: user.bio || "",
        skillsOffered: skills?.filter(s => s.skill_type === "OFFERING") || [],
        skillsWanted: skills?.filter(s => s.skill_type === "WANTED") || [],
        slots: availability || [],
        profileVisibility: user.profile_visibility || "PUBLIC",
        profileImage: user.profile_pic_url || null,
      };

      setUserData(fetchedData);
      setOriginalData(fetchedData);

      // Sync auth state with fetched profile name and picture
      dispatch(updateUserInfo({
        user_name: user.user_name,
        profile_pic_url: user.profile_pic_url
      }));
    }
  }, [profileResponse, dispatch]);

  useEffect(() => {
    if (originalData) {
      const changed = JSON.stringify(userData) !== JSON.stringify(originalData);
      setHasChanges(changed);
    }
  }, [userData, originalData]);

  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (e) {
      return dateString;
    }
  };

  const getDayName = (dayCode) => {
    const days = {
      MON: "Monday",
      TUES: "Tuesday",
      WED: "Wednesday",
      THURS: "Thursday",
      FRI: "Friday",
      SAT: "Saturday",
      SUN: "Sunday",
    };
    return days[dayCode] || dayCode;
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("bio", userData.bio || "");
      formData.append("profile_visibility", userData.profileVisibility);

      const slotsPayload = userData.slots.map(s => ({
        day_of_week: s.day_of_week,
        from_time: s.from_time,
        to_time: s.to_time
      }));
      formData.append("slots", JSON.stringify(slotsPayload));

      const skillsPayload = [
        ...userData.skillsOffered.map(s => ({ skill_id: s.skill_id, skill_type: "OFFERING" })),
        ...userData.skillsWanted.map(s => ({ skill_id: s.skill_id, skill_type: "WANTED" }))
      ];
      formData.append("skills", JSON.stringify(skillsPayload));

      if (userData.selectedFile) {
        formData.append("profile_pic", userData.selectedFile);
      }

      await updateProfile(formData).unwrap();

      setHasChanges(false);
      setUserData(prev => ({ ...prev, selectedFile: null, previewUrl: null }));

      // Fetch fresh data to get the new profile_pic_url from backend
      const result = await refetch();
      if (result.data?.success) {
        const { user } = result.data.data;
        dispatch(updateUserInfo({
          user_name: user.user_name,
          profile_pic_url: user.profile_pic_url
        }));
      }

      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert(err?.data?.message || "Failed to update profile");
    }
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

      if (fromDate >= toDate) {
        alert("From time must be earlier than To time");
        return;
      }

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

  const addSkillOffered = (skillId) => {
    // Prevent same skill in wanted
    if (userData.skillsWanted.some(s => s.skill_id === skillId)) {
      alert("This skill is already in your Wanted list. You cannot offer it too.");
      return;
    }

    const skillObj = skillsMaster.find(s => s.id === skillId);
    if (skillObj && !userData.skillsOffered.some(s => s.skill_id === skillId)) {
      setUserData((prev) => ({
        ...prev,
        skillsOffered: [...prev.skillsOffered, { skill_id: skillObj.id, skill_name: skillObj.name }],
      }));
      setShowAddSkillOffered(false);
    }
  };

  const addSkillWanted = (skillId) => {
    // Prevent same skill in offered
    if (userData.skillsOffered.some(s => s.skill_id === skillId)) {
      alert("This skill is already in your Offering list. You cannot want it too.");
      return;
    }

    const skillObj = skillsMaster.find(s => s.id === skillId);
    if (skillObj && !userData.skillsWanted.some(s => s.skill_id === skillId)) {
      setUserData((prev) => ({
        ...prev,
        skillsWanted: [...prev.skillsWanted, { skill_id: skillObj.id, skill_name: skillObj.name }],
      }));
      setShowAddSkillWanted(false);
    }
  };

  const getAvailableSkillsForOffering = () => {
    return skillsMaster.filter(
      (skill) => !userData.skillsOffered.some(s => s.skill_id === skill.id)
    );
  };

  const getAvailableSkillsForWanting = () => {
    return skillsMaster.filter(
      (skill) => !userData.skillsWanted.some(s => s.skill_id === skill.id)
    );
  };

  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prev) => {
          // If we had a previous preview URL, revoke it to avoid memory leaks
          if (prev.previewUrl) {
            URL.revokeObjectURL(prev.previewUrl);
          }
          const previewUrl = URL.createObjectURL(file);
          return {
            ...prev,
            selectedFile: file,
            previewUrl: previewUrl
          };
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const navigate = (path) => {
    history.push(path);
  };

  if (profileLoading || skillsLoading) return <div className="loading">Loading profile...</div>;

  return (
    <div className="screen6-container1">
      <Helmet>
        <title>UserProfile - Skill Swap</title>
        <meta property="og:title" content="UserProfile - Skill Swap" />
      </Helmet>
      <div className="screen6-thq-screen6-elm">
        <div className="screen6-thq-depth1-frame0-elm">
          <div className="screen6-thq-depth2-frame1-elm">
            <div className="screen6-thq-depth3-frame0-elm2">
              <div className="screen6-thq-depth4-frame0-elm2">
                <div className="screen6-thq-depth5-frame0-elm4">
                  <span className="screen6-thq-text-elm13">User Profile</span>
                </div>
                {(hasChanges || updating) && (
                  <div
                    className="screen6-thq-depth5-frame1-elm1"
                    onClick={!updating ? handleSave : null}
                    style={{ cursor: updating ? "wait" : "pointer", opacity: updating ? 0.7 : 1 }}
                  >
                    <div className="screen6-thq-depth6-frame0-elm10">
                      <span className="screen6-thq-text-elm14">{updating ? "Saving..." : "Save"}</span>
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
                        style={{
                          backgroundImage: `url(${userData.previewUrl || getImageUrl(userData.profileImage, defaultProfilePic)
                            })`,
                          backgroundSize: '110%',
                          backgroundPosition: 'center'
                        }}
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
                          {userData.email}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              <div className="screen6-thq-depth4-frame2-elm2" style={{ marginTop: '20px' }}>
                <span className="screen6-thq-text-elm17">Bio</span>
              </div>
              <div className="screen6-thq-depth4-frame3-elm">
                <textarea
                  className="screen6-bio-textarea"
                  value={userData.bio}
                  onChange={(e) => setUserData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell others about yourself..."
                />
              </div>

              {/* Skills Offered */}
              <div className="screen6-thq-depth4-frame2-elm2">
                <span className="screen6-thq-text-elm17">Skills Offered</span>
              </div>
              <div className="screen6-thq-depth4-frame3-elm">
                {userData.skillsOffered.map((skill, index) => (
                  <div key={index} className="screen6-skill-tag">
                    <div className="screen6-thq-depth6-frame0-elm12">
                      <span className="screen6-thq-text-elm18">{skill.skill_name}</span>
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
                        <option key={index} value={skill.id}>
                          {skill.name}
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
                      <span className="screen6-thq-text-elm22">{skill.skill_name}</span>
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
                        <option key={index} value={skill.id}>
                          {skill.name}
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
                          <option value="TUES">Tuesday</option>
                          <option value="WED">Wednesday</option>
                          <option value="THURS">Thursday</option>
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
                    value="PUBLIC"
                    checked={userData.profileVisibility === "PUBLIC"}
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
                    value="PRIVATE"
                    checked={userData.profileVisibility === "PRIVATE"}
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

