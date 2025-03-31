import { UserProvider } from '@/contexts/UserContext';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Application',
  description: 'Your application description',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}