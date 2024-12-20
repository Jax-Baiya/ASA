import React, { useState, useEffect } from 'react';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react';

interface CompareAnalyticsProps {
  mediaFiles: { id: string; filename: string }[];
}

interface AnalyticsDataPoint {
  date: string;
  views: number;
  likes: number;
  shares: number;
  comments: number;
}

const CompareAnalytics: React.FC<CompareAnalyticsProps> = ({ mediaFiles }) => {
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [analyticsData, setAnalyticsData] = useState<{ [key: string]: AnalyticsDataPoint[] }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPostAnalytics = async (postId: string) => {
    try {
      const response = await fetch(`/api/getPostAnalytics?postId=${postId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch post analytics');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching post analytics:', error);
      throw error;
    }
  };

  const handleCompare = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const newAnalyticsData: { [key: string]: AnalyticsDataPoint[] } = {};
      for (const postId of selectedPosts) {
        newAnalyticsData[postId] = await fetchPostAnalytics(postId);
      }
      setAnalyticsData(newAnalyticsData);
    } catch (error) {
      setError('Failed to fetch analytics data for comparison');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostSelect = (postId: string) => {
    setSelectedPosts((prev) => {
      if (prev.includes(postId)) {
        return prev.filter((id) => id !== postId);
      } else if (prev.length < 3) {
        return [...prev, postId];
      }
      return prev;
    });
  };

  const getColorForPost = (index: number) => {
    const colors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];
    return colors[index % colors.length];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compare Post Analytics</CardTitle>
        <CardDescription>Select up to 3 posts to compare their performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {mediaFiles.map((file, index) => (
            <Button
              key={file.id}
              variant={selectedPosts.includes(file.id) ? "default" : "outline"}
              onClick={() => handlePostSelect(file.id)}
            >
              {file.filename}
            </Button>
          ))}
        </div>
        <Button onClick={handleCompare} disabled={selectedPosts.length === 0 || isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Compare
        </Button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {!isLoading && !error && Object.keys(analyticsData).length > 0 && (
          <ChartContainer
            config={Object.fromEntries(
              selectedPosts.map((postId, index) => [
                postId,
                {
                  label: mediaFiles.find(file => file.id === postId)?.filename || '',
                  color: getColorForPost(index),
                },
              ])
            )}
            className="h-[400px] mt-4"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  type="category"
                  allowDuplicatedCategory={false}
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                {selectedPosts.map((postId, index) => (
                  <Line
                    key={postId}
                    type="monotone"
                    dataKey="views"
                    data={analyticsData[postId]}
                    name={mediaFiles.find(file => file.id === postId)?.filename || ''}
                    stroke={getColorForPost(index)}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default CompareAnalytics;

