// Data types for the application

export type ComponentType = 'Capacitor' | 'Inductor' | 'Resistor';

export interface OriginalData {
  manufacturer: string;
  manufacturer_part_number: string;
  component_type: string;
  key_electrical_specs: Record<string, string>;
}


export interface ExcelRowData extends OriginalData {
  id: string;
  selected: boolean;
}

export interface ResultOriginalData extends OriginalData {
  wuerth_manufacturer_part_number: string;
  reason_why_it_is_a_match: string;
}

export interface ResultRowData extends ResultOriginalData {
  id: string;
  selected?: boolean;
}


export type SearchMethod = 'excel' | 'manual' | 'camera';

export interface SearchQuery {
  method: SearchMethod;
  productNumber?: string;
  includeAlternatives?: boolean;
  files?: File[];
  imageData?: string;
  selectedItems?: OriginalData[]; // For excel upload selected items
}

export interface EmailData {
  recipient: string;
  subject: string;
  message: string;
  selectedComponents: ResultRowData[];
}
