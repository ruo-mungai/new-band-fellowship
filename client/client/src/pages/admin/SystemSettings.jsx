import React, { useState, useEffect } from 'react';
import {
  Cog6ToothIcon,
  BellIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  CameraIcon,
} from '@heroicons/react/24/outline';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import { adminService } from '@/services/adminService';
import { toast } from 'react-hot-toast';

const SystemSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'New Band Fellowship',
    siteDescription: 'Worship fellowship in Ruiru Town',
    siteEmail: 'info@newband.org',
    sitePhone: '+254700000000',
    siteAddress: 'Ruiru Town, Kenya',
    
    // Feature Toggles
    allowRegistration: true,
    requireApproval: true,
    enableDonations: false,
    enableLiveStreaming: false,
    enableRSVP: true,
    enableComments: true,
    
    // Voting Mode
    voteMode: 'DISABLED', // ENABLED, DISABLED, HYBRID
    
    // Email Settings
    smtpHost: '',
    smtpPort: '',
    smtpUser: '',
    smtpPass: '',
    smtpFrom: '',
    
    // Social Media
    facebook: '',
    twitter: '',
    instagram: '',
    youtube: '',
    
    // SEO
    metaTitle: 'New Band Fellowship - Worship Together in Ruiru',
    metaDescription: 'Join us for worship fellowship in Ruiru Town. Experience Nyimbo cia Agendi and old Kikuyu gospel songs.',
    metaKeywords: 'worship, fellowship, gospel, kikuyu, ruiru',
    
    // Security
    sessionTimeout: 30, // minutes
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    
    // Donations
    currency: 'KES',
    minDonation: 100,
    maxDonation: 100000,
    paymentGateway: 'mpesa',
    
    // Notifications
    notifyNewUser: true,
    notifyNewRequest: true,
    notifyNewComment: true,
    notifyNewDonation: true,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await adminService.settings.get();
      setSettings(data);
    } catch (error) {
      toast.error('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminService.settings.update(settings);
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', name: 'General', icon: Cog6ToothIcon },
    { id: 'features', name: 'Features', icon: GlobeAltIcon },
    { id: 'email', name: 'Email', icon: EnvelopeIcon },
    { id: 'social', name: 'Social Media', icon: CameraIcon },
    { id: 'seo', name: 'SEO', icon: GlobeAltIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'donations', name: 'Donations', icon: CurrencyDollarIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Settings</h1>
        <Button onClick={handleSave} loading={saving}>
          Save Changes
        </Button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          <Card>
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-900 dark:text-primary-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1">
          <Card>
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">General Settings</h2>
                
                <Input
                  label="Site Name"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                />
                
                <Input
                  label="Site Description"
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                />
                
                <Input
                  label="Contact Email"
                  type="email"
                  value={settings.siteEmail}
                  onChange={(e) => setSettings({ ...settings, siteEmail: e.target.value })}
                />
                
                <Input
                  label="Contact Phone"
                  value={settings.sitePhone}
                  onChange={(e) => setSettings({ ...settings, sitePhone: e.target.value })}
                />
                
                <Input
                  label="Address"
                  value={settings.siteAddress}
                  onChange={(e) => setSettings({ ...settings, siteAddress: e.target.value })}
                />
              </div>
            )}

            {/* Features */}
            {activeTab === 'features' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Feature Toggles</h2>
                
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Allow Registration</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Enable new user registration</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.allowRegistration}
                      onChange={(e) => setSettings({ ...settings, allowRegistration: e.target.checked })}
                      className="h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Require Approval</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">New users need admin approval</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.requireApproval}
                      onChange={(e) => setSettings({ ...settings, requireApproval: e.target.checked })}
                      className="h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Enable Donations</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Accept online donations</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.enableDonations}
                      onChange={(e) => setSettings({ ...settings, enableDonations: e.target.checked })}
                      className="h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Enable Live Streaming</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Show live stream on website</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.enableLiveStreaming}
                      onChange={(e) => setSettings({ ...settings, enableLiveStreaming: e.target.checked })}
                      className="h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Enable RSVP</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Allow users to RSVP for events</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.enableRSVP}
                      onChange={(e) => setSettings({ ...settings, enableRSVP: e.target.checked })}
                      className="h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Enable Comments</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Allow comments on blog posts</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.enableComments}
                      onChange={(e) => setSettings({ ...settings, enableComments: e.target.checked })}
                      className="h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
                    />
                  </label>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Voting Mode
                  </label>
                  <Select
                    value={settings.voteMode}
                    onChange={(e) => setSettings({ ...settings, voteMode: e.target.value })}
                    options={[
                      { value: 'DISABLED', label: 'Disabled (First-come, first-served)' },
                      { value: 'ENABLED', label: 'Enabled (Community voting)' },
                      { value: 'HYBRID', label: 'Hybrid (Admin can override)' },
                    ]}
                  />
                </div>
              </div>
            )}

            {/* Email Settings */}
            {activeTab === 'email' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Email Settings</h2>
                
                <Input
                  label="SMTP Host"
                  value={settings.smtpHost}
                  onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                />
                
                <Input
                  label="SMTP Port"
                  type="number"
                  value={settings.smtpPort}
                  onChange={(e) => setSettings({ ...settings, smtpPort: e.target.value })}
                />
                
                <Input
                  label="SMTP Username"
                  value={settings.smtpUser}
                  onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })}
                />
                
                <Input
                  label="SMTP Password"
                  type="password"
                  value={settings.smtpPass}
                  onChange={(e) => setSettings({ ...settings, smtpPass: e.target.value })}
                />
                
                <Input
                  label="From Email"
                  type="email"
                  value={settings.smtpFrom}
                  onChange={(e) => setSettings({ ...settings, smtpFrom: e.target.value })}
                />
              </div>
            )}

            {/* Social Media */}
            {activeTab === 'social' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Social Media Links</h2>
                
                <Input
                  label="Facebook URL"
                  value={settings.facebook}
                  onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                  placeholder="https://facebook.com/newbandfellowship"
                />
                
                <Input
                  label="Twitter URL"
                  value={settings.twitter}
                  onChange={(e) => setSettings({ ...settings, twitter: e.target.value })}
                  placeholder="https://twitter.com/newband"
                />
                
                <Input
                  label="Instagram URL"
                  value={settings.instagram}
                  onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                  placeholder="https://instagram.com/newband"
                />
                
                <Input
                  label="YouTube URL"
                  value={settings.youtube}
                  onChange={(e) => setSettings({ ...settings, youtube: e.target.value })}
                  placeholder="https://youtube.com/@newband"
                />
              </div>
            )}

            {/* SEO Settings */}
            {activeTab === 'seo' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">SEO Settings</h2>
                
                <Input
                  label="Meta Title"
                  value={settings.metaTitle}
                  onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })}
                />
                
                <Input
                  label="Meta Description"
                  value={settings.metaDescription}
                  onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                />
                
                <Input
                  label="Meta Keywords"
                  value={settings.metaKeywords}
                  onChange={(e) => setSettings({ ...settings, metaKeywords: e.target.value })}
                  placeholder="worship, fellowship, gospel, kikuyu"
                />
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Security Settings</h2>
                
                <Input
                  label="Session Timeout (minutes)"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
                />
                
                <Input
                  label="Max Login Attempts"
                  type="number"
                  value={settings.maxLoginAttempts}
                  onChange={(e) => setSettings({ ...settings, maxLoginAttempts: parseInt(e.target.value) })}
                />
                
                <Input
                  label="Minimum Password Length"
                  type="number"
                  value={settings.passwordMinLength}
                  onChange={(e) => setSettings({ ...settings, passwordMinLength: parseInt(e.target.value) })}
                />
              </div>
            )}

            {/* Donations Settings */}
            {activeTab === 'donations' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Donations Settings</h2>
                
                <Select
                  label="Currency"
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  options={[
                    { value: 'KES', label: 'KES - Kenyan Shilling' },
                    { value: 'USD', label: 'USD - US Dollar' },
                    { value: 'EUR', label: 'EUR - Euro' },
                  ]}
                />
                
                <Input
                  label="Minimum Donation"
                  type="number"
                  value={settings.minDonation}
                  onChange={(e) => setSettings({ ...settings, minDonation: parseInt(e.target.value) })}
                />
                
                <Input
                  label="Maximum Donation"
                  type="number"
                  value={settings.maxDonation}
                  onChange={(e) => setSettings({ ...settings, maxDonation: parseInt(e.target.value) })}
                />
                
                <Select
                  label="Payment Gateway"
                  value={settings.paymentGateway}
                  onChange={(e) => setSettings({ ...settings, paymentGateway: e.target.value })}
                  options={[
                    { value: 'mpesa', label: 'M-Pesa' },
                    { value: 'stripe', label: 'Stripe' },
                    { value: 'paypal', label: 'PayPal' },
                  ]}
                />
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Notification Settings</h2>
                
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">New User Registration</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Notify when new user registers</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifyNewUser}
                      onChange={(e) => setSettings({ ...settings, notifyNewUser: e.target.checked })}
                      className="h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">New Song Request</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Notify when song is requested</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifyNewRequest}
                      onChange={(e) => setSettings({ ...settings, notifyNewRequest: e.target.checked })}
                      className="h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">New Comment</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Notify when comment is posted</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifyNewComment}
                      onChange={(e) => setSettings({ ...settings, notifyNewComment: e.target.checked })}
                      className="h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">New Donation</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Notify when donation is received</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifyNewDonation}
                      onChange={(e) => setSettings({ ...settings, notifyNewDonation: e.target.checked })}
                      className="h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
                    />
                  </label>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;