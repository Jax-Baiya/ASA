import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { startDate, endDate } = req.query;

    try {
      const whereClause: any = {};

      if (startDate && endDate) {
        whereClause.createdAt = {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string),
        };
      }

      // Fetch analytics data from the database
      const analytics = await prisma.analytics.findMany({
        where: whereClause,
        include: {
          mediaFile: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 100, // Limit to the last 100 entries
      });

      res.status(200).json(analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      res.status(500).json({ error: 'Failed to fetch analytics data' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

