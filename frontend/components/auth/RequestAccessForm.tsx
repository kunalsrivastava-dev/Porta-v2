'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authAPI } from '@/lib/api/endpoints';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Check, FileText } from 'lucide-react';

export const RequestAccessForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [requestStatus, setRequestStatus] = useState<'pending' | 'approved' | null>(null);

  const handleCheckStatus = async () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authAPI.checkEmailStatus(email);
      if (response.data.isApproved) {
        setRequestStatus('approved');
      } else {
        setRequestStatus('pending');
      }
    } catch (err: any) {
      setError('Error checking status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      await authAPI.requestAccess(email);
      setSuccess(true);
      setRequestStatus('pending');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setIsLoading(false);
    }
  };

  if (requestStatus === 'approved') {
    return (
      <Card className="p-8 border-4 border-black text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-black text-white rounded-full">
            <Check size={48} />
          </div>
          <h2 className="text-xl font-black text-black uppercase">Email Approved!</h2>
          <p className="text-grey-600">
            Your email has been approved. You can now create an account.
          </p>
          <Link href="/register">
            <Button className="w-full">Create Account</Button>
          </Link>
          <p className="text-sm text-grey-600">
            Already have an account?{' '}
            <Link href="/login" className="text-black font-medium hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </Card>
    );
  }

  if (success) {
    return (
      <Card className="p-8 border-4 border-black text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-black text-white rounded-full">
            <FileText size={48} />
          </div>
          <h2 className="text-xl font-black text-black uppercase">Request Submitted!</h2>
          <p className="text-grey-600">
            Your access request has been sent to the admin. Please wait for approval.
          </p>
          <Badge variant="info">Status: Pending</Badge>
          <Link href="/login">
            <Button variant="secondary" className="w-full">Back to Login</Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">Request Access</h1>
        <p className="text-grey-600 mt-2">
          Enter your email to request access to PORTA
        </p>
      </div>

      <form onSubmit={handleRequestAccess} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCheckStatus}
            isLoading={isLoading}
            className="w-full"
          >
            Check Status
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full"
          >
            Request Access
          </Button>
        </div>
      </form>

      <div className="mt-6">
        <p className="text-center text-sm text-grey-600">
          Have access?{' '}
          <Link
            href="/login"
            className="text-black font-medium hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </Card>
  );
};
