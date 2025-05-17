import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Search } from 'lucide-react';

interface ManualInputProps {
  onSearch: (productNumber: string, includeAlternatives: boolean) => void;
}

const ManualInput: React.FC<ManualInputProps> = ({ onSearch }) => {
  const [productNumber, setProductNumber] = useState('');
  const [includeAlternatives, setIncludeAlternatives] = useState(false);

  const handleSubmit = () => {
    if (productNumber.trim()) {
      onSearch(productNumber, includeAlternatives);
    }
  };

  return (
    <div className="py-4 sm:py-6">
      <div className="w-full max-w-xl mx-auto">
        <div className="mb-4 sm:mb-5">
          <Label htmlFor="product-number" className="block text-sm font-medium text-gray-700 mb-1">
            Product Number
          </Label>
          <div className="relative rounded-md shadow-sm">
            <Input
              type="text"
              id="product-number"
              placeholder="Enter product number (e.g. 744771147)"
              value={productNumber}
              onChange={(e) => setProductNumber(e.target.value)}
              className="pr-10"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <p className="mt-2 text-xs sm:text-sm text-gray-500">Enter a product number to find matching components</p>
        </div>

        <div className="flex items-center mt-4 mb-6">
          <Checkbox 
            id="include-alternatives" 
            checked={includeAlternatives}
            onCheckedChange={(checked) => setIncludeAlternatives(checked === true)}
          />
          <Label htmlFor="include-alternatives" className="ml-2 text-xs sm:text-sm text-gray-700">
            Include alternative products in search results
          </Label>
        </div>
        
        <div className="mt-6 flex justify-center">
          <Button 
            onClick={handleSubmit}
            disabled={!productNumber.trim()}
            className="bg-primary hover:bg-red-700 w-full sm:w-auto"
          >
            <Search className="mr-2 h-4 w-4" />
            Search Components
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ManualInput;
