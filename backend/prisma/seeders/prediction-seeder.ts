import {
  PredictionStatus,
  PredictionType,
  PrismaClient,
  Severity,
} from '@prisma/client';

export async function seedPredictions(
  prisma: PrismaClient,
  ecommerceProjectId: string,
  mobileProjectId: string,
  managerId: string
) {
  console.log('🔮 Seeding predictions...');

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
        projectId: ecommerceProjectId,
        userId: managerId,
      },
      {
        title: 'Resource Shortage Warning',
        description: 'Mobile developers may be overallocated in Q2',
        type: PredictionType.RESOURCE_SHORTAGE,
        probability: 0.65,
        impact: Severity.MEDIUM,
        status: PredictionStatus.PENDING,
        predictedAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        projectId: mobileProjectId,
        userId: managerId,
      },
    ],
    skipDuplicates: true,
  });
}
