import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { useSigninMutation } from '../../store/api/authApi';
import { setCredentials } from '../../store/slices/authSlice';
import "./Login.css";
import Header from "../../components/Header/Header";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();
  const dispatch = useDispatch();

  const [signin, { isLoading }] = useSigninMutation();

  const handleLogin = async () => {
    try {
      setError("");
      const response = await signin({ email, password }).unwrap();
      // The Swagger shows the response contains 'user' and 'token'
      dispatch(setCredentials({
        user: response.user,
        token: response.token
      }));
      history.push("/dashboard");
    } catch (err) {
      setError(err?.data?.message || "Failed to login. Please check your credentials.");
      console.error("Login error:", err);
    }
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
          <div className="screen2-thq-depth2-frame1-elm">
            <div className="screen2-thq-depth3-frame0-elm2">
              <div className="screen2-thq-depth4-frame0-elm2">
                <span className="screen2-thq-text-elm3">Welcome back</span>
              </div>

              {error && (
                <div style={{ color: 'red', marginBottom: '10px', fontSize: '14px' }}>
                  {error}
                </div>
              )}

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
                  onClick={!isLoading ? handleLogin : null}
                  style={{ cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.7 : 1 }}
                >
                  <div className="screen2-thq-depth6-frame0-elm3">
                    <span className="screen2-thq-text-elm9">
                      {isLoading ? "Logging in..." : "Login"}
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

export default Login;
