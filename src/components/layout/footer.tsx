import React from 'react';

export function Footer() {
  return (
    <footer className="w-full border-t bg-card">
      <div className="container mx-auto py-6 px-4 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} فارسي هب. جميع الحقوق محفوظة.</p>
      </div>
    </footer>
  );
}
