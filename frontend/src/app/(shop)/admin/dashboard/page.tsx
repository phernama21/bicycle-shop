'use client';

import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

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
    
       
        <div className="mt-10 grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
          {/* Users Management Card - Spans 2 rows */}
          <Link href="/admin/users" className="relative lg:row-span-2 group">
            <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-2xl"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-lg lg:rounded-l-2xl">
              <div className="px-8 pt-5 pb-3 sm:px-10 sm:pb-0">
                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                  Users Management
                </p>
                <p className="mt-2 max-w-lg text-sm text-gray-600 max-lg:text-center">
                  View, search, and manage all user accounts.
                </p>
              </div>
              <div className="relative min-h-64 w-full grow max-lg:mx-auto max-lg:max-w-sm">
                <div className="absolute inset-x-10 top-10 bottom-0 overflow-hidden rounded-t-xl border-x-4 border-t-4 border-gray-700 bg-gray-900 shadow-2xl">
                  <div className="p-4 text-white text-sm">
                    <div className="bg-gray-800 p-2 rounded mb-2 flex justify-between">
                      <span>John Doe</span>
                      <span className="text-green-400">Active</span>
                    </div>
                    <div className="bg-gray-800 p-2 rounded mb-2 flex justify-between">
                      <span>Jane Smith</span>
                      <span className="text-green-400">Active</span>
                    </div>
                    <div className="bg-gray-800 p-2 rounded mb-2 flex justify-between">
                      <span>Alice Johnson</span>
                      <span className="text-yellow-400">Pending</span>
                    </div>
                    <div className="bg-gray-800 p-2 rounded flex justify-between">
                      <span>Bob Wilson</span>
                      <span className="text-red-400">Inactive</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ring-black/5 lg:rounded-l-2xl"></div>
            <div className="absolute inset-0 rounded-lg bg-indigo-500/5 opacity-0 transition-opacity group-hover:opacity-100"></div>
          </Link>

          <Link href="/admin/components" className="relative max-lg:row-start-1 group">
            <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-t-2xl"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-lg max-lg:rounded-t-2xl">
              <div className="px-8 pt-8 sm:px-10 sm:pt-5">
                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">Components</p>
                <p className="mt-2 max-w-lg text-sm text-gray-600 max-lg:text-center">
                  Create, modify and add options to bicycle components.
                </p>
              </div>
              <div className="flex flex-1 items-center justify-center px-8 max-lg:pt-10 max-lg:pb-12 sm:px-10 sm:pt-5 sm:pb-5 lg:pb-5">
                <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
                  <div className="bg-gray-200 rounded h-16 flex items-center justify-center">
                    <div className="bg-indigo-600 w-8 h-8 rounded"></div>
                  </div>
                  <div className="bg-gray-200 rounded h-16 flex items-center justify-center">
                    <div className="bg-green-600 w-8 h-8 rounded-full"></div>
                  </div>
                  <div className="bg-gray-200 rounded h-16 flex items-center justify-center">
                    <div className="border-2 border-orange-500 w-10 h-6 rounded"></div>
                  </div>
                  <div className="bg-gray-200 rounded h-16 flex items-center justify-center">
                    <div className="bg-blue-500 w-12 h-4 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ring-black/5 max-lg:rounded-t-2xl"></div>
            <div className="absolute inset-0 rounded-lg bg-indigo-500/5 opacity-0 transition-opacity group-hover:opacity-100"></div>
          </Link>

          <Link href="/admin/rules" className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2 group">
            <div className="absolute inset-px rounded-lg bg-white"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-lg">
              <div className="px-8 pt-5 sm:px-10">
                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">Rules</p>
                <p className="mt-2 max-w-lg text-sm text-gray-600 max-lg:text-center">
                  Configure rules between components and options.
                </p>
              </div>
              <div className="flex flex-1 items-center justify-center max-lg:py-6 lg:pb-2">
                <div className="bg-gray-100 rounded-lg p-6 w-4/5">
                  <div className="flex items-center mb-2">
                    <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-xs text-gray-700">REQUIRE</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                    <span className="text-xs text-gray-700">EXCLUDE</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-xs text-gray-700">PRICE</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ring-black/5"></div>
            <div className="absolute inset-0 rounded-lg bg-indigo-500/5 opacity-0 transition-opacity group-hover:opacity-100"></div>
          </Link>

          <Link href="/admin/shopping-carts" className="relative lg:row-span-2 group">
            <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-b-2xl lg:rounded-r-2xl"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-lg max-lg:rounded-b-2xl lg:rounded-r-2xl">
              <div className="px-8 pt-5 pb-3 sm:px-10 sm:pb-0">
                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                  Orders
                </p>
                <p className="mt-2 max-w-lg text-sm text-gray-600 max-lg:text-center">
                  Monitor orders. Track customer purchases and behavior.
                </p>
              </div>
              <div className="relative min-h-64 w-full grow">
                <div className="absolute top-10 right-0 bottom-0 left-10 overflow-hidden rounded-tl-xl bg-gray-900 shadow-2xl">
                  <div className="flex bg-gray-800/40 ring-1 ring-white/5">
                    <div className="-mb-px flex text-sm font-medium text-gray-400">
                      <div className="border-r border-b border-r-white/10 border-b-white/20 bg-white/5 px-4 py-2 text-white">
                        Active Orders
                      </div>
                      <div className="border-r border-gray-600/10 px-4 py-2">Cancelled Orders</div>
                    </div>
                  </div>
                  <div className="px-6 pt-6 pb-14 text-white">
                    <div className="flex justify-between text-xs text-gray-400 mb-4">
                      <span>Customer</span>
                      <span>Items</span>
                      <span>Value</span>
                      <span>Time</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>user1@example.com</span>
                        <span>3</span>
                        <span>$149.99</span>
                        <span>12m ago</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>user2@example.com</span>
                        <span>1</span>
                        <span>$29.99</span>
                        <span>18m ago</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>user3@example.com</span>
                        <span>5</span>
                        <span>$219.95</span>
                        <span>25m ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg ring-1 shadow-sm ring-black/5 max-lg:rounded-b-2xl lg:rounded-r-2xl"></div>
            <div className="absolute inset-0 rounded-lg bg-indigo-500/5 opacity-0 transition-opacity group-hover:opacity-100"></div>
          </Link>
        </div>
  );
}