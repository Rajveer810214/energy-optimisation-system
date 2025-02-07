import React, { useState, useEffect } from 'react';
import { 
  Grid, Paper, Typography, Box, Card, CardContent, Avatar, Button,
  Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText,
  DialogActions, IconButton, Tooltip, LinearProgress, Divider,
  Chip
} from '@mui/material';
import {
  Science as ScienceIcon, Group as GroupIcon, Add as AddIcon,
  Visibility as ViewIcon, TrendingUp as TrendingIcon,
  Speed as SpeedIcon, Sensors as SensorIcon, Warning as WarningIcon,
  CheckCircle as CheckIcon, Dashboard as DashboardIcon,
  Timeline as TimelineIcon, NotificationsActive as AlertIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../api/axios';

const sensorData = [
  { time: '00:00', temperature: 23, humidity: 45, energy: 120 },
  { time: '04:00', temperature: 24, humidity: 48, energy: 125 },
  { time: '08:00', temperature: 26, humidity: 52, energy: 140 },
  { time: '12:00', temperature: 28, humidity: 55, energy: 150 },
  { time: '16:00', temperature: 27, humidity: 54, energy: 145 },
  { time: '20:00', temperature: 25, humidity: 50, energy: 130 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [labs, setLabs] = useState([]);
  const [users, setUsers] = useState([]);
  const [openLabDialog, setOpenLabDialog] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState(3);
  const [systemHealth, setSystemHealth] = useState(92);

  useEffect(() => {
    fetchLabs();
    fetchUsers();
  }, []);

  const fetchLabs = async () => {
    try {
      const response = await api.get('/labs');
      setLabs(response.data.data);
    } catch (error) {
      const errorMessage = err.response?.data?.match(/Error: (.*?)<br>/)?.[1] || 'An error occurred';
      console.log(errorMessage);
      setError(errorMessage);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data.data);
    } catch (error) {
      const errorMessage = err.response?.data?.match(/Error: (.*?)<br>/)?.[1] || 'An error occurred';
      console.log(errorMessage);
      setError(errorMessage);
    }
  };

  const StatCard = ({ icon, title, value, subtitle, onClick, color, trend }) => (
    <Card 
      onClick={onClick}
      sx={{ 
        height: '100%',
        background: `linear-gradient(135deg, ${color}15, ${color}05)`,
        border: `1px solid ${color}30`,
        borderRadius: 3,
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        '&:hover': { 
          transform: 'translateY(-8px)',
          boxShadow: `0 8px 24px ${color}20`
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Avatar sx={{ bgcolor: color, width: 48, height: 48 }}>
            {icon}
          </Avatar>
          {trend && (
            <Chip 
              icon={<TrendingIcon />} 
              label={trend} 
              size="small"
              sx={{ bgcolor: `${color}20`, color: color }}
            />
          )}
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 700, color: color, mb: 1 }}>
          {value}
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ 
      p: 4, 
      background: 'linear-gradient(145deg, #f6f8fc, #f0f4f8)',
      minHeight: '100vh'
    }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <DashboardIcon sx={{ fontSize: 40, color: '#1a237e' }} />
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a237e' }}>
          Lab Management Dashboard
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <StatCard 
            icon={<ScienceIcon />}
            title="Total Labs"
            value={labs.length}
            subtitle="Active Research Facilities"
            color="#2196f3"
            trend="+2 this month"
            onClick={() => navigate('/labs')}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard 
            icon={<GroupIcon />}
            title="Total Users"
            value={users.length}
            subtitle="Researchers & Staff"
            color="#4caf50"
            trend="+5 this week"
            onClick={() => navigate('/users')}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard 
            icon={<SensorIcon />}
            title="Active Sensors"
            value="124"
            subtitle="Across All Labs"
            color="#ff9800"
            trend="98% uptime"
            onClick={() => navigate('/sensors')}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard 
            icon={<AlertIcon />}
            title="Active Alerts"
            value={activeAlerts}
            subtitle="Require Attention"
            color="#f44336"
            onClick={() => navigate('/alerts')}
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, height: '100%', borderRadius: 3 }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Sensor Metrics Overview
              </Typography>
              <Button startIcon={<TimelineIcon />} variant="outlined">
                Detailed Analytics
              </Button>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sensorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Line type="monotone" dataKey="temperature" stroke="#f44336" />
                <Line type="monotone" dataKey="humidity" stroke="#2196f3" />
                <Line type="monotone" dataKey="energy" stroke="#4caf50" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, height: '100%', borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              System Health
            </Typography>
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Overall Status
                </Typography>
                <Typography variant="body2" color="primary">
                  {systemHealth}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={systemHealth} 
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
            <List>
              <ListItem sx={{ px: 0 }}>
                <ListItemText 
                  primary="Sensor Network"
                  secondary="All systems operational"
                />
                <CheckIcon color="success" />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemText 
                  primary="Data Storage"
                  secondary="85% capacity remaining"
                />
                <CheckIcon color="success" />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemText 
                  primary="Alert System"
                  secondary="Minor issues detected"
                />
                <WarningIcon color="warning" />
              </ListItem>
            </List>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 3
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Recent Lab Activities
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<ViewIcon />}
                onClick={() => setOpenLabDialog(true)}
                sx={{ borderRadius: 2 }}
              >
                View All Labs
              </Button>
            </Box>

            <Grid container spacing={2}>
              {labs.slice(0, 4).map((lab) => (
                <Grid item xs={12} sm={6} md={3} key={lab._id}>
                  <Card sx={{ 
                    bgcolor: '#f5f5f5',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.02)' }
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <ScienceIcon color="primary" />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {lab.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Active Users: {lab.users?.length || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Sensors: {lab.sensors?.length || 0}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Grid>
      </Grid>

      <Dialog 
        open={openLabDialog} 
        onClose={() => setOpenLabDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ bgcolor: '#1a237e', color: 'white' }}>
          Lab Details
        </DialogTitle>
        <DialogContent dividers>
          <List>
            {labs.map((lab) => (
              <ListItem key={lab._id}>
                <ListItemText 
                  primary={<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{lab.name}</Typography>}
                  secondary={
                    <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                      <Chip 
                        size="small" 
                        icon={<GroupIcon />} 
                        label={`${lab.users?.length || 0} Users`}
                      />
                      <Chip 
                        size="small" 
                        icon={<SensorIcon />} 
                        label={`${lab.sensors?.length || 0} Sensors`}
                      />
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenLabDialog(false)} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;