// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importar componentes EXISTENTES
import FormularioPublico from './components/FormularioPublico';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';

// Importar componentes dashboard
import AdminDashboard from './components/dashboard/AdminDashboard';
import SocioDashboard from './components/dashboard/SocioDashboard';
import Dashboard from './components/dashboard/Dashboard';

// Importar rutas protegidas
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/auth/AdminRoute';
import SocioRoute from './components/auth/SocioRoute';

// Importar componente de permisos (nuevo)
import PermissionRoute from './components/auth/PermissionRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* ====================== */}
        {/* RUTAS PÚBLICAS (sin autenticación) */}
        {/* ====================== */}
        
        <Route path="/" element={<FormularioPublico />} />
        <Route path="/inscripcion" element={<FormularioPublico />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* ====================== */}
        {/* RUTAS PROTEGIDAS (con autenticación) */}
        {/* ====================== */}
        
        {/* Dashboard principal - con redirección automática según rol */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        
        {/* Dashboard para socios - Con validación de permisos */}
        <Route path="/socio/dashboard" element={
          <PrivateRoute>
            <SocioRoute>
              <SocioDashboard />
            </SocioRoute>
          </PrivateRoute>
        } />
        
        {/* Dashboard para administradores */}
        <Route path="/admin/dashboard" element={
          <PrivateRoute>
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          </PrivateRoute>
        } />
        
        {/* ====================== */}
        {/* RUTAS ESPECÍFICAS CON PERMISOS */}
        {/* ====================== */}
        
        {/* Ejemplo: Ruta solo para usuarios con permiso de gestión */}
        <Route path="/admin/usuarios" element={
          <PrivateRoute>
            <AdminRoute>
              <PermissionRoute requiredPermissions={['gestionar_usuarios']}>
                {/* Aquí iría el componente de gestión de usuarios */}
                <AdminDashboard section="usuarios" />
              </PermissionRoute>
            </AdminRoute>
          </PrivateRoute>
        } />
        
        {/* ====================== */}
        {/* REDIRECCIONES */}
        {/* ====================== */}
        
        <Route path="/home" element={<Navigate to="/" />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
        <Route path="/socio" element={<Navigate to="/socio/dashboard" />} />
        
        {/* Redirección desde dashboard según rol */}
        <Route path="/dashboard/redirect" element={
          <PrivateRoute>
            <Navigate to="/dashboard" />
          </PrivateRoute>
        } />
        
        {/* ====================== */}
        {/* RUTAS DE ERROR */}
        {/* ====================== */}
        
        <Route path="/404" element={
          <div style={{ 
            textAlign: 'center', 
            padding: '50px',
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <h1 style={{ fontSize: '4rem', marginBottom: '20px' }}>404</h1>
            <h2>Página no encontrada</h2>
            <p style={{ marginTop: '20px' }}>
              La página que buscas no existe o ha sido movida.
            </p>
            <a 
              href="/" 
              style={{
                marginTop: '30px',
                padding: '10px 30px',
                background: '#2196f3',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px',
                fontWeight: 'bold'
              }}
            >
              Volver al inicio
            </a>
          </div>
        } />
        
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
    </Router>
  );
}

export default App;