import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Switch,
  FormControlLabel,
} from "@mui/material";
import axios from "axios";

const Dashboard = () => {
  const [gadgets, setGadgets] = useState([]);
  const [filteredGadgets, setFilteredGadgets] = useState([]);
  const [reportTypes, setReportTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [selectedGadgetId, setSelectedGadgetId] = useState(null);
  const [editGadget, setEditGadget] = useState({});
  const [newGadget, setNewGadget] = useState({
    gadget_name: "",
    serial_number: "",
    note: "",
    report_type_id: 3,
  });

  const fetchGadgets = useCallback(async () => {
    try {
      const userId = localStorage.getItem("user_id");
      const response = await axios.get(
        `http://127.0.0.1:5000/users/${userId}/gadgets?is_deleted=${showDeleted}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setGadgets(response.data);
      setFilteredGadgets(response.data);
    } catch (error) {
      console.error("Failed to fetch gadgets:", error);
    }
  }, [showDeleted]);

  const fetchReportTypes = useCallback(async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/report_types", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setReportTypes(response.data);
    } catch (error) {
      console.error("Failed to fetch report types:", error);
    }
  }, []);

  useEffect(() => {
    fetchGadgets();
    fetchReportTypes();
  }, [fetchGadgets, fetchReportTypes]);

  useEffect(() => {
    const filtered = gadgets.filter((gadget) =>
      [gadget.gadget_name, gadget.serial_number, gadget.note, gadget.report_type]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredGadgets(filtered);
  }, [searchTerm, gadgets]);

  const handleToggleDeleted = () => setShowDeleted(!showDeleted);
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const handleAddGadget = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      const payload = { ...newGadget, owner_id: userId };
      await axios.post("http://127.0.0.1:5000/gadgets", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchGadgets();
      setNewGadget({ gadget_name: "", serial_number: "", note: "", report_type_id: 3 });
      handleCloseAdd();
    } catch (error) {
      console.error("Failed to add gadget:", error);
    }
  };

  const handleOpenEdit = (gadget) => {
    const matchingReportType = reportTypes.find(
      (type) => type.report_type_name === gadget.report_type
    );

    setEditGadget({
      id: gadget.id,
      gadget_name: gadget.gadget_name,
      serial_number: gadget.serial_number,
      note: gadget.note,
      report_type_id: matchingReportType ? matchingReportType.report_type_id : "",
    });
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setEditGadget({});
    setOpenEdit(false);
  };

  const handleEditGadget = async () => {
    try {
      const payload = {
        gadget_name: editGadget.gadget_name,
        serial_number: editGadget.serial_number,
        note: editGadget.note,
        report_type_id: editGadget.report_type_id,
      };
      await axios.put(
        `http://127.0.0.1:5000/gadgets/${editGadget.id}/update`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchGadgets();
      handleCloseEdit();
    } catch (error) {
      console.error("Failed to edit gadget:", error);
    }
  };

  const handleOpenDeleteConfirm = (gadgetId) => {
    setSelectedGadgetId(gadgetId);
    setOpenDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setSelectedGadgetId(null);
    setOpenDeleteConfirm(false);
  };

  const handleDeleteGadget = async () => {
    try {
      await axios.put(
        `http://127.0.0.1:5000/gadgets/${selectedGadgetId}`,
        { is_deleted: true },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchGadgets();
      handleCloseDeleteConfirm();
    } catch (error) {
      console.error("Failed to delete gadget:", error);
    }
  };

  const handleRecoverGadget = async (gadgetId) => {
    try {
      await axios.put(
        `http://127.0.0.1:5000/gadgets/${gadgetId}/recover`,
        { is_deleted: false },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchGadgets();
    } catch (error) {
      console.error("Failed to recover gadget:", error);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f7f8fc" }}>
      {/* Header */}
      <Box sx={{ backgroundColor: "#1976d2", color: "#fff", padding: 2 }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              My Gadgets Dashboard
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {/* Profile Button with Icon */}
              <Button
                color="inherit"
                onClick={() => {
                  window.location.href = "/profile";
                }}
                sx={{
                  backgroundColor: "#fff",
                  color: "#1976d2",
                  "&:hover": { backgroundColor: "#e3f2fd" },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "100px", // Ensure same size
                  padding: "8px 16px", // Consistent padding
                   marginRight: 2, // Space between buttons
                  
                }}
              >
                <Box component="span" sx={{ marginRight: 1,alignItems: "center" }}>
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    alt="User Icon"
                    width="20"
                    height="20"
                  />
                </Box>
                PROFILE
              </Button>

              {/* Logout Button */}
              <Button
                color="inherit"
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
                sx={{
                  backgroundColor: "#fff",
                  color: "#1976d2",
                  "&:hover": { backgroundColor: "#e3f2fd" },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "100px", // Ensure same size
                  height: "44px", // Ensure same size
                  padding: "8px 16px", // Consistent padding
                  marginRight: 2, // Space between buttons
                }}
              >
                Logout
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Gadgets Section */}
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Pajisjet e mia
          </Typography>
          <Button variant="contained" color="primary" onClick={handleOpenAdd}>
            Add Gadget
          </Button>
        </Box>

        {/* Toggle for Deleted Gadgets */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={showDeleted}
                onChange={handleToggleDeleted}
                color="primary"
              />
            }
            label="Shfaq pajisjet e fshira"
          />
        </Box>

        {/* Search Box */}
        <Box sx={{ mb: 3 }}>
          <TextField
            label="Kerko ne baze te emrin, numrit serial ose statusit"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            variant="outlined"
          />
        </Box>

        {filteredGadgets.length === 0 ? (
          <Typography>Pajisja qe kerkoni nuk gjendet</Typography>
        ) : (
          <Grid container spacing={4}>
            {filteredGadgets.map((gadget) => (
              <Grid item xs={12} sm={6} md={4} key={gadget.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{gadget.gadget_name}</Typography>
                    <Typography variant="body2">
                      Serial Number: {gadget.serial_number}
                    </Typography>
                    <Typography variant="body2">Note: {gadget.note}</Typography>
                    <Typography variant="body2">
                      Status: {gadget.report_type || "N/A"}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      {!gadget.is_deleted ? (
                        <>
                          <Button
                            variant="outlined"
                            color="primary"
                            sx={{ mr: 1 }}
                            onClick={() => handleOpenEdit(gadget)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleOpenDeleteConfirm(gadget.id)}
                          >
                            Delete
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleRecoverGadget(gadget.id)}
                        >
                          Recover
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteConfirm} onClose={handleCloseDeleteConfirm}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this gadget? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm}>Cancel</Button>
          <Button
            onClick={handleDeleteGadget}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Gadget Dialog */}
      <Dialog open={openEdit} onClose={handleCloseEdit}>
        <DialogTitle>Edit Gadget</DialogTitle>
        <DialogContent>
          <TextField
            label="Gadget Name"
            value={editGadget.gadget_name || ""}
            onChange={(e) =>
              setEditGadget({ ...editGadget, gadget_name: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Serial Number"
            value={editGadget.serial_number || ""}
            onChange={(e) =>
              setEditGadget({ ...editGadget, serial_number: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Note"
            value={editGadget.note || ""}
            onChange={(e) =>
              setEditGadget({ ...editGadget, note: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Status"
            select
            value={editGadget.report_type_id || ""}
            onChange={(e) =>
              setEditGadget({ ...editGadget, report_type_id: e.target.value })
            }
            fullWidth
            margin="normal"
          >
            {reportTypes.map((type) => (
              <MenuItem key={type.report_type_id} value={type.report_type_id}>
                {type.report_type_name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button onClick={handleEditGadget} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Gadget Dialog */}
      <Dialog open={openAdd} onClose={handleCloseAdd}>
        <DialogTitle>Add New Gadget</DialogTitle>
        <DialogContent>
          <TextField
            label="Gadget Name"
            value={newGadget.gadget_name}
            onChange={(e) =>
              setNewGadget({ ...newGadget, gadget_name: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Serial Number"
            value={newGadget.serial_number}
            onChange={(e) =>
              setNewGadget({ ...newGadget, serial_number: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Note"
            value={newGadget.note}
            onChange={(e) =>
              setNewGadget({ ...newGadget, note: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Status"
            select
            value={newGadget.report_type_id}
            onChange={(e) =>
              setNewGadget({ ...newGadget, report_type_id: e.target.value })
            }
            fullWidth
            margin="normal"
          >
            {reportTypes.map((type) => (
              <MenuItem key={type.report_type_id} value={type.report_type_id}>
                {type.report_type_name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd}>Cancel</Button>
          <Button onClick={handleAddGadget} variant="contained" color="primary">
            Add Gadget
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
