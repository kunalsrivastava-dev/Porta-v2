'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { AuthStep1 } from '@/components/auth/AuthStep1';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  
  // Auth Steps: 1 (Email), 2 (Password/Register)
  const [step, setStep] = useState(1);
  const [authData, setAuthData] = useState<{
    email: string;
    registered: boolean;
    role?: string;
  } | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleVerified = (email: string, registered: boolean, role?: string) => {
    setAuthData({ email, registered, role });
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setAuthData(null);
  };

  return (
    <AuthLayout>
      {step === 1 && <AuthStep1 onVerified={handleVerified} />}
      
      {step === 2 && authData && (
        authData.registered ? (
          <LoginForm 
            email={authData.email} 
            onBack={handleBack} 
          />
        ) : (
          <RegisterForm 
            email={authData.email} 
            role={authData.role}
            onBack={handleBack} 
          />
        )
      )}
    </AuthLayout>
  );
}
