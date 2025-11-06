"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return; // Do nothing while loading
    }
    if (user) {
      if (user.role === 'admin') {
        router.replace('/admin');
      } else if (user.role === 'student') {
        // If the student hasn't selected a year, force them to the onboarding page.
        if (!user.year) {
          router.replace('/student/onboarding');
        } else {
          // If year is selected, go to the main student page.
          router.replace('/student');
        }
      }
    } else {
      // If no user, send to login.
      router.replace('/login');
    }
  }, [user, loading, router]);
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
      <p className='ml-4'>جارِ توجيهك...</p>
    </div>
  );
}
