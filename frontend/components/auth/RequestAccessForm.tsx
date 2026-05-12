'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authAPI } from '@/lib/api/endpoints';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Check, FileText, ChevronLeft } from 'lucide-react';

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
    setError('');
    try {
      const response = await authAPI.checkEmailStatus(email);
      if (response.data.isApproved) {
        setRequestStatus('approved');
      } else {
        setRequestStatus('pending');
      }
    } catch (err: any) {
      setError('No request found for this email.');
      setRequestStatus(null);
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
      <Card className="p-6 sm:p-10 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center shadow-lg">
            <Check size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-black uppercase tracking-tight">Approved!</h2>
            <p className="text-grey-600 font-medium max-w-xs">
              Your email <span className="font-bold text-black">{email}</span> is cleared for registration.
            </p>
          </div>
          <Link href="/register" className="w-full">
            <Button className="w-full h-14 bg-black text-white hover:bg-grey-900 rounded-none text-lg font-black uppercase tracking-widest">
              Create Account
            </Button>
          </Link>
          <Link href="/login" className="flex items-center text-sm font-bold uppercase tracking-widest hover:underline">
            <ChevronLeft size={16} className="mr-1" /> Back to Sign In
          </Link>
        </div>
      </Card>
    );
  }

  if (success || requestStatus === 'pending') {
    return (
      <Card className="p-6 sm:p-10 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-20 h-20 bg-grey-100 text-black rounded-full flex items-center justify-center shadow-inner border-2 border-black">
            <FileText size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-black uppercase tracking-tight">Request Logged</h2>
            <p className="text-grey-600 font-medium">
              We&apos;ve received your request for <span className="font-bold text-black">{email}</span>.
            </p>
          </div>
          <div className="py-2 px-4 border-2 border-black bg-yellow-100 font-bold uppercase tracking-widest text-xs">
            Status: Pending Approval
          </div>
          <p className="text-sm text-grey-500 italic max-w-xs">
            An administrator will review your credentials shortly. You will be able to register once approved.
          </p>
          <Link href="/login" className="w-full">
            <Button variant="secondary" className="w-full h-14 border-2 border-black rounded-none text-lg font-black uppercase tracking-widest">
              Return to Login
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 sm:p-10 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-black uppercase tracking-tight">Request Access</h1>
        <p className="text-grey-600 mt-2 font-medium">
          New operators must be cleared by HQ before account creation.
        </p>
      </div>

      <form onSubmit={handleRequestAccess} className="space-y-6">
        <Input
          label="Operational Email"
          type="email"
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-12 border-2 border-grey-200 focus:border-black transition-colors"
        />

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-none text-sm font-bold">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3 pt-2">
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full h-14 bg-black text-white hover:bg-grey-900 rounded-none text-lg font-black uppercase tracking-widest transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            Submit Request
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleCheckStatus}
            isLoading={isLoading}
            className="w-full h-14 border-2 border-black bg-white text-black hover:bg-grey-50 rounded-none text-lg font-black uppercase tracking-widest"
          >
            Check My Status
          </Button>
        </div>
      </form>

      <div className="mt-8 pt-8 border-t-2 border-grey-100 text-center">
        <Link
          href="/login"
          className="text-black font-black text-sm uppercase tracking-wider hover:underline inline-flex items-center"
        >
          <ChevronLeft size={16} className="mr-1" /> Already Have Access? Sign In
        </Link>
      </div>
    </Card>
  );
};
