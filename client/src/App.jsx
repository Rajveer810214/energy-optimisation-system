import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
function App() {

  return (
    <>
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
     </Routes>
    </Router>
    </>
  )
}

export default App
