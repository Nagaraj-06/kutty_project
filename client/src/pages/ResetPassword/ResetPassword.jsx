import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useHistory, useParams } from "react-router-dom";
import { useResetPasswordMutation } from "../../store/api/authApi";
import "./ResetPassword.css";

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const history = useHistory();

    const [resetPassword, { isLoading }] = useResetPasswordMutation();

    const handleReset = async () => {
        if (!password || !confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        try {
            setError("");
            setMessage("");
            await resetPassword({ token, newPassword: password }).unwrap();
            setMessage("Password reset successfully! Redirecting to login...");
            setTimeout(() => {
                history.push("/login");
            }, 3000);
        } catch (err) {
            setError(err?.data?.message || "Failed to reset password. The link may have expired.");
        }
    };

    return (
        <div className="rp-container1">
            <Helmet>
                <title>Reset Password - Skill Swap</title>
            </Helmet>
            <div className="rp-thq-screen-elm">
                <div className="rp-thq-depth1-frame0-elm">
                    <div className="rp-thq-depth2-frame1-elm">
                        <div className="rp-thq-depth3-frame0-elm2">
                            <div className="rp-thq-depth4-frame0-elm2">
                                <span className="rp-thq-text-elm3">Reset Password</span>
                                <p className="rp-subtext">Choose a new, strong password for your account.</p>
                            </div>

                            {error && (
                                <div style={{ color: 'red', marginBottom: '10px', fontSize: '14px', textAlign: 'center' }}>
                                    {error}
                                </div>
                            )}

                            {message && (
                                <div style={{ color: 'green', marginBottom: '10px', fontSize: '14px', textAlign: 'center', fontWeight: 'bold' }}>
                                    {message}
                                </div>
                            )}

                            <div className="rp-thq-depth4-frame1-elm2">
                                <div className="rp-thq-depth5-frame0-elm2">
                                    <div className="rp-thq-depth6-frame0-elm1">
                                        <span className="rp-thq-text-elm4">New Password</span>
                                    </div>
                                    <input
                                        type="password"
                                        className="rp-text-input"
                                        placeholder="Enter new password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="rp-thq-depth4-frame1-elm2">
                                <div className="rp-thq-depth5-frame0-elm2">
                                    <div className="rp-thq-depth6-frame0-elm1">
                                        <span className="rp-thq-text-elm4">Confirm Password</span>
                                    </div>
                                    <input
                                        type="password"
                                        className="rp-text-input"
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="rp-thq-depth4-frame4-elm">
                                <div
                                    className="rp-thq-depth5-frame0-elm4"
                                    onClick={!isLoading ? handleReset : null}
                                    style={{ cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.7 : 1 }}
                                >
                                    <div className="rp-thq-depth6-frame0-elm3">
                                        <span className="rp-thq-text-elm9">
                                            {isLoading ? "Resetting..." : "Reset Password"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="rp-back-to-login">
                                <span
                                    onClick={() => history.push("/login")}
                                    style={{ cursor: "pointer", color: "rgba(73, 114, 155, 1)", textDecoration: "underline" }}
                                >
                                    Back to Login
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
