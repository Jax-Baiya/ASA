import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(process.cwd(), 'public', 'uploads');
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form:', err);
        return res.status(500).json({ error: 'File upload failed' });
      }

      const file = files.file as formidable.File;
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      try {
        const stats = fs.statSync(file.filepath);
        const mediaFile = await prisma.mediaFile.create({
          data: {
            filename: file.originalFilename || 'unknown',
            filepath: file.filepath,
            filesize: stats.size,
            mimetype: file.mimetype || 'application/octet-stream',
            metadata: {
              create: {},
            },
          },
        });

        res.status(200).json(mediaFile);
      } catch (error) {
        console.error('Error saving file to database:', error);
        res.status(500).json({ error: 'File upload failed' });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

