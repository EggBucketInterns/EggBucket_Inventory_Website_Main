import React, { useState } from "react";
import axios from "axios";
import "../index.css"; // Import the CSS file

function ResetPassword() {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/reset-password", formData);
      setMessage(response.data.message);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <div className="reset-password-container">
      <h2 className="reset-password-title">Reset Password</h2>
      {message && <p className="reset-password-success">{message}</p>}
      {error && <p className="reset-password-error">{error}</p>}
      <form className="reset-password-form" onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            className="reset-password-input"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>OTP:</label>
          <input
            className="reset-password-input"
            type="text"
            name="otp"
            value={formData.otp}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>New Password:</label>
          <input
            className="reset-password-input"
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            className="reset-password-input"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button className="reset-password-button" type="submit">
          Reset Password
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
