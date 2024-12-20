import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { mediaFileId, platform, content, scheduleTime } = req.body;

    if (!mediaFileId || !platform || !content || !scheduleTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const scheduledPost = await prisma.scheduledPost.create({
        data: {
          mediaFileId,
          platform,
          content,
          scheduleTime: new Date(scheduleTime),
          status: 'pending',
        },
      });

      res.status(200).json(scheduledPost);
    } catch (error) {
      console.error('Error scheduling post:', error);
      res.status(500).json({ error: 'Failed to schedule post' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

