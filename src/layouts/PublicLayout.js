import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import HomeIcon from '@mui/icons-material/Home';

const PublicLayout = () => {
  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* AppBar simplificado para público */}
      <AppBar 
        position="static" 
        sx={{ 
          background: 'rgba(44, 62, 80, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '3px solid #E74C3C'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ py: 1 }}>
            <SchoolIcon sx={{ mr: 2, color: '#E74C3C' }} />
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                flexGrow: 1,
                fontWeight: 700,
                textDecoration: 'none',
                color: 'white',
                '&:hover': {
                  color: '#EC7063'
                }
              }}
            >
              Academia Para Adultos
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                component={Link}
                to="/"
                startIcon={<HomeIcon />}
                sx={{
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(231, 76, 60, 0.1)'
                  }
                }}
              >
                Inicio
              </Button>
              
              {/* Solo mostrar Acceso Admin para administradores que ya saben de su existencia */}
              <Button
                component={Link}
                to="/admin"
                sx={{
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  fontSize: '0.8rem',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Acceso Admin
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Contenido principal */}
      <Box sx={{ py: 4 }}>
        <Outlet />
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: 'rgba(26, 37, 47, 0.9)',
          color: 'white',
          borderTop: '2px solid #E74C3C'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body1">
              © {new Date().getFullYear()} Academia Para Adultos. Todos los derechos reservados.
            </Typography>
            <Box sx={{ mt: { xs: 2, md: 0 } }}>
              <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                📞 Contacto: info@academiaadultos.com | 📍 Dirección: Av. Principal 123
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default PublicLayout;