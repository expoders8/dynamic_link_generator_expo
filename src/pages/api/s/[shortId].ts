import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { shortId } = req.query;

  if (typeof shortId !== "string") {
    return res.status(400).send("Invalid link");
  }

  const link = await prisma.link.findUnique({
    where: { shortId },
    include: { project: true },
  });

  if (!link) {
    return res.status(404).send("Not found");
  }

  // increment clicks async
  prisma.link
    .update({
      where: { id: link.id },
      data: { clickCount: { increment: 1 } },
    })
    .catch(() => {});

  const ua = req.headers["user-agent"] || "";
  const isAndroid = /Android/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isDesktop = !isAndroid && !isIOS;

  // extract scheme from deep link
  const schemeMatch = link.deepLink.match(/^([a-zA-Z0-9+.-]+):\/\//);
  const scheme = schemeMatch ? schemeMatch[1] : null;

  // ANDROID
  if (isAndroid) {
    const deepPath = link.deepLink.replace(/^.*?:\/\//, "");

    const intentUrl = `intent://${deepPath}#Intent;scheme=${
      scheme || "https"
    };package=${link.project.androidPkg};S.browser_fallback_url=${
      link.androidredirecturl ||
      `https://play.google.com/store/apps/details?id=${link.project.androidPkg}`
    };end;`;

    return res.redirect(intentUrl);
  }

  // IOS
  if (isIOS) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>Redirecting...</title>
          <script>
            function openApp() {
              window.location = "${link.deepLink}";
              setTimeout(function() {
                window.location = "${
                  link.project.iosredirecturl || link.webRedirectUrl || ""
                }";
              }, 2000);
            }
          </script>
        </head>
        <body onload="openApp()">
          <p>Redirecting...</p>
        </body>
      </html>
    `;

    res.setHeader("Content-Type", "text/html");
    return res.send(html);
  }

  if (isDesktop) {
    const url = link.webRedirectUrl || link.androidredirecturl || "";

    if (!url) {
      return res.redirect("https://your-default-website.com");
    }

    // ✅ if already absolute URL, redirect directly
    if (url.startsWith("http:") || url.startsWith("https:")) {
      return res.redirect(302, url);
    }

    // fallback (safety)
    return res.redirect(302, `https://${url}`);
  }

  // DESKTOP
  return res.redirect(
    link.webRedirectUrl ||
      link.androidredirecturl ||
      "https://your-default-website.com",
  );
}
