import React, { useState } from "react";
import { TextField, Button, Typography, Box, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match! Please try again.");
      return;
    }

    try {
      // Call the backend API to register the user
      const response = await axios.post("http://127.0.0.1:5000/register", {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password, // Assuming the backend expects `password`
      });

      // Show success message and redirect to confirm email page
      alert("Registration successful! Check your email for the confirmation code.");
      console.log("User registered:", response.data);

      // Redirect to the email confirmation page
      navigate("/confirm-email", { state: { email: formData.email } });
    } catch (error) {
      // Handle errors from the backend
      console.error("Failed to register user:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Registration failed. Please try again.");
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
            Krijoni llogarine
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Emri"
              name="name"
              fullWidth
              margin="normal"
              required
              onChange={handleChange}
              value={formData.name}
            />
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
              label="Email"
              name="email"
              type="email"
              fullWidth
              margin="normal"
              required
              onChange={handleChange}
              value={formData.email}
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
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              fullWidth
              margin="normal"
              required
              onChange={handleChange}
              value={formData.confirmPassword}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3, py: 1.5, fontSize: "1rem" }}
            >
              Krijo
            </Button>
          </form>
          <Typography
            align="center"
            sx={{ mt: 2, color: "gray", fontSize: "0.875rem" }}
          >
            Ke nje llogari tashme?{" "}
            <a
              href="/login"
              style={{ textDecoration: "none", color: "#1976d2" }}
            >
              Logohu ketu
            </a>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Register;
