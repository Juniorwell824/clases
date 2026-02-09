// src/components/auth/ForgotPassword.js (DISEÑO ULTRA PROFESIONAL)
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
  Link
} from '@mui/material';
import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { Link as RouterLink } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
      setEmail('');
    } catch (error) {
      console.error('Error al enviar correo de recuperación:', error);
      if (error.code === 'auth/user-not-found') {
        setError('No existe una cuenta con este correo electrónico.');
      } else if (error.code === 'auth/invalid-email') {
        setError('El correo electrónico no es válido.');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Demasiados intentos. Por favor, intente más tarde.');
      } else {
        setError('Ocurrió un error. Por favor, intente nuevamente.');
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
              <LockResetOutlinedIcon className="auth-icon" />
            </Box>
            <Typography className="auth-title">
              Recuperar Contraseña
            </Typography>
            <Typography className="auth-subtitle">
              Ingrese su correo electrónico para recibir un enlace de recuperación
            </Typography>
          </Box>

          {success && (
            <Alert 
              className="auth-alert"
              severity="success"
            >
              <Typography variant="body2">
                <strong>✅ Correo enviado exitosamente</strong><br />
                Revise su bandeja de entrada y siga las instrucciones para restablecer su contraseña.
              </Typography>
            </Alert>
          )}

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
            <TextField
              className="form-input"
              label="Correo Electrónico"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading || success}
            />
            
            <Button
              className="auth-button"
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading || success || !email}
            >
              {loading ? (
                <CircularProgress size={20} />
              ) : success ? (
                '✅ Correo Enviado'
              ) : (
                'Enviar Enlace de Recuperación'
              )}
            </Button>
          </form>

          <Box className="auth-footer">
            <Link
              className="auth-link"
              component={RouterLink}
              to="/login"
            >
              <ArrowBackOutlinedIcon sx={{ fontSize: 16 }} />
              Volver al inicio de sesión
            </Link>
          </Box>

          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
            <Typography variant="caption" color="textSecondary" align="center" sx={{ fontSize: '11px', lineHeight: 1.6 }}>
              <strong>Nota:</strong> El enlace de recuperación expira en 1 hora.<br />
              Si no recibe el correo en unos minutos, revise su carpeta de spam.
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

export default ForgotPassword;