import React, { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import {
  PhotoIcon,
  DocumentTextIcon,
  RocketLaunchIcon,
  EyeIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import TextArea from '@/components/common/TextArea';
import ImageUpload from '@/components/admin/ImageUpload';
import { adminService } from '@/services/adminService';
import { toast } from 'react-hot-toast';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const ManageLanding = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [content, setContent] = useState({
    hero: {
      title: '',
      subtitle: '',
      backgroundImage: '',
      buttonText: '',
      buttonLink: '',
    },
    about: {
      title: '',
      content: '',
      imageUrl: '',
    },
    mission: {
      title: '',
      content: '',
    },
    vision: {
      title: '',
      content: '',
    },
    siteTitle: '',
    logo: '',
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const data = await adminService.landing.get();
      setContent(data);
    } catch (error) {
      toast.error('Failed to fetch landing content');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (section) => {
    setSaving(true);
    try {
      await adminService.landing.update(section, content[section]);
      toast.success(`${section} section updated successfully`);
    } catch (error) {
      toast.error(`Failed to update ${section} section`);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file, section, field) => {
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const { url } = await adminService.landing.uploadImage(formData);
      setContent({
        ...content,
        [section]: {
          ...content[section],
          [field]: url,
        },
      });
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
    }
  };

  const tabs = [
    {
      name: 'Hero Section',
      icon: RocketLaunchIcon,
      content: (
        <div className="space-y-6">
          <Input
            label="Hero Title"
            value={content.hero.title}
            onChange={(e) => setContent({
              ...content,
              hero: { ...content.hero, title: e.target.value }
            })}
            placeholder="Welcome to New Band Fellowship"
          />
          
          <Input
            label="Hero Subtitle"
            value={content.hero.subtitle}
            onChange={(e) => setContent({
              ...content,
              hero: { ...content.hero, subtitle: e.target.value }
            })}
            placeholder="Experience the beauty of worship..."
          />
          
          <ImageUpload
            label="Background Image"
            value={content.hero.backgroundImage}
            onUpload={(file) => handleImageUpload(file, 'hero', 'backgroundImage')}
            onRemove={() => setContent({
              ...content,
              hero: { ...content.hero, backgroundImage: '' }
            })}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Button Text"
              value={content.hero.buttonText}
              onChange={(e) => setContent({
                ...content,
                hero: { ...content.hero, buttonText: e.target.value }
              })}
              placeholder="Join Us"
            />
            <Input
              label="Button Link"
              value={content.hero.buttonLink}
              onChange={(e) => setContent({
                ...content,
                hero: { ...content.hero, buttonLink: e.target.value }
              })}
              placeholder="/events"
            />
          </div>
          
          <div className="flex justify-end">
            <Button
              onClick={() => handleSave('hero')}
              loading={saving}
            >
              Save Changes
            </Button>
          </div>
        </div>
      ),
    },
    {
      name: 'About Section',
      icon: DocumentTextIcon,
      content: (
        <div className="space-y-6">
          <Input
            label="About Title"
            value={content.about.title}
            onChange={(e) => setContent({
              ...content,
              about: { ...content.about, title: e.target.value }
            })}
            placeholder="About New Band Fellowship"
          />
          
          <TextArea
            label="About Content"
            value={content.about.content}
            onChange={(e) => setContent({
              ...content,
              about: { ...content.about, content: e.target.value }
            })}
            rows={6}
            placeholder="Tell your story..."
          />
          
          <ImageUpload
            label="About Image"
            value={content.about.imageUrl}
            onUpload={(file) => handleImageUpload(file, 'about', 'imageUrl')}
            onRemove={() => setContent({
              ...content,
              about: { ...content.about, imageUrl: '' }
            })}
          />
          
          <div className="flex justify-end">
            <Button
              onClick={() => handleSave('about')}
              loading={saving}
            >
              Save Changes
            </Button>
          </div>
        </div>
      ),
    },
    {
      name: 'Mission & Vision',
      icon: ArrowPathIcon,
      content: (
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Mission</h3>
            <Input
              label="Mission Title"
              value={content.mission.title}
              onChange={(e) => setContent({
                ...content,
                mission: { ...content.mission, title: e.target.value }
              })}
              placeholder="Our Mission"
            />
            <TextArea
              label="Mission Content"
              value={content.mission.content}
              onChange={(e) => setContent({
                ...content,
                mission: { ...content.mission, content: e.target.value }
              })}
              rows={4}
              placeholder="Describe your mission..."
            />
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Vision</h3>
            <Input
              label="Vision Title"
              value={content.vision.title}
              onChange={(e) => setContent({
                ...content,
                vision: { ...content.vision, title: e.target.value }
              })}
              placeholder="Our Vision"
            />
            <TextArea
              label="Vision Content"
              value={content.vision.content}
              onChange={(e) => setContent({
                ...content,
                vision: { ...content.vision, content: e.target.value }
              })}
              rows={4}
              placeholder="Describe your vision..."
            />
          </div>
          
          <div className="flex justify-end">
            <Button
              onClick={() => {
                handleSave('mission');
                handleSave('vision');
              }}
              loading={saving}
            >
              Save Changes
            </Button>
          </div>
        </div>
      ),
    },
    {
      name: 'Site Settings',
      icon: PhotoIcon,
      content: (
        <div className="space-y-6">
          <Input
            label="Site Title"
            value={content.siteTitle}
            onChange={(e) => setContent({
              ...content,
              siteTitle: e.target.value
            })}
            placeholder="New Band Fellowship"
          />
          
          <ImageUpload
            label="Site Logo"
            value={content.logo}
            onUpload={(file) => handleImageUpload(file, 'logo', 'logo')}
            onRemove={() => setContent({
              ...content,
              logo: ''
            })}
          />
          
          <div className="flex justify-end">
            <Button
              onClick={() => handleSave('settings')}
              loading={saving}
            >
              Save Changes
            </Button>
          </div>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Manage Landing Page
        </h1>
        <Button
          variant="outline"
          onClick={() => setPreviewMode(!previewMode)}
          icon={EyeIcon}
        >
          {previewMode ? 'Edit Mode' : 'Preview Mode'}
        </Button>
      </div>

      {previewMode ? (
        <Card>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2 className="text-3xl font-bold">{content.hero.title}</h2>
            <p className="text-xl">{content.hero.subtitle}</p>
            
            <hr className="my-8" />
            
            <h3>{content.about.title}</h3>
            <p>{content.about.content}</p>
            
            <hr className="my-8" />
            
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4>{content.mission.title}</h4>
                <p>{content.mission.content}</p>
              </div>
              <div>
                <h4>{content.vision.title}</h4>
                <p>{content.vision.content}</p>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Card>
          <Tab.Group>
            <Tab.List className="flex border-b border-gray-200 dark:border-gray-700">
              {tabs.map((tab, idx) => (
                <Tab
                  key={idx}
                  className={({ selected }) =>
                    classNames(
                      'flex-1 py-4 px-6 text-sm font-medium focus:outline-none',
                      selected
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    )
                  }
                >
                  <div className="flex items-center justify-center space-x-2">
                    <tab.icon className="h-5 w-5" />
                    <span>{tab.name}</span>
                  </div>
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className="p-6">
              {tabs.map((tab, idx) => (
                <Tab.Panel key={idx}>
                  {tab.content}
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </Card>
      )}
    </div>
  );
};

export default ManageLanding;