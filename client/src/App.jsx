import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import LabList from './components/LabCrud';
import SensorList from './components/Sensor';
import SignIn from './components/signin';
import Signup from './components/signup';
import VerificationCode from './components/VerifcationCode';
import Home from './components/Home';
import VerifyEmail from './components/VerifyEmail';
import AddUserToLab from './components/AddUserToLab';
import LabUser from './components/LabUser';
import Basic from './layouts/Basic';
import Users from './components/Users';
import About from './components/About';
import Contact from './components/contact'
import Report from './components/Report'
import LandingPage from './components/LandingPage';
import Profile from './components/Profile';
import EmailVerification from './components/VerifcationCode';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Wrap these routes inside Basic to include Navbar */}
          <Route element={<Basic />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/labs" element={<LabList />} />
            <Route path="/labs/:labId/sensors" element={<SensorList />} />
            <Route path="/labs/:labId/add-user" element={<AddUserToLab />} />
            <Route path="/labs/:labId/users" element={<LabUser />} />
            <Route path='/about' element={<About />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/report' element={<Report />} />
            <Route path='/verify-code' element={<EmailVerification />} />
          </Route>

          {/* These routes do NOT have a Navbar */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-code" element={<VerificationCode />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/users" element={<Users />} />
          <Route path='/profile' element={<Profile />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
