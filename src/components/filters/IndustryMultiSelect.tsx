import React, { useEffect, useState } from 'react';
import ReactSelect, { components as RSComponents } from 'react-select';
import { useAppContext } from '../../context/AppContext';

const OptionCheckbox = (props: any) => {
  const { isSelected, label } = props;
  return (
    <RSComponents.Option {...props}>
      <div className={`flex items-center gap-2 px-2 py-1 rounded ${isSelected ? 'bg-blue-10 dark:bg-gray-800' : ''}`}>
        <input
          type="checkbox"
          checked={isSelected}
          readOnly
          className="w-4 h-4"
        />
        <span className={`truncate ${isSelected ? 'text-gray-900 dark:text-gray-100' : ''}`}>{label}</span>
      </div>
    </RSComponents.Option>
  );
};

const ValueContainer = ({ children, ...props }: any) => {
  const { getValue } = props;
  const selected = getValue() || [];
  if (selected.length === 0) return <RSComponents.ValueContainer {...props}>{children}</RSComponents.ValueContainer>;

  const first = selected[0];
  const rest = selected.length - 1;

  return (
    <div className="flex items-center gap-2 px-2">
      <div className="flex items-center gap-2">
        <div className="px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-100 rounded-full max-w-[140px] truncate">{first.label}</div>
        {rest > 0 && (
          <div className="px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-200 rounded-full">+{rest}</div>
        )}
      </div>
    </div>
  );
};

export const IndustryMultiSelect: React.FC = () => {
  const { state, actions } = useAppContext();
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    const names = state.filterOptions.industries || [];
    const opts = names.map((n: string) => ({ value: n, label: n }));
    setOptions(opts);
  }, [state.filterOptions.industries]);

  const handleChange = (selected: any) => {
    const names = (selected || []).map((s: any) => s.value);
    actions.updateFilters({ industries: names });
  };

  const value = options.filter(o => state.filters.industries?.includes(o.value));

  return (
    <div style={{ minWidth: 220 }}>
      <ReactSelect
        options={options}
        isMulti
        onChange={handleChange}
        value={value}
        placeholder="Select Industry"
        classNamePrefix="react-select"
        className='text-sm'
        styles={{
          menu: (provided: any) => ({ ...provided, zIndex: 60 }),
          control: (provided: any) => ({
            ...provided,
            borderColor: '#e5e7eb',
            boxShadow: 'none',
            height: '36px',
            minHeight: '36px',
          }),
          option: (provided: any, state: any) => ({
            ...provided,
            background: state.isSelected ? (state.isFocused ? '#eef2f5' : '#f8fafc') : (state.isFocused ? '#f1f5f9' : provided.background),
            color: state.isSelected ? '#0f172a' : provided.color,
            borderRadius: 6,
            padding: '8px 10px',
          }),
          valueContainer: (provided: any) => ({ ...provided, padding: '2px 6px' }),
        }}
        components={{ Option: OptionCheckbox, ValueContainer }}
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
      />
    </div>
  );
};

export default IndustryMultiSelect;
