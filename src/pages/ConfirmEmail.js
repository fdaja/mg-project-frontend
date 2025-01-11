import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Box, Container } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const ConfirmEmail = () => {
  const [confirmationCode, setConfirmationCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email; // Get email passed from Register.js

  useEffect(() => {
    if (!email) {
      setError("No email provided. Please register first.");
    }
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email is missing. Please go back to registration.");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:5000/confirm", {
        email,
        confirmation_code: confirmationCode,
      });
      setMessage(response.data.message);
      setError("");

      // Redirect to the login page after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setMessage("");
      setError(err.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: "linear-gradient(to bottom, #f7f8fc, #e9ecf4)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 3,
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            background: "#fff",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "12px",
            padding: 4,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            align="center"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            Email Confirmation
          </Typography>
          {email && (
            <Typography
              align="center"
              sx={{ mt: 2, color: "gray", fontSize: "0.875rem" }}
            >
              Confirming for: <strong>{email}</strong>
            </Typography>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Confirmation Code"
              name="confirmationCode"
              type="text"
              fullWidth
              margin="normal"
              required
              onChange={(e) => setConfirmationCode(e.target.value)}
              value={confirmationCode}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3, py: 1.5, fontSize: "1rem" }}
            >
              Confirm Email
            </Button>
          </form>
          {message && (
            <Typography align="center" sx={{ mt: 2, color: "green" }}>
              {message}
            </Typography>
          )}
          {error && (
            <Typography align="center" sx={{ mt: 2, color: "red" }}>
              {error}
            </Typography>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default ConfirmEmail;
