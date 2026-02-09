// src/components/dashboard/SocioDashboard.jsx (VERSIÓN ACTUALIZADA)
import React, { useState, useEffect } from 'react';
import './SocioDashboard.css';
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Divider,
  LinearProgress,
  Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  Visibility as VisibilityIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  FilterList as FilterIcon,
  Block as BlockIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../../firebase/config';
import usePermissions from '../../hooks/usePermissions'; // IMPORTAR EL HOOK

const SocioDashboard = () => {
  const [registros, setRegistros] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegistro, setSelectedRegistro] = useState(null);
  const [viewMotivo, setViewMotivo] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const navigate = useNavigate();
  
  // Usar el hook de permisos
  const { 
    permissions, 
    loading: permissionsLoading, 
    userData,
    hasPermission 
  } = usePermissions();

  useEffect(() => {
  // Esperar a que los permisos se carguen
  if (permissionsLoading) {
    return;
  }

  // Verificar si tiene permiso para ver registros
  if (permissions.includes('ver_registros')) {
    cargarDatos();
  } else {
    setLoadingData(false);
  }
}, [permissions, permissionsLoading]); // ✅ Dependencias correctas

  const cargarDatos = async () => {
    try {
      setLoadingData(true);
      const registrosSnapshot = await getDocs(collection(db, 'registros'));
      const registrosData = registrosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRegistros(registrosData);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const filteredRegistros = registros.filter(registro =>
    registro.nombres?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    registro.apellidos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    registro.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Verificar permisos
  const canViewRegistros = hasPermission('ver_registros');
  const canViewDetails = hasPermission('ver_registros'); // Mismo permiso para detalles
  const canExportData = hasPermission('exportar_datos');
  const canViewAnalytics = hasPermission('ver_analytics');

  // Estadísticas - solo calcular si tiene permiso
  const stats = canViewRegistros ? {
    totalRegistros: registros.length,
    empleados: registros.filter(r => r.estatusLaboral?.includes('Empleado')).length,
    estudiantes: registros.filter(r => r.estatusLaboral?.includes('Estudiante')).length,
    porcentajeCompletitud: 85
  } : {
    totalRegistros: 0,
    empleados: 0,
    estudiantes: 0,
    porcentajeCompletitud: 0
  };

  // Mostrar loading mientras se cargan permisos
  if (permissionsLoading || loadingData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <LinearProgress sx={{ width: '100%' }} />
      </Box>
    );
  }

  // Si no tiene permiso para ver registros, mostrar mensaje
  if (!canViewRegistros) {
    return (
      <Box className="socio-dashboard">
        <AppBar position="sticky" className="socio-header" elevation={0}>
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6" className="logo-text">
                  <span className="logo-highlight">CLASES</span>ADULTOS
                </Typography>
                <Chip 
                  label="Socio" 
                  size="small" 
                  className="socio-chip"
                  icon={<PersonIcon />}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box textAlign="right">
                  <Typography variant="body2" className="user-name">
                    {userData?.nombres} {userData?.apellidos}
                  </Typography>
                  <Typography variant="caption" className="user-email">
                    {userData?.email}
                  </Typography>
                </Box>
                
                <Avatar className="header-avatar">
                  {userData?.nombres?.charAt(0)}
                </Avatar>

                <Tooltip title="Cerrar sesión">
                  <IconButton onClick={handleLogout} className="logout-btn">
                    <LogoutIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>

        <Container maxWidth="xl" className="socio-content">
          <Box className="welcome-section" mb={4}>
            <Typography variant="h4" className="welcome-title">
              👋 Bienvenido, {userData?.nombres}
            </Typography>
            <Typography variant="body1" className="welcome-subtitle">
              Tu cuenta está activa pero no tienes permisos para acceder al contenido.
            </Typography>
          </Box>

          <Card className="main-table-card" elevation={0}>
            <CardContent>
              <Box textAlign="center" py={8}>
                <BlockIcon sx={{ fontSize: 60, color: '#e0e0e0', mb: 2 }} />
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  Acceso Restringido
                </Typography>
                <Typography variant="body1" color="textSecondary" paragraph>
                  No tienes permisos para ver registros. Contacta al administrador para solicitar acceso.
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Permisos actuales: {permissions.length > 0 ? permissions.join(', ') : 'Ninguno'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  return (
    <Box className="socio-dashboard">
      {/* Header Minimalista */}
      <AppBar position="sticky" className="socio-header" elevation={0}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6" className="logo-text">
                <span className="logo-highlight">CLASES</span>ADULTOS
              </Typography>
              <Chip 
                label="Socio" 
                size="small" 
                className="socio-chip"
                icon={<PersonIcon />}
              />
              
              {/* Mostrar permisos activos */}
              {permissions.length > 0 && (
                <Chip 
                  label={`${permissions.length} permisos`}
                  size="small"
                  variant="outlined"
                  sx={{ ml: 1, fontSize: '0.7rem' }}
                />
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box textAlign="right">
                <Typography variant="body2" className="user-name">
                  {userData?.nombres} {userData?.apellidos}
                </Typography>
                <Typography variant="caption" className="user-email">
                  {userData?.email}
                </Typography>
              </Box>
              
              <Avatar className="header-avatar">
                {userData?.nombres?.charAt(0)}
              </Avatar>

              <Tooltip title="Cerrar sesión">
                <IconButton onClick={handleLogout} className="logout-btn">
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Contenido Principal */}
      <Container maxWidth="xl" className="socio-content">
        {/* Bienvenida */}
        <Box className="welcome-section" mb={4}>
          <Typography variant="h4" className="welcome-title">
            👋 Bienvenido, {userData?.nombres}
          </Typography>
          <Typography variant="body1" className="welcome-subtitle">
            Aquí puedes gestionar y visualizar todos los registros de estudiantes adultos.
            {permissions.length > 0 && (
              <span style={{ fontSize: '0.9em', color: '#666', marginLeft: '10px' }}>
                (Permisos activos: {permissions.length})
              </span>
            )}
          </Typography>
        </Box>

        {/* Barra de búsqueda y filtros - solo si tiene permiso */}
        <Paper className="search-card" elevation={0}>
          <Box display="flex" alignItems="center" gap={2}>
            <TextField
              fullWidth
              placeholder="Buscar por nombre, apellido o email..."
              variant="outlined"
              size="small"
              className="search-input"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              className="filter-button"
            >
              Filtrar
            </Button>
            {canExportData && (
              <Button
                variant="contained"
                className="export-button"
                disabled={registros.length === 0}
              >
                Exportar ({registros.length})
              </Button>
            )}
          </Box>
        </Paper>

        {/* Cards de Resumen - solo si tiene permiso para ver */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="summary-card total">
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <div>
                    <Typography variant="h3" className="summary-number">
                      {stats.totalRegistros}
                    </Typography>
                    <Typography variant="body2" className="summary-label">
                      Total Registros
                    </Typography>
                  </div>
                  <Box className="summary-icon">
                    <DescriptionIcon />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="summary-card employed">
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <div>
                    <Typography variant="h3" className="summary-number">
                      {stats.empleados}
                    </Typography>
                    <Typography variant="body2" className="summary-label">
                      Empleados
                    </Typography>
                  </div>
                  <Box className="summary-icon">
                    <WorkIcon />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="summary-card students">
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <div>
                    <Typography variant="h3" className="summary-number">
                      {stats.estudiantes}
                    </Typography>
                    <Typography variant="body2" className="summary-label">
                      Estudiantes
                    </Typography>
                  </div>
                  <Box className="summary-icon">
                    <SchoolIcon />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {canViewAnalytics && (
            <Grid item xs={12} sm={6} md={3}>
              <Card className="summary-card progress">
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <div>
                      <Typography variant="h3" className="summary-number">
                        {stats.porcentajeCompletitud}%
                      </Typography>
                      <Typography variant="body2" className="summary-label">
                        Completitud
                      </Typography>
                    </div>
                    <Box className="summary-icon">
                      <TrendingUpIcon />
                    </Box>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={stats.porcentajeCompletitud} 
                    className="progress-bar"
                  />
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>

        {/* Tabla de Registros */}
        <Card className="main-table-card" elevation={0}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
              <Typography variant="h5" className="table-title">
                <DescriptionIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Registros de Estudiantes
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Mostrando {filteredRegistros.length} de {registros.length} registros
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <TableContainer className="table-container">
              <Table>
                <TableHead>
                  <TableRow className="table-header-row">
                    <TableCell width="30%">Nombre</TableCell>
                    <TableCell width="25%">Contacto</TableCell>
                    <TableCell width="15%">Edad</TableCell>
                    <TableCell width="15%">Estatus</TableCell>
                    <TableCell width="15%">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRegistros.map((registro) => (
                    <TableRow key={registro.id} hover className="table-body-row">
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar className="table-avatar">
                            {registro.nombres?.charAt(0)}
                          </Avatar>
                          <Box ml={2}>
                            <Typography variant="body1" fontWeight="500">
                              {registro.nombres} {registro.apellidos}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              ID: {registro.id.substring(0, 6)}...
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" display="flex" alignItems="center" gap={1}>
                            <EmailIcon fontSize="small" color="action" />
                            {registro.email}
                          </Typography>
                          {registro.telefono && (
                            <Typography variant="caption" display="flex" alignItems="center" gap={1}>
                              <PhoneIcon fontSize="small" color="action" />
                              {registro.telefono}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={`${registro.edad} años`} 
                          className="age-chip"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={registro.estatusLaboral} 
                          className={`status-label ${registro.estatusLaboral?.toLowerCase().replace(' ', '-')}`}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<VisibilityIcon />}
                          onClick={() => {
                            if (canViewDetails) {
                              setSelectedRegistro(registro);
                              setViewMotivo(true);
                            }
                          }}
                          className="detail-button"
                          disabled={!canViewDetails}
                        >
                          Detalles
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {filteredRegistros.length === 0 && (
              <Box textAlign="center" py={4}>
                <DescriptionIcon sx={{ fontSize: 48, color: '#e0e0e0', mb: 2 }} />
                <Typography variant="body1" color="textSecondary">
                  No se encontraron registros
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Intenta con otros términos de búsqueda
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>

      {/* Dialog para ver detalles */}
      <Dialog 
        open={viewMotivo} 
        onClose={() => setViewMotivo(false)} 
        maxWidth="sm" 
        fullWidth
        className="detail-dialog"
      >
        <DialogTitle className="dialog-header">
          <Box display="flex" alignItems="center">
            <Avatar className="dialog-avatar" sx={{ mr: 2 }}>
              {selectedRegistro?.nombres?.charAt(0)}
            </Avatar>
            <div>
              <Typography variant="h6">
                {selectedRegistro?.nombres} {selectedRegistro?.apellidos}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Detalles completos del registro
              </Typography>
            </div>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          {selectedRegistro && (
            <Box className="dialog-content">
              <Grid container spacing={2} mb={3}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    <EmailIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                    Email
                  </Typography>
                  <Typography variant="body1">{selectedRegistro.email}</Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    <CalendarIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                    Edad
                  </Typography>
                  <Typography variant="body1">{selectedRegistro.edad} años</Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    <WorkIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                    Estatus Laboral
                  </Typography>
                  <Chip 
                    label={selectedRegistro.estatusLaboral} 
                    className={`status-label ${selectedRegistro.estatusLaboral?.toLowerCase().replace(' ', '-')}`}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    <CalendarIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                    Fecha de Registro
                  </Typography>
                  <Typography variant="body1">
                    {selectedRegistro.fechaRegistro ? 
                      new Date(selectedRegistro.fechaRegistro).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 
                      'No disponible'}
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Motivo del Registro
              </Typography>
              <Paper variant="outlined" className="motive-paper">
                <Typography variant="body1" className="motive-text">
                  {selectedRegistro.motivo || 'Sin motivo especificado'}
                </Typography>
              </Paper>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions className="dialog-actions">
          <Button 
            onClick={() => setViewMotivo(false)} 
            className="close-dialog-button"
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SocioDashboard;