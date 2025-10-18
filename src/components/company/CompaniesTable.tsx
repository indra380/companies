import React from 'react';
import { motion } from 'framer-motion';
import {  Edit2Icon, Trash2Icon } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { useAppContext } from '../../context/AppContext';
import { Company, SortOption } from '../../types';

interface CompaniesTableProps {
  companies: Company[];
  loading?: boolean;
  onEdit?: (company: Company) => void;
  onDelete?: (company: Company) => void;
}

export const CompaniesTable: React.FC<CompaniesTableProps> = ({
  companies,
  loading,
  onEdit,
  onDelete,
}) => {
  const { state, actions } = useAppContext();
  const { filters } = state;

  const handleSort = (column: SortOption) => {
    const isCurrentSort = filters.sortBy === column;
    const newOrder = isCurrentSort && filters.sortOrder === 'asc' ? 'desc' : 'asc';

    actions.updateFilters({
      sortBy: column,
      sortOrder: newOrder,
    });
  };

  const getSortDirection = (column: SortOption): 'asc' | 'desc' | null => {
    if (filters.sortBy === column) {
      return filters.sortOrder;
    }
    return null;
  };

  const formatRevenue = (revenue: number) => {
    if (revenue >= 1000000000) return `$${(revenue / 1000000000).toFixed(1)}B`;
    if (revenue >= 1000000) return `$${(revenue / 1000000).toFixed(1)}M`;
    if (revenue >= 1000) return `$${(revenue / 1000).toFixed(0)}K`;
    return `$${revenue}`;
  };

  const formatEmployees = (employees: number) => {
    if (employees >= 1000) return `${(employees / 1000).toFixed(1)}K`;
    return employees.toString();
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading companies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              sortable
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              sortDirection={getSortDirection('id')}
              onSort={() => handleSort('id')}
            >
              ID
            </TableHead>
            <TableHead
              sortable
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              sortDirection={getSortDirection('name')}
              onSort={() => handleSort('name')}
            >
              Company
            </TableHead>

            <TableHead
              sortable
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              sortDirection={getSortDirection('industry')}
              onSort={() => handleSort('industry')}
            >
              Industry
            </TableHead>
            <TableHead>Location</TableHead>
            <TableHead
              sortable
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              sortDirection={getSortDirection('employees')}
              onSort={() => handleSort('employees')}
            >
              Employees
            </TableHead>
            <TableHead
              sortable
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              sortDirection={getSortDirection('revenue')}
              onSort={() => handleSort('revenue')}
            >
              Revenue
            </TableHead>
            <TableHead
              sortable
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              sortDirection={getSortDirection('foundedYear')}
              onSort={() => handleSort('foundedYear')}
            >
              Founded
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company, index) => (
            <motion.tr
              key={company.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-700"
            >
              <TableCell className="py-2 text-sm text-gray-500">
                {company.id}
              </TableCell>
              <TableCell className="py-1">
                <div className="flex items-center space-x-3">
                  <div>
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-blue-600 dark:text-white hover:underline "
                      onClick={(e) => e.stopPropagation()}
                    >
                      {company.name}
                    </a>
                  </div>
                </div>
              </TableCell>



              <TableCell className="py-1">
                {/* map some industry names to badge variants */}
                {(() => {
                  const industry = (company.industry || '').toLowerCase();
                  let variant: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' = 'secondary';
                  if (industry.includes('tech') || industry.includes('technology')) variant = 'primary';
                  else if (industry.includes('finance') || industry.includes('bank')) variant = 'success';
                  else if (industry.includes('health') || industry.includes('bio')) variant = 'danger';
                  else if (industry.includes('energy') || industry.includes('logistics')) variant = 'warning';

                  return (
                    <Badge variant={variant} size="sm" className="font-medium">
                      {company.industry}
                    </Badge>
                  );
                })()}
              </TableCell>

              <TableCell className="py-1">
                {/* <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{company.location.city}, {company.location.state}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {company.location.country} {company.location.zip}
                </p> */}
                 
                <p className="font-medium text-gray-700 dark:text-white">
                  {company.location.country}, <span>{company.location.city}, {company.location.state}</span>
                </p> 
              </TableCell>

              <TableCell className="py-1">
                <div className="font-medium text-gray-700 dark:text-white">
                  {formatEmployees(company.employees)}
                </div>
              </TableCell>

              <TableCell className="py-1">
                <div className="font-medium text-gray-700 dark:text-white">
                  {formatRevenue(company.revenue)}
                </div>
              </TableCell>

              <TableCell className="py-1">
                <div className="font-medium text-gray-700 dark:text-white">
                  {company.foundedYear}
                </div>
              </TableCell>

              <TableCell className="py-1">
                <div className="flex items-center space-x-2">
                  {onEdit && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(company);
                      }}
                      className="p-1.5 hover:bg-blue-50 rounded-md transition-colors"
                      aria-label={`Edit ${company.name}`}
                    >
                      <Edit2Icon className="w-4 h-4 text-blue-600" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(company);
                      }}
                      className="p-1.5 hover:bg-red-50 rounded-md transition-colors"
                      aria-label={`Delete ${company.name}`}
                    >
                      <Trash2Icon className="w-4 h-4 text-red-600" />
                    </button>
                  )}
                </div>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};