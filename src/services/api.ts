import axios, { AxiosResponse } from 'axios';
import type { Company, ApiResponse, FilterOptions, PaginationInfo } from '../types';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
const ITEMS_PER_PAGE = parseInt(import.meta.env.VITE_ITEMS_PER_PAGE || '12');

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging and auth
api.interceptors.request.use(
  (config) => {
    // Add timestamp for cache busting if needed
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }
    
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.params);
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status}`, response.data);
    return response;
  },
  (error) => {
    console.error('[API Response Error]', error);
    
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      throw new Error(`API Error ${status}: ${data.message || 'Something went wrong'}`);
    } else if (error.request) {
      // Request made but no response received
      throw new Error('Network Error: Unable to connect to server');
    } else {
      // Something else happened
      throw new Error(`Request Error: ${error.message}`);
    }
  }
);



/**
 * Client-side filtering for more complex filters that JSON Server can't handle
 */
function applyClientSideFilters(companies: Company[], filters: Partial<FilterOptions>): Company[] {
  // We'll use OR semantics across the categorical/search filters so a company
  // is included when it matches ANY of: companyNames, industries, locations, or searchTerm.
  // Numeric range filters (employees/revenue/founded) are applied afterwards as additional constraints.

  const hasCompanyNames = !!(filters.companyNames && filters.companyNames.length > 0);
  const hasIndustries = !!(filters.industries && filters.industries.length > 0);
  const hasLocations = !!(filters.locations && filters.locations.length > 0);
  const hasSearchTerm = !!filters.searchTerm;

  // If no categorical/search filters are active, start with full list
  let filtered = [...companies];

  if (hasCompanyNames || hasIndustries || hasLocations || hasSearchTerm) {
    const names = (filters.companyNames || []).map(n => n.toLowerCase());
    const inds = (filters.industries || []).map(i => i.toLowerCase());
    const locFilters = (filters.locations || []).map(l => l.toLowerCase());
    const searchTerm = (filters.searchTerm || '').toLowerCase();

    filtered = companies.filter(company => {
      const nameMatch = hasCompanyNames ? names.includes(company.name.toLowerCase()) : false;
      const industryMatch = hasIndustries ? inds.includes(company.industry.toLowerCase()) : false;
      const locationMatch = hasLocations ? locFilters.some(loc =>
        company.location.city.toLowerCase().includes(loc) ||
        company.location.state.toLowerCase().includes(loc) ||
        company.location.country.toLowerCase().includes(loc)
      ) : false;
      const searchMatch = hasSearchTerm ? (
        company.name.toLowerCase().includes(searchTerm) ||
        company.industry.toLowerCase().includes(searchTerm) ||
        company.location.city.toLowerCase().includes(searchTerm) ||
        company.location.state.toLowerCase().includes(searchTerm) ||
        company.website.toLowerCase().includes(searchTerm)
      ) : false;

      // OR across the categorical/search filters
      return nameMatch || industryMatch || locationMatch || searchMatch;
    });
  }

  return filtered;
}

/**
 * Create pagination info from filtered results
 */
function createPaginationInfo(
  totalItems: number,
  currentPage: number,
  itemsPerPage: number = ITEMS_PER_PAGE
): PaginationInfo {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
}

/**
 * Company API Service
 */
export const companyService = {
  /**
   * Fetch companies with filtering and pagination
   */
  async getCompanies(
    filters: Partial<FilterOptions> = {},
    page: number = 1
  ): Promise<ApiResponse<Company[]>> {
    try {
      // For development, we'll fetch all companies and filter client-side
      // In production, you'd want server-side filtering
      const response: AxiosResponse<{ companies: Company[] }> = await api.get('/companies');
      
      let companies = response.data.companies || response.data;
      
      // Apply client-side filters
      let filteredCompanies = applyClientSideFilters(companies, filters);

      // Apply numeric and range constraints after OR-based categorical/search filtering
      filteredCompanies = filteredCompanies.filter(company => {
        if (typeof filters.minEmployees === 'number' && company.employees < filters.minEmployees) return false;
        if (typeof filters.maxEmployees === 'number' && company.employees > filters.maxEmployees) return false;
        if (typeof filters.minRevenue === 'number' && company.revenue < filters.minRevenue) return false;
        if (typeof filters.maxRevenue === 'number' && company.revenue > filters.maxRevenue) return false;
        if (typeof filters.foundedAfter === 'number' && company.foundedYear < filters.foundedAfter) return false;
        if (typeof filters.foundedBefore === 'number' && company.foundedYear > filters.foundedBefore) return false;
        return true;
      });
      
      // Apply sorting
      if (filters.sortBy) {
        filteredCompanies.sort((a, b) => {
          const aValue = getNestedValue(a, filters.sortBy!);
          const bValue = getNestedValue(b, filters.sortBy!);

          let comparison = 0;

          // Handle null/undefined
          if (aValue == null && bValue == null) comparison = 0;
          else if (aValue == null) comparison = -1;
          else if (bValue == null) comparison = 1;
          else if (filters.sortBy === 'id' || typeof aValue === 'number' || typeof bValue === 'number') {
            // Numeric compare (ensures '10' sorts after '2')
            const na = Number(aValue);
            const nb = Number(bValue);
            if (na < nb) comparison = -1;
            else if (na > nb) comparison = 1;
            else comparison = 0;
          } else {
            // String compare (case-insensitive)
            const sa = String(aValue).toLowerCase();
            const sb = String(bValue).toLowerCase();
            if (sa < sb) comparison = -1;
            else if (sa > sb) comparison = 1;
            else comparison = 0;
          }

          return filters.sortOrder === 'desc' ? -comparison : comparison;
        });
      }
      
      // Apply pagination
      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const paginatedCompanies = filteredCompanies.slice(startIndex, endIndex);
      
      // Create pagination info
      const pagination = createPaginationInfo(filteredCompanies.length, page);
      
      // Generate metadata
      const meta = {
        totalIndustries: [...new Set(companies.map(c => c.industry))].length,
        totalLocations: [...new Set(companies.map(c => `${c.location.city}, ${c.location.state}`))].length,
        avgEmployees: companies.reduce((sum, c) => sum + c.employees, 0) / companies.length,
      };

      return {
        data: paginatedCompanies,
        pagination,
        meta,
      };
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  },

  /**
   * Fetch a single company by ID
   */
  async getCompanyById(id: number): Promise<Company> {
    try {
      const response: AxiosResponse<Company> = await api.get(`/companies/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching company ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get filter options (industries, locations, etc.)
   */
  async getFilterOptions(): Promise<{
    industries: string[];
    locations: string[];
  }> {
    try {
      const response: AxiosResponse<{ companies: Company[] }> = await api.get('/companies');
      const companies = response.data.companies || response.data;

      const industries = [...new Set(companies.map(c => c.industry))].sort();
      const locations = [...new Set(companies.map(c => `${c.location.city}, ${c.location.state}`))].sort();

      return {
        industries,
        locations,
      };
    } catch (error) {
      console.error('Error fetching filter options:', error);
      throw error;
    }
  },

  /**
   * Search companies by term
   */
  async searchCompanies(searchTerm: string, limit: number = 10): Promise<Company[]> {
    try {
      const filters = { searchTerm };
      const result = await this.getCompanies(filters, 1);
      return result.data.slice(0, limit);
    } catch (error) {
      console.error('Error searching companies:', error);
      throw error;
    }
  },

  /**
   * Return array of all company names (used for building dropdown options)
   */
  async getAllCompanyNames(): Promise<string[]> {
    try {
      const response: AxiosResponse<{ companies: Company[] } | Company[]> = await api.get('/companies');
      const companies = (response.data as any).companies || response.data;
      return companies.map((c: Company) => c.name).filter(Boolean);
    } catch (error) {
      console.error('Error fetching all company names:', error);
      throw error;
    }
  },

  /**
   * Create a new company
   */
  async createCompany(companyData: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>): Promise<Company> {
    try {
      // First, get all companies to determine the next ID
      const allCompaniesResponse: AxiosResponse<{ companies: Company[] }> = await api.get('/companies');
      const companies = allCompaniesResponse.data.companies || allCompaniesResponse.data;
      
      // Find the highest numeric ID and increment it
      const numericIds = companies
        .map(company => parseInt(String(company.id)))
        .filter(id => !isNaN(id));
      
      const nextId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
      
      const payload = {
        ...companyData,
        id: String(nextId),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const response: AxiosResponse<Company> = await api.post('/companies', payload);
      return response.data;
    } catch (error) {
      console.error('Error creating company:', error);
      throw error;
    }
  },

  /**
   * Update an existing company
   */
  async updateCompany(id: number, companyData: Partial<Company>): Promise<Company> {
    try {
      const updatedData = {
        ...companyData,
        updatedAt: new Date().toISOString(),
      };

      const response: AxiosResponse<Company> = await api.put(`/companies/${id}`, updatedData);
      return response.data;
    } catch (error) {
      console.error('Error updating company:', error);
      throw error;
    }
  },

  /**
   * Delete a company
   */
  async deleteCompany(id: number): Promise<void> {
    try {
      await api.delete(`/companies/${id}`);
    } catch (error) {
      console.error('Error deleting company:', error);
      throw error;
    }
  },
};

/**
 * Helper function to get nested object values for sorting
 */
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Export for use in components
 */
export default companyService;