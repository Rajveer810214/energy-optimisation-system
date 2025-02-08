import  { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, Grid, Button, Dialog, 
  DialogTitle, DialogContent, TextField, DialogActions, Snackbar, 
  Alert, IconButton, Chip, Avatar, Divider, Tooltip
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  DeviceHub as DeviceIcon, Wifi as WifiIcon, LocationOn as LocationIcon,
  Settings as SettingsIcon, QrCode as QrCodeIcon
} from '@mui/icons-material';
import api from '../../api/axios';
import getUserDetail from '../../hooks/GetUserDetails';
import tokenHeader from '../../utils/header-token'
const sensorTypes = ['Temperature', 'Humidity', 'Pressure', 'Motion', 'Light', 'Sound'];
const typeColors = {
  'Temperature': '#f44336',
  'Humidity': '#2196f3',
  'Pressure': '#4caf50',
  'Motion': '#ff9800',
  'Light': '#ffd700',
  'Sound': '#9c27b0'
};

const SensorList = () => {
  const { labId } = useParams();
  const [sensors, setSensors] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    sensorType: '',
    location: '',
    macAddress: '',
    sensorId: '',
    deviceName: ''
  });
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    const userDetails = await getUserDetail();
    setUser(userDetails);
    fetchSensors();
  };

  const fetchSensors = async () => {
    try {
      const response = await api.get(`/labs/${labId}/sensors`, tokenHeader);
      setSensors(response.data.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message : error.response?.data?.match(/Error: (.*?)<br>/)?.[1] || 'An error occurred',
        severity: 'error'
      });
    }
  };

  const handleSaveSensor = async () => {
    try {
        console.log("Form Data Before Sending:", formData); // Debugging

        if (!formData.sensorType || !formData.deviceName || !formData.macAddress || !formData.sensorId || !formData.location) {
            setSnackbar({ open: true, message: 'All fields are required', severity: 'error' });
            return;
        }

        await api.post(`/labs/${labId}/sensors`, formData, tokenHeader);
        setSnackbar({ open: true, message: 'Sensor added successfully', severity: 'success' });

        setOpen(false);
        fetchSensors();
    } catch (error) {
        console.error("Error saving sensor:", error);
        setSnackbar({
            open: true,
            message: error.response?.data?.message || 'Error saving sensor',
            severity: 'error'
        });
    }
};


  const handleDeleteSensor = async () => {
    try {
      await api.delete(`labs/${labId}/sensors/${selectedSensor._id}`, tokenHeader);
      setSnackbar({ open: true, message: 'Sensor deleted successfully', severity: 'success' });
      setDeleteDialogOpen(false);
      fetchSensors();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error deleting sensor',
        severity: 'error'
      });
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4,
        backgroundColor: 'white',
        p: 3,
        borderRadius: 2,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <DeviceIcon sx={{ fontSize: 40, color: '#1a237e' }} />
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#1a237e' }}>
            Lab Sensors
          </Typography>
        </Box>
        {user?.role === 'admin' && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => { setSelectedSensor(null); setOpen(true); }}
            sx={{
              borderRadius: 2,
              bgcolor: '#1a237e',
              '&:hover': { bgcolor: '#0d47a1' }
            }}
          >
            Add Sensor
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {sensors.map((sensor) => (
          <Grid item xs={12} sm={6} md={4} key={sensor._id}>
            <Card sx={{
              height: '100%',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: typeColors[sensor.type] || '#757575' }}>
                    <SettingsIcon />
                  </Avatar>
                  <Box>
                    {/* <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {sensor.name}
                    </Typography> */}
                    <Chip
                      label={sensor.sensorType}
                      size="small"
                      sx={{
                        bgcolor: typeColors[sensor.type] || '#757575',
                        color: 'white',
                        mt: 0.5
                      }}
                    />
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <QrCodeIcon color="action" />
                    <Typography variant="body2">ID: {sensor.sensorId}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WifiIcon color="action" />
                    <Typography variant="body2">MAC: {sensor.macAddress}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DeviceIcon color="action" />
                    <Typography variant="body2">Device: {sensor.deviceName}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationIcon color="action" />
                    <Typography variant="body2">Location: {sensor.location}</Typography>
                  </Box>
                </Box>

                {user?.role === 'admin' && (
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end', 
                    gap: 1,
                    mt: 3,
                    pt: 2,
                    borderTop: '1px solid #eee'
                  }}>
                    <Tooltip title="Edit Sensor">
                      <IconButton
                        onClick={() => { setSelectedSensor(sensor); setOpen(true); }}
                        sx={{ 
                          color: '#1976d2',
                          '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.1)' }
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Sensor">
                      <IconButton
                        onClick={() => { setSelectedSensor(sensor); setDeleteDialogOpen(true); }}
                        sx={{ 
                          color: '#d32f2f',
                          '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.1)' }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog 
        open={open} 
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ 
          bgcolor: '#1a237e', 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          {selectedSensor ? <EditIcon /> : <AddIcon />}
          {selectedSensor ? 'Edit Sensor' : 'Add New Sensor'}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          
            <TextField
              select
              label="Sensor Type"
              fullWidth
              value={formData.sensorType}
              onChange={(e) => setFormData({ ...formData, sensorType: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              SelectProps={{
                native: true
              }}
            >
              <option value="">Select Type</option>
              {sensorTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </TextField>
            <TextField
              label="MAC Address"
              fullWidth
              value={formData.macAddress}
              onChange={(e) => setFormData({ ...formData, macAddress: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              label="Sensor ID"
              fullWidth
              value={formData.sensorId}
              onChange={(e) => setFormData({ ...formData, sensorId: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              label="Device Name"
              fullWidth
              value={formData.deviceName}
              onChange={(e) => setFormData({ ...formData, deviceName: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              label="Location"
              fullWidth
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveSensor}
            variant="contained"
            sx={{ 
              borderRadius: 2,
              bgcolor: '#1a237e',
              '&:hover': { bgcolor: '#0d47a1' }
            }}
          >
            {selectedSensor ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ bgcolor: '#d32f2f', color: 'white' }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent sx={{ p: 3, mt: 2 }}>
          <Typography>Are you sure you want to delete this sensor?</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteSensor}
            variant="contained"
            color="error"
            sx={{ borderRadius: 2 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SensorList;