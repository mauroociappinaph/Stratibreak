import { PrismaClient } from '@prisma/client';
import { seedData } from './seed-data';
import { SeedHelpers } from './seed-helpers';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create default tenant
  const tenant = await prisma.tenant.upsert({
    where: { organizationName: seedData.tenant.organizationName },
    update: {},
    create: seedData.tenant,
  });

  const helpers = new SeedHelpers(prisma);

  // Create users
  const { manager, user } = await helpers.createUsers(tenant.id);

  // Create sample projects
  const { ecommerceProject, mobileProject } = await helpers.createProjects(
    manager.id,
    tenant.id
  );

  // Create sample gaps with root causes
  await helpers.createGapsAndRootCauses(
    ecommerceProject.id,
    mobileProject.id,
    manager.id,
    user.id
  );

  // Create sample predictions
  await helpers.createPredictions(
    ecommerceProject.id,
    mobileProject.id,
    manager.id
  );

  // Create sample integrations
  await helpers.createIntegrations(
    ecommerceProject.id,
    mobileProject.id,
    manager.id
  );

  // Create project stakeholders and goals
  await helpers.createStakeholdersAndGoals(
    ecommerceProject.id,
    mobileProject.id
  );

  // Create analysis records
  await helpers.createAnalysisRecords(ecommerceProject.id, mobileProject.id);

  console.log('✅ Database seeding completed successfully!');
  console.log('📊 Created:');
  console.log('  - 1 tenant organization');
  console.log('  - 3 users (admin, manager, user)');
  console.log('  - 2 projects with stakeholders and goals');
  console.log('  - 3 gaps with 5 root causes');
  console.log('  - 2 predictions');
  console.log('  - 2 integrations (Jira, Asana)');
  console.log('  - 5 project stakeholders');
  console.log('  - 3 project goals');
  console.log('  - 2 analysis records');
  console.log('');
  console.log('🔐 Default login credentials:');
  console.log('  Admin: admin@stratibreak.com / admin123');
  console.log('  Manager: manager@stratibreak.com / manager123');
  console.log('  User: user@stratibreak.com / user123');
  console.log('');
  console.log('🏢 Organization: Stratibreak Demo Organization');
}

main()
  .catch(e => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
