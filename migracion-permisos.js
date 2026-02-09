// migracion-permisos.js
const admin = require('firebase-admin');

// Inicializar Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function agregarPermisosASocios() {
  try {
    console.log('🔄 Iniciando migración de permisos...\n');
    
    // Obtener todos los usuarios con rol "socio"
    const sociosSnapshot = await db.collection('usuarios')
      .where('rol', '==', 'socio')
      .get();
    
    if (sociosSnapshot.empty) {
      console.log('⚠️  No se encontraron usuarios con rol "socio"');
      return;
    }
    
    console.log(`📊 Se encontraron ${sociosSnapshot.size} socios\n`);
    
    let actualizados = 0;
    let sinCambios = 0;
    
    // Iterar sobre cada socio
    for (const doc of sociosSnapshot.docs) {
      const data = doc.data();
      const userId = doc.id;
      
      // Verificar si ya tiene permisos
      if (data.permisos && Array.isArray(data.permisos) && data.permisos.length > 0) {
        console.log(`✓ ${data.nombres} ${data.apellidos} - Ya tiene permisos: [${data.permisos.join(', ')}]`);
        sinCambios++;
        continue;
      }
      
      // Permisos básicos para socios
      const permisosBasicos = [
        'ver_registros',
        'ver_analytics'
      ];
      
      // Actualizar el documento
      await db.collection('usuarios').doc(userId).update({
        permisos: permisosBasicos
      });
      
      console.log(`✅ ${data.nombres} ${data.apellidos} - Permisos agregados: [${permisosBasicos.join(', ')}]`);
      actualizados++;
    }
    
    console.log('\n📈 Resumen de migración:');
    console.log(`   ✅ Actualizados: ${actualizados}`);
    console.log(`   ✓ Sin cambios: ${sinCambios}`);
    console.log(`   📊 Total procesados: ${sociosSnapshot.size}`);
    console.log('\n✨ Migración completada exitosamente!\n');
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
  } finally {
    // Terminar la conexión
    process.exit();
  }
}

// Ejecutar la migración
agregarPermisosASocios();