'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api/endpoints';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import Cookies from 'js-cookie';

export const LoginForm = () => {
  const router = useRouter();
  const { setUser, setToken, setAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authAPI.login(formData);
      const { token, user } = response.data;

      // Set token in cookie
      Cookies.set('token', token, {
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      // Update store
      setToken(token);
      setUser(user);
      setAuthenticated(true);

      // Redirect based on role
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 sm:p-10 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Operational Email"
          type="email"
          name="email"
          placeholder="name@company.com"
          value={formData.email}
          onChange={handleChange}
          required
          className="h-12 border-2 border-grey-200 focus:border-black transition-colors"
        />

        <Input
          label="Security Password"
          type="password"
          name="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          required
          className="h-12 border-2 border-grey-200 focus:border-black transition-colors"
        />

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-none text-sm font-bold animate-shake">
            {error}
          </div>
        )}

        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full h-14 bg-black text-white hover:bg-grey-900 rounded-none text-lg font-black uppercase tracking-widest transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-none"
        >
          {isLoading ? 'Authenticating...' : 'Establish Session'}
        </Button>
      </form>

      <div className="mt-8 pt-8 border-t-2 border-grey-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-grey-500 font-medium">
          New Operator?
        </p>
        <Link
          href="/request-access"
          className="text-black font-black text-sm uppercase tracking-wider hover:underline"
        >
          Request Access
        </Link>
      </div>
    </Card>
  );
};
