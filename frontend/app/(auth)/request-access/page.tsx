'use client';

import { AuthLayout } from '@/components/layout/AuthLayout';
import { RequestAccessForm } from '@/components/auth/RequestAccessForm';

export default function RequestAccessPage() {
  return (
    <AuthLayout>
      <RequestAccessForm />
    </AuthLayout>
  );
}
