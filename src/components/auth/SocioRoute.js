// src/components/auth/SocioRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth, db } from '../../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { CircularProgress, Box } from '@mui/material';

const SocioRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSocio = async () => {
      onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          
          // Obtener rol del usuario desde Firestore
          try {
            const userDocRef = doc(db, 'usuarios', currentUser.uid);
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
              const userData = userDoc.data();
              setUserRole(userData.rol);
            }
          } catch (error) {
            console.error('Error obteniendo rol:', error);
          }
        }
        setLoading(false);
      });
    };

    checkSocio();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Si no hay usuario autenticado, redirige al login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Si es admin, redirige al dashboard de admin
  if (userRole === 'admin') {
    return <Navigate to="/admin/dashboard" />;
  }

  // Para socios o cualquier otro rol, permite acceso a la ruta protegida
  return children;
};

export default SocioRoute;