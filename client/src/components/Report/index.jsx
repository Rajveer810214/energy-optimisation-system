import  { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid, Box } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,  PieChart, Pie, Cell } from 'recharts';
import sensorsData from "../../assets/lab-monitoring.labmappings.json";
const LDRPowerMonitoring = () => {
  const [data, setData] = useState([]);
  const [powerHistory, setPowerHistory] = useState([]); // Track power consumption over time

  const powerIncrement = 2;
  const intervalTime = 600;

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  useEffect(() => {
    const initializedData = sensorsData.map((item) => ({
      ...item,
      value1: item.value1 ?? 0,
      value2: item.value2 ?? 0,
      powerLoss: item.value1 === 0 && !item.value2 ? 0 : undefined,
    }));
    setData(initializedData);
    setPowerHistory([{ timestamp: new Date().toLocaleTimeString(), ...getAggregatedPowerData(initializedData) }]);

    const interval = setInterval(() => {
      setData((prevData) =>
        prevData.map((item) => {
          if (item.value1 === 0 && !item.value2) {
            const randomPowerLoss = Math.random() * 10 + 1;
            return { ...item, value1: 0, value2: 0, powerLoss: randomPowerLoss };
          } else {
            return {
              ...item,
              value1: item.value1 + powerIncrement,
              value2: item.value2 + powerIncrement,
              powerLoss: undefined,
            };
          }
        })
      );

      // Update power history
      setPowerHistory(prev => {
        const newHistory = [...prev, {
          timestamp: new Date().toLocaleTimeString(),
          ...getAggregatedPowerData(data)
        }];
        return newHistory.slice(-10); // Keep last 10 readings
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  // Helper function to get aggregated power data
  const getAggregatedPowerData = (currentData) => {
    const totalPower = currentData.reduce((acc, item) => {
      return acc + (item.powerLoss === undefined ? (item.value1 + item.value2) : 0);
    }, 0);
    
    const powerLossCount = currentData.filter(item => item.powerLoss !== undefined).length;
    const activePowerCount = currentData.filter(item => item.powerLoss === undefined).length;
    
    return {
      totalPower,
      powerLossCount,
      activePowerCount
    };
  };

  // Prepare data for pie chart
  const getPieChartData = () => {
    const statusData = [
      { name: 'Active Devices', value: data.filter(item => item.powerLoss === undefined).length },
      { name: 'Power Loss', value: data.filter(item => item.powerLoss !== undefined).length }
    ];
    return statusData;
  };

  return (
    <>
    <Box sx={{ p: 4, backgroundColor: '#f5f5f5' }}>
      <Typography variant="h4" sx={{ textAlign: "center", mb: 3, color: '#2c3e50', fontWeight: 'bold' }}>
        LDR Power Monitoring Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: '#fff', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" color="primary">Total Active Devices</Typography>
              <Typography variant="h4">
                {data.filter(item => item.powerLoss === undefined).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: '#fff', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" color="error">Devices with Power Loss</Typography>
              <Typography variant="h4">
                {data.filter(item => item.powerLoss !== undefined).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: '#fff', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" color="success">Total Power Consumption</Typography>
              <Typography variant="h4">
                {data.reduce((acc, item) => acc + (item.powerLoss === undefined ? (item.value1 + item.value2) : 0), 0).toFixed(2)} W
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Power Consumption Timeline */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 2, backgroundColor: '#fff', boxShadow: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Power Consumption Timeline</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={powerHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="totalPower" stroke="#8884d8" name="Total Power (W)" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Device Status Distribution */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, backgroundColor: '#fff', boxShadow: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Device Status Distribution</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getPieChartData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getPieChartData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>

      {/* Device Cards */}
      <Grid container spacing={3}>
        {data.map((item, index) => {
          const isPowerLoss = item.powerLoss !== undefined;
          const totalPowerConsumption = !isPowerLoss ? item.value1 + item.value2 : 0;

          return (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{
                backgroundColor: '#fff',
                borderLeft: isPowerLoss ? '5px solid #ff4444' : '5px solid #00C851',
                boxShadow: 3,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}>
                <CardContent>
                  <Typography variant="h6" color="primary">{item.deviceName}</Typography>
                  <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
                    {item.sensorType}
                  </Typography>
                  
                  {!isPowerLoss ? (
                    <Typography variant="body1" sx={{ color: '#00C851', fontWeight: 'bold' }}>
                      Power Consumption: {totalPowerConsumption.toFixed(2)} W
                    </Typography>
                  ) : (
                    <Typography variant="body1" sx={{ color: '#ff4444', fontWeight: 'bold' }}>
                      ⚠️ Power Loss: {item.powerLoss.toFixed(2)} W
                    </Typography>
                  )}
                  
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Status: <span style={{ 
                      color: item.status === 'Active' ? '#00C851' : '#ff4444',
                      fontWeight: 'bold'
                    }}>
                      {item.status ?? "Unknown"}
                    </span>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
    </>
  );
};

export default LDRPowerMonitoring;