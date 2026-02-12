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
import { doc, getDoc } from 'firebase/firestore';
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
      // PASO 1: Autenticacion con Firebase Auth
      console.log('[v0] Intentando login con email:', email);
      let userCredential;
      try {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } catch (authError) {
        // Error de autenticacion - mostrar mensaje especifico
        console.error('[v0] Error de Firebase Auth:', authError.code, authError.message);
        
        switch (authError.code) {
          case 'auth/invalid-credential':
          case 'auth/wrong-password':
          case 'auth/user-not-found':
            setError('Credenciales incorrectas. Verifique su correo y contraseña.');
            break;
          case 'auth/too-many-requests':
            setError('Demasiados intentos fallidos. Intente más tarde.');
            break;
          case 'auth/user-disabled':
            setError('Esta cuenta ha sido deshabilitada. Contacte al administrador.');
            break;
          case 'auth/network-request-failed':
            setError('Error de conexión. Verifique su internet e intente nuevamente.');
            break;
          default:
            setError(`Error de autenticación (${authError.code}): ${authError.message}`);
        }
        return; // Salir, no continuar
      }

      console.log('[v0] Auth exitoso para UID:', userCredential.user.uid);
      
      // PASO 2: Intentar leer el rol del usuario desde Firestore
      // Si esto falla, no es un error fatal - el usuario YA esta autenticado
      let userRole = 'socio';
      try {
        const userDocRef = doc(db, 'usuarios', userCredential.user.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          userRole = userData.rol || 'socio';
          console.log('[v0] Rol del usuario:', userRole);
        } else {
          console.log('[v0] Documento de usuario no encontrado en Firestore, usando rol default: socio');
        }
      } catch (firestoreError) {
        console.error('[v0] Error leyendo Firestore (no fatal, auth ya exitoso):', firestoreError.code, firestoreError.message);
        // No hacer nada - el usuario ya esta autenticado, usamos rol default
      }
      
      // PASO 3: Navegar al dashboard correcto
      if (userRole === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/socio/dashboard');
      }
      
    } catch (error) {
      // Error inesperado general
      console.error('[v0] Error inesperado en login:', error);
      setError(`Error inesperado: ${error.message || 'Intente nuevamente'}`);
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
