import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';

const AuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirigir al formulario principal después de 2 segundos
    const timer = setTimeout(() => {
      navigate('/');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      <CircularProgress sx={{ color: 'white', mb: 3 }} />
      <Typography variant="h6" color="white" align="center">
        Redirigiendo al formulario principal...
      </Typography>
      <Typography variant="body2" color="rgba(255, 255, 255, 0.7)" sx={{ mt: 1 }}>
        Esta página no está disponible para el público.
      </Typography>
    </Box>
  );
};

export default AuthRedirect;