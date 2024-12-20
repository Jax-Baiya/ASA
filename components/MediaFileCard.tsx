import { useState } from 'react';
import { MediaFile } from '@prisma/client';
import Image from 'next/image';
import { Play, Pause, File, BarChart2 } from 'lucide-react';
import { Button } from "@/components/ui/button"
import PostAnalytics from './PostAnalytics';

interface MediaFileCardProps {
  file: MediaFile;
  onEditMetadata: () => void;
}

export default function MediaFileCard({ file, onEditMetadata }: MediaFileCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const handlePreview = () => {
    if (file.mimetype.startsWith('video/')) {
      setIsPlaying(!isPlaying);
    }
  };

  const toggleAnalytics = () => {
    setShowAnalytics(!showAnalytics);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48">
        {file.mimetype.startsWith('image/') && (
          <Image
            src={`/uploads/${file.filename}`}
            alt={file.filename}
            layout="fill"
            objectFit="cover"
          />
        )}
        {file.mimetype.startsWith('video/') && (
          <video
            src={`/uploads/${file.filename}`}
            className="w-full h-full object-cover"
            controls={isPlaying}
          >
            Your browser does not support the video tag.
          </video>
        )}
        {!file.mimetype.startsWith('image/') && !file.mimetype.startsWith('video/') && (
          <div className="flex items-center justify-center h-full bg-gray-200">
            <File className="h-12 w-12 text-gray-400" />
          </div>
        )}
        {file.mimetype.startsWith('video/') && (
          <button
            onClick={handlePreview}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white"
          >
            {isPlaying ? (
              <Pause className="h-12 w-12" />
            ) : (
              <Play className="h-12 w-12" />
            )}
          </button>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{file.filename}</h3>
        <p className="text-sm text-gray-600 mb-2">Size: {formatFileSize(file.filesize)}</p>
        <p className="text-sm text-gray-600 mb-4">Created: {new Date(file.createdAt).toLocaleString()}</p>
        <div className="flex space-x-2">
          <Button onClick={onEditMetadata}>
            Edit Metadata
          </Button>
          <Button onClick={toggleAnalytics} variant="outline">
            <BarChart2 className="mr-2 h-4 w-4" />
            {showAnalytics ? 'Hide Analytics' : 'View Analytics'}
          </Button>
        </div>
      </div>
      {showAnalytics && (
        <div className="p-4 border-t">
          <PostAnalytics postId={file.id} />
        </div>
      )}
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

