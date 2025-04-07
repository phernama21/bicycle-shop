'use client';

import { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, ChevronLeft } from 'lucide-react';
import { Order } from '@/models/order/domain/order';
import { orderRepository } from '@/models/order/infrastructure/orderRepository';
import { useAlert } from '@/contexts/AlertContext';
import { useRouter } from 'next/navigation';
import SearchBar from '@/components/ui/searchBar';
import Pagination from '@/components/ui/pagination';
import { useLoading } from '@/contexts/LoadingContext';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const { startLoading, stopLoading, isLoading} = useLoading();
  const [sortField, setSortField] = useState<keyof Order | ''>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 5;
  const { showAlert } = useAlert();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        startLoading()
        const allOrders = await orderRepository.getAllOrders();
        setOrders(allOrders);
        setFilteredOrders(allOrders);
      } catch (err) {
        showAlert('error', 'Load Error', 'Failed to load orders data.');
      } finally {
        stopLoading()
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const results = orders.filter(order => {
      const fullName = `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.toLowerCase();
      const orderId = order.id.toString();
      const term = searchTerm.toLowerCase();
      
      return fullName.includes(term) || orderId.includes(term);
    });
    
    setFilteredOrders(results);
    setCurrentPage(1); 
  }, [searchTerm, orders]);

  const handleSort = (field: keyof Order) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedOrders = () => {
    if (!sortField) return filteredOrders;
    
    return [...filteredOrders].sort((a, b) => {
      let aValue, bValue;
      
      if (sortField === 'user') {
        const aFullName = `${a.user?.firstName || ''} ${a.user?.lastName || ''}`;
        const bFullName = `${b.user?.firstName || ''} ${b.user?.lastName || ''}`;
        aValue = aFullName;
        bValue = bFullName;
      } else if (sortField === 'createdAt') {
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
      } else {
        aValue = a[sortField];
        bValue = b[sortField];
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const handleBackClick = () => {
    router.push("/admin/dashboard");
  };

  const getSortIcon = (field: keyof Order) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ArrowUp className="ml-1 h-4 w-4 inline" /> : <ArrowDown className="ml-1 h-4 w-4 inline" />;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = sortedOrders().slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedOrders().length / itemsPerPage);

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center py-4">
        <div className='flex flex-row items-center'>
          <button 
            onClick={handleBackClick}
            className="mr-3 h-full rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Go back to dashboard"
          >
            <ChevronLeft className='text-indigo-600 mt-1' />
          </button>
          <h1 className="text-2xl font-bold text-indigo-600">Orders</h1>
        </div>
        <SearchBar 
          searchTerm={searchTerm} 
          onSearchChange={handleSearchChange}
          placeholder='Search orders...'
        />
      </div>
      
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-indigo-600"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-gray-50 px-2 text-sm text-indigo-600">Orders Management</span>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center">
                  Order ID
                  {getSortIcon('id')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('user')}
              >
                <div className="flex items-center">
                  Customer
                  {getSortIcon('user')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center">
                  Status
                  {getSortIcon('status')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center">
                  Amount
                  {getSortIcon('amount')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('nItems')}
              >
                <div className="flex items-center">
                  Items
                  {getSortIcon('nItems')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center">
                  Date
                  {getSortIcon('createdAt')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  #{order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Unknown'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
                    {order.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.amount.toFixed(2)}€
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.nItems}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(order.createdAt)}
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && !isLoading && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {filteredOrders.length > 0 && (
        <div className="mt-4">
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredOrders.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}