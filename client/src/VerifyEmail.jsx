import React, { useEffect, useState } from "react";
import axios from "axios";

const VerifyEmail = () => {
  const [status, setStatus] = useState("Verifying...");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        const res = await axios.get(
          `http://localhost:8080/public/api/auth/verify_email?token=${token}`
        );

        setStatus(res.data.message);
        setSuccess(res.data.message);
      } catch (err) {
        setSuccess("Verification failed or link expired.");
      }
    };

    verifyEmail();
  }, []);

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "80px auto",
        textAlign: "center",
        border: "1px solid #ccc",
        padding: "30px",
        borderRadius: "10px",
      }}
    >
      <h2>Email Verification</h2>
      <p>{status}</p>
      {success && (
        <a
          href="/login"
          style={{
            display: "inline-block",
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "5px",
          }}
        >
          Go to Login
        </a>
      )}
    </div>
  );
};

export default VerifyEmail;
