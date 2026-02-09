// src/components/dashboard/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import AdminDashboard from './AdminDashboard';
import SocioDashboard from './SocioDashboard';
import { CircularProgress, Box, Alert, Typography } from '@mui/material';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate('/login');
        return;
      }

      setUser(currentUser);
      
      try {
        // Obtener rol del usuario desde Firestore usando su UID
        const userDocRef = doc(db, 'usuarios', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserRole(userData.rol);
        } else {
          setError('Usuario no encontrado en la base de datos');
          setUserRole(null);
        }
      } catch (err) {
        console.error('Error obteniendo rol del usuario:', err);
        setError('Error al cargar los datos del usuario');
      } finally {
        setLoading(false);
      }
    });

    // Limpiar suscripción al desmontar
    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        flexDirection="column"
        gap={2}
      >
        <CircularProgress />
        <Typography variant="body1" color="textSecondary">
          Cargando dashboard...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert 
          severity="error" 
          action={
            <button 
              onClick={() => window.location.reload()} 
              style={{ background: 'none', border: 'none', color: '#1976d2', cursor: 'pointer' }}
            >
              Reintentar
            </button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  // Redirigir según el rol
  switch (userRole) {
    case 'admin':
      return <AdminDashboard />;
    case 'socio':
      return <SocioDashboard />;
    default:
      // Si no tiene rol definido, mostrar dashboard básico
      return (
        <Box p={3}>
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1" paragraph>
            Bienvenido {user?.email}
          </Typography>
          <Alert severity="info">
            Tu cuenta está pendiente de asignación de rol. Por favor, contacta al administrador.
          </Alert>
        </Box>
      );
  }
};

export default Dashboard;