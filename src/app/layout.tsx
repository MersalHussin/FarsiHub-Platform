import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/auth-context';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Farsi Hub | فارسي هب',
  description: 'منصة تعليمية لطلاب قسم اللغة الفارسية - جامعة القاهرة',
  icons: {
    icon: 'https://i.suar.me/lpqVn/l',
  },
  // This will prevent Next.js from generating a default favicon.ico
  // and force it to use the one specified above.
  metadataBase: new URL(process.env.NODE_ENV === 'production' ? 'https://farsi-hub-app.vercel.app' : 'http://localhost:9002'),
  alternates: {
    canonical: '/',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Zain:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
