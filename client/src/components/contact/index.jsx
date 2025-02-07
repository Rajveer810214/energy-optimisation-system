import React, { useState } from 'react';
import { Box, Container, Grid, Typography, TextField, Button, Card, CardContent, CardActions, Divider, IconButton } from '@mui/material';
import { Phone, Email, LocationOn, Facebook, Twitter, LinkedIn } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Navbar from '../Navbar'

const ContactPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // Form submission logic
    alert('Form submitted');
  };

  return (
    <>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box textAlign="center" sx={{ mb: 8 }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700, color: 'primary.main', mb: 3 }}>
            Contact Us
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary' }}>
            We're here to help. Reach out to us for any queries, feedback, or support!
          </Typography>
        </Box>

        {/* Contact Form Section */}
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ boxShadow: 5, borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Send Us a Message
                </Typography>

                <TextField
                  fullWidth
                  label="Name"
                  variant="outlined"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Message"
                  variant="outlined"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  sx={{ mb: 2 }}
                />
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleSubmit}
                >
                  Send Message
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* Contact Info Section */}
          <Grid item xs={12} md={5}>
            <Box>
              <Card variant="outlined" sx={{ boxShadow: 5, borderRadius: 3, mb: 4 }}>
                <CardContent>
                  <Typography variant="h5" component="h2" gutterBottom>
                    Contact Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Phone sx={{ mr: 2, color: 'primary.main' }} />
                    <Typography variant="body1">+1 (555) 123-4567</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Email sx={{ mr: 2, color: 'primary.main' }} />
                    <Typography variant="body1">support@example.com</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOn sx={{ mr: 2, color: 'primary.main' }} />
                    <Typography variant="body1">1234 Street Name, City, Country</Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* Social Media Section */}
              <Card variant="outlined" sx={{ boxShadow: 5, borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h5" component="h2" gutterBottom>
                    Connect with Us
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <IconButton color="primary" href="https://facebook.com" target="_blank">
                      <Facebook />
                    </IconButton>
                    <IconButton color="primary" href="https://twitter.com" target="_blank">
                      <Twitter />
                    </IconButton>
                    <IconButton color="primary" href="https://linkedin.com" target="_blank">
                      <LinkedIn />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </motion.div>
    </>
  );
};

export default ContactPage;
