import { Controller, Post, Body, Param, Get } from "@nestjs/common";
import { LinksService } from "./links.service";
@Controller("api/:projectSlug/links")
export class LinksController {
  constructor(private links: LinksService) {}
  @Post()
  async create(@Param("projectSlug") projectSlug: any, @Body() body: any) {
    // NOTE: In scaffold we accept projectId in body for simplicity.
    const { projectId, deepLink, fallbackUrl, meta } = body;
    return this.links.create(projectId, deepLink, fallbackUrl, meta);
  }
  @Get(":shortId")
  async get(@Param("shortId") shortId: any) {
    return this.links.findByShortId(shortId);
  }
}
