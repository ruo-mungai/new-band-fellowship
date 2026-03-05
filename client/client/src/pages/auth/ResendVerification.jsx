import React, { useState } from 'react';
import Button from '@/components/common/Button';
import { toast } from 'react-hot-toast';

const ResendVerification = ({ email }) => {
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error('Failed to resend verification');
      
      toast.success('Verification email resent. Please check your inbox.');
    } catch (error) {
      toast.error('Failed to resend verification email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center mt-4">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
        Didn't receive verification email?
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={handleResend}
        loading={loading}
      >
        Resend Verification Email
      </Button>
    </div>
  );
};

export default ResendVerification;