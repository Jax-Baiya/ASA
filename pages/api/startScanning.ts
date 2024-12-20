import { NextApiRequest, NextApiResponse } from 'next';
import { scanDirectory } from '../../lib/fileScanner';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { directoryPath } = req.body;

    if (!directoryPath) {
      return res.status(400).json({ error: 'Directory path is required' });
    }

    try {
      await scanDirectory(directoryPath);
      res.status(200).json({ message: 'File scanning started successfully' });
    } catch (error) {
      console.error('Error starting file scan:', error);
      res.status(500).json({ error: 'Failed to start file scanning' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

