import { PrismaClient } from '@prisma/client';

export async function seedTenant(prisma: PrismaClient) {
  console.log('🏢 Seeding tenant...');

  const tenant = await prisma.tenant.upsert({
    where: { organizationName: 'Stratibreak Demo Organization' },
    update: {},
    create: {
      organizationName: 'Stratibreak Demo Organization',
      dataEncryptionKey: 'demo-encryption-key-change-in-production',
      retentionPolicyDays: 365,
      isActive: true,
    },
  });

  return tenant;
}
