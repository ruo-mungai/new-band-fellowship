import React, { useState, useEffect } from 'react';
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
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import TextArea from '@/components/common/TextArea';
import SortableImage from '@/components/admin/SortableImage';
import { adminService } from '@/services/adminService';
import { toast } from 'react-hot-toast';

const ManageGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const data = await adminService.gallery.getAll();
      setImages(data);
    } catch (error) {
      toast.error('Failed to fetch gallery');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over.id);
      
      const newImages = arrayMove(images, oldIndex, newIndex);
      const reorderedImages = newImages.map((img, index) => ({
        ...img,
        order: index + 1,
      }));
      
      setImages(reorderedImages);
      
      try {
        await adminService.gallery.reorder(reorderedImages);
        toast.success('Gallery reordered');
      } catch (error) {
        toast.error('Failed to reorder gallery');
        fetchGallery();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingImage) {
        await adminService.gallery.update(editingImage.id, formData);
        toast.success('Image updated successfully');
      } else {
        await adminService.gallery.add(formData);
        toast.success('Image added to gallery');
      }
      
      setIsModalOpen(false);
      setEditingImage(null);
      setFormData({ title: '', description: '', imageUrl: '' });
      fetchGallery();
    } catch (error) {
      toast.error('Failed to save image');
    }
  };

  const handleDelete = async (imageId) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await adminService.gallery.delete(imageId);
        toast.success('Image deleted');
        fetchGallery();
      } catch (error) {
        toast.error('Failed to delete image');
      }
    }
  };

  const openEditModal = (image) => {
    setEditingImage(image);
    setFormData({
      title: image.title,
      description: image.description || '',
      imageUrl: image.imageUrl,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Gallery</h1>
        <Button
          variant="primary"
          icon={PlusIcon}
          onClick={() => {
            setEditingImage(null);
            setFormData({ title: '', description: '', imageUrl: '' });
            setIsModalOpen(true);
          }}
        >
          Add Image
        </Button>
      </div>

      <Card>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-12">
            <PhotoIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No images in gallery
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start adding photos from your fellowship events
            </p>
            <Button
              variant="primary"
              onClick={() => {
                setEditingImage(null);
                setFormData({ title: '', description: '', imageUrl: '' });
                setIsModalOpen(true);
              }}
            >
              Add First Image
            </Button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={images.map(img => img.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <SortableImage
                    key={image.id}
                    id={image.id}
                    image={image}
                    index={index}
                    onEdit={() => openEditModal(image)}
                    onDelete={() => handleDelete(image.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </Card>

      {/* Add/Edit Image Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingImage(null);
          setFormData({ title: '', description: '', imageUrl: '' });
        }}
        title={editingImage ? 'Edit Image' : 'Add Image to Gallery'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Image Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <TextArea
            label="Description (optional)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />

          <Input
            label="Image URL"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            required
            placeholder="https://example.com/image.jpg"
          />

          {formData.imageUrl && (
            <div className="mt-2">
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x300?text=Invalid+Image';
                }}
              />
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setEditingImage(null);
                setFormData({ title: '', description: '', imageUrl: '' });
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingImage ? 'Update' : 'Add'} Image
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageGallery;