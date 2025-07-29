import {
  GapStatus,
  GapType,
  IntegrationStatus,
  IntegrationType,
  PredictionStatus,
  PredictionType,
  PrismaClient,
  ProjectStatus,
  Severity,
  UserRole,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
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
      role: UserRole.MANAGER,
      isActive: true,
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
      role: UserRole.USER,
      isActive: true,
    },
  });

  // Create sample projects
  const project1 = await prisma.project.upsert({
    where: { id: 'sample-project-1' },
    update: {},
    create: {
      id: 'sample-project-1',
      name: 'E-commerce Platform Redesign',
      description:
        'Complete redesign of the company e-commerce platform with modern UI/UX and improved performance',
      status: ProjectStatus.ACTIVE,
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-06-30'),
      userId: manager.id,
    },
  });

  const project2 = await prisma.project.upsert({
    where: { id: 'sample-project-2' },
    update: {},
    create: {
      id: 'sample-project-2',
      name: 'Mobile App Development',
      description:
        'Development of native mobile applications for iOS and Android platforms',
      status: ProjectStatus.ACTIVE,
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-08-15'),
      userId: manager.id,
    },
  });

  // Create sample gaps
  await prisma.gap.createMany({
    data: [
      {
        title: 'Frontend Development Skills Gap',
        description:
          'Team lacks experience with React 18 and modern frontend frameworks',
        type: GapType.SKILL,
        severity: Severity.HIGH,
        status: GapStatus.OPEN,
        impact: 'May delay frontend development by 2-3 weeks',
        rootCause: 'Team primarily experienced with older technologies',
        projectId: project1.id,
        userId: manager.id,
      },
      {
        title: 'Database Performance Issues',
        description:
          'Current database queries are not optimized for the expected load',
        type: GapType.TECHNOLOGY,
        severity: Severity.MEDIUM,
        status: GapStatus.IN_PROGRESS,
        impact: 'Performance degradation under high load',
        rootCause: 'Legacy database schema and unoptimized queries',
        projectId: project1.id,
        userId: user.id,
      },
      {
        title: 'Mobile Testing Resources',
        description: 'Insufficient mobile testing devices and automation tools',
        type: GapType.RESOURCE,
        severity: Severity.MEDIUM,
        status: GapStatus.OPEN,
        impact: 'Limited testing coverage for mobile applications',
        rootCause: 'Budget constraints and lack of testing infrastructure',
        projectId: project2.id,
        userId: manager.id,
      },
    ],
    skipDuplicates: true,
  });

  // Create sample predictions
  await prisma.prediction.createMany({
    data: [
      {
        title: 'Potential Delay Risk',
        description: 'Based on current progress, project may face 2-week delay',
        type: PredictionType.DELAY_RISK,
        probability: 0.75,
        impact: Severity.HIGH,
        status: PredictionStatus.PENDING,
        predictedAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        projectId: project1.id,
        userId: manager.id,
      },
      {
        title: 'Resource Shortage Warning',
        description: 'Mobile developers may be overallocated in Q2',
        type: PredictionType.RESOURCE_SHORTAGE,
        probability: 0.65,
        impact: Severity.MEDIUM,
        status: PredictionStatus.PENDING,
        predictedAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        projectId: project2.id,
        userId: manager.id,
      },
    ],
    skipDuplicates: true,
  });

  // Create sample integrations
  await prisma.integration.createMany({
    data: [
      {
        name: 'Jira Integration - E-commerce Project',
        type: IntegrationType.JIRA,
        status: IntegrationStatus.INACTIVE,
        config: {
          url: 'https://company.atlassian.net',
          projectKey: 'ECOM',
          boardId: '123',
        },
        syncInterval: 30, // 30 minutes
        isActive: false,
        projectId: project1.id,
        userId: manager.id,
      },
      {
        name: 'Asana Integration - Mobile Project',
        type: IntegrationType.ASANA,
        status: IntegrationStatus.INACTIVE,
        config: {
          projectId: '1234567890',
          teamId: '0987654321',
        },
        syncInterval: 60, // 60 minutes
        isActive: false,
        projectId: project2.id,
        userId: manager.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Database seeding completed successfully!');
  console.log('📊 Created:');
  console.log('  - 3 users (admin, manager, user)');
  console.log('  - 2 projects');
  console.log('  - 3 gaps');
  console.log('  - 2 predictions');
  console.log('  - 2 integrations');
  console.log('');
  console.log('🔐 Default login credentials:');
  console.log('  Admin: admin@stratibreak.com / admin123');
  console.log('  Manager: manager@stratibreak.com / manager123');
  console.log('  User: user@stratibreak.com / user123');
}

main()
  .catch(e => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
