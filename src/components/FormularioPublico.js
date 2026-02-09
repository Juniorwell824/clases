import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
  Link
} from '@mui/material';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/config';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import InfoIcon from '@mui/icons-material/Info';
import SchoolIcon from '@mui/icons-material/School';
import SecurityIcon from '@mui/icons-material/Security';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link as RouterLink } from 'react-router-dom';
import './FormularioPublico.css';

const schema = yup.object({
  nombres: yup.string().required('Los nombres son requeridos'),
  apellidos: yup.string().required('Los apellidos son requeridos'),
  edad: yup.number()
    .required('La edad es requerida')
    .min(18, 'Debe ser mayor de 18 años')
    .max(100, 'Edad no válida'),
  email: yup.string()
    .email('Email inválido')
    .required('El email es requerido'),
  estatusLaboral: yup.string().required('El estatus laboral es requerido'),
  motivo: yup.string()
    .required('El motivo es requerido')
    .min(10, 'Por favor, describa su motivo con al menos 10 caracteres')
    .max(500, 'Máximo 500 caracteres')
});

const FormularioPublico = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await addDoc(collection(db, 'registros'), {
        ...data,
        fechaRegistro: new Date().toISOString(),
        procesado: false
      });
      setSuccess(true);
      reset();
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('Error al registrar:', error);
      alert('Error al enviar el formulario. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const estatusLaboralOptions = [
    'Empleado/a',
    'Desempleado/a',
    'Jubilado/a',
    'Estudiante',
    'Independiente',
    'Dueño de negocio',
    'Profesionista'
  ];

  return (
    <Box className="formulario-container">
      {/* Elementos decorativos de fondo */}
      <div className="background-decoration">
        <div className="accent-shape shape-1"></div>
        <div className="accent-shape shape-2"></div>
      </div>

      <Container maxWidth="lg" className="main-container">
        {/* Encabezado académico */}
        <Paper elevation={0} className="academic-header">
          <Box className="university-logo">
            <SchoolIcon className="logo-icon" />
            <div>
              <Typography 
                variant="h3" 
                className="titulo-principal"
              >
                Academia Para Adultos
              </Typography>
              <Typography variant="h6" className="subtitulo">
                Formulario de Inscripción - Programa de Educación Continua
              </Typography>
            </div>
          </Box>
          
        </Paper>

        <Box className="form-content-container">
          {/* Panel de información */}
          <Paper elevation={0} className="info-panel">
            <Typography variant="h5" className="info-title">
              Información del Programa
            </Typography>
            
            <ul className="info-list">
              <li className="info-item">
                <InfoIcon className="info-icon" />
                <Typography variant="body1" className="info-text">
                  <strong>Horarios flexibles:</strong> Clases disponibles en diferentes horarios para adaptarse a tu rutina
                </Typography>
              </li>
              
              <li className="info-item">
                <SchoolIcon className="info-icon" />
                <Typography variant="body1" className="info-text">
                  <strong>Instructores certificados:</strong> Profesionales con amplia experiencia en educación de adultos
                </Typography>
              </li>
              
              <li className="info-item">
                <SecurityIcon className="info-icon" />
                <Typography variant="body1" className="info-text">
                  <strong>Certificación oficial:</strong> Al finalizar recibirás un certificado reconocido
                </Typography>
              </li>
              
              <li className="info-item">
                <AccessTimeIcon className="info-icon" />
                <Typography variant="body1" className="info-text">
                  <strong>Duración del programa:</strong> 6 meses (240 horas lectivas)
                </Typography>
              </li>
            </ul>

            <Box className="important-note">
              <Typography variant="subtitle1" className="note-title">
                Importante
              </Typography>
              <Typography variant="body2" className="note-text">
                Una vez enviado el formulario, recibirás un correo de confirmación y un asesor se pondrá en contacto contigo en un plazo máximo de 48 horas hábiles para programar una entrevista informativa.
              </Typography>
            </Box>
          </Paper>

          {/* Panel del formulario */}
          <Paper elevation={0} className="form-panel">
            {success && (
              <Alert 
                severity="success" 
                icon={<CheckCircleIcon fontSize="inherit" />}
                className="success-alert"
              >
                <Typography variant="body1" fontWeight="600">
                  ¡Registro exitoso! Te hemos enviado un correo de confirmación. Nos pondremos en contacto contigo en las próximas 48 horas.
                </Typography>
              </Alert>
            )}

            <Box className="form-header">
              <Typography 
                variant="h4" 
                className="titulo-formulario"
              >
                Formulario de Inscripción
              </Typography>
              
              <Typography 
                variant="body1" 
                className="instrucciones"
              >
                Complete la siguiente información para iniciar su proceso de inscripción al Programa de Educación Continua para Adultos.
              </Typography>
            </Box>

            <Box className="form-container">
              <form onSubmit={handleSubmit(onSubmit)}>
                <Box className="form-grid">
                  {/* Nombres y Apellidos */}
                  <Box className="form-row">
                    <Box className="form-field">
                      <TextField
                        label="Nombres *"
                        variant="outlined"
                        fullWidth
                        {...register('nombres')}
                        error={!!errors.nombres}
                        helperText={errors.nombres?.message}
                        className="form-input"
                      />
                    </Box>
                    
                    <Box className="form-field">
                      <TextField
                        label="Apellidos *"
                        variant="outlined"
                        fullWidth
                        {...register('apellidos')}
                        error={!!errors.apellidos}
                        helperText={errors.apellidos?.message}
                        className="form-input"
                      />
                    </Box>
                  </Box>

                  {/* Edad y Email */}
                  <Box className="form-row">
                    <Box className="form-field">
                      <TextField
                        label="Edad *"
                        type="number"
                        variant="outlined"
                        fullWidth
                        {...register('edad')}
                        error={!!errors.edad}
                        helperText={errors.edad?.message}
                        className="form-input"
                        InputProps={{
                          inputProps: { 
                            min: 18, 
                            max: 100 
                          }
                        }}
                      />
                    </Box>
                    
                    <Box className="form-field">
                      <TextField
                        label="Correo Electrónico *"
                        type="email"
                        variant="outlined"
                        fullWidth
                        {...register('email')}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        className="form-input"
                      />
                    </Box>
                  </Box>

                  {/* Estatus Laboral */}
                  <Box className="form-field">
                    <TextField
                      select
                      label="Estatus Laboral *"
                      variant="outlined"
                      fullWidth
                      {...register('estatusLaboral')}
                      error={!!errors.estatusLaboral}
                      helperText={errors.estatusLaboral?.message}
                      className="form-select"
                    >
                      {estatusLaboralOptions.map((option) => (
                        <MenuItem key={option} value={option} className="menu-item">
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>

                  {/* Motivo */}
                  <Box className="form-field">
                    <TextField
                      label="Motivo para tomar el programa *"
                      multiline
                      rows={4}
                      variant="outlined"
                      fullWidth
                      {...register('motivo')}
                      error={!!errors.motivo}
                      helperText={errors.motivo?.message || "Describa sus objetivos profesionales/personales (mínimo 10 caracteres)"}
                      placeholder="Ej: Deseo desarrollar nuevas habilidades para mejorar mi desempeño laboral, adquirir conocimientos actualizados en mi área profesional y ampliar mis oportunidades de crecimiento..."
                      className="form-textarea"
                    />
                  </Box>

                  {/* Botón de envío */}
                  <Box className="submit-button-container">
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading}
                      className="submit-button"
                      startIcon={!loading && <EmailIcon />}
                    >
                      {loading ? (
                        <>
                          <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                          Enviando...
                        </>
                      ) : (
                        'Enviar Solicitud de Inscripción'
                      )}
                    </Button>
                  </Box>
                </Box>
              </form>
            </Box>

            {/* Footer del formulario */}
            <Box className="footer-info">
              <Typography 
                variant="body2" 
                className="footer-text"
              >
                Su información personal está protegida según nuestra Política de Privacidad y será utilizada exclusivamente para fines académicos y de contacto relacionado con el programa.
              </Typography>
              
              <Box className="contact-info">
                <a href="mailto:contacto@academiaadultos.com" className="contact-item">
                  <EmailIcon className="contact-icon" />
                  contacto@academiaadultos.com
                </a>
                
                <Typography variant="body2" className="contact-item">
                  <PhoneIcon className="contact-icon" />
                  Tel: (555) 123-4567
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Copyright */}
        <Box className="copyright">
          <Typography variant="body2">
            © {new Date().getFullYear()} Academia Para Adultos - Programa de Educación Continua. 
            Todos los derechos reservados. 
          </Typography>
          
          <Button
            component={RouterLink}
            to="/login"
            variant="text"
            className="login-link"
            startIcon={<LockOutlinedIcon />}
          >
            Acceso para Socios y Administradores
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default FormularioPublico;