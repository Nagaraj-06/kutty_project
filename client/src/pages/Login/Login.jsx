import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import "./Login.css";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const handleLogin = () => {
    console.log({
      email: email,
      password: password,
    });
  };

  const handleSignUpClick = () => {
    history.push("/signin");
  };

  const handleForgotPassword = () => {
    history.push("/forgot-password");
  };

  return (
    <div className="screen2-container1">
      <Helmet>
        <title>Login - Skill Swap</title>
        <meta property="og:title" content="Login - Skill Swap" />
      </Helmet>
      <div className="screen2-thq-screen2-elm">
        <div className="screen2-thq-depth1-frame0-elm">
          <div className="screen2-thq-depth2-frame0-elm">
            <div className="screen2-thq-depth3-frame0-elm1">
              <img
                src="/depth5frame02113-fl95.svg"
                alt="Depth5Frame02113"
                className="screen2-thq-depth5-frame0-elm1"
              />
              <div className="screen2-thq-depth4-frame1-elm1">
                <span className="screen2-thq-text-elm1">
                  Skill Swap Platform
                </span>
              </div>
            </div>
            <div
              className="screen2-thq-depth3-frame1-elm"
              onClick={handleSignUpClick}
              style={{ cursor: "pointer" }}
            >
              <div className="screen2-thq-depth4-frame0-elm1">
                <span className="screen2-thq-text-elm2">Sign Up</span>
              </div>
            </div>
          </div>
          <div className="screen2-thq-depth2-frame1-elm">
            <div className="screen2-thq-depth3-frame0-elm2">
              <div className="screen2-thq-depth4-frame0-elm2">
                <span className="screen2-thq-text-elm3">Welcome back</span>
              </div>
              <div className="screen2-thq-depth4-frame1-elm2">
                <div className="screen2-thq-depth5-frame0-elm2">
                  <div className="screen2-thq-depth6-frame0-elm1">
                    <span className="screen2-thq-text-elm4">Email</span>
                  </div>
                  <input
                    type="email"
                    className="screen2-text-input"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="screen2-thq-depth4-frame2-elm">
                <div className="screen2-thq-depth5-frame0-elm3">
                  <div className="screen2-thq-depth6-frame0-elm2">
                    <span className="screen2-thq-text-elm6">Password</span>
                  </div>
                  <input
                    type="password"
                    className="screen2-text-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="screen2-thq-depth4-frame3-elm">
                <span
                  className="screen2-thq-text-elm8"
                  onClick={handleForgotPassword}
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                >
                  Forgot password?
                </span>
              </div>
              <div className="screen2-thq-depth4-frame4-elm">
                <div
                  className="screen2-thq-depth5-frame0-elm4"
                  onClick={handleLogin}
                  style={{ cursor: "pointer" }}
                >
                  <div className="screen2-thq-depth6-frame0-elm3">
                    <span className="screen2-thq-text-elm9">Login</span>
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

export default Login;
