import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Button, TextField, Typography, Container } from "@mui/material";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/login", formData);
      const { access_token, user_id } = response.data;

      // Store the token and user_id in localStorage
      localStorage.setItem("token", access_token);
      localStorage.setItem("user_id", user_id);

      alert("Login successful");
      navigate("/dashboard"); // Redirect to the Dashboard after successful login
    } catch (error) {
      console.error("Failed to login:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Failed to login. Please try again.");
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
      {/* Header with "Go to Homepage" button */}
      <Box
        sx={{
          position: "absolute",
          top: 20,
          right: 20,
        }}
      >
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate("/home")}
          sx={{
            borderColor: "#1976d2",
            color: "#1976d2",
            "&:hover": { backgroundColor: "#e3f2fd" },
          }}
        >
          Kthehu tek faqja kryesore
        </Button>
      </Box>

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
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Username"
              name="username"
              fullWidth
              margin="normal"
              required
              onChange={handleChange}
              value={formData.username}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              margin="normal"
              required
              onChange={handleChange}
              value={formData.password}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3, py: 1.5, fontSize: "1rem" }}
            >
              LOGIN
            </Button>
          </form>
          <Typography
            align="center"
            sx={{ mt: 2, color: "gray", fontSize: "0.875rem" }}
          >
            Nuk ke nje llogari??{" "}
            <a
              href="/register"
              style={{ textDecoration: "none", color: "#1976d2" }}
            >
              Krijoje ketu
            </a>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
  