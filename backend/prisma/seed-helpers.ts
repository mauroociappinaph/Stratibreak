import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { seedData } from './seed-data';

export class SeedHelpers {
  constructor(private prisma: PrismaClient) {}

  async createUsers(tenantId: string) {
    // Create users
    const adminUser = seedData.users[0];
    if (!adminUser) throw new Error('Admin user data not found');

    const adminPassword = await bcrypt.hash('admin123', 10);
    await this.prisma.user.upsert({
      where: { email: adminUser.email },
      update: {},
      create: {
        ...adminUser,
        password: adminPassword,
        tenantId,
      },
    });

    const managerUser = seedData.users[1];
    if (!managerUser) throw new Error('Manager user data not found');

    const managerPassword = await bcrypt.hash('manager123', 10);
    const manager = await this.prisma.user.upsert({
      where: { email: managerUser.email },
      update: {},
      create: {
        ...managerUser,
        password: managerPassword,
        tenantId,
      },
    });

    const regularUser = seedData.users[2];
    if (!regularUser) throw new Error('Regular user data not found');

    const userPassword = await bcrypt.hash('user123', 10);
    const user = await this.prisma.user.upsert({
      where: { email: regularUser.email },
      update: {},
      create: {
        ...regularUser,
        password: userPassword,
        tenantId,
      },
    });

    return { manager, user };
  }

  async createProjects(managerId: string, tenantId: string) {
    const ecommerceProjectData = seedData.projects[0];
    if (!ecommerceProjectData)
      throw new Error('E-commerce project data not found');

    const ecommerceProject = await this.prisma.project.upsert({
      where: { id: ecommerceProjectData.id },
      update: {},
      create: {
        ...ecommerceProjectData,
        userId: managerId,
        tenantId,
      },
    });

    const mobileProjectData = seedData.projects[1];
    if (!mobileProjectData) throw new Error('Mobile project data not found');

    const mobileProject = await this.prisma.project.upsert({
      where: { id: mobileProjectData.id },
      update: {},
      create: {
        ...mobileProjectData,
        userId: managerId,
        tenantId,
      },
    });

    return { ecommerceProject, mobileProject };
  }

  async createGapsAndRootCauses(
    ecommerceProjectId: string,
    mobileProjectId: string,
    managerId: string,
    userId: string
  ) {
    const gapData1 = seedData.gaps[0];
    if (!gapData1) throw new Error('Gap data 1 not found');

    const gap1 = await this.prisma.gap.create({
      data: {
        ...gapData1,
        projectId: ecommerceProjectId,
        userId: managerId,
      },
    });

    const gapData2 = seedData.gaps[1];
    if (!gapData2) throw new Error('Gap data 2 not found');

    const gap2 = await this.prisma.gap.create({
      data: {
        ...gapData2,
        projectId: ecommerceProjectId,
        userId,
      },
    });

    const gapData3 = seedData.gaps[2];
    if (!gapData3) throw new Error('Gap data 3 not found');

    const gap3 = await this.prisma.gap.create({
      data: {
        ...gapData3,
        projectId: mobileProjectId,
        userId: managerId,
      },
    });

    // Create root causes for gaps
    const rootCauseData = seedData.rootCauses;
    if (rootCauseData.length < 5)
      throw new Error('Insufficient root cause data');

    await this.prisma.rootCause.createMany({
      data: [
        { ...rootCauseData[0], gapId: gap1.id },
        { ...rootCauseData[1], gapId: gap1.id },
        { ...rootCauseData[2], gapId: gap2.id },
        { ...rootCauseData[3], gapId: gap2.id },
        { ...rootCauseData[4], gapId: gap3.id },
      ],
      skipDuplicates: true,
    });
  }

  async createPredictions(
    ecommerceProjectId: string,
    mobileProjectId: string,
    managerId: string
  ) {
    const predictionData = seedData.predictions;
    if (predictionData.length < 2)
      throw new Error('Insufficient prediction data');

    await this.prisma.prediction.createMany({
      data: [
        {
          ...predictionData[0],
          projectId: ecommerceProjectId,
          userId: managerId,
        },
        {
          ...predictionData[1],
          projectId: mobileProjectId,
          userId: managerId,
        },
      ],
      skipDuplicates: true,
    });
  }

  async createIntegrations(
    ecommerceProjectId: string,
    mobileProjectId: string,
    managerId: string
  ) {
    const integrationData = seedData.integrations;
    if (integrationData.length < 2)
      throw new Error('Insufficient integration data');

    await this.prisma.integration.createMany({
      data: [
        {
          ...integrationData[0],
          projectId: ecommerceProjectId,
          userId: managerId,
        },
        {
          ...integrationData[1],
          projectId: mobileProjectId,
          userId: managerId,
        },
      ],
      skipDuplicates: true,
    });
  }

  async createStakeholdersAndGoals(
    ecommerceProjectId: string,
    mobileProjectId: string
  ) {
    // Create project stakeholders
    const stakeholderData = seedData.stakeholders;
    if (stakeholderData.length < 5)
      throw new Error('Insufficient stakeholder data');

    await this.prisma.projectStakeholder.createMany({
      data: [
        { ...stakeholderData[0], projectId: ecommerceProjectId },
        { ...stakeholderData[1], projectId: ecommerceProjectId },
        { ...stakeholderData[2], projectId: ecommerceProjectId },
        { ...stakeholderData[3], projectId: mobileProjectId },
        { ...stakeholderData[4], projectId: mobileProjectId },
      ],
      skipDuplicates: true,
    });

    // Create project goals
    const goalData = seedData.goals;
    if (goalData.length < 3) throw new Error('Insufficient goal data');

    await this.prisma.projectGoal.createMany({
      data: [
        { ...goalData[0], projectId: ecommerceProjectId },
        { ...goalData[1], projectId: mobileProjectId },
        { ...goalData[2], projectId: ecommerceProjectId },
      ],
      skipDuplicates: true,
    });
  }

  async createAnalysisRecords(
    ecommerceProjectId: string,
    mobileProjectId: string
  ) {
    const analysisData = seedData.analysisRecords;
    if (analysisData.length < 2)
      throw new Error('Insufficient analysis record data');

    await this.prisma.analysisRecord.createMany({
      data: [
        { ...analysisData[0], projectId: ecommerceProjectId },
        { ...analysisData[1], projectId: mobileProjectId },
      ],
      skipDuplicates: true,
    });
  }
}
