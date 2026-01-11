import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ResetPassword.css";

function ResetPasswordPage() {
    const { token } = useParams();
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                "https://kutty-project.onrender.com/public/api/forget_password/reset",
                {
                    token,
                    newPassword: password,
                }
            );
            setMessage(res.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="reset-password-container">
            <div className="reset-password-card">
                <h2>Reset Password</h2>
                <form className="reset-password-form" onSubmit={handleSubmit}>
                    <input
                        type="password"
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="reset-password-button">
                        Reset Password
                    </button>
                </form>
                {message && (
                    <p
                        className={`reset-password-message ${message.includes("successfully") ? "success" : "error"
                            }`}
                    >
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}

export default ResetPasswordPage;
