import React, { useEffect, useState } from "react";
import axios from "axios";
import "./VerifyEmail.css";

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
