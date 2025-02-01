
// function App() {

//   return (
//     <>
//      <Router>
//      <Routes>
//      <Route path='/signin' element={<SignIn />} />
//      <Route path='/signup' element={<Signup />} />
//      <Route path='/' element={<Home />} />
//      <Route path='/verify-code' element={<VerificationCode />} />
//      <Route path='/verify-email' element={<VerifyEmail />} />
//      <Route path='/ldr' element={<LDRPowerLoss/>} />
//      <Route path='/about' element={<AboutPage />} />4
// <Route path='/contact' element={<ContactPage />} />
// <Route path='/admin' element={<Admin />} />
//      </Routes>
//     </Router>
//     </>
//   )
// }

// export default App

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import LabList from './components/Admin';
import SensorList from './components/Sensor';
import { useState } from 'react'
import Navbar from './components/Navbar'
// import 'bootstrap/dist/css/bootstrap.min.css';
import SignIn from './components/signin'
import Signup from './components/signup'
import  VerificationCode  from './components/VerifcationCode'
import Home from './components/Home'
import VerifyEmail from './components/VerifyEmail'
import LDRPowerLoss from './components/LDR';
import AboutPage from './components/About';
import ContactPage from './components/contact';
import Admin from './components/Admin';
import AddUserToLab from './components/AddUserToLab';
import LabUser from './components/LabUser'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});
const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
        <Route path='/signin' element={<SignIn />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/' element={<Home />} />
      <Route path='/verify-code' element={<VerificationCode />} />
      <Route path='/verify-email' element={<VerifyEmail />} />
      <Route path='/ldr' element={<LDRPowerLoss/>} />
     <Route path='/about' element={<AboutPage />} />4
 <Route path='/contact' element={<ContactPage />} />
 <Route path='/admin' element={<Admin />} />
          <Route path="/Lab" element={<LabList />} />
          <Route path="/labs/:labId/sensors" element={<SensorList />} />
          <Route path="/labs/:labId/add-user" element={<AddUserToLab />} />
    <Route path='/labs/:labId/users' element={<LabUser />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;