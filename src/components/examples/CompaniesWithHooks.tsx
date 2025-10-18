import React from 'react';
import { 
  useCompanies, 
  useCompanyMutations, 
  useModal, 
  useDebounce, 
  useTheme 
} from '../../hooks';
import { Button } from '../ui/Button';

/**
 * Example component demonstrating how to use the new custom hooks
 */
export const CompaniesWithHooks: React.FC = () => {
  // 1. Use custom companies hook for data fetching
  const {
    companies,
    loading,
    error,
    pagination,
    updateFilters,
    changePage
  } = useCompanies();

  // 2. Use mutations hook for CRUD operations
  const {
    createCompany,
    updateCompany,
    deleteCompany,
    loading: mutationLoading,
    error: mutationError
  } = useCompanyMutations();

  // 3. Use modal hook for UI state
  const {
    isOpen: isAddModalOpen,
    openModal: openAddModal,
    closeModal: closeAddModal
  } = useModal();

  // 4. Use debounce hook for search
  const [searchTerm, setSearchTerm] = React.useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // 5. Use theme hook
  const { darkMode, toggleTheme } = useTheme();

  // Handle debounced search
  React.useEffect(() => {
    if (debouncedSearchTerm) {
      updateFilters({ searchTerm: debouncedSearchTerm });
    }
  }, [debouncedSearchTerm, updateFilters]);

  const handleAddCompany = async (companyData: any) => {
    const newCompany = await createCompany(companyData);
    if (newCompany) {
      closeAddModal();
      // Refresh the companies list
      updateFilters({});
    }
  };

  if (loading) return <div className="text-center py-8">Loading companies...</div>;
  if (error) return <div className="text-red-600 text-center py-8">Error: {error}</div>;

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        
        {/* Header with theme toggle */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Companies Directory (With Hooks!)
          </h1>
          <div className="flex gap-4">
            <Button onClick={toggleTheme} variant="outline">
              {darkMode ? '☀️' : '🌙'} Toggle Theme
            </Button>
            <Button onClick={openAddModal}>
              Add Company
            </Button>
          </div>
        </div>

        {/* Search with debounce */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
          {debouncedSearchTerm && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Searching for: "{debouncedSearchTerm}"
            </p>
          )}
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {companies.map((company) => (
            <div
              key={company.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {company.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                {company.industry}
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                📍 {company.location.city}, {company.location.state}
              </p>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  👥 {company.employees} employees
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateCompany(Number(company.id), { ...company })}
                    disabled={mutationLoading}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteCompany(Number(company.id))}
                    disabled={mutationLoading}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination using hook data */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4">
            <Button
              variant="outline"
              onClick={() => changePage(pagination.currentPage - 1)}
              disabled={!pagination.hasPrevPage}
            >
              Previous
            </Button>
            
            <span className="text-gray-600 dark:text-gray-400">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            
            <Button
              variant="outline"
              onClick={() => changePage(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
            >
              Next
            </Button>
          </div>
        )}

        {/* Mutation Error Display */}
        {mutationError && (
          <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Error: {mutationError}
          </div>
        )}

        {/* Add Modal (using modal hook) */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Add New Company
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                This is a demo modal using the useModal hook
              </p>
              <div className="flex gap-4">
                <Button onClick={closeAddModal} variant="outline">
                  Cancel
                </Button>
                <Button onClick={() => handleAddCompany({})}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompaniesWithHooks;