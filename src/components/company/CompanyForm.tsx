import React, { useState, useEffect } from 'react';
import { Company, CompanyFormData } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface CompanyFormProps {
  company?: Company;
  onSubmit: (data: CompanyFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const INDUSTRIES = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'E-commerce',
  'Manufacturing', 'Consulting', 'Media', 'Real Estate', 'Transportation',
  'Energy', 'Food & Beverage', 'Retail', 'Telecommunications', 'Other'
];

const COUNTRIES = ['United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Australia', 'Other'];

export const CompanyForm: React.FC<CompanyFormProps> = ({
  company,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    industry: '',
    location: {
      city: '',
      state: '',
      country: 'United States',
      zip: ''
    },
    employees: 1,
    revenue: 0,
    website: '',
    foundedYear: new Date().getFullYear()
  });

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name,
        industry: company.industry,
        location: company.location,
        employees: company.employees,
        revenue: company.revenue,
        website: company.website,
        foundedYear: company.foundedYear
      });
    }
  }, [company]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pr-2 -mr-2">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Company Name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                placeholder="Enter company name"
              />
              
              <Select
                label="Industry"
                value={formData.industry}
                onChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}
                options={INDUSTRIES.map(industry => ({ value: industry, label: industry }))}
                required
                placeholder="Select industry"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                required
                placeholder="https://example.com"
              />
              
              <Input
                label="Annual Revenue (USD)"
                type="number"
                value={formData.revenue}
                onChange={(e) => setFormData(prev => ({ ...prev, revenue: parseInt(e.target.value) }))}
                required
                min="0"
                placeholder="0"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Founded Year"
                type="number"
                value={formData.foundedYear}
                onChange={(e) => setFormData(prev => ({ ...prev, foundedYear: parseInt(e.target.value) }))}
                required
                min="1800"
                max={new Date().getFullYear()}
                placeholder="2025"
              />
              
              <Input
                label="Number of Employees"
                type="number"
                value={formData.employees}
                onChange={(e) => setFormData(prev => ({ ...prev, employees: parseInt(e.target.value) }))}
                required
                min="1"
                placeholder="1"
              />
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="City"
                value={formData.location.city}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  location: { ...prev.location, city: e.target.value }
                }))}
                required
                placeholder="San Francisco"
              />
              
              <Input
                label="State/Province"
                value={formData.location.state}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  location: { ...prev.location, state: e.target.value }
                }))}
                required
                placeholder="California"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Country"
                value={formData.location.country}
                onChange={(value) => setFormData(prev => ({
                  ...prev,
                  location: { ...prev.location, country: value }
                }))}
                options={COUNTRIES.map(country => ({ value: country, label: country }))}
                required
                placeholder="Select country"
              />
              
              <Input
                label="ZIP/Postal Code"
                value={formData.location.zip}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  location: { ...prev.location, zip: e.target.value }
                }))}
                required
                placeholder="94105"
              />
            </div>
          </div>
        </form>
      </div>

      {/* Fixed Footer */}
      <div className="flex-shrink-0 mt-6 pt-4 border-t border-gray-200 bg-white">
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            onClick={handleSubmit}
            className="px-4 py-2"
          >
            {loading ? 'Saving...' : company ? 'Update Company' : 'Add Company'}
          </Button>
        </div>
      </div>
    </div>
  );
};