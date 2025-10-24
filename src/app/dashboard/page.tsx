"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Hourglass } from 'lucide-react';

function PendingApproval() {
  const { logout } = useAuth();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Hourglass className="h-10 w-10 text-primary" />
          </div>
          <CardTitle>حسابك قيد المراجعة</CardTitle>
          <CardDescription>
            شكراً لتسجيلك. حسابك في انتظار موافقة المسؤول. سيتم إعلامك عند تفعيل الحساب.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={logout} variant="outline">تسجيل الخروج</Button>
        </CardContent>
      </Card>
    </div>
  );
}


export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'admin') {
        router.replace('/admin');
      } else if (user.role === 'student' && user.approved) {
        router.replace('/student');
      }
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (user.role === 'student' && !user.approved) {
    return <PendingApproval />;
  }
  
  // This state is temporary while redirecting
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
    </div>
  );
}
