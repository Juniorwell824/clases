// src/components/auth/Register.js (DISEÑO ULTRA PROFESIONAL)
import React, { useState } from 'react';
import '../../styles/auth.css';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Link,
  Snackbar
} from '@mui/material';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import MuiAlert from '@mui/material/Alert';

const AlertComponent = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Register = () => {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const validateForm = () => {
    if (!formData.nombres.trim()) {
      setError('El nombre es requerido');
      return false;
    }
    
    if (!formData.apellidos.trim()) {
      setError('Los apellidos son requeridos');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor ingrese un email válido');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      await setDoc(doc(db, 'usuarios', userCredential.user.uid), {
        nombres: formData.nombres.trim(),
        apellidos: formData.apellidos.trim(),
        email: formData.email.toLowerCase(),
        rol: 'socio',
        fechaRegistro: new Date().toISOString(),
        activo: true,
        tipo: 'registrado',
        uid: userCredential.user.uid
      });
      
      showSnackbar('¡Registro exitoso! Redirigiendo al panel...', 'success');
      
      setTimeout(() => {
        navigate('/socio/dashboard', { 
          state: { 
            message: '¡Bienvenido! Registro completado exitosamente.' 
          } 
        });
      }, 2000);
      
    } catch (error) {
      let errorMessage = 'Error al registrar usuario. Intente nuevamente.';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Este correo electrónico ya está registrado.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'El correo electrónico no es válido.';
          break;
        case 'auth/weak-password':
          errorMessage = 'La contraseña es demasiado débil. Debe tener al menos 6 caracteres.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'El registro con email/contraseña no está habilitado. Contacte al administrador.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Error de red. Verifique su conexión a internet.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Demasiados intentos. Por favor, intente más tarde.';
          break;
        default:
          errorMessage = `Error: ${error.message}`;
      }
      
      setError(errorMessage);
      showSnackbar(errorMessage, 'error');
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
              <PersonAddOutlinedIcon className="auth-icon" />
            </Box>
            <Typography className="auth-title">
              Registro de Socio
            </Typography>
            <Typography className="auth-subtitle">
              Complete el formulario para registrarse como socio
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

          <form className="auth-form" onSubmit={handleSubmit}>
            <Box className="form-group">
              <TextField
                className="form-input"
                label="Nombres"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                required
                disabled={loading}
              />
              
              <TextField
                className="form-input"
                label="Apellidos"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Box>

            <TextField
              className="form-input"
              label="Correo Electrónico"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <Box className="form-group">
              <TextField
                className="form-input"
                label="Contraseña"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                helperText="Mínimo 6 caracteres"
              />
              
              <TextField
                className="form-input"
                label="Confirmar Contraseña"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Box>

            <Box className="auth-note">
              <Typography variant="body2">
                Todos los nuevos usuarios se registran como <strong>Socios</strong> con acceso de solo lectura.
              </Typography>
            </Box>

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
                'Registrarse como Socio'
              )}
            </Button>
          </form>

          <Box className="auth-footer">
            <Typography variant="body2" color="textSecondary">
              ¿Ya tiene cuenta?{' '}
              <Link 
                className="auth-link"
                component={RouterLink} 
                to="/login"
              >
                Inicie sesión aquí
              </Link>
            </Typography>
            
            <Typography variant="caption" sx={{ mt: 2, color: 'text.disabled', display: 'block', fontSize: '11px' }}>
              * Campos obligatorios
            </Typography>
          </Box>
        </Paper>

        <Snackbar 
          open={snackbarOpen} 
          autoHideDuration={6000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          className="auth-snackbar"
        >
          <AlertComponent onClose={handleCloseSnackbar} severity={snackbarSeverity}>
            {snackbarMessage}
          </AlertComponent>
        </Snackbar>
      </Container>
      
      <Box className="auth-copyright">
        <Typography variant="caption">
          © 2024 Sistema Corporativo de Gestión • Acceso Seguro
        </Typography>
      </Box>
    </>
  );
};

export default Register;