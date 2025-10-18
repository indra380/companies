import React from 'react';
import { cn } from '../../utils';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
}

interface TableHeadProps {
  children: React.ReactNode;
  className?: string;
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc' | null;
  onSort?: () => void;
}

export const Table: React.FC<TableProps> = ({ children, className }) => (
  <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 rounded-sm">
    <table className={cn("min-w-full divide-y divide-gray-300 dark:divide-gray-600", className)}>
      {children}
    </table>
  </div>
);

export const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => (
  <thead className={cn("bg-gray-50 dark:bg-gray-800", className)}>
    {children}
  </thead>
);

export const TableBody: React.FC<TableBodyProps> = ({ children, className }) => (
  <tbody className={cn("divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900", className)}>
    {children}
  </tbody>
);

export const TableRow: React.FC<TableRowProps> = ({ children, className, onClick }) => (
  <tr 
    className={cn(
      "hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150",
      onClick && "cursor-pointer",
      className
    )}
    onClick={onClick}
  >
    {children}
  </tr>
);

export const TableHead: React.FC<TableHeadProps> = ({ 
  children, 
  className, 
  sortable, 
  sortDirection, 
  onSort 
}) => (
  <th 
    className={cn(
      "px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider bg-white",
      sortable && "cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-700",
      className
    )}
    onClick={sortable ? onSort : undefined}
  >
    <div className="flex items-center gap-2">
      {children}
      {sortable && (
        <div className="flex flex-col">
          <svg
            className={cn(
              "w-3 h-3 transition-colors",
              sortDirection === 'asc' ? "text-blue-500" : "text-gray-400"
            )}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <svg
            className={cn(
              "w-3 h-3 transition-colors -mt-1",
              sortDirection === 'desc' ? "text-blue-500" : "text-gray-400"
            )}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  </th>
);

export const TableCell: React.FC<TableCellProps> = ({ children, className }) => (
  <td className={cn("px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-100", className)}>
    {children}
  </td>
);