import  { useState, useEffect } from 'react';
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
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Avatar,
  Badge,
  Skeleton,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Sensors as SensorsIcon,
  PersonAdd as PersonAddIcon,
  Science as ScienceIcon,
  LocationOn as LocationIcon,
  Description as DescriptionIcon,
  Info as InfoIcon,           // Info Icon
  Report as ReportIcon        // Report Icon
} from '@mui/icons-material';
import EmptyIllustration from '../EmptyIllustration';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import getUserDetail from '../../hooks/GetUserDetails';
import tokenHeader from '../../utils/header-token';
const departments = ['Computer Science', 'IT', 'Mechanical'];
const departmentColors = {
  'Computer Science': '#2196f3',
  'IT': '#4caf50',
  'Mechanical': '#ff9800'
};

const LabList = () => {
  const [labs, setLabs] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedLab, setSelectedLab] = useState(null);
  const [formData, setFormData] = useState({ name: '', location: '', description: '', department: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    setLoading(true)
   try {
     const userDetails = await getUserDetail();
     console.log("user")
     if (!userDetails || Object.keys(userDetails).length === 0) {
       // Redirect to /signin if userDetails is empty or null
       console.log("user")
       navigate("/signin");
       return;
     }
     console.log(userDetails)
     setUser(userDetails);
     fetchLabs(userDetails);
   } catch (error) {
    console.warn("error", error);
    navigate("/signin");
   }
   finally{
    setTimeout(() => {
      
      setLoading(false)
    }, 2000);
  }
  };

  const fetchLabs = async (loggedInUser) => {
    setLoading(true)
    try {
      
      const response = await api.get(`/labs?department=${selectedDepartment}`, tokenHeader);
      let filteredLabs = response.data.data;
      if (loggedInUser && loggedInUser.role !== 'admin') {
        filteredLabs = filteredLabs.filter(lab => lab.users.includes(loggedInUser._id));
      }
      setLabs(filteredLabs);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'An error occurred',
        severity: 'error'
      });
      
    }
    finally{
      setTimeout(() => {
        
        setLoading(false)
      }, 2000);
    }
  };

  useEffect(() => {
    if (user) {
      fetchLabs(user);
    }
  }, [selectedDepartment]);

  const handleOpen = (lab = null) => {

    console.log("Opening modal with lab:", lab);
    if (lab) {
      setSelectedLab(lab);
      setFormData({ name: lab.name, location: lab.location, description: lab.description, department: lab.department });
    } else {
      setSelectedLab(null);
      setFormData({ name: '', location: '', description: '', department: '' });
    }
    setOpen(true);
  };
  

  const handleClose = () => {
    setOpen(false);
    setSelectedLab(null);
    setFormData({ name: '', location: '', description: '', department: '' });
  };

  const handleSubmit = async () => {
    setLoading(true)
    try {
      console.log(selectedLab+"hi")
      if (selectedLab) {
        await fetch.put(`https://energy-optimisation-system.onrender.com/api/admin/labs/${selectedLab._id}`, formData);
        setSnackbar({ open: true, message: 'Lab updated successfully', severity: 'success' });
      } else {
        console.log(formData)
        await api.post('/labs', formData, tokenHeader);
        setSnackbar({ open: true, message: 'Lab created successfully', severity: 'success' });
      }
      handleClose();
      fetchLabs(user);
    } catch (error) {
      setSnackbar({ open: true, message: 'Error saving lab', severity: error });
    }
    finally{
      setTimeout(() => {
        
        setLoading(false)
      }, 2000);
    }
  };

  const handleDelete = async (labId) => {
    setLoading(true)
    try {
      await api.delete(`/labs/${labId}`, tokenHeader);
      setSnackbar({ open: true, message: 'Lab deleted successfully', severity: 'success' });
      fetchLabs(user);
    } catch (error) {
      setSnackbar({ open: true, message: 'Error deleting lab', severity: error });
      setLoading(false)
    }
    finally{
      setLoading(false)
    }
  };
  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          <Skeleton variant="text" width={200} />
        </Typography>
        <Grid container spacing={3}>
          {[1, 2, 3].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Card sx={{ p: 2, borderRadius: 3 }}>
                <CardContent>
                  <Skeleton variant="text" width={150} height={30} />
                  <Skeleton variant="rectangular" width={100} height={20} sx={{ mt: 2 }} />
                  <Skeleton variant="rectangular" width={80} height={20} sx={{ mt: 2 }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }
  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        mb: 4,
        alignItems: 'center',
        backgroundColor: 'white',
        p: 3,
        borderRadius: 2,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#1a237e' }}>
          Labs Management
        </Typography>
        <FormControl sx={{ minWidth: 250 }}>
          <InputLabel>Filter by Department</InputLabel>
          <Select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="">All Departments</MenuItem>
            {departments.map((dept) => (
              <MenuItem key={dept} value={dept}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ width: 24, height: 24, bgcolor: departmentColors[dept] }}>
                    {dept[0]}
                  </Avatar>
                  {dept}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {user?.role === 'admin' && (
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
            sx={{ 
              borderRadius: 2,
              backgroundColor: '#1a237e',
              '&:hover': { backgroundColor: '#0d47a1' }
            }}
          >
            Add New Lab
          </Button>
        )}
      </Box>
      {labs.length === 0 ? (
        <EmptyIllustration title={"No Labs found"} subtitle={"Add labs to get started!"} />
      ) : (
      <Grid container spacing={3}>
        {labs.map((lab) => (
          <Grid item xs={12} sm={6} md={4} key={lab._id}>
            <Card 
              onClick={() => navigate(`/labs/${lab._id}/users`)}
              sx={{ 
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: departmentColors[lab.department] }}>
                    <ScienceIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {lab.name}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationIcon color="action" />
                    <Typography color="textSecondary">{lab.location}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DescriptionIcon color="action" />
                    <Typography variant="body2">{lab.description}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mb: 2 }} onClick={(e) => { 
                          e.stopPropagation(); 
                          navigate(`/labs/${lab._id}/sensors`); 
                        }} >
                  <Chip
                    label={lab.department}
                    sx={{ 
                      bgcolor: departmentColors[lab.department],
                      color: 'white',
                      fontWeight: 500
                    }}
                  />
                  <Badge 
                    badgeContent={lab.sensors?.length || 0} 
                    color="primary"
                    sx={{ '& .MuiBadge-badge': { fontSize: '0.8rem' } }}
                  >
                    <Chip
                      icon={<SensorsIcon sx={{ fontSize: '1.2rem' }} />}
                      label="Sensors"
                      variant="outlined"
                    />
                  </Badge>
                </Box>

                {user?.role === 'admin' && (
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    borderTop: '1px solid #eee',
                    pt: 2
                  }}>
                    <Box>
                      <IconButton 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          navigate(`/labs/${lab._id}/sensors`); 
                        }} 
                        color="secondary"
                        sx={{ '&:hover': { bgcolor: 'rgba(156, 39, 176, 0.1)' } }}
                      >
                        <SensorsIcon />
                      </IconButton>
                      <IconButton 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          navigate(`/labs/${lab._id}/add-user`); 
                        }} 
                        color="primary"
                        sx={{ '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.1)' } }}
                      >
                        <PersonAddIcon />
                        

                      </IconButton>
                    </Box>
                    <Box>
                      <IconButton 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          navigate(`/labs/${lab._id}/sensors`); 
                        }} 
                        color="secondary"
                        sx={{ '&:hover': { bgcolor: 'rgba(156, 39, 176, 0.1)' } }}
                      >
                        <InfoIcon />
                      </IconButton>
                      <IconButton 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          navigate(`/report`); 
                        }} 
                        color="primary"
                        sx={{ '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.1)' } }}
                      >
                        <ReportIcon />
                        

                      </IconButton>
                    </Box>
                    <Box>
                      <IconButton 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleOpen(lab); 
                        }} 
                        color="primary"
                        sx={{ '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.1)' } }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleDelete(lab._id); 
                        }} 
                        color="error"
                        sx={{ '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.1)' } }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      )}
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: '#1a237e', 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          {selectedLab ? <EditIcon /> : <AddIcon />}
          {selectedLab ? 'Edit Lab' : 'Add New Lab'}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
            <TextField 
              label="Lab Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField 
              label="Location"
              fullWidth
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField 
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                sx={{ borderRadius: 2 }}
              >
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 24, height: 24, bgcolor: departmentColors[dept] }}>
                        {dept[0]}
                      </Avatar>
                      {dept}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={handleClose}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            variant="contained"
            sx={{ 
              borderRadius: 2,
              bgcolor: '#1a237e',
              '&:hover': { bgcolor: '#0d47a1' }
            }}
          >
            {selectedLab ? 'Update Lab' : 'Create Lab'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LabList;