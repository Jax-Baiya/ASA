import { useState, useEffect } from 'react';
import Head from 'next/head';
import { MediaFile } from '@prisma/client';
import MediaFileCard from '../components/MediaFileCard';
import EditMetadataModal from '../components/EditMetadataModal';
import FileUpload from '../components/FileUpload';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';
import ScheduledPosts from '../components/ScheduledPosts';
import AnalyticsDisplay from '../components/AnalyticsDisplay';
import { Twitter } from 'lucide-react';
import CompareAnalytics from '../components/CompareAnalytics';

export default function Dashboard() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTwitterAuthenticated, setIsTwitterAuthenticated] = useState(false);

  useEffect(() => {
    fetchMediaFiles();
  }, [currentPage, searchQuery]);

  const fetchMediaFiles = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/getMediaFiles?page=${currentPage}&search=${searchQuery}`);
      if (!response.ok) {
        throw new Error('Failed to fetch media files');
      }
      const data = await response.json();
      setMediaFiles(data.mediaFiles);
      setTotalPages(data.totalPages);
      setIsLoading(false);
    } catch (error) {
      setError('An error occurred while fetching media files');
      setIsLoading(false);
    }
  };

  const handleEditMetadata = (file: MediaFile) => {
    setSelectedFile(file);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedFile(null);
    setIsModalOpen(false);
  };

  const handleUpdateMetadata = async (updatedMetadata: any) => {
    if (!selectedFile) return;

    try {
      const response = await fetch('/api/updateMetadata', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedFile.id,
          metadata: updatedMetadata,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update metadata');
      }

      handleCloseModal();
      await fetchMediaFiles();
    } catch (error) {
      console.error('Error updating metadata:', error);
      // You can add error handling here, such as showing an error message to the user
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleTwitterAuth = () => {
    window.location.href = '/api/auth/twitter';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>ASA Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Media Files Dashboard</h1>
          <button
            onClick={handleTwitterAuth}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Twitter className="mr-2 h-5 w-5" />
            {isTwitterAuthenticated ? 'Authenticated with Twitter' : 'Authenticate with Twitter'}
          </button>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <FileUpload onUploadComplete={fetchMediaFiles} />
          <SearchBar onSearch={handleSearch} />
        </div>

        {isLoading && <p className="text-center mt-4">Loading media files...</p>}

        {error && <p className="text-center text-red-500 mt-4">{error}</p>}

        {!isLoading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {mediaFiles.map((file) => (
                <MediaFileCard
                  key={file.id}
                  file={file}
                  onEditMetadata={() => handleEditMetadata(file)}
                />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}

        {selectedFile && (
          <EditMetadataModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            file={selectedFile}
            onUpdateMetadata={handleUpdateMetadata}
          />
        )}

        <ScheduledPosts />
        <AnalyticsDisplay />
        <CompareAnalytics mediaFiles={mediaFiles} />
      </main>
    </div>
  );
}

