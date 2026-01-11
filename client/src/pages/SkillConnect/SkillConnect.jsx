import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import "./SkillConnect.css";
import EthanCarterImg from "../../assets/images/tq_lp9_4etwck-4tnq-200h.png";
import SophiaClarkImg from "../../assets/images/tq_tx535muzma-ddt-200h.png";
import LiamFosterImg from "../../assets/images/tq_qrpcz5jygk-9m6qo-200h.png";
import OliviaHayesImg from "../../assets/images/tq_cef-seuad5-sdpb-200h.png";
import NoahBennettImg from "../../assets/images/tq_lp9_4etwck-4tnq-200h.png";
import AvaTurnerImg from "../../assets/images/tq_ceabciosxv-qnxh-200h.png";

const SkillConnect = (props) => {
  const history = useHistory();
  const [searchTerm, setSearchTerm] = useState("");
  const [availability, setAvailability] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;

  const users = [
    {
      id: 1,
      name: "Ethan Carter",
      skillsOffered: "JavaScript, Python",
      skillsWanted: "Photoshop, Graphic Design",
      image: EthanCarterImg,
      availability: "       Available",
    },
    {
      id: 2,
      name: "Sophia Clark",
      skillsOffered: "UI/UX Design, Figma",
      skillsWanted: "Data Analysis, Machine Learning",
      image: SophiaClarkImg,
      availability: "Busy",
    },
    {
      id: 3,
      name: "Liam Foster",
      skillsOffered: "Photography, Video Editing",
      skillsWanted: "Spanish, French",
      image: LiamFosterImg,
      availability: "Available",
    },
    {
      id: 4,
      name: "Olivia Hayes",
      skillsOffered: "Content Writing, SEO",
      skillsWanted: "Yoga, Meditation",
      image: OliviaHayesImg,
      availability: "Available",
    },
    {
      id: 5,
      name: "Noah Bennett",
      skillsOffered: "Music Production, DJing",
      skillsWanted: "Cooking, Baking",
      image: NoahBennettImg,
      availability: "Busy",
    },
    {
      id: 6,
      name: "Ava Turner",
      skillsOffered: "Marketing, Social Media",
      skillsWanted: "Web Development, HTML/CSS",
      image: AvaTurnerImg,
      availability: "Available",
    },
  ];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.skillsOffered.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.skillsWanted.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAvailability =
      availability === "All" || user.availability.trim() === availability;
    return matchesSearch && matchesAvailability;
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage
  );

  const handleLoginClick = () => {
    history.push("/login");
  };

  const handleUserClick = (userId) => {
    // history.push(`/user/${userId}`);
    history.push(`/feedbacks`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="screen1-container1">
      <Helmet>
        <title>SkillConnect - Skill Swap</title>
        <meta property="og:title" content="SkillConnect - Skill Swap" />
      </Helmet>
      <div className="screen1-thq-screen1-elm">
        <div className="screen1-thq-depth2-frame0-elm">
          <div className="screen1-thq-depth3-frame0-elm1">
            <div className="screen1-thq-depth4-frame0-elm1">
              <img
                src="/depth5frame12111-mn8.svg"
                alt="Depth5Frame12111"
                className="screen1-thq-depth5-frame1-elm1"
              />
            </div>
            <div className="screen1-thq-depth4-frame1-elm1">
              <span className="screen1-thq-text-elm10">
                Skill Swap Platform
              </span>
            </div>
          </div>
          <div className="screen1-thq-depth3-frame1-elm">
            <div className="screen1-thq-depth4-frame0-elm2">
              <span
                className="screen1-thq-text-elm11"
                onClick={handleLoginClick}
                style={{ cursor: "pointer" }}
              >
                Login
              </span>
            </div>
          </div>
        </div>
        <div className="screen1-thq-depth2-frame1-elm">
          <div className="screen1-thq-depth3-frame0-elm2">
            <div className="screen1-thq-depth4-frame0-elm3">
              <div className="screen1-thq-depth5-frame0-elm1">
                <div className="screen1-thq-depth6-frame0-elm1">
                  <div className="screen1-thq-depth7-frame0-elm10">
                    <img
                      src="/depth8frame0626-uapf.svg"
                      alt="Depth8Frame0626"
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
            <div className="screen1-thq-depth4-frame1-elm2">
              <div className="screen1-thq-depth5-frame0-elm2">
                <select
                  className="screen1-availability-select"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                >
                  <option value="All">Availability</option>
                  <option value="Available">Available</option>
                  <option value="Busy">Busy</option>
                </select>
              </div>
            </div>
            <div className="screen1-thq-depth4-frame2-elm">
              <div className="screen1-thq-depth5-frame0-elm3">
                {currentUsers.map((user, index) => (
                  <div
                    key={user.id}
                    className={`screen1-thq-depth6-frame${index % 5}-elm`}
                    onClick={() => handleUserClick(user.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="screen1-thq-depth7-frame0-elm12">
                      <div
                        className="screen1-thq-depth8-frame0-elm11"
                        style={{
                          backgroundImage: `url(${user.image})`,
                          backgroundPosition: "center",
                          backgroundSize: "cover",
                          backgroundRepeat: "no-repeat",
                        }}
                      ></div>
                    </div>
                    <div className="screen1-thq-depth7-frame1-elm2">
                      <div className="screen1-thq-depth8-frame0-elm12">
                        <span className="screen1-thq-text-elm14">
                          {user.name}
                        </span>
                      </div>
                      <div className="screen1-thq-depth8-frame1-elm1">
                        <span className="screen1-thq-text-elm15">
                          Skills Offered: {user.skillsOffered} | Skills Wanted:{" "}
                          {user.skillsWanted}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* <div className="screen1-thq-depth4-frame3-elm">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={`screen1-page-button ${
                      page === currentPage ? "active" : ""
                    }`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                )
              )}
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillConnect;
