"use client";

import { User } from "@/models/user/domain/user";
import { userRepository } from "@/models/user/infrastructure/userRepository";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/ui/searchBar";
import Switch from "@/components/ui/switch";
import Pagination from "@/components/ui/pagination";
import { useLoading } from "@/contexts/LoadingContext";

export default function UsersListPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { startLoading, stopLoading, isLoading} = useLoading();
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        startLoading();
        const currentUserData = await userRepository.getCurrentUser();
        setCurrentUser(currentUserData);
        
        const allUsers = await userRepository.getAllUsers();
        setUsers(allUsers);
        setFilteredUsers(allUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        stopLoading();
      }
    };

    fetchData();
  }, []);
  
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = users.filter(
        user => 
          user.firstName.toLowerCase().includes(term) || 
          user.lastName.toLowerCase().includes(term) || 
          user.email.toLowerCase().includes(term)
      );
      setFilteredUsers(filtered);
    }
    setCurrentPage(1); 
  }, [searchTerm, users]);

  const handleToggleAdmin = async (userId: number, newStatus: boolean) => {
    if (currentUser && userId === currentUser.id) {
      return;
    }
    setUsers(users.map(user => 
        user.id === userId ? { ...user, isAdmin: newStatus } : user
      ));
    try {
      const success = await userRepository.updateUserAdminStatus(userId, newStatus);
    } catch (error) {
      console.error("Error updating user:", error);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isAdmin: !newStatus } : user
      ));
    }
  };
  
  const handleBackClick = () => {
    router.push("/admin/dashboard");
  };
  
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col py-4 rounded-lg sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center">
          <button 
            onClick={handleBackClick}
            className="mr-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Go back to dashboard"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-indigo-600"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-indigo-600">Users</h1>
        </div>
        
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Search users..." />
      </div>
      
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-indigo-600"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-gray-50 px-2 text-sm text-indigo-600">User Management</span>
        </div>
      </div>
      
      <ul role="list" className="divide-y divide-gray-100 bg-white rounded-lg shadow mb-6">
        {currentUsers.map((user) => (
          <li key={user.id} className="flex justify-between gap-x-6 py-5 px-4 hover:bg-gray-50">
            <div className="flex min-w-0 gap-x-4">
              <div className="size-12 flex-none rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-lg font-semibold text-gray-600">
                  {user.firstName ? user.firstName.charAt(0) : "X"}{user.lastName ? user.lastName.charAt(0) : 'X'}
                </span>
              </div>
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold text-gray-900">
                  {user.firstName || '-'} {user.lastName || '-'}
                </p>
                <p className="mt-1 truncate text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
            <div className="flex flex-col sm:items-end justify-center">
              <div className="flex items-center gap-x-2">
                <span className="text-sm text-gray-500">Admin</span>
                <Switch 
                    isChecked={user.isAdmin || false}
                    onChange={() => handleToggleAdmin(user.id, !user.isAdmin)}
                    disabled={currentUser !== null && user.id === currentUser.id}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
      
      {filteredUsers.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-500">No users found</p>
        </div>
      )}
      
      {filteredUsers.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredUsers.length}
          itemsPerPage={usersPerPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}