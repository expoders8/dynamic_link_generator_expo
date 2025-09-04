import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'], // 👈 Enable query logging here
    });
  }
  async onModuleInit() {
    try {
      console.log('📦 Connecting to Prisma...');
      await this.$connect();
      console.log('✅ Prisma connected!');
    } catch (error) {
      console.error('❌ Prisma connection failed:');
      console.error(JSON.stringify(error, null, 2)); // full error object
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
