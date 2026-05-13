'use client';

import { useState } from 'react';
import { authAPI } from '@/lib/api/endpoints';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { ArrowRight } from 'lucide-react';

interface AuthStep1Props {
  onVerified: (email: string, registered: boolean, role?: string) => void;
}

export const AuthStep1 = ({ onVerified }: AuthStep1Props) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await authAPI.verifyEmail(email);
      const { approved, registered, role } = response.data;

      if (!approved) {
        setError('Unauthorized Access: This email address is not in our approved list.');
      } else {
        onVerified(email, registered, role);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 sm:p-10 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-black uppercase tracking-tight">Access Portal</h1>
        <p className="text-grey-600 mt-2 font-medium">
          Enter your approved email to continue.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Corporate Email"
          type="email"
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-14 border-4 border-black focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-bold"
        />

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-none text-sm font-bold">
            {error}
          </div>
        )}

        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full h-14 bg-black text-white hover:bg-grey-900 rounded-none text-lg font-black uppercase tracking-widest transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          {isLoading ? 'Checking Access...' : (
            <span className="flex items-center justify-center gap-2">
              Continue <ArrowRight size={20} />
            </span>
          )}
        </Button>
      </form>
    </Card>
  );
};
