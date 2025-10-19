import React, { useState, useEffect } from "react";
import axios from "axios";

function SignupPage() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // 1️⃣ Normal signup handler
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/signup", {
        user_name: userName,
        email,
        password,
      });
      setMessage("Signup successful! Welcome " + res.data.user.user_name);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  // 2️⃣ Google Sign-In callback
  const handleGoogleSignIn = async (response) => {
    const googleIdToken = response.credential;
    try {
      const res = await axios.post("http://localhost:8080/signup", {
        googleIdToken,
      });
      setMessage("Signup successful! Welcome " + res.data.user.user_name);
    } catch (error) {
      setMessage(error.response?.data?.message || "Google signup failed");
    }
  };

  // 3️⃣ Load Google Sign-In script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    window.onGoogleLibraryLoad = () => {
      window.google.accounts.id.initialize({
        client_id: "YOUR_GOOGLE_CLIENT_ID",
        callback: handleGoogleSignIn,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-btn"),
        { theme: "outline", size: "large", width: "250" }
      );
    };

    script.onload = () => {
      if (window.google) window.onGoogleLibraryLoad();
    };
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div
        style={{
          maxWidth: "400px",
          width: "100%",
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Sign Up</h2>

        {/* Normal Signup Form */}
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
              marginBottom: "15px",
            }}
          >
            Sign Up
          </button>
        </form>

        <p>Or sign up with Google:</p>
        <div id="google-signin-btn" style={{ margin: "0 auto" }}></div>

        {message && (
          <p style={{ marginTop: "15px", color: "#007bff" }}>{message}</p>
        )}
      </div>
    </div>
  );
}

export default SignupPage;
