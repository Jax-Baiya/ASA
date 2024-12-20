import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { mediaFileId, platform, views, likes, shares, comments } = req.body;

    if (!mediaFileId || !platform) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const analytics = await prisma.analytics.create({
        data: {
          mediaFileId,
          platform,
          views: views || 0,
          likes: likes || 0,
          shares: shares || 0,
          comments: comments || 0,
        },
      });

      res.status(200).json(analytics);
    } catch (error) {
      console.error('Error updating analytics:', error);
      res.status(500).json({ error: 'Failed to update analytics' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

