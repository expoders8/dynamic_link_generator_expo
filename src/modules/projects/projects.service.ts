import { Injectable, Inject } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}
  async create(data: any) {
    return this.prisma.project.create({ data });
  }
  async findBySlug(slug: any) {
    return this.prisma.project.findUnique({ where: { id: slug } });
  }
}
