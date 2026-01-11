import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import "./SwapRequests.css";

const SwapRequests = (props) => {
  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [requests, setRequests] = useState([
    {
      id: 1,
      name: "Sophia Carter",
      rating: 4.5,
      skillsOffered: "Graphic Design",
      skillsWanted: "Web Development",
      status: "Pending",
      avatarClass: "screen17-thq-depth6-frame0-elm12",
    },
    {
      id: 2,
      name: "Ethan Bennett",
      rating: 4.8,
      skillsOffered: "Photography",
      skillsWanted: "Marketing",
      status: "Pending",
      avatarClass: "screen17-thq-depth6-frame0-elm15",
    },
    {
      id: 3,
      name: "Olivia Harper",
      rating: 4.2,
      skillsOffered: "Copywriting",
      skillsWanted: "Data Analysis",
      status: "Pending",
      avatarClass: "screen17-thq-depth6-frame0-elm18",
    },
    {
      id: 4,
      name: "Liam Foster",
      rating: 4.6,
      skillsOffered: "UI/UX Design",
      skillsWanted: "Project Management",
      status: "Pending",
      avatarClass: "screen17-thq-depth6-frame0-elm21",
    },
  ]);

  const handleAccept = (id) => {
    setRequests(
      requests.map((req) =>
        req.id === id ? { ...req, status: "Accepted" } : req
      )
    );
  };

  const handleReject = (id) => {
    setRequests(
      requests.map((req) =>
        req.id === id ? { ...req, status: "Rejected" } : req
      )
    );
  };

  const navigateToProfile = () => {
    history.push("/profile");
  };

  const filteredRequests = requests.filter((req) => {
    const matchesSearch = req.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="screen17-container1">
      <Helmet>
        <title>Screen17 - exported project</title>
        <meta property="og:title" content="Screen17 - exported project" />
        <link
          rel="canonical"
          href="https://s5-skillswap-68454w.teleporthq.app/screen17"
        />
      </Helmet>
      <div className="screen17-thq-screen17-elm">
        <div className="screen17-thq-depth1-frame0-elm">
          <div className="screen17-thq-depth2-frame1-elm">
            <div className="screen17-thq-depth3-frame0-elm2">
              <div className="screen17-thq-depth4-frame0-elm3">
                <div className="screen17-thq-depth5-frame0-elm10">
                  <span className="screen17-thq-text-elm11">Swap Requests</span>
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
                        placeholder="Search requests"
                        className="screen17-thq-text-elm12 swap-search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="screen17-thq-depth4-frame2-elm">
                <div className="screen17-thq-depth5-frame0-elm12">
                  <div className="screen17-thq-depth6-frame0-elm11">
                    <select
                      className="screen17-thq-text-elm13 swap-status-select"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="All">All Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </div>

              {filteredRequests.map((request) => (
                <React.Fragment key={request.id}>
                  <div className="screen17-thq-depth4-frame3-elm">
                    <div className="screen17-thq-depth5-frame0-elm13">
                      <div
                        className={request.avatarClass}
                        onClick={navigateToProfile}
                        style={{ cursor: "pointer" }}
                      ></div>
                      <div className="screen17-thq-depth6-frame1-elm2">
                        <div className="screen17-thq-depth7-frame0-elm12">
                          <span
                            className="screen17-thq-text-elm14"
                            onClick={navigateToProfile}
                            style={{ cursor: "pointer" }}
                          >
                            {request.name}
                          </span>
                        </div>
                        <div className="screen17-thq-depth7-frame1-elm2">
                          <span className="screen17-thq-text-elm15">
                            Rating: {request.rating}
                          </span>
                        </div>
                        <div className="screen17-thq-depth7-frame2-elm1">
                          <span className="screen17-thq-text-elm16">
                            Skills Offered: {request.skillsOffered}, Skills
                            Wanted: {request.skillsWanted}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="screen17-thq-depth5-frame1-elm2">
                      <div className="screen17-thq-depth6-frame0-elm13">
                        <div
                          className="screen17-thq-depth7-frame0-elm13"
                          style={{
                            backgroundColor:
                              request.status === "Accepted"
                                ? "#078738"
                                : request.status === "Rejected"
                                  ? "#ff5c5c"
                                  : "#ffd600",
                          }}
                        ></div>
                      </div>
                    </div>
                    {request.status === "Pending" && (
                      <div className="screen17-thq-depth4-frame4-elm">
                        <div className="screen17-thq-depth5-frame0-elm14">
                          <div
                            className="screen17-thq-depth6-frame0-elm14"
                            onClick={() => handleReject(request.id)}
                            style={{ cursor: "pointer" }}
                          >
                            <div className="screen17-thq-depth7-frame0-elm14">
                              <span className="screen17-thq-text-elm17">
                                Reject
                              </span>
                            </div>
                          </div>
                          <div
                            className="screen17-thq-depth6-frame1-elm3"
                            onClick={() => handleAccept(request.id)}
                            style={{ cursor: "pointer" }}
                          >
                            <div className="screen17-thq-depth7-frame0-elm15">
                              <span className="screen17-thq-text-elm18">
                                Accept
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {request.status !== "Pending" && (
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
              ))}

              {/* <div className="screen17-thq-depth4-frame12-elm">
                <div className="screen17-thq-depth5-frame0-elm21">
                  <div className="screen17-thq-depth6-frame0-elm24">
                    <img
                      src="/depth7frame09190-ldy8.svg"
                      alt="Depth7Frame09190"
                      className="screen17-thq-depth7-frame0-elm28"
                    />
                  </div>
                </div>
                <div className="screen17-thq-depth5-frame1-elm6"></div>
                <div className="screen17-thq-depth5-frame2-elm2"></div>
                <div className="screen17-thq-depth5-frame3-elm"></div>
                <div className="screen17-thq-depth5-frame4-elm"></div>
                <div className="screen17-thq-depth5-frame5-elm"></div>
                <div className="screen17-thq-depth5-frame6-elm"></div>
                <div className="screen17-thq-depth5-frame7-elm"></div>
                <div className="screen17-thq-depth5-frame8-elm">
                  <div className="screen17-thq-depth6-frame0-elm25">
                    <img
                      src="/depth7frame09209-aq1p.svg"
                      alt="Depth7Frame09209"
                      className="screen17-thq-depth7-frame0-elm29"
                    />
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default SwapRequests;
