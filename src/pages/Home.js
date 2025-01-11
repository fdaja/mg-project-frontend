import React, { useState } from "react";
import { Typography, Box, Button, Container, TextField } from "@mui/material";
import axios from "axios";

const Home = () => {
  const [serialNumber, setSerialNumber] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!serialNumber) {
      alert("Please enter a serial number to search.");
      return;
    }

    setIsSearching(true); // Disable button while searching

    // Request user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const response = await axios.post("http://127.0.0.1:5000/gadgets/search", {
              serial_number: serialNumber,
              latitude,
              longitude,
            });

            setSearchResults(response.data); // Store the search result
          } catch (error) {
            console.error("Failed to search gadget:", error);
            setSearchResults(null); // Clear results if an error occurs
            if (error.response && error.response.status === 404) {
              alert("No gadget found with the provided serial number.");
            } else {
              alert("An error occurred while searching for the gadget.");
            }
          } finally {
            setIsSearching(false); // Re-enable button after search
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to retrieve your location. Please check your location settings.");
          setIsSearching(false); // Re-enable button if location is denied
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setIsSearching(false); // Re-enable button if geolocation isn't supported
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f7f8fc",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: "#1976d2",
          color: "#fff",
          padding: 2,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              My Gadgets
            </Typography>
            <Box>
              <Button color="inherit" href="/login">
                Login
              </Button>
              <Button
                color="inherit"
                href="/register"
                sx={{
                  marginLeft: 2,
                  backgroundColor: "#fff",
                  color: "#1976d2",
                  "&:hover": { backgroundColor: "#e3f2fd" },
                }}
              >
                Register
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          backgroundColor: "#e9ecf4",
          padding: 5,
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" gutterBottom sx={{ fontWeight: 700 }}>
            Welcome to My Gadgets Platform
          </Typography>
          <Typography variant="h6" gutterBottom>
            Open an account and register your gadgets
          </Typography>
          <Button
            variant="contained"
            color="primary"
            href="/register"
            sx={{
              mt: 3,
              py: 1.5,
              px: 4,
              fontSize: "1.1rem",
              backgroundColor: "#1976d2",
              "&:hover": { backgroundColor: "#145ea8" },
            }}
          >
            Create Your Account
          </Button>

          {/* Search Section */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Search gadgets by serial number!
            </Typography>
            <TextField
              label="Serial Number"
              variant="outlined"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              sx={{ mr: 2, width: "300px" }}
            />
            <Button
              variant="contained"
              sx={{
                py: 1.5,
                px: 3,
                fontSize: "1rem",
                backgroundColor: isSearching ? "#ccc" : "#1976d2",
                color: "#fff",
                "&:hover": { backgroundColor: isSearching ? "#ccc" : "#145ea8" },
                cursor: isSearching ? "not-allowed" : "pointer",
              }}
              onClick={handleSearch}
              disabled={isSearching}
            >
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </Box>

          {/* Display Search Results */}
          {searchResults ? (
            <Box
              sx={{
                mt: 4,
                mb: 4,
                backgroundColor: "#fff",
                padding: 3,
                borderRadius: 1,
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                textAlign: "left",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Search Results:
              </Typography>
              <Typography>
                <strong>Serial Number:</strong> {searchResults.serial_number}
              </Typography>
              <Typography>
                <strong>Gadget Name:</strong> {searchResults.gadget_name || "N/A"}
              </Typography>
              <Typography>
                <strong>Note:</strong> {searchResults.note || "N/A"}
              </Typography>
              <Typography>
                <strong>Status:</strong> {searchResults.status || "N/A"}
              </Typography>
            </Box>
          ) : (
            <Typography sx={{ mt: 2 }}>No results found.</Typography>
          )}
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          backgroundColor: "#1976d2",
          color: "#fff",
          py: 2,
          textAlign: "center",
        }}
      >
        <Typography>&copy; 2025 My Gadgets. All rights reserved.</Typography>
      </Box>
    </Box>
  );
};

export default Home;
