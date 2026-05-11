'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api/endpoints';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Check } from 'lucide-react';
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

    // Validate passwords match
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
      setSuccess(true);

      // Redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="p-8 text-center border-4 border-black">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-black text-white rounded-full">
            <Check size={48} />
          </div>
        </div>
        <h2 className="text-xl font-black text-black mb-2 uppercase">Success!</h2>
        <p className="text-grey-600">Redirecting to dashboard...</p>
      </Card>
    );
  }

  return (
    <Card className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">Create Account</h1>
        <p className="text-grey-600 mt-2">Join PORTA</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          name="name"
          placeholder="John Doe"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="At least 6 characters"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full"
        >
          Create Account
        </Button>
      </form>

      <div className="mt-6">
        <p className="text-center text-sm text-grey-600">
          Already have an account?{' '}
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
