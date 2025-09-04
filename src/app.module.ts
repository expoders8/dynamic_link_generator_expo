import { Module } from "@nestjs/common";
import { LinksModule } from "./modules/links/links.module";
import { RedirectModule } from "./modules/redirect/redirect.module";
import { ProjectsModule } from "./modules/projects/projects.module";
import { PrismaClient } from "../generated/prisma";
import { PrismaModule } from "./prisma/prisma.module";
const prisma = new PrismaClient();

@Module({
  imports: [LinksModule, RedirectModule, ProjectsModule, PrismaModule],
  providers: [],
  exports: [],
})
export class AppModule {}
