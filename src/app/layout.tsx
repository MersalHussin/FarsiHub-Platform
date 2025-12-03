
import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from '@/context/app-providers';
import { Toaster } from '@/components/ui/toaster';


export const metadata: Metadata = {
  title: 'Farsi Hub | فارسي هب',
  description: 'منصة تعليمية لطلاب قسم اللغة الفارسية - جامعة القاهرة',
  metadataBase: new URL('https://farsi-hub.com'), // Replace with your actual domain
  openGraph: {
    title: 'Farsi Hub | فارسي هب',
    description: 'منصة تعليمية لطلاب قسم اللغة الفارسية - جامعة القاهرة',
    images: [
      {
        url: 'https://i.suar.me/evQjQ/l',
        width: 1200,
        height: 630,
        alt: 'Farsi Hub Logo',
      },
    ],
    locale: 'ar_EG',
    type: 'website',
  },
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
        <AppProviders>
          {children}
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}
