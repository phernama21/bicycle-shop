import { UserProvider } from '@/contexts/UserContext';
import './globals.css';
import type { Metadata } from 'next';
import { NavigationProvider } from '@/contexts/NavigationContext';
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
    <html lang="en" className="h-full bg-white vsc-initialized">
      <body className="h-full">
        <UserProvider>
          <NavigationProvider>
              {children}
          </NavigationProvider>
        </UserProvider>
      </body>
    </html>
  );
}