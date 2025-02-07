import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Button,
  TextField,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Person as PersonIcon,
  Email as EmailIcon,
  AdminPanelSettings as AdminIcon 
} from '@mui/icons-material';
import api from "../../api/axios";
import Navbar from "../Navbar";
import getUserDetail from "../../hooks/GetUserDetails";

const LabUsers = () => {
  const { labId } = useParams();
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);
  const [newEmail, setNewEmail] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const loggedInUser = await getUserDetail();
        setUser(loggedInUser);
        const response = await api.get(`/labs/${labId}/users`);
        setUsers(response.data.data);
      } catch (error) {
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [labId]);

  const handleEditClick = (userId, currentEmail) => {
    setEditingUserId(userId);
    setNewEmail(currentEmail);
  };

  const handleSaveEmail = async (userId) => {
    try {
      const response = await api.patch(`/users/${userId}/email`, { email: newEmail });
      setUsers(users.map((u) => (u._id === userId ? { ...u, email: response.data.data.email } : u)));
      setEditingUserId(null);
    } catch (error) {
      const errorMessage = err.response?.data?.match(/Error: (.*?)<br>/)?.[1] || 'An error occurred';
      console.log(errorMessage);
      setError(errorMessage);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/labs/${labId}/users/${userId}`);
      setUsers(users.filter((u) => u._id !== userId));
      setDeleteConfirmation(null);
    } catch (error) {
      const errorMessage = err.response?.data?.match(/Error: (.*?)<br>/)?.[1] || 'An error occurred';
      console.log(errorMessage);
      setError(errorMessage);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <>
    
      <Box sx={{ 
        p: 4, 
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        minHeight: 'calc(100vh - 64px)'
      }}>
        <Typography 
          variant="h4" 
          sx={{ 
            mb: 3, 
            fontWeight: "bold", 
            color: "#1976d2",
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <PersonIcon fontSize="large" /> Users in Lab
        </Typography>
        <Grid container spacing={3}>
          {users.map((userItem) => (
            <Grid item xs={12} sm={6} md={4} key={userItem._id}>
              <Card
                sx={{
                  p: 2,
                  borderRadius: 3,
                  background: 'white',
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                  transition: "0.3s",
                  "&:hover": { 
                    boxShadow: "0px 6px 16px rgba(0,0,0,0.2)",
                    transform: "translateY(-5px)"
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EmailIcon sx={{ mr: 2, color: '#1976d2' }} />
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      {userItem.email}
                    </Typography>
                  </Box>

                  <Chip
                    icon={<AdminIcon />}
                    label={`Role: ${userItem.role}`}
                    sx={{
                      mb: 2,
                      fontWeight: "bold",
                      backgroundColor: userItem.role === "admin" ? "#1976d2" : "#4caf50",
                      color: "#fff",
                    }}
                  />

                  {user?.role === "admin" && (
                    <Stack direction="row" spacing={1}>
                      <Button
                        startIcon={<EditIcon />}
                        variant="contained"
                        size="small"
                        sx={{
                          backgroundColor: "#1976d2",
                          "&:hover": { backgroundColor: "#1565c0" },
                        }}
                        onClick={() => handleEditClick(userItem._id, userItem.email)}
                      >
                        Edit
                      </Button>

                      <Button
                        startIcon={<DeleteIcon />}
                        variant="contained"
                        size="small"
                        sx={{
                          backgroundColor: "#d32f2f",
                          "&:hover": { backgroundColor: "#b71c1c" },
                        }}
                        onClick={() => setDeleteConfirmation(userItem._id)}
                      >
                        Delete
                      </Button>
                    </Stack>
                  )}

                  {editingUserId === userItem._id && (
                    <Stack spacing={1} sx={{ mt: 2 }}>
                      <TextField
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        fullWidth
                        size="small"
                        variant="outlined"
                        label="New Email"
                        InputProps={{
                          startAdornment: <EmailIcon sx={{ mr: 1, color: '#1976d2' }} />
                        }}
                      />
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => handleSaveEmail(userItem._id)}
                        >
                          Save
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          onClick={() => setEditingUserId(null)}
                        >
                          Cancel
                        </Button>
                      </Stack>
                    </Stack>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={!!deleteConfirmation}
          onClose={() => setDeleteConfirmation(null)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this user?</Typography>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setDeleteConfirmation(null)} 
              color="secondary"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => handleDeleteUser(deleteConfirmation)} 
              color="error" 
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default LabUsers;