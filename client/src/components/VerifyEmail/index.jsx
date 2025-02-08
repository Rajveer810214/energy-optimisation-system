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
  CircularProgress,
  Fade,
  Zoom,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Navbar from '../Navbar';
import { keyframes } from '@emotion/react';

// Custom keyframes for animations
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function VerifyEmail() {
  const [formData, setFormData] = useState({
    email: '',
    code: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

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
    setLoading(true); // Start loading

    try {
      const response = await axios.post('https://energy-optimisation-system.onrender.com/api/users/verify-email', {
        email: formData.email || localStorage.getItem('email'),
        code: formData.code,
      });

      console.log('Email verified:', response.data);
      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/signin';
      }, 2000); // Redirect after 2 seconds
    } catch (err) {
      const errorMessage = err.response?.data?.match(/Error: (.*?)<br>/)?.[1] || 'An error occurred';
      console.log(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false); // Stop loading
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
            animation: `${fadeIn} 1s ease-in`,
          }}
        >
          <Zoom in={true} timeout={500}>
            <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
              Verify Your Email
            </Typography>
          </Zoom>
          <Fade in={true} timeout={1000}>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1, width: '100%' }}
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
                sx={{ mb: 2 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="code"
                label="Verification Code"
                name="code"
                autoComplete="off"
                value={formData.code}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Verify Email'}
              </Button>
              {error && (
                <Fade in={true} timeout={500}>
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                </Fade>
              )}
              {success && (
                <Fade in={true} timeout={500}>
                  <Alert severity="success" sx={{ mt: 2 }}>
                    Email verified successfully! Redirecting...
                  </Alert>
                </Fade>
              )}
            </Box>
          </Fade>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default VerifyEmail;