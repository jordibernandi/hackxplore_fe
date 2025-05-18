import React from 'react';
import { cn } from '@/lib/utils';
import { ResultRowData } from '@/lib/types';

interface SearchTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setResults: (results: ResultRowData[]) => void;
}

const SearchTabs: React.FC<SearchTabsProps> = ({ activeTab, setActiveTab, setResults }) => {
  return (
    <div className="border-b border-gray-200 overflow-x-auto">
      <nav className="flex min-w-max">
        <button
          onClick={() => {
            setActiveTab('excel');
            setResults([]);
          }}
          className={cn(
            "mb-[1px] mr-4 md:mr-8 py-3 md:py-4 px-1 text-xs md:text-sm font-medium whitespace-nowrap",
            activeTab === 'excel' ? 'tab-active' : 'text-gray-500 hover:text-gray-700'
          )}
        >
          Excel/CSV Upload
        </button>
        <button
          onClick={() => {
            setActiveTab('manual');
            setResults([]);
          }}
          className={cn(
            "mb-[1px] mr-4 md:mr-8 py-3 md:py-4 px-1 text-xs md:text-sm font-medium whitespace-nowrap",
            activeTab === 'manual' ? 'tab-active' : 'text-gray-500 hover:text-gray-700'
          )}
        >
          Manual Input
        </button>
        <button
          onClick={() => {
            setActiveTab('camera');
            setResults([]);
          }} className={cn(
            "mb-[1px] py-3 md:py-4 px-1 text-xs md:text-sm font-medium whitespace-nowrap",
            activeTab === 'camera' ? 'tab-active' : 'text-gray-500 hover:text-gray-700'
          )}
        >
          Camera Capture
        </button>
      </nav>
    </div>
  );
};

export default SearchTabs;
