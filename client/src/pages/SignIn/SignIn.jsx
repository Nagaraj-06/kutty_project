import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import { useSignupMutation } from '../../store/api/authApi';
import "./SignIn.css";

const SignIn = (props) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const history = useHistory();

  const [signup, { isLoading }] = useSignupMutation();


  const handleLoginClick = () => {
    history.push("/login");
  };

  const handleCreateAccount = async () => {
    try {
      setError("");
      setSuccess("");
      const response = await signup({
        user_name: username,
        email,
        password
      }).unwrap();

      setSuccess(response.message || "Account created! Please check your email for verification (check your spam folder as well).");

      // Optionally redirect after a delay
      // setTimeout(() => history.push("/"), 3000);
    } catch (err) {
      setError(err?.data?.message || "Failed to create account. Please try again.");
      console.error("Signup error:", err);
    }
  };


  return (
    <div className="screen3-container1">
      <Helmet>
        <title>SignIn - Skill Swap</title>
        <meta property="og:title" content="SignIn - Skill Swap" />
      </Helmet>
      <div className="signin-wrapper">
        <div className="screen3-thq-depth4-frame0-elm2">
          <span className="screen3-thq-text-elm12">Welcome !!</span>
        </div>

        {error && (
          <div style={{ color: 'red', marginBottom: '10px', fontSize: '14px' }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ color: 'green', marginBottom: '10px', fontSize: '14px' }}>
            {success}
          </div>
        )}

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
            onClick={!isLoading ? handleCreateAccount : null}
            style={{ cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.7 : 1 }}
          >
            <div className="screen3-thq-depth6-frame0-elm4">
              <span className="screen3-thq-text-elm19">
                {isLoading ? "Creating..." : "Create Account"}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SignIn;
