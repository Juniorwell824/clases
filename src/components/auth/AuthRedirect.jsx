// src/components/auth/AuthRedirect.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth, db } from '../../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { CircularProgress, Box } from '@mui/material';

const AuthRedirect = () => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          
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

    checkUser();
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

  // Si el usuario no está autenticado, redirige al login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Si está autenticado, redirige según su rol
  if (userRole === 'admin') {
    return <Navigate to="/admin/dashboard" />;
  } else {
    return <Navigate to="/socio/dashboard" />;
  }
};

export default AuthRedirect;