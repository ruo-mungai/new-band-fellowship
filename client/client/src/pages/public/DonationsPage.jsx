import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { HeartIcon, ShieldCheckIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';

const DonationsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [donationType, setDonationType] = useState('once');
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    enabled: true,
    minAmount: 100,
    maxAmount: 100000,
    currency: 'KES',
    paymentMethods: ['mpesa', 'card']
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // Fetch donation settings from your API
      const response = await fetch('/api/public/settings');
      const data = await response.json();
      if (data.donations) {
        setSettings(data.donations);
      }
    } catch (error) {
      console.error('Error fetching donation settings:', error);
    }
  };

  const presetAmounts = [500, 1000, 2000, 5000];

  const handleAmountSelect = (value) => {
    setAmount(value);
    setCustomAmount('');
  };

  const handleCustomAmount = (e) => {
    setCustomAmount(e.target.value);
    setAmount('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const finalAmount = amount || customAmount;
    
    if (!finalAmount) {
      toast.error('Please select an amount');
      return;
    }

    if (finalAmount < settings.minAmount) {
      toast.error(`Minimum donation is ${settings.currency} ${settings.minAmount}`);
      return;
    }

    if (finalAmount > settings.maxAmount) {
      toast.error(`Maximum donation is ${settings.currency} ${settings.maxAmount}`);
      return;
    }

    setLoading(true);

    try {
      // Process donation
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(isAuthenticated && { Authorization: `Bearer ${localStorage.getItem('accessToken')}` })
        },
        body: JSON.stringify({
          amount: finalAmount,
          type: donationType,
          currency: settings.currency
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Thank you for your donation!');
        setAmount('');
        setCustomAmount('');
      } else {
        toast.error(data.message || 'Donation failed');
      }
    } catch (error) {
      console.error('Donation error:', error);
      toast.error('Failed to process donation');
    } finally {
      setLoading(false);
    }
  };

  if (!settings.enabled) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <HeartIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Donations Temporarily Unavailable
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            We're currently updating our donation system. Please check back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Support Our Ministry - New Band Fellowship</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <HeartIcon className="h-16 w-16 mx-auto text-primary-600 mb-4" />
            <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">
              Support Our Ministry
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Your generous donations help us continue spreading the gospel through traditional Kikuyu music and fellowship.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Donation Form */}
            <Card>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Make a Donation
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Donation Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Donation Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setDonationType('once')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          donationType === 'once'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        One Time
                      </button>
                      <button
                        type="button"
                        onClick={() => setDonationType('monthly')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          donationType === 'monthly'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        Monthly
                      </button>
                    </div>
                  </div>

                  {/* Amount Presets */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Amount ({settings.currency})
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {presetAmounts.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => handleAmountSelect(preset)}
                          className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                            amount === preset
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {settings.currency} {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Amount */}
                  <Input
                    type="number"
                    label="Or enter custom amount"
                    placeholder={`${settings.currency} ${settings.minAmount} - ${settings.maxAmount}`}
                    value={customAmount}
                    onChange={handleCustomAmount}
                    min={settings.minAmount}
                    max={settings.maxAmount}
                  />

                  {/* Payment Methods */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Payment Methods
                    </h3>
                    <div className="space-y-2">
                      {settings.paymentMethods.includes('mpesa') && (
                        <label className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-700 rounded-lg">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="mpesa"
                            defaultChecked
                            className="h-4 w-4 text-primary-600"
                          />
                          <span className="text-gray-700 dark:text-gray-300">M-Pesa</span>
                        </label>
                      )}
                      {settings.paymentMethods.includes('card') && (
                        <label className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-700 rounded-lg">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="card"
                            className="h-4 w-4 text-primary-600"
                          />
                          <span className="text-gray-700 dark:text-gray-300">Credit/Debit Card</span>
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <LockClosedIcon className="h-4 w-4" />
                      <span>Secure Payment</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ShieldCheckIcon className="h-4 w-4" />
                      <span>SSL Encrypted</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    size="lg"
                    loading={loading}
                  >
                    Donate {amount || customAmount ? `${settings.currency} ${amount || customAmount}` : ''}
                  </Button>
                </form>

                {!isAuthenticated && (
                  <p className="mt-4 text-sm text-center text-gray-500 dark:text-gray-400">
                    You can donate as a guest or{' '}
                    <Link to="/login" className="text-primary-600 hover:text-primary-700">
                      sign in
                    </Link>{' '}
                    to track your donations.
                  </p>
                )}
              </div>
            </Card>

            {/* Impact Info */}
            <div className="space-y-6">
              <Card>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Where Your Money Goes
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 dark:text-primary-400 text-sm">1</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">
                        Supporting our worship services and fellowship events
                      </p>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 dark:text-primary-400 text-sm">2</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">
                        Preserving and recording traditional Kikuyu gospel music
                      </p>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 dark:text-primary-400 text-sm">3</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">
                        Community outreach and ministry programs
                      </p>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 dark:text-primary-400 text-sm">4</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">
                        Maintaining our fellowship facilities
                      </p>
                    </li>
                  </ul>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Tax Information
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    New Band Fellowship is a registered religious organization. All donations are tax-deductible.
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Registration Number: XXX-XXX-XXX
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DonationsPage;