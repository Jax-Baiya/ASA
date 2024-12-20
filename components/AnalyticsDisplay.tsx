import { useState, useEffect } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from 'lucide-react'

interface AnalyticsData {
  id: string;
  mediaFileId: string;
  platform: string;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  createdAt: string;
  mediaFile: {
    filename: string;
  };
}

export default function AnalyticsDisplay() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    fetchAnalytics();
  }, [startDate, endDate]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      let url = '/api/getAnalytics';
      if (startDate && endDate) {
        url += `?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }
      const data = await response.json();
      setAnalyticsData(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('Failed to fetch analytics data');
      setIsLoading(false);
    }
  };

  const handleDateSelect = (date: Date | undefined, isStart: boolean) => {
    if (isStart) {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
  };

  if (isLoading) return <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (error) return <p className="text-red-500 p-4 bg-red-100 rounded-md">{error}</p>;
  if (analyticsData.length === 0) return <p className="text-gray-500">No analytics data available for the selected date range.</p>;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Content Performance Analytics</h2>
      <div className="flex space-x-4 mb-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "PPP") : "Select start date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={(date) => handleDateSelect(date, true)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "PPP") : "Select end date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={(date) => handleDateSelect(date, false)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
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
        className="h-[400px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={analyticsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mediaFile.filename" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Bar dataKey="views" fill="var(--color-views)" name="Views" />
            <Bar dataKey="likes" fill="var(--color-likes)" name="Likes" />
            <Bar dataKey="shares" fill="var(--color-shares)" name="Shares" />
            <Bar dataKey="comments" fill="var(--color-comments)" name="Comments" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Detailed Analytics</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">File Name</th>
                <th className="py-2 px-4 border-b">Platform</th>
                <th className="py-2 px-4 border-b">Views</th>
                <th className="py-2 px-4 border-b">Likes</th>
                <th className="py-2 px-4 border-b">Shares</th>
                <th className="py-2 px-4 border-b">Comments</th>
                <th className="py-2 px-4 border-b">Date</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.map((item) => (
                <tr key={item.id}>
                  <td className="py-2 px-4 border-b">{item.mediaFile.filename}</td>
                  <td className="py-2 px-4 border-b">{item.platform}</td>
                  <td className="py-2 px-4 border-b">{item.views}</td>
                  <td className="py-2 px-4 border-b">{item.likes}</td>
                  <td className="py-2 px-4 border-b">{item.shares}</td>
                  <td className="py-2 px-4 border-b">{item.comments}</td>
                  <td className="py-2 px-4 border-b">{new Date(item.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

