import { GapStatus, GapType, PrismaClient, Severity } from '@prisma/client';

export async function seedGaps(
  prisma: PrismaClient,
  ecommerceProjectId: string,
  mobileProjectId: string,
  managerId: string,
  userId: string
) {
  console.log('🔍 Seeding gaps and root causes...');

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
      projectId: ecommerceProjectId,
      userId: managerId,
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
      projectId: ecommerceProjectId,
      userId,
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
      projectId: mobileProjectId,
      userId: managerId,
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

  return { gap1, gap2, gap3 };
}
