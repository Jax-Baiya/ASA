import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const search = req.query.search as string | undefined;

    try {
      const where = search
        ? {
            OR: [
              { filename: { contains: search, mode: 'insensitive' } },
              { metadata: { title: { contains: search, mode: 'insensitive' } } },
              { metadata: { description: { contains: search, mode: 'insensitive' } } },
            ],
          }
        : {};

      const [mediaFiles, totalCount] = await Promise.all([
        prisma.mediaFile.findMany({
          where,
          include: { metadata: true },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.mediaFile.count({ where }),
      ]);

      res.status(200).json({
        mediaFiles,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      });
    } catch (error) {
      console.error('Error fetching media files:', error);
      res.status(500).json({ error: 'Failed to fetch media files' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

