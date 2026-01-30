import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const userId = req.query.userId as string;

  const links = await prisma.link.findMany({
    where: {
      project: {
        userId: userId,
      },
    },
    include: {
      project: true,
    },
    orderBy: { createdAt: "desc" },
  });

  res.json(links);
}
