import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Grid, CircularProgress, Alert } from '@mui/material';
import api from '../../api/axios';

const LabUsers = () => {
  const { labId } = useParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLabUsers = async () => {
      try {
        console.log("hi")
        const response = await api.get(`/labs/${labId}/users`);
        setUsers(response.data.data);
      } catch (error) {
        console.log("fdsa")
        setError(error.response?.data?.message || 'Error fetching lab users');
      } finally {
        setLoading(false);
      }
    };
    fetchLabUsers();
  }, [labId]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Users in Lab</Typography>
      <Grid container spacing={3}>
        {users.map((user) => (
          <Grid item xs={12} sm={6} md={4} key={user._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{user.name}</Typography>
                <Typography color="textSecondary">{user.email}</Typography>
                <Typography variant="body2">Role: {user.role}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default LabUsers;
