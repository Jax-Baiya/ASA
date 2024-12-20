import { useState, useEffect } from 'react';
import { ScheduledPost } from '@prisma/client';

export default function ScheduledPosts() {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchScheduledPosts();
  }, []);

  const fetchScheduledPosts = async () => {
    try {
      const response = await fetch('/api/getScheduledPosts');
      if (!response.ok) {
        throw new Error('Failed to fetch scheduled posts');
      }
      const data = await response.json();
      setScheduledPosts(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching scheduled posts:', error);
      setError('Failed to fetch scheduled posts');
      setIsLoading(false);
    }
  };

  const handleCancelPost = async (postId: string) => {
    try {
      const response = await fetch(`/api/cancelScheduledPost?id=${postId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to cancel scheduled post');
      }
      await fetchScheduledPosts();
    } catch (error) {
      console.error('Error cancelling scheduled post:', error);
      setError('Failed to cancel scheduled post');
    }
  };

  if (isLoading) return <p>Loading scheduled posts...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Scheduled Posts</h2>
      {scheduledPosts.length === 0 ? (
        <p>No scheduled posts.</p>
      ) : (
        <ul className="space-y-4">
          {scheduledPosts.map((post) => (
            <li key={post.id} className="bg-white rounded-lg shadow-md p-4">
              <p className="font-semibold">{post.platform}</p>
              <p className="text-sm text-gray-600">
                Scheduled for: {new Date(post.scheduleTime).toLocaleString()}
              </p>
              <p className="mt-2">{post.content}</p>
              <button
                onClick={() => handleCancelPost(post.id)}
                className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Cancel
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

