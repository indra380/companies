import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon } from 'lucide-react';
import { cn } from '../../utils';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'max-w-xs sm:max-w-sm',
    md: 'max-w-sm sm:max-w-md',
    lg: 'max-w-md sm:max-w-lg',
    xl: 'max-w-lg sm:max-w-2xl'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                'bg-white rounded-xl shadow-xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden',
                sizeClasses[size]
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  {title}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                >
                  <XIcon className="w-4 h-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex flex-col h-full max-h-[calc(95vh-80px)] sm:max-h-[calc(90vh-80px)]">
                <div className="flex-1 overflow-y-auto p-6">
                  {children}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};