import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from '@dnd-kit/modifiers';
import { format } from 'date-fns';
import {
  MusicalNoteIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Select from '@/components/common/Select';
import Input from '@/components/common/Input';
import Modal from '@/components/common/Modal';
import SortableItem from '@/components/admin/SortableItem';
import { adminService } from '@/services/adminService';
import { songService } from '@/services/songService';
import { toast } from 'react-hot-toast';
import Loader from '@/components/common/Loader';

const ManagePlaylist = () => {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get('event');
  
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [playlist, setPlaylist] = useState({ items: [], sessions: [] });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [songs, setSongs] = useState([]);
  const [fetchingSongs, setFetchingSongs] = useState(false);
  const [formData, setFormData] = useState({
    songId: '',
    sessionId: '',
    order: 1,
    backgroundImage: '',
    backgroundColor: '#f97316',
    notes: '',
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchEvents();
    fetchSongs();
  }, []);

  useEffect(() => {
    if (eventId) {
      setSelectedEvent(eventId);
      fetchPlaylist(eventId);
    }
  }, [eventId]);

  const fetchEvents = async () => {
    try {
      const data = await adminService.events.getAll({ limit: 100 });
      console.log('📡 Events fetched:', data);
      // Handle different response structures
      if (data && data.items) {
        setEvents(data.items);
      } else if (Array.isArray(data)) {
        setEvents(data);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to fetch events');
      setEvents([]);
    }
  };

  const fetchSongs = async () => {
    setFetchingSongs(true);
    try {
      const data = await songService.getMasterList({ limit: 100 });
      console.log('📡 Songs fetched:', data);
      // Handle different response structures
      if (data && data.items) {
        setSongs(data.items);
      } else if (Array.isArray(data)) {
        setSongs(data);
      } else {
        setSongs([]);
      }
    } catch (error) {
      console.error('Error fetching songs:', error);
      toast.error('Failed to fetch songs');
      setSongs([]);
    } finally {
      setFetchingSongs(false);
    }
  };

  const fetchPlaylist = async (id) => {
    setLoading(true);
    try {
      const data = await adminService.playlist.get(id);
      console.log('📡 Playlist fetched:', data);
      setPlaylist(data || { items: [], sessions: [] });
    } catch (error) {
      console.error('Error fetching playlist:', error);
      toast.error('Failed to fetch playlist');
      setPlaylist({ items: [], sessions: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = playlist.items.findIndex((item) => item.id === active.id);
      const newIndex = playlist.items.findIndex((item) => item.id === over.id);
      
      const newItems = arrayMove(playlist.items, oldIndex, newIndex);
      const reorderedItems = newItems.map((item, index) => ({
        ...item,
        order: index + 1,
      }));
      
      setPlaylist({ ...playlist, items: reorderedItems });
      
      // API call to reorder
      adminService.playlist.reorder(selectedEvent, reorderedItems)
        .then(() => toast.success('Playlist reordered'))
        .catch(() => {
          toast.error('Failed to reorder playlist');
          fetchPlaylist(selectedEvent);
        });
    }
  };

  const handleAddItem = async (e) => {
  e.preventDefault();
  
  // Validate required fields
  if (!formData.songId) {
    toast.error('Please select a song');
    return;
  }
  
  try {
    console.log('📝 Adding song to playlist with data:', formData);
    
    // Prepare the data
    const addData = {
      songId: formData.songId,
      order: parseInt(formData.order) || 1,
    };
    
    // Only add optional fields if they have values
    if (formData.sessionId) addData.sessionId = formData.sessionId;
    if (formData.backgroundImage) addData.backgroundImage = formData.backgroundImage;
    if (formData.backgroundColor) addData.backgroundColor = formData.backgroundColor;
    if (formData.notes) addData.notes = formData.notes;
    
    await adminService.playlist.addSong(selectedEvent, addData);
    toast.success('Song added to playlist successfully');
    setIsModalOpen(false);
    resetForm();
    fetchPlaylist(selectedEvent);
  } catch (error) {
    console.error('❌ Error adding song:', error);
    toast.error(error.response?.data?.message || error.message || 'Failed to add song');
  }
};

 const handleUpdateItem = async (e) => {
  e.preventDefault();
  
  // Validate required fields
  if (!formData.songId) {
    toast.error('Please select a song');
    return;
  }
  
  try {
    console.log('📝 Updating playlist item with data:', formData);
    
    // Prepare the data - only send fields that have values
    const updateData = {
      songId: formData.songId,
      order: parseInt(formData.order) || 1,
    };
    
    // Only add optional fields if they have values
    if (formData.sessionId) updateData.sessionId = formData.sessionId;
    if (formData.backgroundImage) updateData.backgroundImage = formData.backgroundImage;
    if (formData.backgroundColor) updateData.backgroundColor = formData.backgroundColor;
    if (formData.notes) updateData.notes = formData.notes;
    
    await adminService.playlist.updateSong(editingItem.id, updateData);
    toast.success('Playlist item updated successfully');
    setIsModalOpen(false);
    resetForm();
    fetchPlaylist(selectedEvent);
  } catch (error) {
    console.error('❌ Error updating item:', error);
    toast.error(error.response?.data?.message || error.message || 'Failed to update item');
  }
};

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Remove this song from the playlist?')) {
      try {
        await adminService.playlist.removeSong(itemId);
        toast.success('Song removed from playlist');
        fetchPlaylist(selectedEvent);
      } catch (error) {
        console.error('Error removing song:', error);
        toast.error(error.message || 'Failed to remove song');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      songId: '',
      sessionId: '',
      order: 1,
      backgroundImage: '',
      backgroundColor: '#f97316',
      notes: '',
    });
    setEditingItem(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      songId: item.songId || '',
      sessionId: item.sessionId || '',
      order: item.order || 1,
      backgroundImage: item.backgroundImage || '',
      backgroundColor: item.backgroundColor || '#f97316',
      notes: item.notes || '',
    });
    setIsModalOpen(true);
  };

  if (!selectedEvent) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Playlist</h1>
        <Card>
          <div className="text-center py-12">
            <MusicalNoteIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Select an Event
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Choose an event to manage its playlist
            </p>
            <Select
              value=""
              onChange={(e) => {
                const eventId = e.target.value;
                if (eventId) {
                  window.location.href = `/admin/playlist?event=${eventId}`;
                }
              }}
              options={[
                { value: '', label: 'Select an event...' },
                ...(events || []).map(event => ({
                  value: event.id,
                  label: `${event.title} (${event.eventDate ? format(new Date(event.eventDate), 'MMM d, yyyy') : 'No date'})`,
                })),
              ]}
              className="max-w-md mx-auto"
            />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Playlist</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {events.find(e => e.id === selectedEvent)?.title || 'Loading...'}
          </p>
        </div>
        <Button
          variant="primary"
          icon={PlusIcon}
          onClick={openAddModal}
        >
          Add Song
        </Button>
      </div>

      <Card>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader size="lg" text="Loading playlist..." />
          </div>
        ) : !playlist.items || playlist.items.length === 0 ? (
          <div className="text-center py-12">
            <MusicalNoteIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No songs in playlist
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start building your worship playlist
            </p>
            <Button
              variant="primary"
              onClick={openAddModal}
            >
              Add First Song
            </Button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          >
            <SortableContext
              items={playlist.items.map(item => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {playlist.items.map((item, index) => (
                  <SortableItem
                    key={item.id}
                    id={item.id}
                    item={item}
                    index={index}
                    onEdit={() => openEditModal(item)}
                    onDelete={() => handleDeleteItem(item.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </Card>

      {/* Add/Edit Song Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingItem ? 'Edit Song' : 'Add Song to Playlist'}
        size="lg"
      >
        <form onSubmit={editingItem ? handleUpdateItem : handleAddItem} className="space-y-4 p-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select Song *
            </label>
            {fetchingSongs ? (
              <div className="text-gray-500">Loading songs...</div>
            ) : (
              <Select
                value={formData.songId}
                onChange={(e) => setFormData({ ...formData, songId: e.target.value })}
                options={[
                  { value: '', label: 'Choose a song...' },
                  ...(songs || []).map(song => ({
                    value: song.id,
                    label: `${song.title}${song.artist ? ` - ${song.artist}` : ''}`,
                  })),
                ]}
                required
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Session (optional)
            </label>
            <Select
              value={formData.sessionId}
              onChange={(e) => setFormData({ ...formData, sessionId: e.target.value })}
              options={[
                { value: '', label: 'No session' },
                ...(playlist.sessions || []).map(session => ({
                  value: session.id,
                  label: session.title,
                })),
              ]}
            />
          </div>

          <Input
            label="Order *"
            type="number"
            min="1"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
            required
          />

          <Input
            label="Background Image URL (optional)"
            value={formData.backgroundImage}
            onChange={(e) => setFormData({ ...formData, backgroundImage: e.target.value })}
            icon={PhotoIcon}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Background Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={formData.backgroundColor}
                onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                className="h-10 w-20 rounded border border-gray-300 dark:border-gray-600"
              />
              <Input
                type="text"
                value={formData.backgroundColor}
                onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                placeholder="#f97316"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes (optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Any special instructions or notes for this song in this playlist..."
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={() => {
              setIsModalOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={fetchingSongs}>
              {editingItem ? 'Update' : 'Add'} Song
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManagePlaylist;