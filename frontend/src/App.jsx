import { useState } from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import ProtectedRoutes from './routes/ProtectedRoutes.jsx'
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Customers from './pages/Customers.jsx';
import Consultations from './pages/Consultations.jsx';
import Recordings from './pages/Recordings.jsx';
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoutes>
              <Dashboard />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/customers"
          element={
            <ProtectedRoutes>
              <Customers />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/consultations"
          element={
            <ProtectedRoutes>
              <Consultations />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/recordings"
          element={
            <ProtectedRoutes>
              <Recordings />
            </ProtectedRoutes>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
