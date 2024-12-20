import { useState } from 'react';
import { MediaFile } from '@prisma/client';
import { Twitter } from 'lucide-react';

interface EditMetadataModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: MediaFile;
  onUpdateMetadata: (metadata: any) => void;
}

export default function EditMetadataModal({
  isOpen,
  onClose,
  file,
  onUpdateMetadata,
}: EditMetadataModalProps) {
  const [title, setTitle] = useState(file.metadata?.title || '');
  const [description, setDescription] = useState(file.metadata?.description || '');
  const [tags, setTags] = useState(file.metadata?.tags?.join(', ') || '');
  const [platform, setPlatform] = useState(file.metadata?.platform || '');
  const [scheduleTime, setScheduleTime] = useState(
    file.metadata?.scheduleTime ? new Date(file.metadata.scheduleTime).toISOString().slice(0, 16) : ''
  );
  const [postContent, setPostContent] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleError, setScheduleError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateMetadata({
      title,
      description,
      tags: tags.split(',').map((tag) => tag.trim()),
      platform,
      scheduleTime: scheduleTime ? new Date(scheduleTime).toISOString() : null,
    });
  };

  const handleSchedulePost = async () => {
    setIsScheduling(true);
    setScheduleError(null);

    try {
      const response = await fetch('/api/schedulePost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mediaFileId: file.id,
          platform,
          content: postContent,
          scheduleTime,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to schedule post');
      }

      const data = await response.json();
      console.log('Post scheduled:', data);
      onClose();
    } catch (error) {
      console.error('Error scheduling post:', error);
      setScheduleError('Failed to schedule post. Please try again.');
    } finally {
      setIsScheduling(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4">Edit Metadata</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="platform" className="block text-sm font-medium text-gray-700">
              Platform
            </label>
            <select
              id="platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select a platform</option>
              <option value="twitter">Twitter</option>
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="pinterest">Pinterest</option>
            </select>
          </div>
          <div>
            <label htmlFor="scheduleTime" className="block text-sm font-medium text-gray-700">
              Schedule Time
            </label>
            <input
              type="datetime-local"
              id="scheduleTime"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="postContent" className="block text-sm font-medium text-gray-700">
              Post Content
            </label>
            <textarea
              id="postContent"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your post content here..."
            ></textarea>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleSchedulePost}
              disabled={isScheduling}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {isScheduling ? 'Scheduling...' : 'Schedule Post'}
            </button>
          </div>
        </form>
        {scheduleError && <p className="mt-2 text-sm text-red-600">{scheduleError}</p>}
      </div>
    </div>
  );
}

