// src/components/dashboard/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import {
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  Box,
  Typography,
  IconButton,
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
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip,
  Menu,
  MenuItem,
  Badge,
  Divider,
  AvatarGroup,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  CircularProgress,
  Select,
  MenuItem as SelectMenuItem,
  FormControl,
  InputLabel,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Description as DescriptionIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  BarChart as BarChartIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  MoreVert as MoreVertIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Security as SecurityIcon,
  Analytics as AnalyticsIcon,
  WorkspacePremium as PremiumIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Shield as ShieldIcon,
  VerifiedUser as VerifiedUserIcon,
  Block as BlockIcon,
  LockOpen as LockOpenIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { 
  collection, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc, 
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy 
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../../firebase/config';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import * as XLSX from 'xlsx';

const AdminDashboard = () => {
  const [registros, setRegistros] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegistro, setSelectedRegistro] = useState(null);
  const [viewMotivo, setViewMotivo] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [editMode, setEditMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  
  // Estados para gestión de usuarios
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userEditMode, setUserEditMode] = useState(false);
  const [userFormData, setUserFormData] = useState({
    nombres: '',
    email: '',
    rol: 'socio',
    estado: 'activo',
    permisos: []
  });
  
  // Estados para feedback
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Estado para diálogo de confirmación de eliminación
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  
  // Estados para nuevo/editar registro
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
    edad: '',
    estatusLaboral: 'Empleado',
    motivo: ''
  });

  const navigate = useNavigate();
  const currentUser = auth.currentUser;

  // Opciones de permisos disponibles
  const permisosDisponibles = [
    { id: 'ver_registros', label: 'Ver registros' },
    { id: 'crear_registros', label: 'Crear registros' },
    { id: 'editar_registros', label: 'Editar registros' },
    { id: 'eliminar_registros', label: 'Eliminar registros' },
    { id: 'ver_usuarios', label: 'Ver usuarios' },
    { id: 'gestionar_usuarios', label: 'Gestionar usuarios' },
    { id: 'ver_analytics', label: 'Ver analytics' },
    { id: 'exportar_datos', label: 'Exportar datos' },
    { id: 'gestionar_config', label: 'Gestionar configuración' }
  ];

  // Roles disponibles
  const rolesDisponibles = [
    { value: 'admin', label: 'Administrador', icon: <AdminIcon fontSize="small" /> },
    { value: 'socio', label: 'Socio', icon: <VerifiedUserIcon fontSize="small" /> },
    { value: 'editor', label: 'Editor', icon: <EditIcon fontSize="small" /> },
    { value: 'visor', label: 'Visor', icon: <VisibilityIcon fontSize="small" /> }
  ];

  // Cargar notificaciones reales
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "notificaciones"), snap => {
      const notifs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setNotifications(notifs);
    });

    return () => unsub();
  }, []);

  // Datos dinámicos para gráficos
  const generarChartData = () => {
    const conteoPorMes = {};

    registros.forEach(r => {
      if (r.fechaRegistro) {
        const fecha = new Date(r.fechaRegistro);
        // Solo procesar si la fecha es válida
        if (!isNaN(fecha.getTime())) {
          const mes = fecha.toLocaleString("es", { month: "short" });
          conteoPorMes[mes] = (conteoPorMes[mes] || 0) + 1;
        }
      }
    });

    return Object.keys(conteoPorMes).map(mes => ({
      name: mes,
      registros: conteoPorMes[mes]
    }));
  };

  const chartData = generarChartData();

  // Datos para gráfico de pastel dinámico
  const generarPieData = () => {
    const conteoEstatus = {};
    
    registros.forEach(r => {
      const estatus = r.estatusLaboral || 'No especificado';
      conteoEstatus[estatus] = (conteoEstatus[estatus] || 0) + 1;
    });

    const colors = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    let index = 0;
    
    return Object.keys(conteoEstatus).map(estatus => ({
      name: estatus,
      value: conteoEstatus[estatus],
      color: colors[index++ % colors.length]
    }));
  };

  const pieData = generarPieData();

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      // Cargar registros con ordenamiento
      const registrosQuery = query(
        collection(db, 'registros'),
        orderBy('fechaRegistro', 'desc')
      );
      const registrosSnapshot = await getDocs(registrosQuery);
      const registrosData = registrosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRegistros(registrosData);

      // Cargar usuarios
      const usuariosSnapshot = await getDocs(collection(db, 'usuarios'));
      const usuariosData = usuariosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsuarios(usuariosData);
    } catch (error) {
      console.error('Error cargando datos:', error);
      showSnackbar('Error cargando datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      showSnackbar('Error al cerrar sesión', 'error');
    }
  };

  // FUNCIÓN PARA ELIMINAR USUARIOS SOCIOS
  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      // Verificar si el usuario actual es administrador
      const currentUserData = usuarios.find(u => u.id === currentUser?.uid);
      const isAdmin = currentUserData?.rol === 'admin';
      
      if (!isAdmin) {
        showSnackbar('Solo los administradores pueden eliminar usuarios', 'error');
        setOpenDeleteDialog(false);
        return;
      }

      // Prevenir que el usuario se elimine a sí mismo
      if (userToDelete.id === currentUser?.uid) {
        showSnackbar('No puedes eliminar tu propia cuenta', 'error');
        setOpenDeleteDialog(false);
        return;
      }

      // Prevenir eliminar administradores (a menos que sea super admin)
      if (userToDelete.rol === 'admin') {
        const isSuperAdmin = currentUserData?.permisos?.includes('gestionar_usuarios');
        if (!isSuperAdmin) {
          showSnackbar('Solo Super Administradores pueden eliminar otros administradores', 'error');
          setOpenDeleteDialog(false);
          return;
        }
      }

      // Eliminar usuario de Firebase
      await deleteDoc(doc(db, 'usuarios', userToDelete.id));
      
      // Recargar datos
      cargarDatos();
      
      // Agregar notificación
      await addDoc(collection(db, "notificaciones"), {
        texto: `Usuario "${userToDelete.nombres || userToDelete.email}" (${userToDelete.rol}) eliminado del sistema`,
        tiempo: "justo ahora",
        leida: false,
        fecha: new Date().toISOString(),
        tipo: 'usuario_eliminado',
        eliminadoPor: currentUser?.email || 'admin',
        eliminadoPorId: currentUser?.uid
      });
      
      showSnackbar(`Usuario "${userToDelete.nombres || userToDelete.email}" eliminado exitosamente`, 'info');
      setOpenDeleteDialog(false);
      setUserToDelete(null);
      
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      showSnackbar('Error eliminando usuario: ' + error.message, 'error');
      setOpenDeleteDialog(false);
    }
  };

  // Función para abrir el diálogo de confirmación de eliminación
  const confirmDeleteUser = (usuario) => {
    setUserToDelete(usuario);
    setOpenDeleteDialog(true);
  };

  const handleDeleteRegistro = async (id) => {
    if (window.confirm('¿Confirmar eliminación de este registro?')) {
      try {
        await deleteDoc(doc(db, 'registros', id));
        cargarDatos();
        
        // Agregar notificación
        await addDoc(collection(db, "notificaciones"), {
          texto: "Registro eliminado del sistema",
          tiempo: "justo ahora",
          leida: false,
          fecha: new Date().toISOString(),
          tipo: 'eliminacion'
        });
        
        showSnackbar('Registro eliminado exitosamente');
      } catch (error) {
        console.error('Error eliminando registro:', error);
        showSnackbar('Error eliminando registro', 'error');
      }
    }
  };

  const handleEditRegistro = async (id, nuevosDatos) => {
    try {
      await updateDoc(doc(db, "registros", id), nuevosDatos);
      cargarDatos();
      
      // Agregar notificación
      await addDoc(collection(db, "notificaciones"), {
        texto: `Registro de ${nuevosDatos.nombres} actualizado`,
        tiempo: "justo ahora",
        leida: false,
        fecha: new Date().toISOString(),
        tipo: 'edicion'
      });
      
      showSnackbar('Registro actualizado exitosamente');
    } catch (error) {
      console.error('Error actualizando registro:', error);
      showSnackbar('Error actualizando registro', 'error');
    }
  };

  const handleCreateRegistro = async () => {
    try {
      const nuevoRegistro = {
        ...formData,
        fechaRegistro: new Date().toISOString(),
        userId: auth.currentUser?.uid || 'admin'
      };

      await addDoc(collection(db, 'registros'), nuevoRegistro);
      cargarDatos();
      setOpenForm(false);
      resetForm();
      
      // Agregar notificación
      await addDoc(collection(db, "notificaciones"), {
        texto: `Nuevo registro creado: ${formData.nombres} ${formData.apellidos}`,
        tiempo: "justo ahora",
        leida: false,
        fecha: new Date().toISOString(),
        tipo: 'creacion'
      });
      
      showSnackbar('Registro creado exitosamente');
    } catch (error) {
      console.error('Error creando registro:', error);
      showSnackbar('Error creando registro', 'error');
    }
  };

  // FUNCIÓN CORREGIDA PARA ACTUALIZAR USUARIOS
  const handleUpdateUser = async () => {
    try {
      if (!selectedUser) return;
      
      // Asegurar que los permisos sean un array válido
      const permisosArray = Array.isArray(userFormData.permisos) 
        ? userFormData.permisos.filter(permiso => 
            permisosDisponibles.some(p => p.id === permiso)
          )
        : [];
      
      // Preparar datos para actualizar
      const userDataToUpdate = {
        nombres: userFormData.nombres,
        email: userFormData.email,
        rol: userFormData.rol,
        estado: userFormData.estado,
        permisos: permisosArray, // Guardar como array filtrado
        ultimaActualizacion: new Date().toISOString(),
        actualizadoPor: currentUser?.email || 'admin'
      };
      
      // Actualizar en Firebase
      const userRef = doc(db, "usuarios", selectedUser.id);
      await updateDoc(userRef, userDataToUpdate);
      
      // Actualizar UI
      cargarDatos();
      setOpenUserDialog(false);
      resetUserForm();
      
      // Agregar notificación
      await addDoc(collection(db, "notificaciones"), {
        texto: `Usuario ${userFormData.nombres} actualizado (${permisosArray.length} permisos)`,
        tiempo: "justo ahora",
        leida: false,
        fecha: new Date().toISOString(),
        tipo: 'usuario_actualizado',
        permisosActualizados: permisosArray,
        rolActualizado: userFormData.rol,
        actualizadoPor: currentUser?.email || 'admin'
      });
      
      showSnackbar('Usuario actualizado exitosamente');
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      showSnackbar('Error actualizando usuario: ' + error.message, 'error');
    }
  };

  const handleToggleUserStatus = async (userId, nuevoEstado) => {
    try {
      const userRef = doc(db, "usuarios", userId);
      await updateDoc(userRef, {
        estado: nuevoEstado,
        ultimaActualizacion: new Date().toISOString(),
        actualizadoPor: currentUser?.email || 'admin'
      });
      
      cargarDatos();
      
      const accion = nuevoEstado === 'activo' ? 'activado' : 'desactivado';
      showSnackbar(`Usuario ${accion} exitosamente`);
    } catch (error) {
      console.error('Error cambiando estado del usuario:', error);
      showSnackbar('Error cambiando estado del usuario', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      nombres: '',
      apellidos: '',
      email: '',
      telefono: '',
      edad: '',
      estatusLaboral: 'Empleado',
      motivo: ''
    });
    setEditMode(false);
    setSelectedRegistro(null);
  };

  const resetUserForm = () => {
    setUserFormData({
      nombres: '',
      email: '',
      rol: 'socio',
      estado: 'activo',
      permisos: [] // Siempre array vacío por defecto
    });
    setSelectedUser(null);
    setUserEditMode(false);
  };

  const handleExport = () => {
    try {
      const ws = XLSX.utils.json_to_sheet(registros);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Registros");
      XLSX.writeFile(wb, `registros_${new Date().toISOString().split('T')[0]}.xlsx`);
      showSnackbar('Exportación completada');
    } catch (error) {
      console.error('Error exportando datos:', error);
      showSnackbar('Error exportando datos', 'error');
    }
  };

  // Filtro combinado
  const filteredRegistros = registros.filter(registro => {
    const coincideTexto =
      registro.nombres?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registro.apellidos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registro.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const coincideEstado =
      filtroEstado === "todos" || registro.estatusLaboral === filtroEstado;

    return coincideTexto && coincideEstado;
  });

  const stats = {
    totalRegistros: registros.length,
    totalSocios: usuarios.filter(u => u.rol === 'socio' && u.estado === "activo").length,
    totalAdmins: usuarios.filter(u => u.rol === 'admin').length,
    usuariosActivos: usuarios.filter(u => u.estado === 'activo').length,
    nuevosHoy: registros.filter(r => {
      if (!r.fechaRegistro) return false;
      const today = new Date().toDateString();
      const regDate = new Date(r.fechaRegistro).toDateString();
      return today === regDate;
    }).length
  };

  // Función para abrir diálogo de edición de usuario
  const openEditUserDialog = (usuario) => {
    setSelectedUser(usuario);
    setUserFormData({
      nombres: usuario.nombres || '',
      email: usuario.email || '',
      rol: usuario.rol || 'socio',
      estado: usuario.estado || 'activo',
      // Asegurar que permisos sea un array
      permisos: Array.isArray(usuario.permisos) ? usuario.permisos : []
    });
    setUserEditMode(true);
    setOpenUserDialog(true);
  };

  // Componentes de sección
  const ResumenSection = () => (
    <>
      <Grid container spacing={3} className="stats-grid" sx={{ justifyContent: 'center' }}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card className="stat-card-executive total">
            <CardContent>
              <Box className="stat-header">
                <Typography variant="subtitle2">TOTAL REGISTROS</Typography>
                <DescriptionIcon className="stat-icon-executive" />
              </Box>
              <Typography variant="h2" className="stat-number-executive">
                {stats.totalRegistros}
              </Typography>
              <LinearProgress variant="determinate" value={75} className="stat-progress" />
              <Typography variant="caption" className="stat-trend">
                <TrendingUpIcon fontSize="small" /> +12% vs mes anterior
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card className="stat-card-executive users">
            <CardContent>
              <Box className="stat-header">
                <Typography variant="subtitle2">USUARIOS ACTIVOS</Typography>
                <PeopleIcon className="stat-icon-executive" />
              </Box>
              <Typography variant="h2" className="stat-number-executive">
                {stats.usuariosActivos}
              </Typography>
              <LinearProgress variant="determinate" value={60} className="stat-progress" />
              <Box display="flex" alignItems="center" gap={1}>
                <AvatarGroup max={3} className="user-avatars">
                  {usuarios.slice(0, 3).map((user, idx) => (
                    <Avatar key={idx} className="small-avatar">
                      {user.nombres?.charAt(0)}
                    </Avatar>
                  ))}
                </AvatarGroup>
                <Typography variant="caption" className="stat-caption">
                  {stats.totalAdmins} administradores
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card className="stat-card-executive growth">
            <CardContent>
              <Box className="stat-header">
                <Typography variant="subtitle2">NUEVOS HOY</Typography>
                <TrendingUpIcon className="stat-icon-executive" />
              </Box>
              <Typography variant="h2" className="stat-number-executive">
                {stats.nuevosHoy}
              </Typography>
              <LinearProgress variant="determinate" value={40} className="stat-progress" />
              <Typography variant="caption" className="stat-trend positive">
                <TrendingUpIcon fontSize="small" /> +8 registros esta semana
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card className="stat-card-executive performance">
            <CardContent>
              <Box className="stat-header">
                <Typography variant="subtitle2">RENDIMIENTO</Typography>
                <BarChartIcon className="stat-icon-executive" />
              </Box>
              <Box className="performance-chart">
                <ResponsiveContainer width="100%" height={60}>
                  <LineChart data={chartData}>
                    <Line 
                      type="monotone" 
                      dataKey="registros" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
              <Typography variant="caption" className="stat-caption">
                Tendencia mensual positiva
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} className="charts-section" sx={{ justifyContent: 'center' }}>
        <Grid item xs={12} md={10} lg={8}>
          <Card className="chart-card">
            <CardContent>
              <Box className="chart-header">
                <Typography variant="h6" sx={{ textAlign: 'center', width: '100%' }}>
                  Registros Mensuales (Real)
                </Typography>
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="registros" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    dot={{ stroke: '#8b5cf6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={10} lg={8}>
          <Card className="chart-card">
            <CardContent>
              <Typography variant="h6" sx={{ textAlign: 'center', width: '100%' }}>
                Distribución por Estado (Real)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Stats Footer */}
      <Box className="quick-stats" sx={{ justifyContent: 'center' }}>
        <Card className="quick-stat-card">
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Progreso del Mes
                </Typography>
                <Typography variant="h5">78%</Typography>
              </Box>
              <CircularProgress variant="determinate" value={78} size={60} />
            </Box>
          </CardContent>
        </Card>
        
        <Card className="quick-stat-card">
          <CardContent>
            <Typography variant="subtitle2" color="textSecondary">
              Próximas Actividades
            </Typography>
            <Box display="flex" alignItems="center" gap={2} mt={1}>
              <CalendarIcon color="primary" />
              <Typography variant="body2">Revisión de registros pendientes</Typography>
            </Box>
          </CardContent>
        </Card>
        
        <Card className="quick-stat-card">
          <CardContent>
            <Typography variant="subtitle2" color="textSecondary">
              Tiempo de Respuesta
            </Typography>
            <Typography variant="h5">4.2h</Typography>
            <Typography variant="caption">Promedio de atención</Typography>
          </CardContent>
        </Card>
      </Box>
    </>
  );

  const RegistrosSection = () => (
    <>
      <Card className="table-card-executive" sx={{ mx: 'auto', maxWidth: '95%' }}>
        <CardContent>
          <Box className="table-header-executive">
            <Typography variant="h6" sx={{ textAlign: 'center', width: '100%' }}>
              Registros ({filteredRegistros.length})
            </Typography>
            <Box className="table-actions" sx={{ justifyContent: 'center' }}>
              <TextField
                placeholder="Buscar..."
                size="small"
                variant="outlined"
                className="table-search"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
              />
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={filtroEstado}
                  label="Estado"
                  onChange={(e) => setFiltroEstado(e.target.value)}
                >
                  <SelectMenuItem value="todos">Todos</SelectMenuItem>
                  <SelectMenuItem value="Empleado">Empleado</SelectMenuItem>
                  <SelectMenuItem value="Estudiante">Estudiante</SelectMenuItem>
                  <SelectMenuItem value="Desempleado">Desempleado</SelectMenuItem>
                  <SelectMenuItem value="Independiente">Independiente</SelectMenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Información</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRegistros.slice(0, 20).map((registro) => (
                  <TableRow key={registro.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar className="table-avatar">
                          {registro.nombres?.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="600">
                            {registro.nombres} {registro.apellidos}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {registro.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          Edad: {registro.edad} años
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Tel: {registro.telefono || 'No especificado'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={registro.estatusLaboral}
                        size="small"
                        className={`status-chip-executive ${registro.estatusLaboral?.toLowerCase()}`}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(registro.fechaRegistro).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" gap={1} justifyContent="center">
                        <Tooltip title="Ver detalles">
                          <IconButton 
                            size="small"
                            onClick={() => {
                              setSelectedRegistro(registro);
                              setViewMotivo(true);
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton 
                            size="small"
                            onClick={() => {
                              setSelectedRegistro(registro);
                              setFormData({
                                nombres: registro.nombres || '',
                                apellidos: registro.apellidos || '',
                                email: registro.email || '',
                                telefono: registro.telefono || '',
                                edad: registro.edad || '',
                                estatusLaboral: registro.estatusLaboral || 'Empleado',
                                motivo: registro.motivo || ''
                              });
                              setEditMode(true);
                              setOpenForm(true);
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteRegistro(registro.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </>
  );

  const UsuariosSection = () => (
    <>
      <Card className="table-card-executive" sx={{ mx: 'auto', maxWidth: '95%' }}>
        <CardContent>
          <Box className="table-header-executive">
            <Typography variant="h6" sx={{ textAlign: 'center', width: '100%' }}>
              Usuarios del Sistema ({usuarios.length})
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', width: '100%' }}>
              Gestiona roles, permisos y estados de los usuarios
            </Typography>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Último Acceso</TableCell>
                  <TableCell align="center">Permisos</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usuarios.map((usuario) => (
                  <TableRow key={usuario.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar className="table-avatar">
                          {usuario.nombres?.charAt(0) || usuario.email?.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="600">
                            {usuario.nombres || 'Sin nombre'}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            ID: {usuario.id.substring(0, 8)}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={usuario.rol || 'usuario'}
                        size="small"
                        className={`role-chip ${usuario.rol}`}
                        color={usuario.rol === 'admin' ? 'primary' : usuario.rol === 'socio' ? 'success' : 'default'}
                        icon={usuario.rol === 'admin' ? <AdminIcon /> : usuario.rol === 'socio' ? <VerifiedUserIcon /> : <PersonIcon />}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={usuario.estado || 'activo'}
                        size="small"
                        className={`status-chip ${usuario.estado}`}
                        color={usuario.estado === 'activo' ? 'success' : 'error'}
                        icon={usuario.estado === 'activo' ? <CheckCircleIcon /> : <CancelIcon />}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{usuario.email}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">
                        {usuario.ultimoAcceso ? new Date(usuario.ultimoAcceso).toLocaleDateString() : 'Nunca'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title={`${Array.isArray(usuario.permisos) ? usuario.permisos.length : 0} permisos asignados`}>
                        <Chip 
                          label={`${Array.isArray(usuario.permisos) ? usuario.permisos.length : 0} permisos`}
                          size="small"
                          variant="outlined"
                          color="info"
                        />
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" gap={1} justifyContent="center">
                        {usuario.estado === 'activo' ? (
                          <Tooltip title="Desactivar usuario">
                            <IconButton 
                              size="small"
                              color="warning"
                              onClick={() => handleToggleUserStatus(usuario.id, 'inactivo')}
                            >
                              <BlockIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Activar usuario">
                            <IconButton 
                              size="small"
                              color="success"
                              onClick={() => handleToggleUserStatus(usuario.id, 'activo')}
                            >
                              <LockOpenIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Editar rol y permisos">
                          <Button 
                            size="small" 
                            variant="outlined"
                            startIcon={<EditIcon />}
                            onClick={() => openEditUserDialog(usuario)}
                          >
                            Editar
                          </Button>
                        </Tooltip>
                        {/* Botón para eliminar usuario */}
                        <Tooltip title="Eliminar usuario permanentemente">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => confirmDeleteUser(usuario)}
                            disabled={usuario.rol === 'admin' && 
                              (!usuarios.find(u => u.id === currentUser?.uid)?.permisos?.includes('gestionar_usuarios'))}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Información adicional sobre roles */}
      <Grid container spacing={2} sx={{ mt: 2, justifyContent: 'center' }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle1" gutterBottom>
                <AdminIcon color="primary" sx={{ mr: 1 }} />
                Administrador
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Acceso completo a todas las funcionalidades del sistema
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle1" gutterBottom>
                <VerifiedUserIcon color="success" sx={{ mr: 1 }} />
                Socio
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Puede ver y gestionar registros, pero no usuarios
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle1" gutterBottom>
                <PersonIcon color="action" sx={{ mr: 1 }} />
                Usuario Básico
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Solo puede ver información, sin permisos de edición
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );

  const AnalyticsSection = () => (
    <>
      <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
        <Grid item xs={12} md={10} lg={8}>
          <Card className="chart-card">
            <CardContent>
              <Box className="chart-header">
                <Typography variant="h6" sx={{ textAlign: 'center', width: '100%' }}>
                  Análisis Detallado de Registros
                </Typography>
              </Box>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Line 
                    type="monotone" 
                    dataKey="registros" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={10} lg={8}>
          <Card className="chart-card">
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
                Métricas Clave
              </Typography>
              
              <Box mb={3}>
                <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center' }}>
                  Registros por Estado Laboral
                </Typography>
                {pieData.map((item, index) => (
                  <Box key={index} display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box width={12} height={12} bgcolor={item.color} borderRadius="2px" />
                      <Typography variant="body2">{item.name}</Typography>
                    </Box>
                    <Typography variant="body2" fontWeight="600">{item.value}</Typography>
                  </Box>
                ))}
              </Box>

              <Divider />

              <Box mt={3}>
                <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center' }}>
                  Tasa de Crecimiento
                </Typography>
                <Typography variant="h4" color="success.main" sx={{ textAlign: 'center' }}>
                  +{stats.nuevosHoy} hoy
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', textAlign: 'center' }}>
                  {((stats.nuevosHoy / stats.totalRegistros) * 100).toFixed(1)}% del total
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );

  return (
    <Box className={`executive-dashboard ${darkMode ? 'dark-mode' : ''}`}>
      {/* AppBar Superior Minimalista */}
      <AppBar position="fixed" className="executive-appbar">
        <Toolbar className="executive-toolbar">
          <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
            <IconButton 
              edge="start" 
              color="inherit" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="menu-toggle"
            >
              {sidebarOpen ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
            
            <Box display="flex" alignItems="center" gap={2} ml={2}>
              <Box className="brand-logo">
                <PremiumIcon />
              </Box>
              <Typography variant="h6" className="brand-name">
                CLASS<span className="brand-accent">ADMIN</span>
              </Typography>
              <Chip 
                label="PRO" 
                size="small" 
                className="pro-badge"
                icon={<SecurityIcon />}
              />
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap={3}>
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                  className="theme-switch"
                />
              }
              label={darkMode ? "Modo Oscuro" : "Modo Claro"}
            />
            
            <TextField
              placeholder="Buscar registros..."
              size="small"
              variant="outlined"
              className="search-field-minimal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
            />

            <Tooltip title="Notificaciones">
              <IconButton 
                className="header-icon-btn"
                onClick={(e) => setNotificationsAnchor(e.currentTarget)}
              >
                <Badge 
                  badgeContent={notifications.filter(n => !n.leida).length} 
                  color="error"
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={notificationsAnchor}
              open={Boolean(notificationsAnchor)}
              onClose={() => setNotificationsAnchor(null)}
              className="notifications-menu"
            >
              <MenuItem disabled>
                <Typography variant="subtitle2">Notificaciones</Typography>
              </MenuItem>
              <Divider />
              {notifications.slice(0, 5).map((notif) => (
                <MenuItem key={notif.id}>
                  <Box>
                    <Typography variant="body2">{notif.texto}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {notif.tiempo}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
              {notifications.length === 0 && (
                <MenuItem disabled>
                  <Typography variant="body2" color="textSecondary">
                    No hay notificaciones
                  </Typography>
                </MenuItem>
              )}
            </Menu>

            <Avatar 
              className="user-avatar-minimal"
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              <PersonIcon />
            </Avatar>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              className="user-menu"
            >
              <MenuItem>
                <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Mi Perfil</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Configuración</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout} className="logout-item">
                <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Cerrar Sesión</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Estilizado - ANCHO REDUCIDO */}
      <Drawer 
        variant="permanent" 
        className={`executive-sidebar ${sidebarOpen ? 'open' : 'closed'}`}
        sx={{
          '& .MuiDrawer-paper': {
            width: sidebarOpen ? 240 : 72,
            transition: 'width 0.3s ease',
          }
        }}
      >
        <Toolbar />
        <Box className="sidebar-content">
          <List className="sidebar-list">
            <ListItem 
              className={`sidebar-item ${activeTab === 0 ? 'active' : ''}`}
              onClick={() => setActiveTab(0)}
              button
            >
              <ListItemIcon><DashboardIcon className="sidebar-icon" /></ListItemIcon>
              <ListItemText primary="Resumen" className="sidebar-text" />
            </ListItem>
            
            <ListItem 
              className={`sidebar-item ${activeTab === 2 ? 'active' : ''}`}
              onClick={() => setActiveTab(2)}
              button
            >
              <ListItemIcon><PeopleIcon className="sidebar-icon" /></ListItemIcon>
              <ListItemText primary="Usuarios" className="sidebar-text" />
              <Chip label={usuarios.length} size="small" className="sidebar-badge" />
            </ListItem>
            
            <ListItem 
              className={`sidebar-item ${activeTab === 1 ? 'active' : ''}`}
              onClick={() => setActiveTab(1)}
              button
            >
              <ListItemIcon><DescriptionIcon className="sidebar-icon" /></ListItemIcon>
              <ListItemText primary="Registros" className="sidebar-text" />
              <Chip label={registros.length} size="small" className="sidebar-badge" />
            </ListItem>
            
            <ListItem 
              className={`sidebar-item ${activeTab === 3 ? 'active' : ''}`}
              onClick={() => setActiveTab(3)}
              button
            >
              <ListItemIcon><AnalyticsIcon className="sidebar-icon" /></ListItemIcon>
              <ListItemText primary="Analytics" className="sidebar-text" />
            </ListItem>
            
            <ListItem className="sidebar-item" button>
              <ListItemIcon><BarChartIcon className="sidebar-icon" /></ListItemIcon>
              <ListItemText primary="Reportes" className="sidebar-text" />
            </ListItem>
            
            <ListItem className="sidebar-item" button>
              <ListItemIcon><CalendarIcon className="sidebar-icon" /></ListItemIcon>
              <ListItemText primary="Calendario" className="sidebar-text" />
            </ListItem>
          </List>

          <Box className="sidebar-footer">
            <Divider />
            <Box className="admin-info">
              <Avatar className="admin-avatar">
                <AdminIcon />
              </Avatar>
              <Box>
                <Typography variant="subtitle2">Administrador</Typography>
                <Typography variant="caption" color="textSecondary">Super Admin</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Drawer>

      {/* Contenido Principal - MARGEN AUMENTADO */}
      <Box 
        component="main" 
        className={`executive-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
        sx={{
          marginLeft: sidebarOpen ? '240px' : '72px',
          transition: 'margin-left 0.3s ease',
          paddingLeft: '32px', // Añadido padding a la izquierda
          paddingRight: '32px', // Añadido padding a la derecha
          width: `calc(100% - ${sidebarOpen ? '240px' : '72px'})`,
          boxSizing: 'border-box'
        }}
      >
        <Toolbar />
        
        {/* Contenedor principal con centrado */}
        <Container maxWidth="xl" className="executive-container main-content-centered">
          
          {/* A. Dashboard Header Centrado */}
          <Box className="dashboard-header">
            <Box sx={{ textAlign: 'center', width: '100%' }}>
              <Typography variant="h4" className="dashboard-title-executive" sx={{ textAlign: 'center' }}>
                Panel de Administración
              </Typography>
              <Typography variant="body1" className="dashboard-subtitle" sx={{ textAlign: 'center' }}>
                Gestión completa del sistema - Última actualización: Hoy
              </Typography>
            </Box>
            
            <Box className="header-actions" sx={{ justifyContent: 'center', width: '100%', mt: 2 }}>
              <Button 
                startIcon={<DownloadIcon />} 
                variant="outlined" 
                className="export-btn"
                onClick={handleExport}
              >
                Exportar
              </Button>
              <Button 
                startIcon={<FilterIcon />} 
                variant="outlined" 
                className="filter-btn"
                onClick={() => setFiltroEstado(filtroEstado === "Empleado" ? "todos" : "Empleado")}
              >
                {filtroEstado === "Empleado" ? "Mostrar Todos" : "Filtrar Empleados"}
              </Button>
              <Button 
                startIcon={<AddIcon />} 
                variant="contained" 
                className="add-btn"
                onClick={() => {
                  resetForm();
                  setOpenForm(true);
                }}
              >
                Nuevo Registro
              </Button>
            </Box>
          </Box>

          {/* Tabs centrados */}
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Tabs 
              value={activeTab} 
              onChange={(e, val) => setActiveTab(val)}
              className="dashboard-tabs"
              centered
            >
              <Tab label="Resumen" icon={<DashboardIcon />} />
              <Tab label="Registros" icon={<DescriptionIcon />} />
              <Tab label="Usuarios" icon={<PeopleIcon />} />
              <Tab label="Analytics" icon={<AnalyticsIcon />} />
            </Tabs>
          </Box>
          
          {/* Contenido de cada sección centrado CON MÁRGENES */}
          <Box sx={{ 
            width: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            marginLeft: 'auto',
            marginRight: 'auto',
            maxWidth: '1400px' // Limitar el ancho máximo
          }}>
            {loading ? (
              <Box className="loading-container">
                <CircularProgress />
                <Typography>Cargando datos...</Typography>
              </Box>
            ) : (
              <>
                {activeTab === 0 && <ResumenSection />}
                {activeTab === 1 && <RegistrosSection />}
                {activeTab === 2 && <UsuariosSection />}
                {activeTab === 3 && <AnalyticsSection />}
              </>
            )}
          </Box>
        </Container>
      </Box>

      {/* Dialog de Confirmación para Eliminar Usuario */}
      <Dialog 
        open={openDeleteDialog} 
        onClose={() => {
          setOpenDeleteDialog(false);
          setUserToDelete(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2} color="error.main" justifyContent="center">
            <WarningIcon fontSize="large" />
            <Typography variant="h6">Confirmar Eliminación</Typography>
          </Box>
          <IconButton
            aria-label="close"
            onClick={() => {
              setOpenDeleteDialog(false);
              setUserToDelete(null);
            }}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          {userToDelete && (
            <Box>
              <Alert severity="warning" sx={{ mb: 3, textAlign: 'center' }}>
                <Typography variant="subtitle2">
                  ⚠️ Esta acción no se puede deshacer
                </Typography>
              </Alert>
              
              <Box className="user-delete-info">
                <Typography variant="subtitle1" gutterBottom sx={{ textAlign: 'center' }}>
                  Información del usuario a eliminar:
                </Typography>
                
                <Grid container spacing={2} sx={{ mt: 1, justifyContent: 'center' }}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="textSecondary">Nombre:</Typography>
                    <Typography variant="body2" fontWeight="600" sx={{ textAlign: 'center' }}>
                      {userToDelete.nombres || 'Sin nombre'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="textSecondary">Email:</Typography>
                    <Typography variant="body2" sx={{ textAlign: 'center' }}>{userToDelete.email}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="textSecondary">Rol:</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Chip 
                        label={userToDelete.rol} 
                        size="small"
                        color={userToDelete.rol === 'admin' ? 'primary' : 'default'}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="textSecondary">Estado:</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Chip 
                        label={userToDelete.estado} 
                        size="small"
                        color={userToDelete.estado === 'activo' ? 'success' : 'error'}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="textSecondary">ID:</Typography>
                    <Typography variant="body2" fontFamily="monospace" sx={{ textAlign: 'center' }}>
                      {userToDelete.id}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              
              <Box sx={{ mt: 3, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
                <Typography variant="body2" color="error.dark" sx={{ textAlign: 'center' }}>
                  <strong>Advertencia:</strong> Al eliminar este usuario:
                </Typography>
                <Typography variant="caption" color="error.dark" component="div" sx={{ textAlign: 'center' }}>
                  <ul style={{ textAlign: 'left', display: 'inline-block' }}>
                    <li>Se eliminará permanentemente de la base de datos</li>
                    <li>No podrá acceder al sistema nuevamente</li>
                    <li>Se registrará esta acción en el historial</li>
                    <li>Esta acción es irreversible</li>
                  </ul>
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button 
            onClick={() => {
              setOpenDeleteDialog(false);
              setUserToDelete(null);
            }}
            variant="outlined"
          >
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteUser}
            disabled={!userToDelete}
          >
            Eliminar Permanentemente
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Gestión de Usuarios */}
      <Dialog 
        open={openUserDialog} 
        onClose={() => {
          setOpenUserDialog(false);
          resetUserForm();
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1} justifyContent="center">
            <ShieldIcon color="primary" />
            {userEditMode ? 'Editar Usuario' : 'Nuevo Usuario'}
          </Box>
          <IconButton
            aria-label="close"
            onClick={() => {
              setOpenUserDialog(false);
              resetUserForm();
            }}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          {selectedUser && (
            <Alert severity="info" sx={{ mb: 2, textAlign: 'center' }}>
              Editando usuario: {selectedUser.email}
            </Alert>
          )}
          
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Nombres"
                  value={userFormData.nombres}
                  onChange={(e) => setUserFormData({...userFormData, nombres: e.target.value})}
                  required
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={userFormData.email}
                  onChange={(e) => setUserFormData({...userFormData, email: e.target.value})}
                  required
                  disabled={userEditMode}
                />
              </Grid>
              
              <Grid item xs={12} md={8}>
                <FormControl fullWidth>
                  <InputLabel>Rol</InputLabel>
                  <Select
                    value={userFormData.rol}
                    label="Rol"
                    onChange={(e) => setUserFormData({...userFormData, rol: e.target.value})}
                  >
                    {rolesDisponibles.map((rol) => (
                      <MenuItem key={rol.value} value={rol.value}>
                        <Box display="flex" alignItems="center" gap={1}>
                          {rol.icon}
                          {rol.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={8}>
                <FormControl fullWidth>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={userFormData.estado}
                    label="Estado"
                    onChange={(e) => setUserFormData({...userFormData, estado: e.target.value})}
                  >
                    <MenuItem value="activo">
                      <Box display="flex" alignItems="center" gap={1}>
                        <CheckCircleIcon fontSize="small" color="success" />
                        Activo
                      </Box>
                    </MenuItem>
                    <MenuItem value="inactivo">
                      <Box display="flex" alignItems="center" gap={1}>
                        <CancelIcon fontSize="small" color="error" />
                        Inactivo
                      </Box>
                    </MenuItem>
                    <MenuItem value="pendiente">
                      <Box display="flex" alignItems="center" gap={1}>
                        <CircularProgress size={16} />
                        Pendiente
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={10}>
                <Typography variant="subtitle2" gutterBottom sx={{ textAlign: 'center' }}>
                  Permisos Específicos
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, maxHeight: 200, overflow: 'auto' }}>
                  <Grid container spacing={1} justifyContent="center">
                    {permisosDisponibles.map((permiso) => (
                      <Grid item xs={12} sm={6} key={permiso.id}>
                        <FormControlLabel
                          control={
                            <Switch
                              size="small"
                              checked={Array.isArray(userFormData.permisos) && userFormData.permisos.includes(permiso.id)}
                              onChange={(e) => {
                                const currentPermisos = Array.isArray(userFormData.permisos) ? userFormData.permisos : [];
                                const nuevosPermisos = e.target.checked
                                  ? [...currentPermisos, permiso.id]
                                  : currentPermisos.filter(p => p !== permiso.id);
                                setUserFormData({...userFormData, permisos: nuevosPermisos});
                              }}
                            />
                          }
                          label={permiso.label}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
                <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
                  {Array.isArray(userFormData.permisos) ? userFormData.permisos.length : 0} de {permisosDisponibles.length} permisos seleccionados
                </Typography>
              </Grid>
              
              {selectedUser && (
                <Grid item xs={12} md={10}>
                  <Typography variant="subtitle2" gutterBottom sx={{ textAlign: 'center' }}>
                    Información Adicional
                  </Typography>
                  <Box className="info-grid" sx={{ textAlign: 'center' }}>
                    <Typography variant="caption">ID:</Typography>
                    <Typography variant="body2">{selectedUser.id}</Typography>
                    
                    <Typography variant="caption">Creado:</Typography>
                    <Typography variant="body2">
                      {selectedUser.fechaCreacion ? new Date(selectedUser.fechaCreacion).toLocaleDateString() : 'No disponible'}
                    </Typography>
                    
                    <Typography variant="caption">Última actualización:</Typography>
                    <Typography variant="body2">
                      {selectedUser.ultimaActualizacion ? new Date(selectedUser.ultimaActualizacion).toLocaleDateString() : 'No disponible'}
                    </Typography>
                    
                    <Typography variant="caption">Permisos activos:</Typography>
                    <Typography variant="body2">
                      {Array.isArray(selectedUser.permisos) ? selectedUser.permisos.join(', ') : 'Ninguno'}
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button 
            onClick={() => {
              setOpenUserDialog(false);
              resetUserForm();
            }}
          >
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            startIcon={<SaveIcon />}
            onClick={handleUpdateUser}
            disabled={!userFormData.nombres || !userFormData.email}
          >
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Nuevo/Editar Registro */}
      <Dialog 
        open={openForm} 
        onClose={() => {
          setOpenForm(false);
          resetForm();
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center' }}>
          {editMode ? 'Editar Registro' : 'Nuevo Registro'}
          <IconButton
            aria-label="close"
            onClick={() => {
              setOpenForm(false);
              resetForm();
            }}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} md={10}>
                <TextField
                  fullWidth
                  label="Nombres"
                  value={formData.nombres}
                  onChange={(e) => setFormData({...formData, nombres: e.target.value})}
                  required
                />
              </Grid>
              <Grid item xs={12} md={10}>
                <TextField
                  fullWidth
                  label="Apellidos"
                  value={formData.apellidos}
                  onChange={(e) => setFormData({...formData, apellidos: e.target.value})}
                  required
                />
              </Grid>
              <Grid item xs={12} md={10}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </Grid>
              <Grid item xs={12} md={10}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  value={formData.telefono}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} md={10}>
                <TextField
                  fullWidth
                  label="Edad"
                  type="number"
                  value={formData.edad}
                  onChange={(e) => setFormData({...formData, edad: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} md={10}>
                <FormControl fullWidth>
                  <InputLabel>Estado Laboral</InputLabel>
                  <Select
                    value={formData.estatusLaboral}
                    label="Estado Laboral"
                    onChange={(e) => setFormData({...formData, estatusLaboral: e.target.value})}
                  >
                    <MenuItem value="Empleado">Empleado</MenuItem>
                    <MenuItem value="Estudiante">Estudiante</MenuItem>
                    <MenuItem value="Desempleado">Desempleado</MenuItem>
                    <MenuItem value="Independiente">Independiente</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={10}>
                <TextField
                  fullWidth
                  label="Motivo del Registro"
                  multiline
                  rows={4}
                  value={formData.motivo}
                  onChange={(e) => setFormData({...formData, motivo: e.target.value})}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button 
            onClick={() => {
              setOpenForm(false);
              resetForm();
            }}
          >
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            startIcon={editMode ? <SaveIcon /> : <AddIcon />}
            onClick={() => {
              if (editMode && selectedRegistro) {
                handleEditRegistro(selectedRegistro.id, formData);
              } else {
                handleCreateRegistro();
              }
            }}
          >
            {editMode ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Detalles */}
      <Dialog 
        open={viewMotivo} 
        onClose={() => setViewMotivo(false)} 
        maxWidth="md"
        className="executive-dialog"
      >
        <DialogTitle className="executive-dialog-title">
          <Box display="flex" alignItems="center" gap={2} justifyContent="center">
            <Avatar className="dialog-main-avatar">
              {selectedRegistro?.nombres?.charAt(0)}
            </Avatar>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6">
                {selectedRegistro?.nombres} {selectedRegistro?.apellidos}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                ID: {selectedRegistro?.id?.substring(0, 8).toUpperCase()}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          {selectedRegistro && (
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} md={8}>
                <Typography variant="subtitle2" gutterBottom sx={{ textAlign: 'center' }}>Información Personal</Typography>
                <Box className="info-grid">
                  <Typography variant="caption">Email:</Typography>
                  <Typography variant="body2" sx={{ textAlign: 'center' }}>{selectedRegistro.email}</Typography>
                  
                  <Typography variant="caption">Teléfono:</Typography>
                  <Typography variant="body2" sx={{ textAlign: 'center' }}>{selectedRegistro.telefono || 'No especificado'}</Typography>
                  
                  <Typography variant="caption">Edad:</Typography>
                  <Typography variant="body2" sx={{ textAlign: 'center' }}>{selectedRegistro.edad} años</Typography>
                  
                  <Typography variant="caption">Estado:</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Chip 
                      label={selectedRegistro.estatusLaboral}
                      size="small"
                      className={`status-chip-executive ${selectedRegistro.estatusLaboral?.toLowerCase()}`}
                    />
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={8}>
                <Typography variant="subtitle2" gutterBottom sx={{ textAlign: 'center' }}>Registro</Typography>
                <Box className="info-grid">
                  <Typography variant="caption">Fecha:</Typography>
                  <Typography variant="body2" sx={{ textAlign: 'center' }}>
                    {new Date(selectedRegistro.fechaRegistro).toLocaleString()}
                  </Typography>
                  
                  <Typography variant="caption">ID Usuario:</Typography>
                  <Typography variant="body2" sx={{ textAlign: 'center' }}>{selectedRegistro.userId || 'N/A'}</Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={10}>
                <Typography variant="subtitle2" gutterBottom sx={{ textAlign: 'center' }}>Motivo del Registro</Typography>
                <Paper variant="outlined" className="motive-paper">
                  <Typography variant="body2" sx={{ textAlign: 'center' }}>
                    {selectedRegistro.motivo}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        
        <DialogActions className="executive-dialog-actions" sx={{ justifyContent: 'center' }}>
          <Button onClick={() => setViewMotivo(false)} className="dialog-close-btn">
            Cerrar
          </Button>
          <Button 
            variant="contained" 
            className="dialog-action-btn"
            onClick={() => {
              setViewMotivo(false);
              setSelectedRegistro(selectedRegistro);
              setFormData({
                nombres: selectedRegistro.nombres || '',
                apellidos: selectedRegistro.apellidos || '',
                email: selectedRegistro.email || '',
                telefono: selectedRegistro.telefono || '',
                edad: selectedRegistro.edad || '',
                estatusLaboral: selectedRegistro.estatusLaboral || 'Empleado',
                motivo: selectedRegistro.motivo || ''
              });
              setEditMode(true);
              setOpenForm(true);
            }}
          >
            Editar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({...snackbar, open: false})}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({...snackbar, open: false})} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminDashboard;