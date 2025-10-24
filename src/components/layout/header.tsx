"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, BookHeart } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export function Header() {
  const { user, loading, logout } = useAuth();
  const isMobile = useIsMobile();

  const navLinks = (
    <>
      {user ? (
        <>
          <Button variant="ghost" asChild>
            <Link href="/dashboard">لوحة التحكم</Link>
          </Button>
          <Button onClick={logout}>تسجيل الخروج</Button>
        </>
      ) : (
        <>
          <Button variant="ghost" asChild>
            <Link href="/login">تسجيل الدخول</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">سجل الآن</Link>
          </Button>
        </>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <BookHeart className="h-7 w-7 text-primary" />
          <span>فارسي هب</span>
        </Link>

        {loading ? null : isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks}
              </nav>
            </SheetContent>
          </Sheet>
        ) : (
          <nav className="flex items-center gap-4">
            {navLinks}
          </nav>
        )}
      </div>
    </header>
  );
}
