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

  // Create default tenant
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
      tenantId: tenant.id,
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
      tenantId: tenant.id,
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
      tenantId: tenant.id,
    },
  });

  // Create sample projects
  const ecommerceProject = await prisma.project.upsert({
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
      tenantId: tenant.id,
    },
  });

  const mobileProject = await prisma.project.upsert({
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
      tenantId: tenant.id,
    },
  });

  // Create sample gaps with root causes
  const gap1 = await prisma.gap.create({
    data: {
      title: 'Frontend Development Skills Gap',
      description:
        'Team lacks experience with React 18 and modern frontend frameworks',
      type: GapType.SKILL,
      severity: Severity.HIGH,
      status: GapStatus.OPEN,
      impact: 'May delay frontend development by 2-3 weeks',
      currentValue: {
        skillLevel: 'intermediate',
        frameworks: ['React 16', 'jQuery'],
      },
      targetValue: {
        skillLevel: 'advanced',
        frameworks: ['React 18', 'Next.js', 'TypeScript'],
      },
      projectId: ecommerceProject.id,
      userId: manager.id,
    },
  });

  const gap2 = await prisma.gap.create({
    data: {
      title: 'Database Performance Issues',
      description:
        'Current database queries are not optimized for the expected load',
      type: GapType.TECHNOLOGY,
      severity: Severity.MEDIUM,
      status: GapStatus.IN_PROGRESS,
      impact: 'Performance degradation under high load',
      currentValue: { avgResponseTime: '2.5s', queryOptimization: 'basic' },
      targetValue: { avgResponseTime: '0.5s', queryOptimization: 'advanced' },
      projectId: ecommerceProject.id,
      userId: user.id,
    },
  });

  const gap3 = await prisma.gap.create({
    data: {
      title: 'Mobile Testing Resources',
      description: 'Insufficient mobile testing devices and automation tools',
      type: GapType.RESOURCE,
      severity: Severity.MEDIUM,
      status: GapStatus.OPEN,
      impact: 'Limited testing coverage for mobile applications',
      currentValue: { devices: 3, automationCoverage: '20%' },
      targetValue: { devices: 10, automationCoverage: '80%' },
      projectId: mobileProject.id,
      userId: manager.id,
    },
  });

  // Create root causes for gaps
  await prisma.rootCause.createMany({
    data: [
      {
        description: 'Team primarily experienced with older technologies',
        category: 'skill',
        confidence: 0.85,
        gapId: gap1.id,
      },
      {
        description: 'Limited training budget for modern frameworks',
        category: 'resource',
        confidence: 0.7,
        gapId: gap1.id,
      },
      {
        description: 'Legacy database schema design',
        category: 'technology',
        confidence: 0.9,
        gapId: gap2.id,
      },
      {
        description: 'Lack of database optimization expertise',
        category: 'skill',
        confidence: 0.75,
        gapId: gap2.id,
      },
      {
        description: 'Budget constraints for testing infrastructure',
        category: 'resource',
        confidence: 0.95,
        gapId: gap3.id,
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
        projectId: ecommerceProject.id,
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
        projectId: mobileProject.id,
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
        credentials: {
          apiToken: 'encrypted-jira-token',
          email: 'integration@company.com',
        },
        syncInterval: 30, // 30 minutes
        isActive: false,
        projectId: ecommerceProject.id,
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
        credentials: {
          accessToken: 'encrypted-asana-token',
        },
        syncInterval: 60, // 60 minutes
        isActive: false,
        projectId: mobileProject.id,
        userId: manager.id,
      },
    ],
    skipDuplicates: true,
  });

  // Create project stakeholders
  await prisma.projectStakeholder.createMany({
    data: [
      {
        name: 'John Smith',
        email: 'john.smith@company.com',
        role: 'Product Owner',
        projectId: ecommerceProject.id,
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@company.com',
        role: 'Technical Lead',
        projectId: ecommerceProject.id,
      },
      {
        name: 'Mike Chen',
        email: 'mike.chen@company.com',
        role: 'UX Designer',
        projectId: ecommerceProject.id,
      },
      {
        name: 'Lisa Rodriguez',
        email: 'lisa.rodriguez@company.com',
        role: 'Mobile Lead',
        projectId: mobileProject.id,
      },
      {
        name: 'David Kim',
        email: 'david.kim@company.com',
        role: 'QA Manager',
        projectId: mobileProject.id,
      },
    ],
    skipDuplicates: true,
  });

  // Create project goals
  await prisma.projectGoal.createMany({
    data: [
      {
        title: 'Improve Page Load Speed',
        description: 'Reduce average page load time to under 2 seconds',
        targetValue: { loadTime: '2s', metric: 'average_page_load' },
        currentValue: { loadTime: '4.2s', metric: 'average_page_load' },
        dueDate: new Date('2024-04-30'),
        isAchieved: false,
        projectId: ecommerceProject.id,
      },
      {
        title: 'Mobile App Store Rating',
        description: 'Achieve 4.5+ rating on both iOS and Android app stores',
        targetValue: { rating: 4.5, stores: ['iOS', 'Android'] },
        currentValue: { rating: 0, stores: [] },
        dueDate: new Date('2024-09-01'),
        isAchieved: false,
        projectId: mobileProject.id,
      },
      {
        title: 'User Conversion Rate',
        description: 'Increase conversion rate from 2.1% to 3.5%',
        targetValue: { conversionRate: 3.5, unit: 'percentage' },
        currentValue: { conversionRate: 2.1, unit: 'percentage' },
        dueDate: new Date('2024-06-15'),
        isAchieved: false,
        projectId: ecommerceProject.id,
      },
    ],
    skipDuplicates: true,
  });

  // Create analysis records
  await prisma.analysisRecord.createMany({
    data: [
      {
        analysisType: 'gap_analysis',
        results: {
          totalGaps: 3,
          criticalGaps: 1,
          highGaps: 1,
          mediumGaps: 1,
          categories: ['skill', 'technology', 'resource'],
        },
        overallScore: 6.5,
        executionTime: 1250,
        projectId: ecommerceProject.id,
      },
      {
        analysisType: 'prediction_analysis',
        results: {
          totalPredictions: 2,
          highRiskPredictions: 1,
          mediumRiskPredictions: 1,
          averageProbability: 0.7,
        },
        overallScore: 7.2,
        executionTime: 890,
        projectId: mobileProject.id,
      },
    ],
    skipDuplicates: true,
  });

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
