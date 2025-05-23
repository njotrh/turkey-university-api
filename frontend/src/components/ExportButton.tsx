import { useState } from 'react';
import { DocumentArrowDownIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { University } from '../types';
import { useExport } from '../hooks/useExport';

interface ExportButtonProps {
  data: University[];
  filename?: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
}

const ExportButton = ({ 
  data, 
  filename = 'universities',
  label = 'Dışa Aktar',
  size = 'md',
  variant = 'outline',
  className = ''
}: ExportButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { exportToJSON, exportToCSV, exportToTXT } = useExport();

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 border-gray-600',
    outline: 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const handleExport = (format: 'json' | 'csv' | 'txt') => {
    setIsOpen(false);
    
    switch (format) {
      case 'json':
        exportToJSON(data, filename);
        break;
      case 'csv':
        exportToCSV(data, filename);
        break;
      case 'txt':
        exportToTXT(data, filename);
        break;
    }
  };

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          border rounded-lg font-medium transition-colors
          flex items-center gap-2
          ${className}
        `}
      >
        <DocumentArrowDownIcon className={iconSizes[size]} />
        {label} ({data.length})
        <ChevronDownIcon className={`${iconSizes[size]} transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="py-1">
              <button
                onClick={() => handleExport('json')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <span className="text-blue-600 font-mono text-xs">JSON</span>
                JSON Formatında İndir
              </button>
              
              <button
                onClick={() => handleExport('csv')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <span className="text-green-600 font-mono text-xs">CSV</span>
                Excel/CSV Formatında İndir
              </button>
              
              <button
                onClick={() => handleExport('txt')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <span className="text-gray-600 font-mono text-xs">TXT</span>
                Metin Formatında İndir
              </button>
            </div>
            
            <div className="border-t border-gray-200 px-4 py-2">
              <p className="text-xs text-gray-500">
                {data.length} üniversite dışa aktarılacak
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ExportButton;
