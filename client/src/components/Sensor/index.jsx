import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Snackbar,
  Alert
} from '@mui/material';
import api from '../../api/axios';

const SensorList = () => {
  const { labId } = useParams();
  const [sensors, setSensors] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: '', location: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchSensors = async () => {
    try {
      const response = await api.get(`/labs/${labId}/sensors`);
      setSensors(response.data.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error fetching sensors',
        severity: 'error'
      });
    }
  };

  useEffect(() => {
    fetchSensors();
  }, [labId]);

  const handleSubmit = async () => {
    try {
      await api.post(`/labs/${labId}/sensors`, formData);
      setSnackbar({ open: true, message: 'Sensor added successfully', severity: 'success' });
      setOpen(false);
      fetchSensors();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error adding sensor',
        severity: 'error'
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Lab Sensors</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Add Sensor
        </Button>
      </Box>

      <Grid container spacing={3}>
        {sensors.map((sensor) => (
          <Grid item xs={12} sm={6} md={4} key={sensor._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{sensor.name}</Typography>
                <Typography color="textSecondary">{sensor.type}</Typography>
                <Typography variant="body2">{sensor.location}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Sensor</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Type"
            fullWidth
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Location"
            fullWidth
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>

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

export default SensorList;