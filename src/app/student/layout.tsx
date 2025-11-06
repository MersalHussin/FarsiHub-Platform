"use client";

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, FileQuestion, Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';


const navItems = [
  { href: '/student', label: 'لوحة التحكم', icon: Home },
  { href: '/student/quizzes', label: 'نتائج الاختبارات', icon: FileQuestion },
  { href: '/student/profile', label: 'الملف الشخصي', icon: User },
];

export default function StudentLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    if (!loading) {
        if (!user || user.role !== 'student' || !user.approved) {
            router.replace('/login');
        }
    }
  }, [user, loading, router]);


  if (loading || !user || !user.approved) {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
        <aside className="w-full md:w-64 border-b md:border-b-0 md:border-l p-4">
          <nav className="flex flex-row md:flex-col gap-2">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                asChild
                className={cn(
                  'justify-start gap-2 flex-1 md:flex-none',
                  pathname === item.href && 'bg-accent text-accent-foreground'
                )}
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>
        </aside>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
        </main>
      </div>
    </>
  );
}
