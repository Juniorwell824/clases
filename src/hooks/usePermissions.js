// src/hooks/usePermissions.js
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const usePermissions = () => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setPermissions([]);
          setUserData(null);
          setLoading(false);
          return;
        }

        const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          
          // Asegurar que permisos sea un array
          let userPermissions = [];
          if (Array.isArray(data.permisos)) {
            userPermissions = data.permisos;
          } else if (data.permisos && typeof data.permisos === 'object') {
            // Si es objeto, convertirlo a array
            userPermissions = Object.keys(data.permisos).filter(key => data.permisos[key]);
          }
          
          setPermissions(userPermissions);
        } else {
          setPermissions([]);
          setUserData(null);
        }
      } catch (error) {
        console.error('Error cargando permisos:', error);
        setPermissions([]);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
    
    // Escuchar cambios en autenticación
    const unsubscribe = auth.onAuthStateChanged(() => {
      loadUserData();
    });

    return () => unsubscribe();
  }, []);

  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };

  const hasAnyPermission = (permissionList) => {
    return permissionList.some(permission => permissions.includes(permission));
  };

  const hasAllPermissions = (permissionList) => {
    return permissionList.every(permission => permissions.includes(permission));
  };

  return {
    permissions,
    loading,
    userData,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions
  };
};

export default usePermissions;