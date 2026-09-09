import db from '../src/db/connection';
import { clerkClient } from '@clerk/express';
import { config } from '../src/config';

const targetEmail = process.argv[2]?.trim().toLowerCase();

if (!targetEmail) {
  console.error('❌ Error: Por favor especifica un email.');
  console.log('Uso: npm run make:admin <email>');
  process.exit(1);
}

async function makeAdmin() {
  console.log(`🔍 Buscando usuario con email: ${targetEmail}...`);

  let dbUser = await db('users').where({ email: targetEmail }).first();
  let clerkUserId: string | null = null;

  // 1. Sincronizar en Clerk si las credenciales están configuradas
  if (config.clerkSecretKey) {
    try {
      const clerkUsers = await clerkClient.users.getUserList({
        emailAddress: [targetEmail],
      });

      if (clerkUsers.data && clerkUsers.data.length > 0) {
        const clerkUser = clerkUsers.data[0];
        clerkUserId = clerkUser.id;
        await clerkClient.users.updateUserMetadata(clerkUser.id, {
          publicMetadata: {
            role: 'admin',
          },
        });
        console.log(`✅ Rol 'admin' asignado en Clerk publicMetadata (Clerk ID: ${clerkUser.id})`);
      } else {
        console.log(`ℹ️ El usuario aún no se ha registrado en Clerk con este email.`);
      }
    } catch (err: any) {
      console.warn('⚠️ No se pudo sincronizar directamente con Clerk API:', err.message);
    }
  }

  // 2. Actualizar o crear en la base de datos
  if (dbUser) {
    const updateData: any = {
      role: 'admin',
      updated_at: new Date().toISOString(),
    };
    if (clerkUserId && !dbUser.clerk_id) {
      updateData.clerk_id = clerkUserId;
    }
    await db('users').where({ id: dbUser.id }).update(updateData);
    console.log(`✅ Usuario existente promovido a 'admin' en la base de datos (User ID: ${dbUser.id})`);
  } else {
    await db('users').insert({
      email: targetEmail,
      role: 'admin',
      clerk_id: clerkUserId || null,
    });
    console.log(`✅ Nuevo registro de usuario creado con rol 'admin'`);
    console.log(`   Cuando ${targetEmail} inicie sesión con Clerk, tendrá acceso automático de administrador.`);
  }

  await db.destroy();
  console.log(`🎉 ¡Listo! ${targetEmail} ahora tiene permisos de Administrador.`);
}

makeAdmin().catch((err) => {
  console.error('❌ Error al asignar rol de admin:', err);
  process.exit(1);
});
