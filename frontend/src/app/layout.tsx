import { UserProvider } from '@/contexts/UserContext';
import './globals.css';
import type { Metadata } from 'next';
import { NavigationProvider } from '@/contexts/NavigationContext';
import { LoadingProvider } from '@/contexts/LoadingContext';
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
    <html lang="en" className="h-full bg-white">
      <body className="h-full vsc-initialized">
        <LoadingProvider>
          <UserProvider>
            <NavigationProvider>
                {children}
            </NavigationProvider>
          </UserProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}