import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  X,
  FileText,
  Upload,
  Loader2,
  Eye,
  // Check
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Checkbox } from '@/components/ui/checkbox';
import { ExcelRowData, OriginalData } from '@/lib/types';
import { getCategoryClass, isComponentType } from '@/lib/utils';

interface ExcelUploadProps {
  onSearch: (selectedItems: OriginalData[]) => void;
}

const ExcelUpload: React.FC<ExcelUploadProps> = ({ onSearch }) => {
  const { toast } = useToast();

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadedData, setUploadedData] = useState<ExcelRowData[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
      // Reset upload states when new files are selected
      setUploadComplete(false);
      setUploadedData([]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    // Reset upload states when files are removed
    setUploadComplete(false);
    setUploadedData([]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).filter(
        file => file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          file.type === 'text/csv'
      );

      if (newFiles.length > 0) {
        setUploadedFiles(prev => [...prev, ...newFiles]);
        // Reset upload states when new files are dropped
        setUploadComplete(false);
        setUploadedData([]);
      }
    }
  };

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) return;

    setIsUploading(true);

    const formData = new FormData();
    uploadedFiles.forEach(file => {
      formData.append('file', file);
    });

    try {
      const response = await fetch('http://172.203.218.183:8080/api/upload-bom', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Upload failed:', errorData);
        // Handle error (e.g., display an error message to the user)
        setIsUploading(false);
        toast({
          title: "Upload failed",
          description: "There was an error processing your request.",
          variant: "destructive"
        });
        return;
      }

      const responseData = await response.json();
      const processedDataWithRandomId: ExcelRowData[] = responseData.map((data: OriginalData) => ({
        ...data,
        id: Math.random().toString(36).substring(2, 15), // Generate a random string for ID
        selected: false,
      }));
      setUploadedData(processedDataWithRandomId);
      setIsUploading(false);
      setUploadComplete(true);
      toast({
        title: "Upload completed",
        description: `Found ${processedDataWithRandomId.length} components`,
      });
    } catch (error) {
      console.error('Error during upload:', error);
      setIsUploading(false);
      // Handle network error
      toast({
        title: "Upload failed",
        description: "There was an error processing your request.",
        variant: "destructive"
      });
    }
  };

  const handleToggleSelect = (id: string, selected: boolean) => {
    setUploadedData(prev =>
      prev.map(item =>
        item.id === id ? { ...item, selected } : item
      )
    );

    // Update selectAll state based on whether all items are now selected
    const allSelected = uploadedData.every(item =>
      item.id === id ? selected : item.selected
    );
    setSelectAll(allSelected);
  };

  const handleToggleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setUploadedData(prev => prev.map(item => ({ ...item, selected: checked })));
  };

  const handleSearch = () => {
    const selectedItems = uploadedData.filter(item => item.selected);
    if (selectedItems.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const removeIdAndSelected = selectedItems.map(({ id, selected, ...rest }) => rest);
      console.log("Selected items: ", removeIdAndSelected);
      onSearch(removeIdAndSelected);
    }
  };

  return (
    <div className="py-6">
      <div className="w-full mx-auto">
        {!uploadComplete && (
          <>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FileText className="w-12 h-12 text-gray-400 mb-3" />
                  <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-500">Excel or CSV files</p>
                </div>
                <input
                  id="file-upload"
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".xlsx,.xls,.csv"
                  multiple
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Uploaded Files</h3>
                <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                  {uploadedFiles.map((file, index) => (
                    <li key={`${file.name}-${index}`} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="ml-2 truncate">{file.name}</span>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <button
                          onClick={() => handleRemoveFile(index)}
                          className="text-primary hover:text-red-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 flex justify-center">

              <Button
                onClick={handleUpload}
                disabled={uploadedFiles.length === 0 || isUploading}
                className="bg-primary hover:bg-red-700"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload and Read Files
                  </>
                )}
              </Button>
            </div>
          </>
        )}

        {uploadComplete && uploadedData.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Excel Data Preview</h3>
              <p className="text-sm text-gray-500 mt-1 md:mt-0">Please select the components you want to search</p>
            </div>

            <div className="overflow-x-auto border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={selectAll}
                        onCheckedChange={handleToggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Part Number</TableHead>
                    <TableHead>Manufacturer</TableHead>
                    <TableHead className="text-center">Type</TableHead>
                    <TableHead className="text-center">Info</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {uploadedData.map(row => (
                    isComponentType(row.component_type) ? (
                      <TableRow key={row.id}>
                        <TableCell>
                          <Checkbox
                            checked={row.selected}
                            onCheckedChange={(checked) => handleToggleSelect(row.id, checked === true)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{row.manufacturer_part_number}</TableCell>
                        <TableCell>{row.manufacturer}</TableCell>
                        <TableCell className="text-center">
                          <span className={`card-category-badge text-xs ${getCategoryClass(row.component_type)}`}>
                            {row.component_type}
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
                                {row.key_electrical_specs && Object.entries(row.key_electrical_specs).map(([key, value]) => {
                                  const newKey = key.replace(/_/g, " ");
                                  return (
                                    <div key={key} className="space-y-1 text-left flex gap-2 items-center">
                                      <p className="text-sm font-semibold text-gray-700 text-nowrap">{newKey}:</p>
                                      <p className="text-sm text-gray-600">{value}</p>
                                    </div>
                                  )
                                })}
                                {!row.key_electrical_specs && (
                                  <p className="text-sm text-gray-500">No electrical specifications available.</p>
                                )}
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        </TableCell>
                      </TableRow>
                    ) : null // Return null if the condition is false
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setUploadComplete(false);
                  setUploadedData([]);
                }}
              >
                Upload Different Files
              </Button>

              <Button
                onClick={handleSearch}
                disabled={!uploadedData.some(item => item.selected)}
                className="bg-primary hover:bg-red-700"
              >
                <Search className="mr-2 h-4 w-4" />
                Search Selected Components
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExcelUpload;
