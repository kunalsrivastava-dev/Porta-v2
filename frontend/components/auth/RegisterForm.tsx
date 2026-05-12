'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api/endpoints';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Check, ChevronLeft, UserPlus } from 'lucide-react';
import Cookies from 'js-cookie';

interface RegisterFormProps {
  email: string;
  role?: string;
  onBack: () => void;
}

export const RegisterForm = ({ email, role, onBack }: RegisterFormProps) => {
  const router = useRouter();
  const { setUser, setToken, setAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
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
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await authAPI.register({
        email,
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
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="p-6 sm:p-10 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center bg-white">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-20 h-20 bg-black text-white flex items-center justify-center">
            <Check size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-black uppercase tracking-tight">Identity Established</h2>
            <p className="text-grey-600 font-medium">
              Welcome, <span className="font-bold text-black">{formData.name}</span>. Your {role} access is active.
            </p>
          </div>
          <p className="text-sm text-grey-500 animate-pulse uppercase font-black tracking-widest">Initializing Environment...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 sm:p-10 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
      <div className="mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-grey-400 hover:text-black transition-colors mb-4"
        >
          <ChevronLeft size={14} /> Back
        </button>
        <h1 className="text-3xl font-black text-black uppercase tracking-tight">Setup Account</h1>
        <p className="text-grey-600 mt-2 font-medium">
          Completing registration for <span className="text-black font-bold">{email}</span>
        </p>
        <div className="mt-4 inline-block px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest">
          Assigned Role: {role}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Full Name"
          type="text"
          name="name"
          placeholder="Operational Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="h-14 border-4 border-black focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-bold"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Min 6 characters"
            value={formData.password}
            onChange={handleChange}
            required
            className="h-14 border-4 border-black focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-bold"
          />

          <Input
            label="Confirm"
            type="password"
            name="confirmPassword"
            placeholder="Repeat Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="h-14 border-4 border-black focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-bold"
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
          {isLoading ? 'Creating Account...' : (
            <span className="flex items-center justify-center gap-2">
              <UserPlus size={18} /> Finalize Identity
            </span>
          )}
        </Button>
      </form>
    </Card>
  );
};
