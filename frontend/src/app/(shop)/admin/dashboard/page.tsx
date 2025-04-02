'use client';

import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminDashboardPage() {
  const { user, loading, logout, isAuthenticated } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
              <h2 className="text-xl font-semibold mb-4">Your ADMIN Dashboard Content</h2>
              <p>This is a protected dashboard page that only authenticated users can access.</p>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium">Your Information:</h3>
                <ul className="mt-2 list-disc list-inside">
                  <li>Email: {user.email}</li>
                  <li>Name: {user.firstName} {user.lastName}</li>
                  <li>Account created: {user.createdAt.toLocaleDateString()}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}