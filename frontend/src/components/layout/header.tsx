'use client'
import { AdminToggle } from '@/components/navigation/adminToggle'; 
import { useUser } from '@/contexts/UserContext';

export const Header = () => { 
  const { user, logout } = useUser();
  
  return (
    user ? (
      <header className="bg-white border-b border-gray-200 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 items-center h-16">
            <div className="col-span-1 flex md:justify-start justify-start">
              <div className="md:hidden block">
                <AdminToggle />
              </div>
            </div>
            
            <div className="col-span-1 hidden md:flex justify-center">
              <AdminToggle />
            </div>
            
            <div className="sm:col-span-2 md:col-span-1 flex justify-end items-center">
            <span className="hidden sm:inline mr-4">
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
        </div>
      </header>
    ) : (
      <></>
    )
  );
};