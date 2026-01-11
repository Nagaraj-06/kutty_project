import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import { useForgotPasswordRequestMutation } from "../../store/api/authApi";
import "./ForgetPassword.css";

const ForgetPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const history = useHistory();

    const [forgotPasswordRequest, { isLoading }] = useForgotPasswordRequestMutation();

    const handleRequest = async () => {
        if (!email) {
            setError("Please enter your email address.");
            return;
        }
        try {
            setError("");
            setMessage("");
            await forgotPasswordRequest({ email }).unwrap();
            setMessage("check your mail and verify within - 1 hour expiration");
        } catch (err) {
            setError(err?.data?.message || "Failed to send reset link. Please try again.");
        }
    };

    return (
        <div className="fp-container1">
            <Helmet>
                <title>Forgot Password - Skill Swap</title>
            </Helmet>
            <div className="fp-thq-screen-elm">
                <div className="fp-thq-depth1-frame0-elm">
                    <div className="fp-thq-depth2-frame1-elm">
                        <div className="fp-thq-depth3-frame0-elm2">
                            <div className="fp-thq-depth4-frame0-elm2">
                                <span className="fp-thq-text-elm3">Forgot Password</span>
                                <p className="fp-subtext">Enter your email and we'll send you a link to reset your password.</p>
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

                            <div className="fp-thq-depth4-frame1-elm2">
                                <div className="fp-thq-depth5-frame0-elm2">
                                    <div className="fp-thq-depth6-frame0-elm1">
                                        <span className="fp-thq-text-elm4">Email</span>
                                    </div>
                                    <input
                                        type="email"
                                        className="fp-text-input"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="fp-thq-depth4-frame4-elm">
                                <div
                                    className="fp-thq-depth5-frame0-elm4"
                                    onClick={!isLoading ? handleRequest : null}
                                    style={{ cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.7 : 1 }}
                                >
                                    <div className="fp-thq-depth6-frame0-elm3">
                                        <span className="fp-thq-text-elm9">
                                            {isLoading ? "Sending..." : "Send Reset Link"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="fp-back-to-login">
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

export default ForgetPassword;
