import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import Navbar from '../Navbar'
// JSON Data
const sensorData = [
  {
    sensorID: "ACS1005622428",
    sensorType: "ACS712",
    deviceName: "fan",
    status: "Active",
    value1: 105,
    value2: 105,
  },
  {
    sensorID: "DHT100112202428",
    sensorType: "DHT",
    deviceName: "Door ",
    status: "inactive",
    value1: null,
    value2: null,
  },
  {
    sensorID: "ACS712100112202428",
    sensorType: "ACS712",
    deviceName: "Laptop",
    status: "Active",
    value1: 10.19,
    value2: 103.21,
  },
  {
    sensorID: "LDR100112202428",
    sensorType: "LDR",
    deviceName: "Room",
    status: "Active",
    value1: 0,
    value2: null,
  },
  {
    sensorID: "DOORWIN100112202428",
    sensorType: "DOORWIN",
    deviceName: "MainGate",
    status: "Active",
    value1: 1,
    value2: null,
  },
  {
    sensorID: "DOORWIN100212202428",
    sensorType: "DOORWIN",
    deviceName: "SideWindow",
    status: "Active",
    value1: 1,
    value2: null,
  },
  {
    sensorID: "PIR100112202428",
    sensorType: "PIR",
    deviceName: "MainGate",
    status: "Active",
    value1: 0,
    value2: null,
  },
];

const SensorBarChart = () => {
  return (
    <>
    <Navbar />
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={sensorData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="deviceName" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value1" fill="#8884d8" name="Value 1" />
        <Bar dataKey="value2" fill="#82ca9d" name="Value 2" />
      </BarChart>
    </ResponsiveContainer>
    </>
  );
};

export default SensorBarChart;
