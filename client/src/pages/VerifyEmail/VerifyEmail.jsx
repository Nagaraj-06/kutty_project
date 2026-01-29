import React, { useEffect, useState } from "react";
import axios from "axios";
import "./VerifyEmail.css";
import { API_URL } from "../../config/constants";

const VerifyEmail = () => {
  const [status, setStatus] = useState("Verifying...");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        const res = await axios.get(
          `${API_URL}/public/api/auth/verify_email`,
          { params: { token } },
        );

        setStatus(res.data.message);
        setSuccess(true);
      } catch (err) {
        setStatus("Verification failed or link expired.");
        setSuccess(false);
      }
    };

    verifyEmail();
  }, []);

  return (
    <div className="verify-email-container">
      <h2>Email Verification</h2>
      <p>{status}</p>
      {success && (
        <a href="/login" className="verify-email-link">
          Go to Login
        </a>
      )}
    </div>
  );
};

export default VerifyEmail;
