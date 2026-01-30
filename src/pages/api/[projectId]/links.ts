import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../prisma/client";

import crypto from "crypto";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const {
    projectId,
    userId,
    projectName,
    androidPkg,
    iosBundleId,
    iosredirecturl,
    deepLink,
    webRedirectUrl,
    androidredirecturl,
  } = req.body;

  try {
    // 1️⃣ Create or find project
    const project = await prisma.project.upsert({
      where: { id: projectId },
      update: {},
      create: {
        id: projectId,
        name: projectName,
        androidPkg,
        userId: userId,
        iosBundleId,
        iosredirecturl,
      },
    });

    // 2️⃣ Create short ID
    const shortId = crypto.randomBytes(5).toString("hex");

    // 3️⃣ Create link
    const link = await prisma.link.create({
      data: {
        shortId,
        projectId: project.id,
        deepLink,
        webRedirectUrl,
        androidredirecturl,
      },
    });

    return res.status(201).json({
      ...link,
      shortUrl: `http://localhost:3000/s/${shortId}`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
