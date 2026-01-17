import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import "./SkillConnect.css";
import { useGetUsersSkillsQuery } from "../../store/api/skillsApi";
import defaultProfilePic from "../../assets/images/default-profile-pic.png";
import { getImageUrl } from "../../utils/imageUtils";
import { useDispatch, useSelector } from 'react-redux';
import { selectSkillConnectSearch, setSkillConnectSearch } from '../../store/slices/filtersSlice';
import { selectIsAuthenticated } from "../../store/slices/authSlice";

const SkillConnect = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const reduxSearchTerm = useSelector(selectSkillConnectSearch);
  const [searchTerm, setSearchTerm] = useState(reduxSearchTerm);
  const [availabilityFilter, setAvailabilityFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;

  const { data: usersResponse, isLoading, isError } = useGetUsersSkillsQuery();

  useEffect(() => {
    dispatch(setSkillConnectSearch(searchTerm));
  }, [searchTerm, dispatch]);

  const users = usersResponse?.data?.map(user => ({
    id: user.id,
    name: user.user_name || "Anonymous",
    skillsOffered: user.skills_offered?.join(", ") || "",
    skillsWanted: user.skills_wanted?.join(", ") || "",
    image: getImageUrl(user.profile_pic_url, defaultProfilePic),
    availability: "Available"
  })) || [];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.skillsOffered.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.skillsWanted.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAvailability =
      availabilityFilter === "All" || user.availability === availabilityFilter;
    return matchesSearch && matchesAvailability;
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage
  );

  const navigate = (path) => {
    history.push(path);
  };


  if (isLoading) return <div className="loading">Loading users...</div>;
  if (isError) return <div className="loading">Failed to load users. Please try again later.</div>;

  return (
    <div className="screen1-container1"> {/* Main SkillConnect page container */}
      <Helmet>
        <title>SkillConnect - Skill Swap</title>
        <meta property="og:title" content="SkillConnect - Skill Swap" />
      </Helmet>

      <div className="skillconnect-wrapper">
        {/* Search bar container */}
        <div className="search-container">
          <div className="screen1-thq-depth5-frame0-elm1">
            <div className="screen1-thq-depth6-frame0-elm1">
              <div className="screen1-thq-depth7-frame0-elm10">
                <img
                  src="/depth8frame0626-uapf.svg"
                  alt="Search"
                  className="screen1-thq-depth8-frame0-elm10"
                />
              </div>
              <input
                type="text"
                className="screen1-search-input"
                placeholder="Search by name or skill"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Availability filter dropdown */}
        <div className="availability-filter">
          <select
            className="availability-select"
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
          >
            <option value="All">Availability</option>
            <option value="Available">Available</option>
            <option value="Busy">Busy</option>
          </select>
        </div>

        {/* Users list container */}
        <div className="users-list">
          <div className="screen1-thq-depth5-frame0-elm3">
            {currentUsers.length > 0 ? (
              currentUsers.map((user, index) => (
                <div
                  key={user.id}
                  /* User card */
                  className={`screen1-thq-depth6-frame${index % 6}-elm user-card`}
                  onClick={() => navigate(`/feedbacks/${user.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="screen1-thq-depth7-frame0-elm12">
                    <div
                      className="screen1-thq-depth8-frame0-elm11" /* Profile image container */
                      style={{
                        backgroundImage: `url(${user.image})`,
                        backgroundPosition: "center",
                        backgroundSize: "110%",
                        backgroundRepeat: "no-repeat",
                      }}
                    ></div>
                  </div>
                  <div className="screen1-thq-depth7-frame1-elm2">
                    <div className="screen1-thq-depth8-frame0-elm12">
                      <span className="screen1-thq-text-elm14">{user.name}</span>
                    </div>
                    <div className="screen1-thq-depth8-frame1-elm1">
                      <div className="skills-description-container">
                        <span className="screen1-thq-text-elm15 line-clamp-2">
                          Skills Offered: {user.skillsOffered || "None"} | Wanted: {user.skillsWanted || "None"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="loading" style={{ height: 'auto', padding: '40px' }}>
                No users found matching your search.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export default SkillConnect;
