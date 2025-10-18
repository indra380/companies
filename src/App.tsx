import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TableIcon,
  LayoutGridIcon,
  BuildingIcon,
  DownloadIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react';
import CompanyMultiSelect from './components/filters/CompanyMultiSelect';
import IndustryMultiSelect from './components/filters/IndustryMultiSelect';
import { AppProvider, useAppContext } from './context/AppContext';
import { SearchBar } from './components/filters/SearchBar';
import { CompaniesTable } from './components/company/CompaniesTable';
import { CompanyCard } from './components/company/CompanyCard';
import { CompanyForm } from './components/company/CompanyForm';
import { Button } from './components/ui/Button';
import { Modal } from './components/ui/Modal';
import { cn } from './utils';
import { Company, CompanyFormData } from './types';
import toast, { Toaster } from 'react-hot-toast';

// Loading skeleton component
const CompanyCardSkeleton = ({ isListView }: { isListView: boolean }) => (
  <div className={cn(
    'bg-white rounded-xl border border-gray-200',
    isListView ? 'p-4 sm:p-6' : 'p-4 sm:p-6'
  )}>
    <div className={isListView ? 'flex items-start gap-4 sm:gap-6' : 'space-y-3 sm:space-y-4'}>
      {/* Logo skeleton */}
      <div className={cn(
        'loading-shimmer rounded-lg',
        isListView ? 'w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0' : 'w-10 h-10 sm:w-12 sm:h-12'
      )} />

      <div className={cn('flex-1 space-y-2 sm:space-y-3', isListView ? '' : 'w-full')}>
        {/* Title skeleton */}
        <div className="loading-shimmer h-5 sm:h-6 w-3/4 rounded" />

        {/* Subtitle skeleton */}
        <div className="loading-shimmer h-3 sm:h-4 w-1/2 rounded" />

        {/* Description skeleton */}
        <div className="space-y-2">
          <div className="loading-shimmer h-3 sm:h-4 w-full rounded" />
          <div className="loading-shimmer h-3 sm:h-4 w-2/3 rounded" />
        </div>

        {/* Tags skeleton */}
        <div className="flex gap-1 sm:gap-2 flex-wrap">
          <div className="loading-shimmer h-5 sm:h-6 w-12 sm:w-16 rounded-full" />
          <div className="loading-shimmer h-5 sm:h-6 w-16 sm:w-20 rounded-full" />
          <div className="loading-shimmer h-5 sm:h-6 w-10 sm:w-12 rounded-full" />
        </div>
      </div>
    </div>
  </div>
);

