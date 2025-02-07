import React, { useState, useEffect } from "react";
import { 
  Container, Typography, Button, Grid, Box, Paper, 
  Card, CardContent, IconButton, Chip, LinearProgress
} from "@mui/material";
import { styled } from "@mui/system";
import { motion, AnimatePresence } from "framer-motion";
import {
  ElectricBolt, ShowChart, Insights, Eco, Wifi, Security,
  Timeline, TrendingUp, Speed, Analytics, Cloud, Settings
} from "@mui/icons-material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useNavigate } from "react-router-dom";

// Mock data for charts
const energyData = [
  { month: "Jan", consumption: 65 },
  { month: "Feb", consumption: 59 },
  { month: "Mar", consumption: 80 },
  { month: "Apr", consumption: 55 },
  { month: "May", consumption: 40 }
];

// Enhanced Styled Components
const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)`,
  color: "#fff",
  padding: theme.spacing(15, 2),
  position: "relative",
  overflow: "hidden",
  "&::after": {
    content: '""',
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    background: "url('/api/placeholder/1200/600') center/cover",
    opacity: 0.1,
  }
}));

const GlassCard = styled(Card)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  borderRadius: "16px",
  padding: theme.spacing(3),
  border: "1px solid rgba(255, 255, 255, 0.2)",
}));

const AnimatedFeatureCard = styled(motion(Paper))(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: "center",
  borderRadius: "16px",
  height: "100%",
  background: "linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-10px)",
    boxShadow: "0 20px 30px rgba(0,0,0,0.1)",
  }
}));

const LandingPage = () => {
  const [activeMetric, setActiveMetric] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const navigate=useNavigate();

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveMetric((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const metrics = [
    { value: "30%", label: "Energy Savings", color: "#4CAF50" },
    { value: "24/7", label: "Monitoring", color: "#2196F3" },
    { value: "99.9%", label: "Uptime", color: "#9C27B0" },
    { value: "15min", label: "Response Time", color: "#FF9800" }
  ];

  return (
    <Box>
      <HeroSection>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h2" gutterBottom sx={{ fontWeight: 700 }}>
                  Smart Energy Management
                </Typography>
                <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                  Transform your building into an energy-efficient powerhouse
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    borderRadius: "30px",
                    px: 4,
                    py: 2,
                    background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                    boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
                  }}
                >
                  Start Optimizing
                </Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <GlassCard>
                  <LineChart width={500} height={300} data={energyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="consumption" 
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </GlassCard>
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </HeroSection>

      {/* Animated Metrics Section */}
      <Container maxWidth="lg" sx={{ mt: -5 }}>
        <Grid container spacing={3}>
          {metrics.map((metric, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <AnimatePresence>
                {activeMetric === index && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Paper
                      sx={{
                        p: 3,
                        textAlign: "center",
                        background: `linear-gradient(135deg, ${metric.color}20 0%, ${metric.color}10 100%)`,
                        border: `2px solid ${metric.color}`,
                      }}
                    >
                      <Typography variant="h3" sx={{ color: metric.color, fontWeight: 700 }}>
                        {metric.value}
                      </Typography>
                      <Typography variant="subtitle1">{metric.label}</Typography>
                    </Paper>
                  </motion.div>
                )}
              </AnimatePresence>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Enhanced Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 700 }}>
          Smart Features
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {[
            {
              icon: <Speed sx={{ fontSize: 40, color: "#2196F3" }} />,
              title: "Real-Time Analytics",
              description: "Monitor energy consumption patterns with millisecond precision",
              color: "#2196F3"
            },
            {
              icon: <Analytics sx={{ fontSize: 40, color: "#4CAF50" }} />,
              title: "Predictive Insights",
              description: "AI-powered predictions for optimal energy usage",
              color: "#4CAF50"
            },
            {
              icon: <Cloud sx={{ fontSize: 40, color: "#9C27B0" }} />,
              title: "Cloud Integration",
              description: "Seamless cloud storage and processing capabilities",
              color: "#9C27B0"
            }
          ].map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <AnimatedFeatureCard
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h5" gutterBottom sx={{ color: feature.color }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={75} 
                  sx={{ 
                    mt: 2, 
                    height: 6, 
                    borderRadius: 3,
                    backgroundColor: `${feature.color}20`,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: feature.color
                    }
                  }} 
                />
              </AnimatedFeatureCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box sx={{ 
        background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
        py: 8,
        mt: 8 
      }}>
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Typography variant="h3" align="center" sx={{ color: "white", mb: 4 }}>
              Ready to Optimize?
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              <Button onClick={() => navigate("/signin")}
                variant="contained"
                size="large"
                
                sx={{
                  borderRadius: "30px",
                  px: 4,
                  py: 2,
                  background: "white",
                  color: "#1e3c72",
                  "&:hover": {
                    background: "#f5f5f5"
                  }
                }}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderRadius: "30px",
                  px: 4,
                  py: 2,
                  borderColor: "white",
                  color: "white",
                  "&:hover": {
                    borderColor: "white",
                    background: "rgba(255,255,255,0.1)"
                  }
                }}
              >
                Learn More
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;