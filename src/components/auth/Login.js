// src/components/auth/Login.js (DISEÑO ULTRA PROFESIONAL)
import React, { useState } from 'react';
import '../../styles/auth.css';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Alert,
  CircularProgress
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase/config';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      const usuariosSnapshot = await getDocs(
        query(collection(db, 'usuarios'), where('email', '==', email))
      );
      
      let userRole = 'socio';
      if (!usuariosSnapshot.empty) {
        const userData = usuariosSnapshot.docs[0].data();
        userRole = userData.rol || 'socio';
      }
      
      if (userRole === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/socio/dashboard');
      }
      
    } catch (error) {
      console.error('Error en login:', error);
      if (error.code === 'auth/invalid-credential') {
        setError('Credenciales incorrectas. Verifique su correo y contraseña.');
      } else if (error.code === 'auth/user-not-found') {
        setError('Usuario no encontrado. Verifique su correo electrónico.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Contraseña incorrecta. Intente nuevamente.');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Demasiados intentos fallidos. Intente más tarde.');
      } else {
        setError('Error al iniciar sesión. Intente nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container className="auth-container" maxWidth="xl">
        <Paper className="auth-card">
          <Box className="auth-header">
            <Box className="auth-logo">
              <LockOutlinedIcon className="auth-icon" />
            </Box>
            <Typography className="auth-title">
              Iniciar Sesión
            </Typography>
            <Typography className="auth-subtitle">
              Acceda al sistema como Socio o Administrador
            </Typography>
          </Box>

          {error && (
            <Alert 
              className="auth-alert"
              severity="error"
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          )}

          <form className="auth-form" onSubmit={handleLogin}>
            <TextField
              className="form-input"
              label="Correo Electrónico"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              autoFocus
            />
            
            <TextField
              className="form-input"
              label="Contraseña"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />

            <Button
              className="auth-button"
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={20} />
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </form>

          <Box className="auth-footer">
            <Link
              className="auth-link"
              component={RouterLink}
              to="/forgot-password"
              sx={{ mb: 1.5, display: 'block' }}
            >
              ¿Olvidó su contraseña?
            </Link>
            
            <Typography variant="body2" color="textSecondary">
              ¿No tiene cuenta?{' '}
              <Link 
                className="auth-link"
                component={RouterLink} 
                to="/register"
              >
                Regístrese como Socio
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
      
      <Box className="auth-copyright">
        <Typography variant="caption">
          © 2024 Sistema Corporativo de Gestión • Acceso Seguro
        </Typography>
      </Box>
    </>
  );
};

export default Login;
