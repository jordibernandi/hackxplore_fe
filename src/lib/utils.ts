import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ComponentResult } from "./types";
import { saveAs } from 'file-saver';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Get category CSS class based on component category
export function getCategoryClass(category: string): string {
  const categoryMap: Record<string, string> = {
    'Inductors': 'category-inductors',
    'Capacitors': 'category-capacitors',
    'Resistors': 'category-resistors',
    'Connectors': 'category-connectors',
    'Diodes': 'category-diodes'
  };
  
  return categoryMap[category] || 'bg-gray-100 text-gray-800';
}

// Export data as CSV
export function exportAsCSV(data: ComponentResult[]): void {
  if (!data.length) return;
  
  const headers = ['Product Number', 'Competitor', 'Category', 'Alternative'];
  const csvRows = [
    headers.join(','),
    ...data.map(item => [
      item.productNumber,
      item.competitor,
      item.category,
      item.alternative
    ].join(','))
  ];
  
  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, `component-results-${new Date().toISOString().split('T')[0]}.csv`);
}

// Export data as JSON
export function exportAsJSON(data: ComponentResult[]): void {
  if (!data.length) return;
  
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  saveAs(blob, `component-results-${new Date().toISOString().split('T')[0]}.json`);
}

// Format pagination text
export function formatPaginationText(currentPage: number, perPage: number, totalItems: number): string {
  const start = (currentPage - 1) * perPage + 1;
  const end = Math.min(currentPage * perPage, totalItems);
  return `Showing ${start} to ${end} of ${totalItems} results`;
}
