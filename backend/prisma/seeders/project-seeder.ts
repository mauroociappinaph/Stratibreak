import { PrismaClient, ProjectStatus } from '@prisma/client';

export async function seedProjects(
  prisma: PrismaClient,
  managerId: string,
  tenantId: string
) {
  console.log('📋 Seeding projects...');

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
      userId: managerId,
      tenantId,
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
      userId: managerId,
      tenantId,
    },
  });

  return { ecommerceProject, mobileProject };
}
