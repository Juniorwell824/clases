// src/components/dashboard/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Typography,
  Box,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  TextField,
  Select,
  MenuItem,
  Alert
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

// Lista de permisos disponibles
const PERMISOS_DISPONIBLES = [
  { id: 'ver_registros', label: 'Ver registros' },
  { id: 'crear_registros', label: 'Crear registros' },
  { id: 'editar_registros', label: 'Editar registros' },
  { id: 'eliminar_registros', label: 'Eliminar registros' },
  { id: 'ver_usuarios', label: 'Ver usuarios' },
  { id: 'gestionar_usuarios', label: 'Gestionar usuarios' },
  { id: 'ver_analytics', label: 'Ver analytics' },
  { id: 'exportar_datos', label: 'Exportar datos' },
  { id: 'gestionar_configuracion', label: 'Gestionar configuración' }
];

const UserManagement = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    rol: 'socio',
    estado: 'activo',
    permisos: []
  });
  const [error, setError] = useState('');

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const usuariosSnapshot = await getDocs(collection(db, 'usuarios'));
      const usuariosData = usuariosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Filtrar y asegurar estructura correcta
      const usuariosFiltrados = usuariosData
        .filter(usuario => usuario.email) // Solo usuarios con email
        .map(usuario => ({
          id: usuario.id || usuario.uid || '',
          nombres: usuario.nombres || '',
          apellidos: usuario.apellidos || '',
          email: usuario.email || '',
          rol: usuario.rol || 'socio',
          estado: usuario.estado || 'activo',
          permisos: Array.isArray(usuario.permisos) ? usuario.permisos : [],
          ultimaActualizacion: usuario.ultimaActualizacion || '',
          fechaRegistro: usuario.fechaRegistro || ''
        }));
      
      setUsuarios(usuariosFiltrados);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      setError('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (usuario) => {
    setEditingUser(usuario);
    setEditForm({
      nombres: usuario.nombres || '',
      apellidos: usuario.apellidos || '',
      email: usuario.email || '',
      rol: usuario.rol || 'socio',
      estado: usuario.estado || 'activo',
      permisos: [...(usuario.permisos || [])]
    });
    setError('');
  };

  const handlePermisoChange = (permisoId) => {
    setEditForm(prev => {
      if (prev.permisos.includes(permisoId)) {
        return {
          ...prev,
          permisos: prev.permisos.filter(p => p !== permisoId)
        };
      } else {
        return {
          ...prev,
          permisos: [...prev.permisos, permisoId]
        };
      }
    });
  };

  const handleSaveChanges = async () => {
    try {
      if (!editingUser) return;
      
      // Validaciones
      if (!editForm.nombres.trim()) {
        setError('El nombre es requerido');
        return;
      }
      
      if (!editForm.email.trim() || !/\S+@\S+\.\S+/.test(editForm.email)) {
        setError('Email inválido');
        return;
      }
      
      // Preparar datos para actualizar
      const updateData = {
        nombres: editForm.nombres.trim(),
        apellidos: editForm.apellidos.trim(),
        email: editForm.email.trim(),
        rol: editForm.rol,
        estado: editForm.estado,
        permisos: editForm.permisos,
        ultimaActualizacion: new Date().toISOString(),
        actualizadoPor: 'admin' // Esto debería ser el email del admin actual
      };
      
      // Actualizar en Firestore
      await updateDoc(doc(db, 'usuarios', editingUser.id), updateData);
      
      // Actualizar estado local
      setUsuarios(prev => prev.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...updateData }
          : user
      ));
      
      // Cerrar modal
      setEditingUser(null);
      setEditForm({
        nombres: '',
        apellidos: '',
        email: '',
        rol: 'socio',
        estado: 'activo',
        permisos: []
      });
      setError('');
      
      alert('Usuario actualizado correctamente');
      
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      setError('Error al actualizar usuario: ' + error.message);
    }
  };

  const handleCloseEdit = () => {
    setEditingUser(null);
    setEditForm({
      nombres: '',
      apellidos: '',
      email: '',
      rol: 'socio',
      estado: 'activo',
      permisos: []
    });
    setError('');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography>Cargando usuarios...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Encabezado */}
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Usuarios del Sistema ({usuarios.length})
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Gestiona roles, permisos y estados de los usuarios
      </Typography>

      {/* Tabla de usuarios */}
      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: 'primary.light' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Usuario</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Rol</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Permisos</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((usuario) => (
              <TableRow 
                key={usuario.id} 
                hover
                sx={{ 
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': { backgroundColor: 'action.hover' }
                }}
              >
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Avatar 
                      sx={{ 
                        mr: 2, 
                        bgcolor: usuario.rol === 'admin' ? 'error.main' : 'primary.main',
                        color: 'white'
                      }}
                    >
                      {usuario.nombres?.charAt(0) || 'U'}
                    </Avatar>
                    <Box>
                      <Typography variant="body1" fontWeight={500}>
                        {usuario.nombres} {usuario.apellidos}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {usuario.id?.substring(0, 8) || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={usuario.rol || 'socio'} 
                    color={usuario.rol === 'admin' ? 'error' : 'primary'}
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={usuario.estado || 'activo'} 
                    color={usuario.estado === 'activo' ? 'success' : 'default'}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {usuario.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Chip 
                      label={`${usuario.permisos?.length || 0} permisos`}
                      variant="outlined"
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    {usuario.permisos?.length > 0 && (
                      <Typography variant="caption" color="text.secondary">
                        ({usuario.permisos.slice(0, 2).join(', ')}...)
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <IconButton 
                    color="primary"
                    onClick={() => handleEditClick(usuario)}
                    size="small"
                    title="Editar usuario"
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo de edición */}
      <Dialog 
        open={!!editingUser} 
        onClose={handleCloseEdit}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Editar Usuario
            </Typography>
            <IconButton onClick={handleCloseEdit} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Editando usuario: {editingUser?.email}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Información básica */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Nombres"
                fullWidth
                value={editForm.nombres}
                onChange={(e) => setEditForm(prev => ({ ...prev, nombres: e.target.value }))}
                required
              />
              <TextField
                label="Apellidos"
                fullWidth
                value={editForm.apellidos}
                onChange={(e) => setEditForm(prev => ({ ...prev, apellidos: e.target.value }))}
              />
            </Box>
            
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={editForm.email}
              onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
              required
              disabled
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Select
                value={editForm.rol}
                onChange={(e) => setEditForm(prev => ({ ...prev, rol: e.target.value }))}
                fullWidth
                label="Rol"
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="socio">Socio</MenuItem>
              </Select>
              
              <Select
                value={editForm.estado}
                onChange={(e) => setEditForm(prev => ({ ...prev, estado: e.target.value }))}
                fullWidth
                label="Estado"
              >
                <MenuItem value="activo">Activo</MenuItem>
                <MenuItem value="inactivo">Inactivo</MenuItem>
              </Select>
            </Box>
            
            {/* Permisos */}
            <Box>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Permisos Específicos
              </Typography>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: 1,
                maxHeight: 300,
                overflow: 'auto',
                p: 1,
                border: 1,
                borderColor: 'divider',
                borderRadius: 1
              }}>
                {PERMISOS_DISPONIBLES.map((permiso) => (
                  <FormControlLabel
                    key={permiso.id}
                    control={
                      <Checkbox
                        checked={editForm.permisos.includes(permiso.id)}
                        onChange={() => handlePermisoChange(permiso.id)}
                        size="small"
                      />
                    }
                    label={permiso.label}
                    sx={{ m: 0 }}
                  />
                ))}
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                {editForm.permisos.length} de {PERMISOS_DISPONIBLES.length} permisos seleccionados
              </Typography>
            </Box>
            
            {/* Información adicional */}
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Información Adicional
              </Typography>
              <Typography variant="body2">
                ID: {editingUser?.id}
              </Typography>
              <Typography variant="body2">
                Última actualización: {editingUser?.ultimaActualizacion ? 
                  new Date(editingUser.ultimaActualizacion).toLocaleString() : 
                  'No disponible'}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ borderTop: 1, borderColor: 'divider', p: 2 }}>
          <Button onClick={handleCloseEdit} color="inherit">
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveChanges} 
            variant="contained" 
            startIcon={<SaveIcon />}
            disabled={!editForm.nombres.trim() || !editForm.email.trim()}
          >
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;