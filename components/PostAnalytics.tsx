import React from 'react';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2 } from 'lucide-react';

interface PostAnalyticsProps {
  postId: string;
}

interface AnalyticsDataPoint {
  date: string;
  views: number;
  likes: number;
  shares: number;
  comments: number;
}

const PostAnalytics: React.FC<PostAnalyticsProps> = ({ postId }) => {
  const [analyticsData, setAnalyticsData] = React.useState<AnalyticsDataPoint[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchPostAnalytics = async () => {
      try {
        const response = await fetch(`/api/getPostAnalytics?postId=${postId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch post analytics');
        }
        const data = await response.json();
        setAnalyticsData(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching post analytics:', error);
        setError('Failed to fetch post analytics');
        setIsLoading(false);
      }
    };

    fetchPostAnalytics();
  }, [postId]);

  if (isLoading) return <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (error) return <p className="text-red-500 p-4 bg-red-100 rounded-md">{error}</p>;
  if (analyticsData.length === 0) return <p className="text-gray-500">No analytics data available for this post.</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Post Performance Analytics</CardTitle>
        <CardDescription>Detailed analytics for the selected post</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            views: {
              label: "Views",
              color: "hsl(var(--chart-1))",
            },
            likes: {
              label: "Likes",
              color: "hsl(var(--chart-2))",
            },
            shares: {
              label: "Shares",
              color: "hsl(var(--chart-3))",
            },
            comments: {
              label: "Comments",
              color: "hsl(var(--chart-4))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line type="monotone" dataKey="views" stroke="var(--color-views)" name="Views" />
              <Line type="monotone" dataKey="likes" stroke="var(--color-likes)" name="Likes" />
              <Line type="monotone" dataKey="shares" stroke="var(--color-shares)" name="Shares" />
              <Line type="monotone" dataKey="comments" stroke="var(--color-comments)" name="Comments" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default PostAnalytics;

