import React, { useState, useEffect } from 'react';
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
  IconButton,
  Alert,
  Snackbar
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Sensors as SensorsIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const LabList = () => {
  const [labs, setLabs] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedLab, setSelectedLab] = useState(null);
  const [formData, setFormData] = useState({ name: '', location: '', description: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  const fetchLabs = async () => {
    try {
      const response = await api.get('/labs');
      setLabs(response.data.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error fetching labs',
        severity: 'error'
      });
    }
  };

  useEffect(() => {
    fetchLabs();
  }, []);

  const handleOpen = (lab = null) => {
    if (lab) {
      setSelectedLab(lab);
      setFormData({
        name: lab.name,
        location: lab.location,
        description: lab.description
      });
    } else {
      setSelectedLab(null);
      setFormData({ name: '', location: '', description: '' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedLab(null);
    setFormData({ name: '', location: '', description: '' });
  };

  const handleSubmit = async () => {
    try {
      if (selectedLab) {
        await api.put(`/labs/${selectedLab._id}`, formData);
        setSnackbar({ open: true, message: 'Lab updated successfully', severity: 'success' });
      } else {
        await api.post('/labs', formData);
        setSnackbar({ open: true, message: 'Lab created successfully', severity: 'success' });
      }
      handleClose();
      fetchLabs();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error saving lab',
        severity: 'error'
      });
    }
  };

  const handleDelete = async (labId) => {
    try {
      await api.delete(`/labs/${labId}`);
      setSnackbar({ open: true, message: 'Lab deleted successfully', severity: 'success' });
      fetchLabs();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error deleting lab',
        severity: 'error'
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Labs Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>Add New Lab</Button>
      </Box>

      <Grid container spacing={3}>
        {labs.map((lab) => (
          <Grid item xs={12} sm={6} md={4} key={lab._id}>
            <Card onClick={() => navigate(`/labs/${lab._id}/users`)} sx={{ cursor: 'pointer' }}>
              <CardContent>
                <Typography variant="h6">{lab.name}</Typography>
                <Typography color="textSecondary">{lab.location}</Typography>
                <Typography variant="body2">{lab.description}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Sensors: {lab.sensors?.length || 0}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <IconButton onClick={() => navigate(`/labs/${lab._id}/sensors`)} color="secondary">
                      <SensorsIcon />
                    </IconButton>
                    <IconButton onClick={() => navigate(`/labs/${lab._id}/add-user`)} color="primary">
                      <PersonAddIcon />
                    </IconButton>
                  </Box>
                  <Box>
                    <IconButton onClick={() => handleOpen(lab)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(lab._id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedLab ? 'Edit Lab' : 'Add New Lab'}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Name" fullWidth value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <TextField margin="dense" label="Location" fullWidth value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
          <TextField margin="dense" label="Description" fullWidth multiline rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">{selectedLab ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default LabList;