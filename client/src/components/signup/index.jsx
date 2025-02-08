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
  Grid,
  Link,
  Paper,
  IconButton,
  InputAdornment
} from '@mui/material';
import { createTheme, ThemeProvider, alpha } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Visibility, 
  VisibilityOff, 
  Email, 
  Lock, 
  Person,
  HowToReg,
  ArrowForward,
  Phone
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6366F1',
      light: '#818CF8',
      dark: '#4F46E5',
    },
    background: {
      default: '#F3F4F6',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 16,
  },
});

function SignupPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('https://energy-optimisation-system.onrender.com/api/users/register', {
        username: formData.name,
        email: formData.email,
        // phone: formData.phone,

        password: formData.password,
      });
      console.log(response)
      await localStorage.setItem('email', formData.email);
      await localStorage.setItem('role','user');
      setSuccess(true);
      setTimeout(() => {
        navigate('/verify-code');
      }, 1000);
    } catch (err) {
      const errorMessage = err.response?.data?.match(/Error: (.*?)<br>/)?.[1] || 'An error occurred';
      console.log(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container 
        component="main" 
        maxWidth="lg" 
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
          p: 3
        }}
      >
        <CssBaseline />
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          transition={{ duration: 0.6 }}
          style={{ width: '100%', maxWidth: '1000px' }}
        >
          <Paper
            elevation={24}
            sx={{
              display: 'flex',
              borderRadius: 4,
              overflow: 'hidden',
              background: 'white',
              boxShadow: '0 25px 50px -12px rgba(99, 102, 241, 0.25)',
            }}
          >
            {/* Left Side - Form */}
            <Box
              sx={{
                width: { xs: '100%', md: '50%' },
                p: 6,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <motion.div
                variants={formVariants}
                initial="hidden"
                animate="visible"
              >
                <Typography
                  component="h1"
                  variant="h4"
                  sx={{
                    mb: 4,
                    fontWeight: 700,
                    color: 'primary.main',
                  }}
                >
                  Create Account
                </Typography>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
                    </motion.div>
                  )}
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <Alert severity="success" sx={{ mb: 2 }}>Account created successfully!</Alert>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <motion.div variants={itemVariants}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="name"
                      label="Full Name"
                      name="name"
                      autoComplete="name"
                      autoFocus
                      value={formData.name}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="phone"
                      label="Phone Number"
                      name="phone"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={formData.password}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock color="primary" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="confirmPassword"
                      label="Confirm Password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock color="primary" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              edge="end"
                            >
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={isLoading}
                      sx={{
                        mt: 3,
                        mb: 2,
                        py: 1.5,
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover .arrow': {
                          transform: 'translateX(5px)',
                        },
                      }}
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          ⚪
                        </motion.div>
                      ) : (
                        <>
                          Sign Up
                          <ArrowForward 
                            className="arrow" 
                            sx={{ 
                              ml: 1,
                              transition: 'transform 0.2s',
                            }} 
                          />
                        </>
                      )}
                    </Button>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Grid container justifyContent="center">
                      <Grid item>
                        <Link
                          href="/signin"
                          variant="body2"
                          sx={{
                            color: 'primary.main',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            '&:hover': {
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          Already have an account? Sign In
                        </Link>
                      </Grid>
                    </Grid>
                  </motion.div>
                </Box>
              </motion.div>
            </Box>

            {/* Right Side - Animation */}
            <Box
              sx={{
                width: '50%',
                background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                justifyContent: 'center',
                p: 6,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <HowToReg 
                  sx={{ 
                    fontSize: 180, 
                    color: alpha('#fff', 0.2),
                  }} 
                />
              </motion.div>
              <motion.div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    color: 'white',
                    fontWeight: 700,
                    textAlign: 'center',
                    mb: 2,
                  }}
                >
                  Join Us Today!
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: alpha('#fff', 0.8),
                    textAlign: 'center',
                  }}
                >
                  Create an account to get started
                </Typography>
              </motion.div>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </ThemeProvider>
  );
}

export default SignupPage;