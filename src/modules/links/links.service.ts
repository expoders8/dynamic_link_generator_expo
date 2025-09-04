import { Injectable, Inject } from "@nestjs/common";
import { nanoid } from "nanoid";
import { PrismaService } from "../../prisma/prisma.service";
@Injectable()
export class LinksService {
  constructor(private prisma: PrismaService) {}
  async create(projectId: any, deepLink: any, fallbackUrl = null, meta: any) {
    const shortId = nanoid(8);
    return this.prisma.link.create({
      data: { projectId, deepLink, fallbackUrl, meta, shortId },
    });
  }
  async findByShortId(shortId: any) {
    return this.prisma.link.findUnique({
      where: { shortId },
      include: { project: true },
    });
  }
  async incrementClicks(id: any) {
    return this.prisma.link.update({
      where: { id },
      data: { clickCount: { increment: 1 } },
    });
  }
}
