"use client";

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookHeart, Home, User, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Header } from '@/components/layout/header';


const navItems = [
  { href: '/student', label: 'لوحة التحكم', icon: Home },
  { href: '/student/profile', label: 'الملف الشخصي', icon: User },
];

export default function StudentLayout({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  if (loading) {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
    );
  }

  if (!user || user.role !== 'student' || !user.approved) {
    router.replace('/login');
    return null;
  }

  return (
    <>
    <Header />
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] p-4">
        <main className="flex-1 overflow-y-auto">
            {children}
        </main>
    </div>
    </>
  );
}
