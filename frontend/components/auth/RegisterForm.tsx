'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api/endpoints';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Check, ChevronLeft } from 'lucide-react';
import Cookies from 'js-cookie';

export const RegisterForm = () => {
  const router = useRouter();
  const { setUser, setToken, setAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await authAPI.register({
        email: formData.email,
        name: formData.name,
        password: formData.password,
      });

      const { token, user } = response.data;

      Cookies.set('token', token, {
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      setToken(token);
      setUser(user);
      setAuthenticated(true);
      setSuccess(true);

      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Is your email approved?');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="p-6 sm:p-10 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center shadow-lg animate-bounce">
            <Check size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-black uppercase tracking-tight">Identity Verified</h2>
            <p className="text-grey-600 font-medium">
              Welcome to the grid, <span className="font-bold text-black">{formData.name}</span>.
            </p>
          </div>
          <p className="text-sm text-grey-500 animate-pulse">Initializing operational environment...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 sm:p-10 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-black uppercase tracking-tight">Establish Account</h1>
        <p className="text-grey-600 mt-2 font-medium">
          Only approved emails can proceed with registration.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Full Name"
          type="text"
          name="name"
          placeholder="John Doe"
          value={formData.name}
          onChange={handleChange}
          required
          className="h-12 border-2 border-grey-200 focus:border-black transition-colors"
        />

        <Input
          label="Approved Email"
          type="email"
          name="email"
          placeholder="name@company.com"
          value={formData.email}
          onChange={handleChange}
          required
          className="h-12 border-2 border-grey-200 focus:border-black transition-colors"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Min 6 chars"
            value={formData.password}
            onChange={handleChange}
            required
            className="h-12 border-2 border-grey-200 focus:border-black transition-colors"
          />

          <Input
            label="Confirm"
            type="password"
            name="confirmPassword"
            placeholder="Repeat pass"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="h-12 border-2 border-grey-200 focus:border-black transition-colors"
          />
        </div>

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
          {isLoading ? 'Processing...' : 'Activate Account'}
        </Button>
      </form>

      <div className="mt-8 pt-8 border-t-2 border-grey-100 text-center">
        <Link
          href="/login"
          className="text-black font-black text-sm uppercase tracking-wider hover:underline inline-flex items-center"
        >
          <ChevronLeft size={16} className="mr-1" /> Back to Sign In
        </Link>
      </div>
    </Card>
  );
};
