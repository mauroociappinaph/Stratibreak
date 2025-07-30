import {
  GapStatus,
  GapType,
  IntegrationStatus,
  IntegrationType,
  PredictionStatus,
  PredictionType,
  ProjectStatus,
  Severity,
  UserRole,
} from '@prisma/client';

export const seedData = {
  tenant: {
    organizationName: 'Stratibreak Demo Organization',
    dataEncryptionKey: 'demo-encryption-key-change-in-production',
    retentionPolicyDays: 365,
    isActive: true,
  },

  users: [
    {
      email: 'admin@stratibreak.com',
      username: 'admin',
      firstName: 'System',
      lastName: 'Administrator',
      role: UserRole.ADMIN,
      isActive: true,
    },
    {
      email: 'manager@stratibreak.com',
      username: 'manager',
      firstName: 'Project',
      lastName: 'Manager',
      role: UserRole.PROJECT_MANAGER,
      isActive: true,
    },
    {
      email: 'user@stratibreak.com',
      username: 'user',
      firstName: 'Team',
      lastName: 'Member',
      role: UserRole.STAKEHOLDER,
      isActive: true,
    },
  ],

  projects: [
    {
      id: 'sample-project-1',
      name: 'E-commerce Platform Redesign',
      description:
        'Complete redesign of the company e-commerce platform with modern UI/UX and improved performance',
      status: ProjectStatus.ACTIVE,
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-06-30'),
    },
    {
      id: 'sample-project-2',
      name: 'Mobile App Development',
      description:
        'Development of native mobile applications for iOS and Android platforms',
      status: ProjectStatus.ACTIVE,
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-08-15'),
    },
  ],

  gaps: [
    {
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
    },
    {
      title: 'Database Performance Issues',
      description:
        'Current database queries are not optimized for the expected load',
      type: GapType.TECHNOLOGY,
      severity: Severity.MEDIUM,
      status: GapStatus.IN_PROGRESS,
      impact: 'Performance degradation under high load',
      currentValue: { avgResponseTime: '2.5s', queryOptimization: 'basic' },
      targetValue: { avgResponseTime: '0.5s', queryOptimization: 'advanced' },
    },
    {
      title: 'Mobile Testing Resources',
      description: 'Insufficient mobile testing devices and automation tools',
      type: GapType.RESOURCE,
      severity: Severity.MEDIUM,
      status: GapStatus.OPEN,
      impact: 'Limited testing coverage for mobile applications',
      currentValue: { devices: 3, automationCoverage: '20%' },
      targetValue: { devices: 10, automationCoverage: '80%' },
    },
  ],

  rootCauses: [
    {
      description: 'Team primarily experienced with older technologies',
      category: 'skill',
      confidence: 0.85,
    },
    {
      description: 'Limited training budget for modern frameworks',
      category: 'resource',
      confidence: 0.7,
    },
    {
      description: 'Legacy database schema design',
      category: 'technology',
      confidence: 0.9,
    },
    {
      description: 'Lack of database optimization expertise',
      category: 'skill',
      confidence: 0.75,
    },
    {
      description: 'Budget constraints for testing infrastructure',
      category: 'resource',
      confidence: 0.95,
    },
  ],

  predictions: [
    {
      title: 'Potential Delay Risk',
      description: 'Based on current progress, project may face 2-week delay',
      type: PredictionType.DELAY_RISK,
      probability: 0.75,
      impact: Severity.HIGH,
      status: PredictionStatus.PENDING,
      predictedAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    },
    {
      title: 'Resource Shortage Warning',
      description: 'Mobile developers may be overallocated in Q2',
      type: PredictionType.RESOURCE_SHORTAGE,
      probability: 0.65,
      impact: Severity.MEDIUM,
      status: PredictionStatus.PENDING,
      predictedAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    },
  ],

  integrations: [
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
    },
  ],

  stakeholders: [
    {
      name: 'John Smith',
      email: 'john.smith@company.com',
      role: 'Product Owner',
    },
    {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      role: 'Technical Lead',
    },
    {
      name: 'Mike Chen',
      email: 'mike.chen@company.com',
      role: 'UX Designer',
    },
    {
      name: 'Lisa Rodriguez',
      email: 'lisa.rodriguez@company.com',
      role: 'Mobile Lead',
    },
    {
      name: 'David Kim',
      email: 'david.kim@company.com',
      role: 'QA Manager',
    },
  ],

  goals: [
    {
      title: 'Improve Page Load Speed',
      description: 'Reduce average page load time to under 2 seconds',
      targetValue: { loadTime: '2s', metric: 'average_page_load' },
      currentValue: { loadTime: '4.2s', metric: 'average_page_load' },
      dueDate: new Date('2024-04-30'),
      isAchieved: false,
    },
    {
      title: 'Mobile App Store Rating',
      description: 'Achieve 4.5+ rating on both iOS and Android app stores',
      targetValue: { rating: 4.5, stores: ['iOS', 'Android'] },
      currentValue: { rating: 0, stores: [] },
      dueDate: new Date('2024-09-01'),
      isAchieved: false,
    },
    {
      title: 'User Conversion Rate',
      description: 'Increase conversion rate from 2.1% to 3.5%',
      targetValue: { conversionRate: 3.5, unit: 'percentage' },
      currentValue: { conversionRate: 2.1, unit: 'percentage' },
      dueDate: new Date('2024-06-15'),
      isAchieved: false,
    },
  ],

  analysisRecords: [
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
    },
  ],
};
