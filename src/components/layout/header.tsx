"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, BookHeart, LayoutDashboard } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Header() {
  const { user, loading, logout } = useAuth();
  const isMobile = useIsMobile();
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'الرئيسية' },
    { href: '/lectures', label: 'المحاضرات' },
    { href: '/assignments', label: 'التكليفات' },
  ];

  const NavLinks = ({ isMobile = false }) => (
    <>
      {navItems.map((item) => (
        <Button
          key={item.href}
          variant="link"
          asChild
          className={cn(
            'text-foreground/80 hover:text-foreground hover:no-underline',
            { 'text-primary font-bold': pathname === item.href },
            isMobile && 'w-full justify-start text-base'
          )}
        >
          <Link href={item.href}>{item.label}</Link>
        </Button>
      ))}
      {user?.role === 'admin' && (
         <Button
          variant="link"
          asChild
          className={cn(
            'text-foreground/80 hover:text-foreground hover:no-underline',
             isMobile && 'w-full justify-start text-base'
          )}
        >
          <Link href="/admin">
            <LayoutDashboard className="ml-2 h-4 w-4" />
            لوحة التحكم
          </Link>
        </Button>
      )}
    </>
  );

  const AuthButtons = ({ isMobile = false }) => (
    <div className={cn("flex items-center gap-2", isMobile && 'flex-col w-full mt-4 pt-4 border-t')}>
      {loading ? null : user ? (
        <>
           <Button variant={isMobile ? 'outline' : 'ghost'} asChild className={cn(isMobile && 'w-full')}>
            <Link href="/dashboard">حسابي</Link>
          </Button>
          <Button onClick={logout} variant={isMobile ? "default" : "secondary"} className={cn(isMobile && 'w-full')}>
            تسجيل الخروج
          </Button>
        </>
      ) : (
        <>
          <Button variant="ghost" asChild  className={cn(isMobile && 'w-full')}>
            <Link href="/login">تسجيل الدخول</Link>
          </Button>
          <Button asChild  className={cn(isMobile && 'w-full')}>
            <Link href="/signup">سجل الآن</Link>
          </Button>
        </>
      )}
    </div>
  );


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <BookHeart className="h-7 w-7 text-primary" />
          <span>فارسي هب</span>
        </Link>

        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-2 mt-8">
                <NavLinks isMobile={true}/>
              </nav>
               <AuthButtons isMobile={true}/>
            </SheetContent>
          </Sheet>
        ) : (
          <div className='flex items-center gap-4'>
             <nav className="flex items-center gap-2">
              <NavLinks />
            </nav>
            <AuthButtons />
          </div>
        )}
      </div>
    </header>
  );
}
