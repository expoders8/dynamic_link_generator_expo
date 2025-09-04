import { Controller, Post, Body, Get, Param } from "@nestjs/common";
import { ProjectsService } from "./projects.service";
@Controller("api/projects")
export class ProjectsController {
  constructor(private projects: ProjectsService) {}
  @Post()
  async create(@Body() body: any) {
    return this.projects.create(body);
  }
  @Get(":slug")
  async get(@Param("slug") slug: any) {
    return this.projects.findBySlug(slug);
  }
}
