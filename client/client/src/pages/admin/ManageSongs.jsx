import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MusicalNoteIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import DataTable from '@/components/admin/DataTable';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import TextArea from '@/components/common/TextArea';
import { adminService } from '@/services/adminService';
import { songService } from '@/services/songService';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const songSchema = z.object({
  title: z.string().min(3, 'Song title is required'),
  artist: z.string().optional(),
  lyrics: z.string().optional(),
  youtubeUrl: z.string().url('Invalid YouTube URL').optional().or(z.literal('')),
  isOriginal: z.boolean().optional(),
});

const ManageSongs = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ page: 1, limit: 20 });
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(songSchema),
    defaultValues: {
      isOriginal: false,
    },
  });

  useEffect(() => {
    fetchSongs();
  }, [filters, searchTerm]);

  const fetchSongs = async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        search: searchTerm || undefined,
      };
      const data = await songService.getMasterList(params);
      console.log('📡 Songs data received:', data);
      
      if (data && data.items) {
        setSongs(data.items);
        setPagination(data.pagination || { page: 1, limit: 20, total: data.items.length, pages: 1 });
      } else if (Array.isArray(data)) {
        setSongs(data);
        setPagination({ page: 1, limit: 20, total: data.length, pages: 1 });
      } else {
        setSongs([]);
      }
    } catch (error) {
      console.error('❌ Failed to fetch songs:', error);
      toast.error('Failed to fetch songs');
      setSongs([]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (selectedSong) {
        // Update existing song
        await songService.updateSong(selectedSong.id, data);
        toast.success('Song updated successfully');
      } else {
        // Create new song
        await songService.createSong(data);
        toast.success('Song created successfully');
      }
      setIsModalOpen(false);
      reset({ isOriginal: false });
      setSelectedSong(null);
      fetchSongs();
    } catch (error) {
      console.error('Failed to save song:', error);
      toast.error(error.message || 'Failed to save song');
    }
  };

  const handleDelete = async (songId) => {
    if (window.confirm('Are you sure you want to delete this song? This may affect playlists that use it.')) {
      try {
        await songService.deleteSong(songId);
        toast.success('Song deleted successfully');
        fetchSongs();
      } catch (error) {
        toast.error('Failed to delete song');
      }
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Song',
      render: (_, row) => (
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
            <MusicalNoteIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{row.title}</p>
            {row.artist && (
              <p className="text-sm text-gray-500 dark:text-gray-400">{row.artist}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'requestCount',
      label: 'Requests',
      render: (count) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">{count || 0}</span>
      ),
    },
    {
      key: 'hasLyrics',
      label: 'Lyrics',
      render: (_, row) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          row.lyrics ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
        }`}>
          {row.lyrics ? 'Available' : 'None'}
        </span>
      ),
    },
    {
      key: 'youtubeUrl',
      label: 'Video',
      render: (url) => (
        url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 text-sm"
          >
            Watch
          </a>
        ) : (
          <span className="text-gray-400 text-sm">None</span>
        )
      ),
    },
    {
      key: 'createdAt',
      label: 'Added',
      render: (date) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {date ? new Date(date).toLocaleDateString() : 'N/A'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedSong(row);
              reset({
                title: row.title,
                artist: row.artist || '',
                lyrics: row.lyrics || '',
                youtubeUrl: row.youtubeUrl || '',
                isOriginal: row.isOriginal || false,
              });
              setIsModalOpen(true);
            }}
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.id);
            }}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Helmet>
        <title>Manage Songs - New Band Fellowship</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Songs</h1>
          <Button
            variant="primary"
            icon={PlusIcon}
            onClick={() => {
              setSelectedSong(null);
              reset({ isOriginal: false });
              setIsModalOpen(true);
            }}
          >
            Add New Song
          </Button>
        </div>

        {/* Search Bar */}
        <Card>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search songs by title or artist..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={MagnifyingGlassIcon}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                fetchSongs();
              }}
            >
              Clear
            </Button>
          </div>
        </Card>

        <Card>
          <DataTable
            columns={columns}
            data={songs}
            loading={loading}
            pagination={pagination}
            onPageChange={(page) => setFilters({ ...filters, page })}
          />
        </Card>

        {/* Add/Edit Song Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedSong(null);
            reset({ isOriginal: false });
          }}
          title={selectedSong ? 'Edit Song' : 'Add New Song'}
          size="lg"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
            <Input
              label="Song Title *"
              {...register('title')}
              error={errors.title?.message}
              placeholder="Enter song title"
            />
            
            <Input
              label="Artist (optional)"
              {...register('artist')}
              error={errors.artist?.message}
              placeholder="Enter artist name"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Lyrics (optional)
              </label>
              <TextArea
                {...register('lyrics')}
                error={errors.lyrics?.message}
                rows={8}
                placeholder="Enter song lyrics..."
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                You can paste the full lyrics here. They will be displayed when users click on the song in a playlist.
              </p>
            </div>
            
            <Input
              label="YouTube Video URL (optional)"
              {...register('youtubeUrl')}
              error={errors.youtubeUrl?.message}
              placeholder="https://www.youtube.com/watch?v=..."
            />
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isOriginal"
                {...register('isOriginal')}
                className="h-4 w-4 text-primary-600 rounded focus:ring-primary-500"
              />
              <label htmlFor="isOriginal" className="text-sm text-gray-700 dark:text-gray-300">
                This is an original composition by our fellowship
              </label>
            </div>
            
            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedSong(null);
                  reset({ isOriginal: false });
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {selectedSong ? 'Update' : 'Create'} Song
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
};

export default ManageSongs;