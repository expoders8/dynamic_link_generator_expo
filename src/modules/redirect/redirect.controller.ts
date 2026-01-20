import { Controller, Get, Param, Req, Res } from "@nestjs/common";
import { LinksService } from "../links/links.service";
import { Response, Request } from "express";

@Controller("s")
export class RedirectController {
  constructor(private linksService: LinksService) {}

  @Get(":shortId")
  async redirect(
    @Param("shortId") shortId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const link = await this.linksService.findByShortId(shortId);
    if (!link) return res.status(404).send("Not found");

    // increment async
    this.linksService.incrementClicks(link.id).catch(() => {});

    const ua = req.headers["user-agent"] || "";
    const isAndroid = /Android/i.test(ua);
    const isIOS = /iPhone|iPad|iPod/i.test(ua);

    // --- Extract scheme from deepLink (myapp:// → "myapp")
    const schemeMatch = link.deepLink.match(/^([a-zA-Z0-9+.-]+):\/\//);
    const scheme = schemeMatch ? schemeMatch[1] : null;

    // --- Android: build intent URL
    if (isAndroid) {
      const deepPath = link.deepLink.replace(/^.*?:\/\//, ""); // e.g. property/1234
      const intentUrl = `intent://${deepPath}#Intent;scheme=${
        scheme || "https"
      };package=${link.project.androidPkg};S.browser_fallback_url=${
        link.fallbackUrl ||
        `https://play.google.com/store/apps/details?id=${link.project.androidPkg}`
      };end;`;

      return res.redirect(intentUrl);
    }

    // --- iOS: deep link → fallback to App Store
    if (isIOS) {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Redirecting...</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <script>
            function openApp() {
              window.location = "${link.deepLink}";
              setTimeout(function() {
                window.location = "${
                  link.project.iosAppStore || link.fallbackUrl || ""
                }";
              }, 2000);
            }
          </script>
        </head>
        <body onload="openApp()">
          <p>Redirecting to app...</p>
        </body>
        </html>
      `;
      res.setHeader("Content-Type", "text/html");
      return res.send(html);
    }

    // --- Desktop / other
    return res.redirect(
      link.fallbackUrl || link.project.iosAppStore || link.deepLink,
    );
  }
}
