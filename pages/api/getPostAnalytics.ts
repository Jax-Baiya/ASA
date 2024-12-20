import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { postId } = req.query;

    if (!postId) {
      return res.status(400).json({ error: 'Post ID is required' });
    }

    try {
      const analytics = await prisma.analytics.findMany({
        where: {
          mediaFileId: postId as string,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      const formattedAnalytics = analytics.map(item => ({
        date: item.createdAt.toISOString().split('T')[0],
        views: item.views,
        likes: item.likes,
        shares: item.shares,
        comments: item.comments,
      }));

      res.status(200).json(formattedAnalytics);
    } catch (error) {
      console.error('Error fetching post analytics:', error);
      res.status(500).json({ error: 'Failed to fetch post analytics' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

