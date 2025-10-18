import { useState, useEffect, useCallback } from 'react';
import { companyService } from '../services/api';
import type { Company, FilterOptions, ApiResponse, PaginationInfo } from '../types';

/**
 * Custom hook for fetching companies with filtering and pagination
 */
export const useCompanies = (
  initialFilters: Partial<FilterOptions> = {},
  initialPage: number = 1
) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [meta, setMeta] = useState<any>(null);

  const fetchCompanies = useCallback(async (
    filters: Partial<FilterOptions> = initialFilters,
    page: number = initialPage
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const response: ApiResponse<Company[]> = await companyService.getCompanies(filters, page);
      
      setCompanies(response.data);
      setPagination(response.pagination || null);
      setMeta(response.meta);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch companies';
      setError(errorMessage);
      setCompanies([]);
      setPagination(null);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }, [initialFilters, initialPage]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const refetch = useCallback(() => {
    fetchCompanies(initialFilters, initialPage);
  }, [fetchCompanies, initialFilters, initialPage]);

  const updateFilters = useCallback((newFilters: Partial<FilterOptions>) => {
    fetchCompanies(newFilters, 1); // Reset to page 1 when filters change
  }, [fetchCompanies]);

  const changePage = useCallback((newPage: number) => {
    fetchCompanies(initialFilters, newPage);
  }, [fetchCompanies, initialFilters]);

  return {
    companies,
    loading,
    error,
    pagination,
    meta,
    fetchCompanies,
    refetch,
    updateFilters,
    changePage
  };
};

/**
 * Custom hook for fetching a single company by ID
 */
export const useCompany = (id: number | null) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setCompany(null);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchCompany = async () => {
      try {
        setLoading(true);
        setError(null);
  const data = await companyService.getCompanyById(id as number);
        setCompany(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch company';
        setError(errorMessage);
        setCompany(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  const refetch = useCallback(() => {
    if (id) {
      // Trigger re-fetch by updating a dependency
      const fetchCompany = async () => {
        try {
          setLoading(true);
          setError(null);
          const data = await companyService.getCompanyById(id as number);
          setCompany(data);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to fetch company';
          setError(errorMessage);
          setCompany(null);
        } finally {
          setLoading(false);
        }
      };
      fetchCompany();
    }
  }, [id]);

  return { company, loading, error, refetch };
};

/**
 * Custom hook for company CRUD operations
 */
export const useCompanyMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCompany = useCallback(async (
    companyData: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Company | null> => {
    try {
      setLoading(true);
      setError(null);
      const newCompany = await companyService.createCompany(companyData);
      return newCompany;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create company';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCompany = useCallback(async (
    id: number,
    companyData: Partial<Company>
  ): Promise<Company | null> => {
    try {
      setLoading(true);
      setError(null);
      const updatedCompany = await companyService.updateCompany(id, companyData);
      return updatedCompany;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update company';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCompany = useCallback(async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await companyService.deleteCompany(id);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete company';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    createCompany,
    updateCompany,
    deleteCompany,
    loading,
    error,
    clearError
  };
};

/**
 * Custom hook for filter options
 */
export const useFilterOptions = () => {
  const [filterOptions, setFilterOptions] = useState<{
    industries: string[];
    locations: string[];
  }>({
    industries: [],
    locations: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFilterOptions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const options = await companyService.getFilterOptions();
      setFilterOptions(options);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch filter options';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  return {
    filterOptions,
    loading,
    error,
    refetch: fetchFilterOptions
  };
};

/**
 * Custom hook for search functionality
 */
export const useCompanySearch = () => {
  const [searchResults, setSearchResults] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (searchTerm: string, limit: number = 10) => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const results = await companyService.searchCompanies(searchTerm, limit);
      setSearchResults(results);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setError(null);
  }, []);

  return {
    searchResults,
    loading,
    error,
    search,
    clearSearch
  };
};

/**
 * Custom hook for managing local storage state
 */
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue] as const;
};

/**
 * Custom hook for debounced values
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};