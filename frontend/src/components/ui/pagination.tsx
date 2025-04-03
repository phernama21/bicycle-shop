"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange
}: PaginationProps) {
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage + 1;
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pageNumbers = [];
    
    pageNumbers.push(1);
    
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);
    
    if (startPage > 2) {
      pageNumbers.push('ellipsis1');
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    if (endPage < totalPages - 1) {
      pageNumbers.push('ellipsis2');
    }
    
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
            currentPage === 1 ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
            currentPage === totalPages ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{indexOfFirstItem}</span> to{' '}
            <span className="font-medium">{indexOfLastItem}</span>{' '}
            of <span className="font-medium">{totalItems}</span> results
          </p>
        </div>
        <div>
          <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-xs">
            <button
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${
                currentPage === 1 ? 'text-gray-300' : 'text-gray-400 hover:bg-gray-50'
              } ring-1 ring-gray-300 ring-inset focus:z-20 focus:outline-offset-0`}
            >
              <span className="sr-only">Previous</span>
              {/* Left Arrow SVG for pagination */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            
            {getPageNumbers().map((page, index) => {
              if (page === 'ellipsis1' || page === 'ellipsis2') {
                return (
                  <span 
                    key={`ellipsis-${index}`}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-300 ring-inset focus:outline-offset-0"
                  >
                    ...
                  </span>
                );
              }
              
              return (
                <button
                  key={`page-${page}`}
                  onClick={() => onPageChange(Number(page))}
                  aria-current={currentPage === Number(page) ? 'page' : undefined}
                  className={`relative ${
                    currentPage === Number(page) 
                      ? 'z-10 bg-indigo-600 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600' 
                      : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                  } inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20`}
                >
                  {page}
                </button>
              );
            })}
            
            <button
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${
                currentPage === totalPages || totalPages === 0 ? 'text-gray-300' : 'text-gray-400 hover:bg-gray-50'
              } ring-1 ring-gray-300 ring-inset focus:z-20 focus:outline-offset-0`}
            >
              <span className="sr-only">Next</span>
              {/* Right Arrow SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}