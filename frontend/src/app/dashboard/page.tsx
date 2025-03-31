'use client';

import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
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
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center">
            <span className="mr-4">
              Welcome, {user.firstName} {user.lastName}
            </span>
            <button
              onClick={() => logout()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
              <h2 className="text-xl font-semibold mb-4">Your Dashboard Content</h2>
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