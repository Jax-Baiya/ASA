import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    const { id, metadata } = req.body;

    if (!id || !metadata) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const updatedFile = await prisma.mediaFile.update({
        where: { id },
        data: {
          metadata: {
            upsert: {
              create: metadata,
              update: metadata,
            },
          },
        },
        include: { metadata: true },
      });

      res.status(200).json(updatedFile);
    } catch (error) {
      console.error('Error updating metadata:', error);
      res.status(500).json({ error: 'Failed to update metadata' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

