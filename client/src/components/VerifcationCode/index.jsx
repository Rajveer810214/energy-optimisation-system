import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  CssBaseline,
  Alert,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Navbar from '../Navbar';
const theme = createTheme();

function EmailVerification() {
  const [formData, setFormData] = useState({
    email: '',
    subject: 'Verification Email', // Default subject
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setSuccess(false); // Reset success state
    console.log("ep",formData.email)
    try {
      const response = await axios.post('http://localhost:4000/api/users/send-verification-code', {
        email: formData.email || localStorage.getItem('email'),
        subject: formData.subject,
      });
     
      if(response.status === 200){
        window.location.href = '/verify-email';
      }
      console.log('Verification email sent:', response.data);
      setSuccess(true);
    } catch (err) {
      console.error('Failed to send verification email:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <ThemeProvider theme={theme}>
       <Navbar />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Send Verification Email
          </Typography>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>Verification email sent successfully!</Alert>}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label={localStorage.getItem('email') ? `Email Address: ${localStorage.getItem('email')}` : 'Email Address'}
              name="email"
              autoComplete="email"
              autoFocus
              value={localStorage.getItem('email') || formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              fullWidth
              id="subject"
              label="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Send Verification Email
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default EmailVerification;
