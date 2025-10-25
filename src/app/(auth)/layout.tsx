import { type ReactNode } from 'react';
import Link from 'next/link';
import { BookHeart } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center">
              <Link href="/" className="flex items-center gap-2 font-bold text-2xl">
                  <BookHeart className="h-8 w-8 text-primary" />
                  <span>فارسي هب</span>
              </Link>
          </div>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
