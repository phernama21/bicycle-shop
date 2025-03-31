'use client';

import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const { isAuthenticated, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center space-y-8 p-10">
        <h1 className="text-4xl font-bold text-gray-900">Welcome to Your App</h1>
        <p className="text-gray-600">Your app description goes here.</p>
        
        <div className="mt-8 space-y-4">
          <Link 
            href="/login"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
          >
            Sign in
          </Link>
          
          <Link 
            href="/register"
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
