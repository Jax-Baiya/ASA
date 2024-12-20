import fs from 'fs';
import path from 'path';
import chokidar from 'chokidar';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function scanDirectory(directoryPath: string) {
  const watcher = chokidar.watch(directoryPath, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true
  });

  watcher
    .on('add', (filePath) => addFile(filePath))
    .on('change', (filePath) => updateFile(filePath))
    .on('unlink', (filePath) => removeFile(filePath));

  console.log(`Watching for file changes on ${directoryPath}`);
}

async function addFile(filePath: string) {
  const stats = fs.statSync(filePath);
  const fileInfo = {
    filename: path.basename(filePath),
    filepath: filePath,
    filesize: stats.size,
    mimetype: getMimeType(filePath),
  };

  try {
    await prisma.mediaFile.create({
      data: {
        ...fileInfo,
        metadata: {
          create: {} // Create an empty metadata record
        }
      }
    });
    console.log(`Added file: ${filePath}`);
  } catch (error) {
    console.error(`Error adding file ${filePath}:`, error);
  }
}

async function updateFile(filePath: string) {
  const stats = fs.statSync(filePath);
  const fileInfo = {
    filesize: stats.size,
    mimetype: getMimeType(filePath),
  };

  try {
    await prisma.mediaFile.update({
      where: { filepath: filePath },
      data: fileInfo
    });
    console.log(`Updated file: ${filePath}`);
  } catch (error) {
    console.error(`Error updating file ${filePath}:`, error);
  }
}

async function removeFile(filePath: string) {
  try {
    await prisma.mediaFile.delete({
      where: { filepath: filePath }
    });
    console.log(`Removed file: ${filePath}`);
  } catch (error) {
    console.error(`Error removing file ${filePath}:`, error);
  }
}

function getMimeType(filePath: string): string {
  const extension = path.extname(filePath).toLowerCase();
  switch (extension) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    case '.mp4':
      return 'video/mp4';
    default:
      return 'application/octet-stream';
  }
}

