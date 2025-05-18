import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Download, Code, Mail, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { ResultRowData } from '@/lib/types';
import { getCategoryClass, formatPaginationText } from '@/lib/utils';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface ResultsSectionProps {
  results: ResultRowData[];
  loading: boolean;
  onExportCSV: () => void;
  onExportJSON: () => void;
  onEmailResults: () => void;
  onToggleSelect: (id: string, selected: boolean) => void;
  onToggleSelectAll: (selected: boolean) => void;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({
  results,
  loading,
  onExportCSV,
  onExportJSON,
  onEmailResults,
  onToggleSelect,
  onToggleSelectAll
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (loading) {
    return (
      <div className="py-8 sm:py-12">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 text-primary animate-spin" />
          <p className="mt-4 text-base sm:text-lg font-medium text-gray-700">Processing your request...</p>
          <p className="mt-2 text-sm text-gray-500">This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (!results.length) {
    return null;
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    onToggleSelectAll(checked);
  };

  // Pagination
  const totalPages = Math.ceil(results.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = results.slice(indexOfFirstItem, indexOfLastItem);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-4 sm:p-6 border-t border-gray-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 sm:mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-accent">Search Results</h2>
          <p className="text-sm text-gray-600 mt-1">Found {results.length} matching components</p>
        </div>
        <div className="mt-3 md:mt-0 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={onExportCSV} className="text-xs sm:text-sm">
            <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={onExportJSON} className="text-xs sm:text-sm">
            <Code className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            Export JSON
          </Button>
          <Button size="sm" className="bg-primary hover:bg-red-700 text-xs sm:text-sm" onClick={onEmailResults}>
            <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            Email Results
          </Button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex border-b border-gray-200 mb-4 sm:mb-6 overflow-x-auto">
        <button
          onClick={() => setViewMode('table')}
          className={`mr-4 sm:mr-8 py-2 px-1 text-xs sm:text-sm font-medium whitespace-nowrap ${viewMode === 'table' ? 'tab-active' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Table View
        </button>
        <button
          onClick={() => setViewMode('cards')}
          className={`py-2 px-1 text-xs sm:text-sm font-medium whitespace-nowrap ${viewMode === 'cards' ? 'tab-active' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Card View
        </button>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px] sm:w-[100px]">
                  <div className="flex items-center">
                    <Checkbox
                      id="select-all"
                      checked={selectAll}
                      onCheckedChange={handleSelectAll}
                    />
                    <span className="ml-2 sm:ml-3 text-xs sm:text-sm hidden sm:inline">Select</span>
                  </div>
                </TableHead>
                <TableHead>Part Number</TableHead>
                <TableHead>Manufacturer</TableHead>
                <TableHead className="text-center">Type</TableHead>
                <TableHead className="text-center">Info</TableHead>
                <TableHead>Alternative</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell>
                    <Checkbox
                      checked={item.selected || false}
                      onCheckedChange={(checked) => onToggleSelect(item.id, checked === true)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{item.manufacturer_part_number}</TableCell>
                  <TableCell>{item.manufacturer}</TableCell>
                  <TableCell className="text-center">
                    <span className={`card-category-badge text-xs ${getCategoryClass(item.component_type)}`}>
                      {item.component_type}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <div className="flex justify-center"> {/* Center the icon */}
                          <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-red-700" />
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent className="min-w-96 p-4 rounded-md shadow-md border border-gray-200 bg-white"> {/* Improved styling */}
                        <div className="grid grid-cols-1 gap-2"> {/* Use a grid for better layout */}
                          {item.key_electrical_specs && Object.entries(item.key_electrical_specs).map(([key, value]) => {
                            const newKey = key.replace(/_/g, " ");
                            return (
                              <div key={key} className="space-y-1 text-left flex gap-2 items-center">
                                <p className="text-sm font-semibold text-gray-700 text-nowrap">{newKey}:</p>
                                <p className="text-sm text-gray-600">{value}</p>
                              </div>
                            )
                          })}
                          {!item.key_electrical_specs && (
                            <p className="text-sm text-gray-500">No electrical specifications available.</p>
                          )}
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </TableCell>
                  <TableCell className="font-medium">{item.wuerth_manufacturer_part_number.length > 0 ? item.wuerth_manufacturer_part_number : "No matched!"}</TableCell>
                  <TableCell className="text-xs">{item.wuerth_manufacturer_part_number.length > 0 ? item.reason_why_it_is_a_match : "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Card View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {currentItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
              <div className="p-3 sm:p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-mono text-sm sm:text-lg font-bold text-gray-900">{item.manufacturer_part_number}</div>
                    <div className="text-xs sm:text-sm text-gray-600 mt-1">{item.manufacturer}</div>
                  </div>
                  <Checkbox
                    checked={item.selected || false}
                    onCheckedChange={(checked) => onToggleSelect(item.id, checked === true)}
                  />
                </div>

                <div className="mt-3 sm:mt-4">
                  <span className={`card-category-badge text-xs ${getCategoryClass(item.component_type)}`}>
                    {item.component_type}
                  </span>
                </div>

                <div className="mt-3 pt-3 sm:mt-4 sm:pt-4 border-t border-gray-200">
                  <h4 className="text-xs sm:text-sm font-medium text-gray-700">Alternative Product:</h4>
                  <p className="mt-1 text-xs sm:text-sm font-mono text-primary">{item.wuerth_manufacturer_part_number}</p>
                  <h4 className="text-xs sm:text-sm font-medium text-gray-700">Reason:</h4>
                  <p className="mt-1 text-xs ont-mono text-black">{item.reason_why_it_is_a_match}</p>
                </div>

                <div className="mt-3 sm:mt-4 flex justify-end space-x-2">
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <div className="flex justify-center"> {/* Center the icon */}
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-red-700" />
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="min-w-96 p-4 rounded-md shadow-md border border-gray-200 bg-white"> {/* Improved styling */}
                      <div className="grid grid-cols-1 gap-2"> {/* Use a grid for better layout */}
                        {item.key_electrical_specs && Object.entries(item.key_electrical_specs).map(([key, value]) => {
                          const newKey = key.replace(/_/g, " ");
                          return (
                            <div key={key} className="space-y-1 text-left flex gap-2 items-center">
                              <p className="text-sm font-semibold text-gray-700 text-nowrap">{newKey}:</p>
                              <p className="text-sm text-gray-600">{value}</p>
                            </div>
                          )
                        })}
                        {!item.key_electrical_specs && (
                          <p className="text-sm text-gray-500">No electrical specifications available.</p>
                        )}
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {results.length > itemsPerPage && (
        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-xs sm:text-sm text-gray-700 order-2 sm:order-1">
            {formatPaginationText(currentPage, itemsPerPage, results.length)}
          </div>
          <div className="order-1 sm:order-2">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-l-md h-7 sm:h-9 px-2 sm:px-3"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>

              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                // Show first page, last page, current page, and pages around current
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                  if (i === 4) pageNum = totalPages;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                  if (i === 0) pageNum = 1;
                } else {
                  pageNum = currentPage - 2 + i;
                  if (i === 0) pageNum = 1;
                  if (i === 4) pageNum = totalPages;
                }

                // Add ellipsis effect
                if ((totalPages > 5 && i === 1 && pageNum > 2) ||
                  (totalPages > 5 && i === 3 && pageNum < totalPages - 1)) {
                  return (
                    <Button
                      key={`ellipsis-${i}`}
                      variant="outline"
                      size="sm"
                      disabled
                      className="h-7 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm"
                    >
                      ...
                    </Button>
                  );
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(pageNum)}
                    className={`h-7 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm ${currentPage === pageNum ? "bg-primary hover:bg-red-700" : ""}`}
                  >
                    {pageNum}
                  </Button>
                );
              })}

              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-r-md h-7 sm:h-9 px-2 sm:px-3"
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsSection;
