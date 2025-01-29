import React from 'react';
import { motion } from 'framer-motion';
import { Power, Activity, AlertTriangle, Check, Server, Battery, Zap, Save } from 'lucide-react';
import { Container, Grid, Typography, Card, CardContent, Button, Box } from '@mui/material';
import Navbar from '../Navbar'

const AboutPage = () => {
  const features = [
    {
      icon: <Power className="w-8 h-8" />,
      title: "Real-Time Monitoring",
      description: "Track power consumption across all devices with live updates every minute"
    },
    {
      icon: <AlertTriangle className="w-8 h-8" />,
      title: "Power Loss Detection",
      description: "Instant alerts when power loss is detected in any connected device"
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Usage Analytics",
      description: "Detailed analytics and visualization of power consumption patterns"
    },
    {
      icon: <Save className="w-8 h-8" />,
      title: "Energy Efficiency",
      description: "Identify power-intensive devices and optimize energy usage"
    }
  ];

  const stats = [
    { value: "99.9%", label: "System Uptime" },
    { value: "<1s", label: "Alert Response" },
    { value: "24/7", label: "Monitoring" },
    { value: "100%", label: "Accuracy" }
  ];

  return (
    <>
    <Navbar />
    <Container sx={{ minHeight: '100vh', padding: 4 }}>
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', marginBottom: '64px' }}
      >
        <Typography variant="h3" sx={{ fontWeight: 'bold', marginBottom: 3, color: '#1f2937' }}>
          Smart Power Monitoring System
        </Typography>
        <Typography variant="h5" sx={{ color: '#4b5563', marginBottom: 3 }}>
          Advanced real-time power monitoring solution for efficient energy management and device control
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Zap sx={{ fontSize: 48, color: '#3b82f6' }} />
          <Battery sx={{ fontSize: 48, color: '#10b981' }} />
          <Server sx={{ fontSize: 48, color: '#9333ea' }} />
        </Box>
      </motion.div>

      {/* Stats Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{ marginBottom: '64px' }}
      >
        <Grid container spacing={4} justifyContent="center">
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                style={{ textAlign: 'center' }}
              >
                <Card sx={{ padding: 3, boxShadow: 3, backgroundColor: 'white' }}>
                  <CardContent>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#3b82f6', marginBottom: 1 }}>
                      {stat.value}
                    </Typography>
                    <Typography sx={{ color: '#6b7280' }}>
                      {stat.label}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      {/* Features Grid */}
      <Grid container spacing={4} justifyContent="center" sx={{ marginBottom: '64px' }}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={6} key={index}>
            <motion.div
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 * index }}
              style={{ display: 'flex', backgroundColor: 'white', padding: 24, borderRadius: 8, boxShadow: 3 }}
            >
              <Box sx={{ color: '#3b82f6', marginRight: 3 }}>
                {feature.icon}
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                  {feature.title}
                </Typography>
                <Typography sx={{ color: '#6b7280' }}>
                  {feature.description}
                </Typography>
              </Box>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* System Overview */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        style={{ backgroundColor: 'white', padding: 32, borderRadius: 8, boxShadow: 3, marginBottom: '64px' }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 4, textAlign: 'center' }}>
          How It Works
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {['Continuous Monitoring', 'Instant Alerts', 'Data Analysis', 'Automated Response'].map((step, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
              <Check sx={{ fontSize: 24, color: '#10b981', marginRight: 2 }} />
              <Typography sx={{ color: '#4b5563' }}>
                <span style={{ fontWeight: 'bold' }}>{step}:</span> {step === 'Continuous Monitoring' ? 'Our system continuously tracks power consumption across all connected devices in real-time.' : 
                step === 'Instant Alerts' ? 'Receive immediate notifications when power loss is detected or when consumption patterns show anomalies.' : 
                step === 'Data Analysis' ? 'Advanced analytics help identify patterns and optimize power usage across your infrastructure.' :
                'System automatically detects and responds to power-related issues, ensuring minimal downtime.'}
              </Typography>
            </Box>
          ))}
        </Box>
      </motion.div>

      {/* Contact Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        style={{ textAlign: 'center' }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
          Need More Information?
        </Typography>
        <Typography sx={{ color: '#6b7280', marginBottom: 3 }}>
          Contact our support team for detailed specifications and custom solutions
        </Typography>
        <Button variant="contained" sx={{ backgroundColor: '#3b82f6', padding: '12px 32px', fontWeight: 'bold', '&:hover': { backgroundColor: '#2563eb' } }}>
          Contact Support
        </Button>
      </motion.div>
    </Container>
    </>
  );
};

export default AboutPage;
