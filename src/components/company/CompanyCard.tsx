import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPinIcon, ExternalLinkIcon, StarIcon, UsersIcon, DollarSignIcon } from 'lucide-react';
import { Company } from '../../types';
import { cn, formatNumber, formatCurrency } from '../../utils';

interface CompanyCardProps {
  company: Company;
  index: number;
  viewMode?: 'grid' | 'list';
  onClick?: (company: Company) => void;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({
  company,
  index,
  viewMode = 'grid',
}) => {
  const isListView = viewMode === 'list';

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        delay: index * 0.1,
        ease: [0.23, 1, 0.32, 1]
      }
    }
  };

  // const handleClick = () => {
  //   onClick?.(company);
  // };

  const handleWebsiteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(company.website, '_blank', 'noopener,noreferrer');
  };

  // Small avatar component with image fallback to initials + generated light background
  const Avatar: React.FC<{ name: string; logo?: string; size?: number }> = ({ name, logo, size = 48 }) => {
    const [imgError, setImgError] = useState(false);
    const initials = name.split(' ').map(s => s[0]).slice(0, 2).join('');

    // generate a soft pastel background color from the name (lighter for light theme)
    const hash = name.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const hue = hash % 360;
    const bgColor = `hsl(${hue} 60% 88%)`;

    const px = `${size}px`;

    if (logo && !imgError) {
      return (
        // eslint-disable-next-line jsx-a11y/img-redundant-alt
        <img
          src={logo}
          alt={`${name} logo`}
          onError={() => setImgError(true)}
          style={{ width: px, height: px, objectFit: 'cover', borderRadius: '50%' }}
        />
      );
    }

    return (
      <div style={{ width: px, height: px, background: bgColor, borderRadius: '50%' }} className="flex items-center justify-center text-gray-800 font-medium text-sm">
        {initials}
      </div>
    );
  };

  if (isListView) {
    return (
      <motion.div
        layout
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className={cn(
          'group relative bg-white rounded-xl border border-gray-200',
          'cursor-pointer overflow-hidden'
        )}
        // onClick={handleClick}
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            {/* Company Logo/Image or initials */}
            <div className="flex-shrink-0">
              <Avatar name={company.name} logo={company.logo} size={64} />
            </div>

            {/* Company Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" onClick={(e) => e.stopPropagation()}>
                      {company.name}
                    </a>
                  </h3>

                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      {company.industry}
                    </span>

                    <span className="flex items-center gap-1">
                      <MapPinIcon className="w-4 h-4" />
                      {company.location.city}, {company.location.state}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleWebsiteClick}
                  className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  title="Visit website"
                >
                  <ExternalLinkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Company Stats */}
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <UsersIcon className="w-4 h-4 text-gray-500" />
                  <span>{formatNumber(company.employees)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSignIcon className="w-4 h-4 text-gray-500" />
                  <span>{formatCurrency(company.revenue)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <StarIcon className="w-4 h-4 text-gray-500" />
                  <span>Review</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      layout
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        'group relative bg-white rounded-xl border border-gray-200',
        'cursor-pointer overflow-hidden h-full'
      )}
      // onClick={handleClick}
    >
      <div className="p-3 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center">
              <Avatar name={company.name} logo={company.logo} size={48} />
            </div>

            <div className="flex-1">
              <h3 className="text-sm font-medium">
                <a 
                  href={company.website} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:text-blue-800 hover:underline "
                  onClick={(e) => e.stopPropagation()}
                >
                  {company.name}
                </a>
              </h3>
              <p className="text-sm text-gray-600">
                {company.industry}
              </p>
            </div>
          </div>
        </div>



        {/* Stats */}
        <div className="space-y-2 mt-auto">
          <div className="flex flex-col justify-between text-xs text-gray-600 dark:text-gray-400 space-y-2">
            {/* Location */}
            <div className="flex items-center gap-2">
              <MapPinIcon className="w-4 h-4" />
              <span>{company.location.city}, {company.location.state}</span>
            </div>
            <div className="flex items-center gap-2">
              <UsersIcon className="w-4 h-4 text-gray-500" />
              <span><span className="font-medium text-gray-900 dark:text-white">{formatNumber(company.employees)}</span> employees</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSignIcon className="w-4 h-4 text-gray-500" />
              <span><span className="font-medium text-gray-900 dark:text-white">{formatCurrency(company.revenue)}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <StarIcon className="w-4 h-4 text-gray-500" />
              <span><span className="font-medium text-gray-900 dark:text-white">{company.foundedYear}</span></span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CompanyCard;