// Pagination component
const Pagination = () => {
  const { state, actions } = useAppContext();
  const { pagination } = state;

  if (pagination.totalPages <= 1) return null;

  const getVisiblePages = () => {
    const current = pagination.currentPage;
    const total = pagination.totalPages;
    const delta = 2;

    let start = Math.max(1, current - delta);
    let end = Math.min(total, current + delta);

    if (end - start < 4) {
      if (start === 1) {
        end = Math.min(total, start + 4);
      } else if (end === total) {
        start = Math.max(1, end - 4);
      }
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between border-gray-200">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => actions.changePage(pagination.currentPage - 1)}
          disabled={!pagination.hasPrevPage}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => actions.changePage(pagination.currentPage + 1)}
          disabled={!pagination.hasNextPage}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing{' '}
            <span className="font-medium">
              {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}
            </span>{' '}
            to{' '}
            <span className="font-medium">
              {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
            </span>{' '}
            of{' '}
            <span className="font-medium">{pagination.totalItems}</span>{' '}
            results
          </p>
        </div>
        <div>
          <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-xs bg-white">
            <button
              onClick={() => actions.changePage(pagination.currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="size-5" />
            </button>
            
            {/* Page numbers */}
            {getVisiblePages().map((page, index) => {
              const isFirst = index === 0;
              const isLast = index === getVisiblePages().length - 1;
              const isCurrent = page === pagination.currentPage;
              
              // Show ellipsis before last pages if there's a gap
              const showEllipsisBefore = isFirst && page > 1 && pagination.totalPages > 5;
              const showEllipsisAfter = isLast && page < pagination.totalPages && pagination.totalPages > 5;
              
              return (
                <div key={page} className="flex items-center">
                  {showEllipsisBefore && (
                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                      ...
                    </span>
                  )}
                  <button
                    onClick={() => actions.changePage(page)}
                    className={cn(
                      "relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus:outline-offset-0",
                      isCurrent
                        ? "z-10 bg-blue-600 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50",
                      // Hide on mobile for non-current pages except first few
                      !isCurrent && index > 2 && "hidden md:inline-flex"
                    )}
                    aria-current={isCurrent ? "page" : undefined}
                  >
                    {page}
                  </button>
                  {showEllipsisAfter && (
                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                      ...
                    </span>
                  )}
                </div>
              );
            })}
            
            <button
              onClick={() => actions.changePage(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="size-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

// Stats component
/* const Stats = () => {
  const { state } = useAppContext();

  const stats = [
    {
      name: 'Total Companies',
      value: formatNumber(state.pagination.totalItems),
      icon: BuildingIcon,
      color: 'text-blue-600'
    },
    {
      name: 'Industries',
      value: state.filterOptions.industries.length,
      icon: TrendingUpIcon,
      color: 'text-green-600'
    },
    {
      name: 'Locations',
      value: state.filterOptions.locations.length,
      icon: MapIcon,
      color: 'text-purple-600'
    },
    {
      name: 'Avg Employees',
      value: formatNumber(
        // Prefer server-provided average across all records if available
        Math.round((state.meta?.avgEmployees) ?? (
          state.companies.length ? (state.companies.reduce((sum, company) => sum + company.employees, 0) / state.companies.length) : 0
        ))
      ),
      icon: UsersIcon,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={cn('p-1.5 sm:p-2 rounded-lg', stat.color.replace('text-', 'bg-').replace('-600', '-100'))}>
              <stat.icon className={cn('w-4 h-4 sm:w-5 sm:h-5', stat.color)} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-600 truncate">{stat.name}</p>
              <p className="text-lg sm:text-2xl font-semibold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}; */

// Utility functions for CSV export
const generateCSV = (companies: any[]) => {
  const headers = ['ID', 'Name', 'Industry', 'Location', 'Employees', 'Founded', 'Rating', 'Website', 'Funding Stage', 'Technologies'];
  const rows = companies.map(company => {
    const technologies = Array.isArray(company.technologies) ? company.technologies.join('; ') : (company.technologies || '');
    const fundingStage = company.funding?.stage || '';
    const location = company.location ? `${company.location.city || ''}, ${company.location.state || ''}` : '';

    return [
      company.id,
      company.name || '',
      company.industry || '',
      location,
      company.employees ?? '',
      company.foundedYear ?? '',
      company.rating ?? '',
      company.website || '',
      fundingStage,
      technologies,
    ];
  });

  const csvRows = [headers, ...rows].map(row =>
    row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
  ).join('\n');

  // Prepend BOM for Excel compatibility
  return '\uFEFF' + csvRows;
};

const downloadCSV = (csvContent: string, filename: string) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Main App Content
const AppContent = () => {
  const { state, actions } = useAppContext();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const handleAddCompany = async (formData: CompanyFormData) => {
    try {
      await actions.addCompany(formData);
      setShowAddModal(false);
      toast.success('Company added successfully!');
    } catch (error) {
      toast.error('Failed to add company');
    }
  };

  const handleEditCompany = async (formData: CompanyFormData) => {
    if (!selectedCompany) return;
    try {
      await actions.updateCompany(selectedCompany.id, formData);
      setShowEditModal(false);
      setSelectedCompany(null);
      toast.success('Company updated successfully!');
    } catch (error) {
      toast.error('Failed to update company');
    }
  };

  const handleDeleteCompany = async () => {
    if (!selectedCompany) return;
    try {
      await actions.deleteCompany(selectedCompany.id);
      setShowDeleteModal(false);
      setSelectedCompany(null);
      toast.success('Company deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete company');
    }
  };

  const handleEditClick = (company: Company) => {
    setSelectedCompany(company);
    setShowEditModal(true);
  };

  const handleDeleteClick = (company: Company) => {
    setSelectedCompany(company);
    setShowDeleteModal(true);
  };

  const handleCompanyClick = (company: any) => {
    toast.success(`Viewing ${company.name}`, {
      icon: '🏢',
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container-custom py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo and title */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <BuildingIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div> */}
              <div>
                <div className="text-lg sm:text-2xl font-semibold text-blue-600">
                  CORP HUB
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* View mode toggle */}
              <div className="flex bg-blue-50 rounded-md items-center justify-center">
                <Button
                  variant={state.viewMode === 'grid' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => actions.setViewMode('grid')}
                  className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-md transition-all duration-300 focus:outline-none focus:ring-0 focus:border-transparent ${state.viewMode === 'grid' ? 'bg-blue-500 text-white' : 'hover:bg-blue-200'}`}
                >
                  <LayoutGridIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
                <Button
                  variant={state.viewMode === 'list' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => actions.setViewMode('list')}
                  className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-md transition-all duration-300 focus:outline-none focus:ring-0 focus:border-transparent ${state.viewMode === 'list' ? 'bg-blue-500 text-white' : 'hover:bg-blue-200'}`}
                >
                  <TableIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-custom py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Mobile-first responsive controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          {/* Search Bar */}
          <div className="w-full sm:w-auto order-2 sm:order-1 text-xl ">
           Companies Directory
          </div>
          
          {/* Controls */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 w-full sm:w-auto order-1 sm:order-2">
             <SearchBar className="w-full sm:w-[180px]" />
            <div className="flex-1 sm:flex-none min-w-[120px] h-9">
              <CompanyMultiSelect />
            </div>
            <div className="flex-1 sm:flex-none min-w-[120px] h-9">
              <IndustryMultiSelect />
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowAddModal(true)}
              leftIcon={<PlusIcon className="w-4 h-4" />}
              className="h-9 flex-shrink-0"
            >
              <span className="hidden sm:inline">Add Company</span>
              <span className="sm:hidden">Add</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-9 p-0 flex-shrink-0"
              aria-label="Export CSV"
              onClick={() => {
                const csv = generateCSV(state.companies);
                downloadCSV(csv, 'companies-export.csv');
                toast.success('Companies exported successfully!');
              }}
            >
              <DownloadIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {/* Stats */}
        {/* <Stats /> */}

        {/* Error State */}
        {/* {state.error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6 mb-4 sm:mb-8"
          >
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-red-600 text-sm sm:text-base">⚠️</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-red-900 text-sm sm:text-base">
                  Something went wrong
                </h3>
                <p className="text-red-700 text-xs sm:text-sm mt-1">
                  {state.error.message}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={actions.clearError}
                className="flex-shrink-0"
              >
                Dismiss
              </Button>
            </div>
          </motion.div>
        )} */}

        {/* Companies Display */}
        <div className="w-full">
          {state.viewMode === 'list' ? (
            <div className="overflow-x-auto">
              <CompaniesTable
                companies={state.companies}
                loading={state.loading}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            </div>
          ) : state.loading ? (
            // Loading state for grid
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <CompanyCardSkeleton
                  key={index}
                  isListView={false}
                />
              ))}
            </div>
          ) : state.companies.length === 0 ? (
            // Empty state
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8 sm:py-12"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <BuildingIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                No companies found
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 px-4">
                Try adjusting your search criteria or filters
              </p>
              <Button onClick={actions.resetFilters} size="sm">
                Clear all filters
              </Button>
            </motion.div>
          ) : (
            // Grid view
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-4">
              {state.companies.map((company, index) => (
                <CompanyCard
                  key={company.id}
                  company={company}
                  index={index}
                  viewMode="grid"
                  onClick={handleCompanyClick}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {!state.loading && state.companies.length > 0 && <Pagination />}
      </main>

      {/* Add Company Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Company"
        size="xl"
      >
        <CompanyForm
          onSubmit={handleAddCompany}
          onCancel={() => setShowAddModal(false)}
          loading={state.loading}
        />
      </Modal>

      {/* Edit Company Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedCompany(null);
        }}
        title="Edit Company"
        size="xl"
      >
        <CompanyForm
          company={selectedCompany || undefined}
          onSubmit={handleEditCompany}
          onCancel={() => {
            setShowEditModal(false);
            setSelectedCompany(null);
          }}
          loading={state.loading}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedCompany(null);
        }}
        title="Delete Company"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete "{selectedCompany?.name}"? This action cannot be undone.
          </p>
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedCompany(null);
              }}
              className="order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteCompany}
              disabled={state.loading}
              className="order-1 sm:order-2"
            >
              {state.loading ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Main App Component with Provider
function App() {
  return (
    <AppProvider>
      <AppContent />
      <Toaster
        position="top-right"
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Default options for all toasts
          duration: 4000,
          className: '',
          style: {
            background: 'white',
            color: '#374151',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
            fontSize: '14px',
            fontWeight: '500',
            maxWidth: '400px',
          },
          success: {
            icon: '✅',
            style: {
              background: '#f0fdf4',
              color: '#166534',
              border: '1px solid #bbf7d0',
            },
          },
          error: {
            icon: '⚠️',
            style: {
              background: '#fef2f2',
              color: '#dc2626',
              border: '1px solid #fecaca',
            },
          },
          loading: {
            icon: '⏳',
            style: {
              background: '#fef3c7',
              color: '#92400e',
              border: '1px solid #fde68a',
            },
          },
        }}
      />
    </AppProvider>
  );
}

export default App;