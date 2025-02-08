
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, Card, CardContent, Divider,
  Snackbar, Alert, Avatar, Chip, Grid
} from '@mui/material';
import { Lock as LockIcon, Email as EmailIcon, Person as PersonIcon } from '@mui/icons-material';
import api from '../api/axios';
import getUserDetail from '../hooks/GetUserDetails';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Profile = () => {
    const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
        const userDetails = await getUserDetail();
        setUser(userDetails);
        setUsername(userDetails.username);
        setEmail(userDetails.email);
    } catch (error) {
        console.warn("error", error);
    navigate("/signin");
    }
  };

  const handleUpdateUsername = async () => {
    try {
      if (!username) {
        setSnackbar({ open: true, message: 'Username cannot be empty', severity: 'error' });
        return;
      }
      const res=await axios.post(`/api/users/update-username`, { username });
      console.log("res",res);
      setSnackbar({ open: true, message: 'Username updated successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, 
        message: err.response?.data?.match(/Error: (.*?)<br>/)?.[1] || 'An error occurred',
         severity: 'error' });
    }
  };

  const handleUpdateEmail = async () => {
    try {
      if (!email) {
        setSnackbar({ open: true, message: 'Email cannot be empty', severity: 'error' });
        return;
      }
      await axios.post(`/api/users/update-email`, { email });
      setSnackbar({ open: true, message: 'Email updated successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.match(/Error: (.*?)<br>/)?.[1] || 'An error occurred', severity: 'error' });
    }
  };

  const handleChangePassword = async () => {
    try {
      if (!oldPassword || !newPassword || !confirmPassword) {
        setSnackbar({ open: true, message: 'All fields are required', severity: 'error' });
        return;
      }
      if (newPassword !== confirmPassword) {
        setSnackbar({ open: true, message: 'Passwords do not match', severity: 'error' });
        return;
      }
      await axios.post(`/api/users/update-password`, { oldPassword, newPassword });
      setSnackbar({ open: true, message: 'Password updated successfully', severity: 'success' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.match(/Error: (.*?)<br>/)?.[1] || 'An error occurred', severity: 'error' });
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ fontWeight: 600, color: '#1a237e', mb: 4 }}>
        Profile Settings
      </Typography>

      <Grid container spacing={4}>
        {/* User Details Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ bgcolor: '#1a237e', width: 56, height: 56 }}>
                  <PersonIcon sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {user?.username}
                  </Typography>
                  <Chip label={user?.role} size="small" sx={{ mt: 1, bgcolor: '#1a237e', color: 'white' }} />
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <EmailIcon color="action" />
                  <Typography variant="body1">{user?.email}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LockIcon color="action" />
                  <Typography variant="body1">********</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Update Username Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Update Username
              </Typography>
              <TextField
                fullWidth
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                onClick={handleUpdateUsername}
                sx={{ bgcolor: '#1a237e', '&:hover': { bgcolor: '#0d47a1' } }}
              >
                Update Username
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Update Email Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Update Email
              </Typography>
              <TextField
                fullWidth
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                onClick={handleUpdateEmail}
                sx={{ bgcolor: '#1a237e', '&:hover': { bgcolor: '#0d47a1' } }}
              >
                Update Email
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Change Password Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Change Password
              </Typography>
              <TextField
                fullWidth
                label="Old Password"
                type="password"
                value=""
                onChange={(e) => setOldPassword(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                onClick={handleChangePassword}
                sx={{ bgcolor: '#1a237e', '&:hover': { bgcolor: '#0d47a1' } }}
              >
                Change Password
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Snackbar for Feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;
