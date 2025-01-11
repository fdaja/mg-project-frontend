import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  TextField,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";

const UserProfile = () => {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    username: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordDetails, setPasswordDetails] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem("user_id");
      const response = await axios.get(`http://127.0.0.1:5000/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUserDetails(response.data);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      setErrorMessage("Failed to fetch user details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditUserDetails = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem("user_id");
      await axios.put(
        `http://127.0.0.1:5000/users/${userId}/update`,
        userDetails,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setEditMode(false);
      setSuccessMessage("User details updated successfully!");
      fetchUserDetails();
    } catch (error) {
      console.error("Failed to update user details:", error);
      setErrorMessage("Failed to update user details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordDetails.newPassword !== passwordDetails.confirmPassword) {
      setErrorMessage("New passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const userId = localStorage.getItem("user_id");
      await axios.put(
        `http://127.0.0.1:5000/users/${userId}/change-password`,
        {
          currentPassword: passwordDetails.currentPassword,
          newPassword: passwordDetails.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPasswordDialogOpen(false);
      setSuccessMessage("Password changed successfully!");
      setPasswordDetails({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Failed to change password:", error);
      setErrorMessage("Failed to change password. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordDetails({ ...passwordDetails, [name]: value });
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setErrorMessage("");
    setSuccessMessage("");
    fetchUserDetails();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    window.location.href = "/login";
  };

  const navigateToDashboard = () => {
    window.location.href = "/dashboard";
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f7f8fc" }}>
      {/* Header */}
      <Box sx={{ backgroundColor: "#1976d2", color: "#fff", padding: 2 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              User Profile
            </Typography>
            <Box>
              <Button
                variant="contained"
                onClick={navigateToDashboard}
                sx={{
                  backgroundColor: "#fff",
                  color: "#1976d2",
                  "&:hover": {
                    backgroundColor: "#e3f2fd",
                  },
                  marginRight: 2,
                }}
              >
                Dashboard
              </Button>
              <Button
                variant="contained"
                onClick={handleLogout}
                sx={{
                  backgroundColor: "#fff",
                  color: "#1976d2",
                  "&:hover": {
                    backgroundColor: "#e3f2fd",
                  },
                }}
              >
                Logout
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Profile Form */}
      <Container maxWidth="sm" sx={{ py: 5 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
            Your Details
          </Typography>

          {loading && <CircularProgress sx={{ mb: 3 }} />}
          {successMessage && <Alert severity="success">{successMessage}</Alert>}
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

          {/* User Details Form */}
          <TextField
            label="Name"
            name="name"
            value={userDetails.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            disabled={!editMode}
          />
          <TextField
            label="Email"
            name="email"
            value={userDetails.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            disabled={!editMode}
          />
          <TextField
            label="Username"
            name="username"
            value={userDetails.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
            disabled={!editMode}
          />

          {/* Action Buttons */}
          <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
            {!editMode ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setEditMode(true)}
              >
                Edit Details
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleEditUserDetails}
                disabled={loading}
              >
                Save Changes
              </Button>
            )}
            {editMode && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCancelEdit}
                disabled={loading}
              >
                Cancel
              </Button>
            )}
          </Box>

          {/* Change Password Button */}
          <Box sx={{ mt: 3 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setPasswordDialogOpen(true)}
            >
              Change Password
            </Button>
          </Box>
        </Box>
      </Container>

      {/* Change Password Dialog */}
      <Dialog
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            label="Current Password"
            name="currentPassword"
            type="password"
            value={passwordDetails.currentPassword}
            onChange={handlePasswordChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="New Password"
            name="newPassword"
            type="password"
            value={passwordDetails.newPassword}
            onChange={handlePasswordChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={passwordDetails.confirmPassword}
            onChange={handlePasswordChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setPasswordDialogOpen(false)}
            color="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleChangePassword}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserProfile;
