import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { seedData } from './seed-data';

export class SeedHelpers {
  constructor(private prisma: PrismaClient) {}

  async createUsers(tenantId: string) {
    // Create users
    const adminPassword = await bcrypt.hash('admin123', 10);
    await this.prisma.user.upsert({
      where: { email: seedData.users[0].email },
      update: {},
      create: {
        ...seedData.users[0],
        password: adminPassword,
        tenantId,
      },
    });

    const managerPassword = await bcrypt.hash('manager123', 10);
    const manager = await this.prisma.user.upsert({
      where: { email: seedData.users[1].email },
      update: {},
      create: {
        ...seedData.users[1],
        password: managerPassword,
        tenantId,
      },
    });

    const userPassword = await bcrypt.hash('user123', 10);
    const user = await this.prisma.user.upsert({
      where: { email: seedData.users[2].email },
      update: {},
      create: {
        ...seedData.users[2],
        password: userPassword,
        tenantId,
      },
    });

    return { manager, user };
  }

  async createProjects(managerId: string, tenantId: string) {
    const ecommerceProject = await this.prisma.project.upsert({
      where: { id: seedData.projects[0].id },
      update: {},
      create: {
        ...seedData.projects[0],
        userId: managerId,
        tenantId,
      },
    });

    const mobileProject = await this.prisma.project.upsert({
      where: { id: seedData.projects[1].id },
      update: {},
      create: {
        ...seedData.projects[1],
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
    const gap1 = await this.prisma.gap.create({
      data: {
        ...seedData.gaps[0],
        projectId: ecommerceProjectId,
        userId: managerId,
      },
    });

    const gap2 = await this.prisma.gap.create({
      data: {
        ...seedData.gaps[1],
        projectId: ecommerceProjectId,
        userId,
      },
    });

    const gap3 = await this.prisma.gap.create({
      data: {
        ...seedData.gaps[2],
        projectId: mobileProjectId,
        userId: managerId,
      },
    });

    // Create root causes for gaps
    await this.prisma.rootCause.createMany({
      data: [
        { ...seedData.rootCauses[0], gapId: gap1.id },
        { ...seedData.rootCauses[1], gapId: gap1.id },
        { ...seedData.rootCauses[2], gapId: gap2.id },
        { ...seedData.rootCauses[3], gapId: gap2.id },
        { ...seedData.rootCauses[4], gapId: gap3.id },
      ],
      skipDuplicates: true,
    });
  }

  async createPredictions(
    ecommerceProjectId: string,
    mobileProjectId: string,
    managerId: string
  ) {
    await this.prisma.prediction.createMany({
      data: [
        {
          ...seedData.predictions[0],
          projectId: ecommerceProjectId,
          userId: managerId,
        },
        {
          ...seedData.predictions[1],
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
    await this.prisma.integration.createMany({
      data: [
        {
          ...seedData.integrations[0],
          projectId: ecommerceProjectId,
          userId: managerId,
        },
        {
          ...seedData.integrations[1],
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
    await this.prisma.projectStakeholder.createMany({
      data: [
        { ...seedData.stakeholders[0], projectId: ecommerceProjectId },
        { ...seedData.stakeholders[1], projectId: ecommerceProjectId },
        { ...seedData.stakeholders[2], projectId: ecommerceProjectId },
        { ...seedData.stakeholders[3], projectId: mobileProjectId },
        { ...seedData.stakeholders[4], projectId: mobileProjectId },
      ],
      skipDuplicates: true,
    });

    // Create project goals
    await this.prisma.projectGoal.createMany({
      data: [
        { ...seedData.goals[0], projectId: ecommerceProjectId },
        { ...seedData.goals[1], projectId: mobileProjectId },
        { ...seedData.goals[2], projectId: ecommerceProjectId },
      ],
      skipDuplicates: true,
    });
  }

  async createAnalysisRecords(
    ecommerceProjectId: string,
    mobileProjectId: string
  ) {
    await this.prisma.analysisRecord.createMany({
      data: [
        { ...seedData.analysisRecords[0], projectId: ecommerceProjectId },
        { ...seedData.analysisRecords[1], projectId: mobileProjectId },
      ],
      skipDuplicates: true,
    });
  }
}
