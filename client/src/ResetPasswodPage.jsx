import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

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
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h2
          style={{ textAlign: "center", marginBottom: "30px", color: "#333" }}
        >
          Reset Password
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
          >
            Reset Password
          </button>
        </form>
        {message && (
          <p
            style={{
              marginTop: "20px",
              textAlign: "center",
              color: message.includes("successfully") ? "#28a745" : "#dc3545",
              fontSize: "14px",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default ResetPasswordPage;
