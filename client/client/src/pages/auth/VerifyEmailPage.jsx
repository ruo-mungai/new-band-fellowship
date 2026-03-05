import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message);
        } else {
          setStatus('error');
          setMessage(data.error || 'Verification failed');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Verification failed. Please try again.');
      }
    };

    verifyEmail();
  }, [searchParams]);

  if (status === 'loading') {
    return <Loader fullScreen text="Verifying your email..." />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <Card className="max-w-md w-full">
        <div className="text-center">
          {status === 'success' ? (
            <>
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-100 dark:bg-green-900 mb-6">
                <CheckCircleIcon className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Email Verified!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                {message || 'Your email has been successfully verified.'}
              </p>
              <Link to="/login">
                <Button variant="primary">Go to Login</Button>
              </Link>
            </>
          ) : (
            <>
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-red-100 dark:bg-red-900 mb-6">
                <XCircleIcon className="h-10 w-10 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Verification Failed
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                {message || 'Email verification failed. Please try again.'}
              </p>
              <Link to="/login">
                <Button variant="primary">Back to Login</Button>
              </Link>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default VerifyEmailPage;