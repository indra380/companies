import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Company, FilterOptions, PaginationInfo, ErrorState, SortOption } from '../types';
import { companyService } from '../services/api';
import { storage, debounce } from '../utils';

// Action Types
type ActionType = 
  | 'SET_LOADING'
  | 'SET_COMPANIES'
  | 'SET_FILTERS'
  | 'SET_PAGINATION'
  | 'SET_ERROR'
  | 'CLEAR_ERROR'
  | 'SET_FILTER_OPTIONS'
  | 'SET_META'
  | 'RESET_FILTERS'
  | 'SET_VIEW_MODE'
  | 'ADD_COMPANY'
  | 'UPDATE_COMPANY'
  | 'DELETE_COMPANY';

// Action Interfaces
interface Action {
  type: ActionType;
  payload?: any;
}

// State Interface
interface AppState {
  companies: Company[];
  loading: boolean;
  error: ErrorState | null;
  filters: FilterOptions;
  pagination: PaginationInfo;
  filterOptions: {
    industries: string[];
    locations: string[];
  };
  meta?: any;
  viewMode: 'grid' | 'list';
}

// Context Interface
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  actions: {
    fetchCompanies: () => Promise<void>;
    updateFilters: (filters: Partial<FilterOptions>) => void;
    changePage: (page: number) => void;
    resetFilters: () => void;
    setViewMode: (mode: 'grid' | 'list') => void;
    clearError: () => void;
    addCompany: (company: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCompany: (id: number, company: Partial<Company>) => Promise<void>;
  deleteCompany: (id: number) => Promise<void>;
  };
}

// Default filter values
const defaultFilters: FilterOptions = {
  searchTerm: '',
  industries: [],
  locations: [],
  minEmployees: 0,
  maxEmployees: 50000,
  minRevenue: 0,
  maxRevenue: 10000000000,
  foundedAfter: 1990,
  foundedBefore: new Date().getFullYear(),
  sortBy: 'updatedAt' as SortOption,
  sortOrder: 'desc',
};

// Initial State
const initialState: AppState = {
  companies: [],
  loading: false,
  error: null,
  filters: defaultFilters,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10, // Changed to 10 records per page
    hasNextPage: false,
    hasPrevPage: false,
  },
  filterOptions: {
    industries: [],
    locations: [],
  },
  viewMode: storage.get('viewMode', 'list'), // Default to list view
};

// Reducer Function
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };

    case 'SET_COMPANIES':
      return {
        ...state,
        companies: action.payload,
        loading: false,
        error: null,
      };

    case 'SET_FILTERS':
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
        pagination: {
          ...state.pagination,
          currentPage: 1, // Reset to first page when filters change
        },
      };

    case 'SET_PAGINATION':
      return {
        ...state,
        pagination: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    case 'SET_FILTER_OPTIONS':
      return {
        ...state,
        filterOptions: action.payload,
      };

    case 'SET_META':
      return {
        ...state,
        meta: action.payload,
      };

    case 'RESET_FILTERS':
      return {
        ...state,
        filters: defaultFilters,
        pagination: {
          ...state.pagination,
          currentPage: 1,
        },
      };

    case 'SET_VIEW_MODE':
      storage.set('viewMode', action.payload);
      return {
        ...state,
        viewMode: action.payload,
      };

    

    case 'ADD_COMPANY':
      return {
        ...state,
        companies: [action.payload, ...state.companies],
        pagination: {
          ...state.pagination,
          totalItems: state.pagination.totalItems + 1,
        },
      };

    case 'UPDATE_COMPANY':
      // Replace the company and move it to the top
      return {
        ...state,
        companies: [
          action.payload,
          ...state.companies.filter((c) => c.id !== action.payload.id),
        ],
      };

    case 'DELETE_COMPANY':
      return {
        ...state,
        companies: state.companies.filter(company => company.id !== action.payload),
        pagination: {
          ...state.pagination,
          totalItems: Math.max(0, state.pagination.totalItems - 1),
        },
      };

    default:
      return state;
  }
}

// Create Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Context Provider Props
interface AppProviderProps {
  children: ReactNode;
}

// Context Provider Component
export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Debounced fetch function to prevent excessive API calls
  const debouncedFetch = debounce(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await companyService.getCompanies(
        state.filters,
        state.pagination.currentPage
      );

      dispatch({ type: 'SET_COMPANIES', payload: response.data });
      dispatch({ type: 'SET_PAGINATION', payload: response.pagination });
      if (response.meta) {
        dispatch({ type: 'SET_META', payload: response.meta });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch companies';
      dispatch({ 
        type: 'SET_ERROR', 
        payload: { 
          message: errorMessage,
          code: 'FETCH_ERROR'
        } 
      });
    }
  }, 300);

  // Action Creators
  const actions = {
    fetchCompanies: async () => {
      await debouncedFetch();
    },

    updateFilters: (newFilters: Partial<FilterOptions>) => {
      dispatch({ type: 'SET_FILTERS', payload: newFilters });
    },

    changePage: (page: number) => {
      dispatch({ 
        type: 'SET_PAGINATION', 
        payload: { 
          ...state.pagination, 
          currentPage: page 
        } 
      });
    },

    resetFilters: () => {
      dispatch({ type: 'RESET_FILTERS' });
    },

    setViewMode: (mode: 'grid' | 'list') => {
      dispatch({ type: 'SET_VIEW_MODE', payload: mode });
    },


    clearError: () => {
      dispatch({ type: 'CLEAR_ERROR' });
    },

    addCompany: async (companyData: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const newCompany = await companyService.createCompany(companyData);
        dispatch({ type: 'ADD_COMPANY', payload: newCompany });
        dispatch({ type: 'SET_LOADING', payload: false });
      } catch (error: any) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: { message: error?.message || 'Failed to add company' } 
        });
      }
    },

  updateCompany: async (id: number, companyData: Partial<Company>) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const updatedCompany = await companyService.updateCompany(id, companyData);
        dispatch({ type: 'UPDATE_COMPANY', payload: updatedCompany });
        dispatch({ type: 'SET_LOADING', payload: false });
      } catch (error: any) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: { message: error?.message || 'Failed to update company' } 
        });
      }
    },

  deleteCompany: async (id: number) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        await companyService.deleteCompany(id);
        dispatch({ type: 'DELETE_COMPANY', payload: id });
        dispatch({ type: 'SET_LOADING', payload: false });
      } catch (error: any) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: { message: error?.message || 'Failed to delete company' } 
        });
      }
    },
  };

  // Load filter options on mount
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const options = await companyService.getFilterOptions();
        dispatch({ type: 'SET_FILTER_OPTIONS', payload: options });
      } catch (error) {
        console.error('Failed to load filter options:', error);
      }
    };

    loadFilterOptions();
  }, []);

  // Fetch companies when filters or pagination change
  useEffect(() => {
    actions.fetchCompanies();
  }, [state.filters, state.pagination.currentPage]);

  // Dark mode removed - no effect necessary

  // Context value
  const contextValue: AppContextType = {
    state,
    dispatch,
    actions,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// Custom Hook to use App Context
export function useAppContext() {
  const context = useContext(AppContext);
  
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  
  return context;
}

// Export types for external use
export type { AppState, AppContextType };