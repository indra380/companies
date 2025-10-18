export interface Company {
  id: number;
  name: string;
  industry: string;
  logo?: string;
  location: {
    city: string;
    state: string;
    country: string;
    zip: string;
  };
  employees: number;
  revenue: number;
  website: string;
  foundedYear: number;
  createdAt: string;
  updatedAt: string;
}

export type ViewMode = 'grid' | 'list';

export interface FilterOptions {
  searchTerm: string;
  industries: string[];
  locations: string[];
  minEmployees: number;
  maxEmployees: number;
  minRevenue: number;
  maxRevenue: number;
  foundedAfter: number;
  foundedBefore: number;
  companyNames?: string[];
  sortBy: SortOption;
  sortOrder: 'asc' | 'desc';
}

export type SortOption = 
  | 'name' 
  | 'industry' 
  | 'employees' 
  | 'revenue' 
  | 'foundedYear' 
  | 'updatedAt'
  | 'id';

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T> {
  data: T;
  pagination?: PaginationInfo;
  meta?: {
    totalIndustries: number;
    totalLocations: number;
    avgEmployees: number;
    [key: string]: any;
  };
}

export interface ErrorState {
  message: string;
  code?: string;
  details?: any;
}

export interface CompanyFormData {
  name: string;
  industry: string;
  location: {
    city: string;
    state: string;
    country: string;
    zip: string;
  };
  employees: number;
  revenue: number;
  website: string;
  foundedYear: number;
}