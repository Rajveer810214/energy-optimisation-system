import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const AddUserToLab = () => {
  const { labId } = useParams(); // Get labId from URL
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [open, setOpen] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users"); // Fetch all users
        setUsers(response.data.data);
      } catch (error) {
        setSnackbar({
          open: true,
          message: error.response?.data?.match(/Error: (.*?)<br>/)?.[1] || 'An error occurred',
          severity: "error",
        });
      }
    };

    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    if (!selectedUser) return;

    try {
      await api.post(`/labs/${labId}/users/${selectedUser}`); // API Call
      setSnackbar({ open: true, message: "User added successfully!", severity: "success" });
      setTimeout(() => navigate(-1), 1500); // Navigate back after success
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Error adding user to lab",
        severity: "error",
      });
    }
  };

  return (
    <Dialog open={open} onClose={() => navigate(-1)}>
      <DialogTitle>Add User to Lab</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <InputLabel>Select User</InputLabel>
          <Select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
            {users.map((user) => (
              <MenuItem key={user._id} value={user._id}>
                {user.name} ({user.email})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => navigate(-1)}>Cancel</Button>
        <Button onClick={handleAddUser} variant="contained" disabled={!selectedUser}>
          Add User
        </Button>
      </DialogActions>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Dialog>
  );
};

export default AddUserToLab;
