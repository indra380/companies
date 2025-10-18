import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FilterIcon, 
  XIcon, 
  SlidersIcon,
  RefreshCcwIcon
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAppContext } from '../../context/AppContext';

interface FilterPanelProps {
  className?: string;
}

// Simple inline multi-select with search + checkboxes
const MultiSelect: React.FC<{
  label?: string;
  options: { value: string; label: string }[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}> = ({ label, options, value, onChange, placeholder }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(o => o.label.toLowerCase().includes(q));
  }, [options, query]);

  const toggleValue = (val: string) => {
    if (value.includes(val)) onChange(value.filter(v => v !== val));
    else onChange([...value, val]);
  };

  return (
    <div className="relative">
      {label && <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</div>}
      <div className="flex items-center gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder || 'Search...'}
        />
        <Button variant="outline" onClick={() => setOpen(!open)}>
          {open ? 'Close' : 'Select'}
        </Button>
      </div>

      {open && (
        <div className="absolute z-50 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg w-80 p-3 max-h-60 overflow-y-auto">
          {filtered.length === 0 && <div className="text-sm text-gray-500">No results</div>}
          {filtered.map(opt => (
            <label key={opt.value} className="flex items-center gap-2 py-1 text-sm">
              <input type="checkbox" checked={value.includes(opt.value)} onChange={() => toggleValue(opt.value)} />
              <span className="truncate">{opt.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export const FilterPanel: React.FC<FilterPanelProps> = ({ className }) => {
  const { state, actions } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);

  // Local temp filters until Apply is clicked
  const [localFilters, setLocalFilters] = useState(() => ({
    companyNames: state.filters.companyNames || [],
    industries: state.filters.industries || [],
    locations: state.filters.locations || [],
  }));

  const industryOptions = state.filterOptions.industries.map(i => ({ value: i, label: i }));
  const locationOptions = state.filterOptions.locations.map(l => ({ value: l, label: l }));
  const companyOptions = (state.companies || []).map(c => ({ value: c.name, label: c.name }));

  const apply = () => {
    actions.updateFilters({
      industries: localFilters.industries,
      locations: localFilters.locations,
      companyNames: localFilters.companyNames,
    });
    setIsOpen(false);
  };

  const reset = () => {
    setLocalFilters({ companyNames: [], industries: [], locations: [] });
    actions.resetFilters();
  };

  const activeCount = (localFilters.companyNames.length + localFilters.industries.length + localFilters.locations.length);

  return (
    <div className={className}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
        leftIcon={<FilterIcon className="w-4 h-4" />}
      >
        Filters
        {activeCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 z-50 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 min-w-[600px]"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <SlidersIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filter Companies</h3>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={reset} leftIcon={<RefreshCcwIcon className="w-4 h-4" />}>Reset</Button>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><XIcon className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <MultiSelect
                  label="Company"
                  options={[...companyOptions, ...industryOptions, ...locationOptions].slice(0, 200)}
                  value={localFilters.companyNames}
                  onChange={(vals) => setLocalFilters(prev => ({ ...prev, companyNames: vals }))}
                  placeholder="Search companies..."
                />
              </div>

              <div>
                <MultiSelect
                  label="Location"
                  options={locationOptions}
                  value={localFilters.locations}
                  onChange={(vals) => setLocalFilters(prev => ({ ...prev, locations: vals }))}
                  placeholder="Search locations..."
                />
              </div>

              <div>
                <MultiSelect
                  label="Industry"
                  options={industryOptions}
                  value={localFilters.industries}
                  onChange={(vals) => setLocalFilters(prev => ({ ...prev, industries: vals }))}
                  placeholder="Search industries..."
                />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex gap-3">
              <Button className="flex-1" onClick={apply}>Apply</Button>
              <Button variant="outline" className="flex-1" onClick={reset}>Clear</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterPanel;