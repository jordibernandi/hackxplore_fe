// Data types for the application

export interface ComponentResult {
  id: string;
  productNumber: string;
  competitor: string;
  category: string;
  alternative: string;
  selected?: boolean;
}

export interface ExcelRowData {
  id: string;
  partNumber: string;
  description: string;
  quantity: number;
  manufacturer: string;
  selected: boolean;
}

export type SearchMethod = 'excel' | 'manual' | 'camera';

export interface SearchQuery {
  method: SearchMethod;
  productNumber?: string;
  includeAlternatives?: boolean;
  files?: File[];
  imageData?: string;
  selectedItems?: ExcelRowData[]; // For excel upload selected items
}

export interface EmailData {
  recipient: string;
  subject: string;
  message: string;
  selectedComponents: ComponentResult[];
}
