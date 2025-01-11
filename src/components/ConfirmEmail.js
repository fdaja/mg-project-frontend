import React, { useState } from "react";
import axios from "axios";

const ConfirmEmail = () => {
  const [email, setEmail] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/confirm", {
        email,
        confirmation_code: confirmationCode,
      });
      setMessage(response.data.message);
      setError("");
    } catch (err) {
      setMessage("");
      setError(err.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <div>
      <h2>Email Confirmation</h2>
      <form onSubmit={handleConfirm}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirmation Code:</label>
          <input
            type="text"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
            required
          />
        </div>
        <button type="submit">Confirm Email</button>
      </form>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ConfirmEmail;
