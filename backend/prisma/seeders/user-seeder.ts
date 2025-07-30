import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export async function seedUsers(prisma: PrismaClient, tenantId: string) {
  console.log('👥 Seeding users...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@stratibreak.com' },
    update: {},
    create: {
      email: 'admin@stratibreak.com',
      username: 'admin',
      password: adminPassword,
      firstName: 'System',
      lastName: 'Administrator',
      role: UserRole.ADMIN,
      isActive: true,
      tenantId,
    },
  });

  // Create manager user
  const managerPassword = await bcrypt.hash('manager123', 10);
  const manager = await prisma.user.upsert({
    where: { email: 'manager@stratibreak.com' },
    update: {},
    create: {
      email: 'manager@stratibreak.com',
      username: 'manager',
      password: managerPassword,
      firstName: 'Project',
      lastName: 'Manager',
      role: UserRole.PROJECT_MANAGER,
      isActive: true,
      tenantId,
    },
  });

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@stratibreak.com' },
    update: {},
    create: {
      email: 'user@stratibreak.com',
      username: 'user',
      password: userPassword,
      firstName: 'Team',
      lastName: 'Member',
      role: UserRole.STAKEHOLDER,
      isActive: true,
      tenantId,
    },
  });

  return { admin, manager, user };
}
