import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import "./SignIn.css";

const SignIn = (props) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const handleLoginClick = () => {
    history.push("/");
  };

  const handleCreateAccount = () => {
    console.log({
      username,
      email,
      password,
    });
  };

  return (
    <div className="screen3-container1">
      <Helmet>
        <title>SignIn - Skill Swap</title>
        <meta property="og:title" content="SignIn - Skill Swap" />
      </Helmet>
      <div className="screen3-thq-screen3-elm">
        <div className="screen3-thq-depth1-frame0-elm">
          <div className="screen3-thq-depth2-frame0-elm">
            <div className="screen3-thq-depth3-frame0-elm1">
              <img
                src="/depth5frame02111-y69.svg"
                alt="Depth5Frame02111"
                className="screen3-thq-depth5-frame0-elm1"
              />
              <div className="screen3-thq-depth4-frame1-elm1">
                <span className="screen3-thq-text-elm10">
                  Skill Swap Platform
                </span>
              </div>
            </div>
            <div className="screen3-thq-depth3-frame1-elm">
              <div className="screen3-thq-depth4-frame0-elm1">
                <span
                  className="screen3-thq-text-elm11"
                  onClick={handleLoginClick}
                  style={{ cursor: "pointer" }}
                >
                  Login
                </span>
              </div>
            </div>
          </div>
          <div className="screen3-thq-depth2-frame1-elm">
            <div className="screen3-thq-depth3-frame0-elm2">
              <div className="screen3-thq-depth4-frame0-elm2">
                <span className="screen3-thq-text-elm12">Welcome !!</span>
              </div>
              <div className="screen3-thq-depth4-frame1-elm2">
                <div className="screen3-thq-depth5-frame0-elm2">
                  <div className="screen3-thq-depth6-frame0-elm1">
                    <span className="screen3-thq-text-elm13">Username</span>
                  </div>
                  <input
                    type="text"
                    className="screen3-input"
                    placeholder="Create Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
              <div className="screen3-thq-depth4-frame5-elm">
                <div className="screen3-thq-depth5-frame0-elm3">
                  <div className="screen3-thq-depth6-frame0-elm2">
                    <span className="screen3-thq-text-elm15">Email</span>
                  </div>
                  <input
                    type="email"
                    className="screen3-input"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="screen3-thq-depth4-frame2-elm">
                <div className="screen3-thq-depth5-frame0-elm4">
                  <div className="screen3-thq-depth6-frame0-elm3">
                    <span className="screen3-thq-text-elm17">Password</span>
                  </div>
                  <input
                    type="password"
                    className="screen3-input"
                    placeholder="Create password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="screen3-thq-depth4-frame3-elm"></div>
              <div className="screen3-thq-depth4-frame4-elm">
                <div
                  className="screen3-thq-depth5-frame0-elm5"
                  onClick={handleCreateAccount}
                  style={{ cursor: "pointer" }}
                >
                  <div className="screen3-thq-depth6-frame0-elm4">
                    <span className="screen3-thq-text-elm19">
                      Create Account
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

export default SignIn;
