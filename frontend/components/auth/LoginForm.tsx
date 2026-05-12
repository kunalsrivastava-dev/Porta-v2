'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api/endpoints';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { ChevronLeft, Lock } from 'lucide-react';
import Cookies from 'js-cookie';

interface LoginFormProps {
  email: string;
  onBack: () => void;
}

export const LoginForm = ({ email, onBack }: LoginFormProps) => {
  const router = useRouter();
  const { setUser, setToken, setAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authAPI.login({ email, password });
      const { token, user } = response.data;

      Cookies.set('token', token, {
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      setToken(token);
      setUser(user);
      setAuthenticated(true);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 sm:p-10 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
      <div className="mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-grey-400 hover:text-black transition-colors mb-4"
        >
          <ChevronLeft size={14} /> Back
        </button>
        <h1 className="text-3xl font-black text-black uppercase tracking-tight">Security Check</h1>
        <p className="text-grey-600 mt-2 font-medium">
          Welcome back, <span className="text-black font-bold">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          {isLoading ? 'Authenticating...' : (
            <span className="flex items-center justify-center gap-2">
              <Lock size={18} /> Establish Session
            </span>
          )}
        </Button>
      </form>
    </Card>
  );
};
