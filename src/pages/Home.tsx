import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { ResultRowData, SearchQuery, EmailData, OriginalData, ResultOriginalData } from '@/lib/types';
import { exportAsCSV, exportAsJSON } from '@/lib/utils';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchTabs from '@/components/SearchTabs';
import ExcelUpload from '@/components/ExcelUpload';
import ManualInput from '@/components/ManualInput';
import CameraCapture from '@/components/CameraCapture';
import ResultsSection from '@/components/ResultsSection';
import EmailModal from '@/components/EmailModal';

// Mock component data for demo
const mockResults: ResultRowData[] = [
  {
    "id": "1",
    "selected": false,
    "manufacturer": "Panasonic Electronic Components",
    "manufacturer_part_number": "ERJ-3EKF5901V",
    "wuerth_manufacturer_part_number": "WEK3EKF5901V",
    "reason_why_it_is_a_match": "It is the crrect fit",
    "component_type": "Resistor",
    "key_electrical_specs": {
      "Resistance": "5.9 kΩ",
      "Power_Rating": "0.1W (1/10W)",
      "Case_Code": "0603 (1608 Metric)",
      "Length": "1.60 mm",
      "Width": "0.80 mm",
      "Height": "0.55 mm",
      "Tolerance": "±1%",
      "Temperature_Coefficient": "±100 ppm/°C",
      "Minimum_Operating_Temperature": "-55°C",
      "Maximum_Operating_Temperature": "155°C"
    }
  }
];

const Home: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('excel');
  const [results, setResults] = useState<ResultRowData[]>([]);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  // Search mutation
  const searchMutation = useMutation({
    mutationFn: async (searchData: SearchQuery) => {
      console.log('Searching with:', searchData);

      if (searchData.method === 'excel' && searchData.selectedItems) {
        // Call the specific API endpoint for Excel search
        const response = await apiRequest(
          'POST',
          'http://172.203.218.183:8080/api/recommend_candidates',
          searchData.selectedItems
        );
        return response.json();
      }
      else if (searchData.method === 'manual') {
        // const response = await apiRequest(
        //   'POST',
        //   '/api/components/match-manual',
        //   {
        //     productNumber: searchData.productNumber,
        //     includeAlternatives: searchData.includeAlternatives
        //   }
        // );
        // return response.json();
        return mockResults;
      }
      else if (searchData.method === 'camera') {
        // const response = await apiRequest(
        //   'POST',
        //   '/api/components/match-image',
        //   {
        //     imageData: searchData.imageData
        //   }
        // );
        // return response.json();
        return mockResults;
      }

      throw new Error('Invalid search method');
    },
    onSuccess: (data) => {
      console.log('Search results:', data);
      setResults(data.map((item: ResultOriginalData) => ({
        ...item,
        id: Math.random().toString(36).substring(2, 15), // Generate a random string for ID
        selected: false
      })));
      toast({
        title: "Search completed",
        description: `Found ${data.length} matching components`,
      });
    },
    onError: () => {
      toast({
        title: "Search failed",
        description: "There was an error processing your request.",
        variant: "destructive"
      });
    }
  });

  // Email mutation
  const emailMutation = useMutation({
    mutationFn: (emailData: EmailData) => {
      console.log('Sending email:', emailData);
      // In a real app, this would call the API
      return new Promise<void>(resolve => {
        setTimeout(() => resolve(), 1000);
      });
    },
    onSuccess: () => {
      toast({
        title: "Email sent",
        description: "Your email has been sent successfully."
      });
    },
    onError: () => {
      toast({
        title: "Email failed",
        description: "There was an error sending your email.",
        variant: "destructive"
      });
    }
  });

  // Search handlers
  const handleExcelSearch = (selectedItems: OriginalData[]) => {
    searchMutation.mutate({
      method: 'excel',
      selectedItems
    });
  };

  const handleManualSearch = (productNumber: string, includeAlternatives: boolean) => {
    searchMutation.mutate({
      method: 'manual',
      productNumber,
      includeAlternatives
    });
  };

  const handleCameraSearch = (imageData: string) => {
    searchMutation.mutate({
      method: 'camera',
      imageData
    });
  };

  // Result handlers
  const handleToggleSelect = (id: string, selected: boolean) => {
    setResults(prev =>
      prev.map(item =>
        item.id === id ? { ...item, selected } : item
      )
    );
  };

  const handleToggleSelectAll = (selected: boolean) => {
    setResults(prev => prev.map(item => ({ ...item, selected })));
  };

  const handleExportCSV = () => {
    exportAsCSV(results);
  };

  const handleExportJSON = () => {
    exportAsJSON(results);
  };

  const handleEmailResults = () => {
    const selectedComponents = results.filter(item => item.selected);

    if (selectedComponents.length === 0) {
      toast({
        title: "No components selected",
        description: "Please select at least one component to email.",
        variant: "destructive"
      });
      return;
    }

    setIsEmailModalOpen(true);
  };

  const handleSendEmail = (emailData: EmailData) => {
    emailMutation.mutate(emailData);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h1 className="text-xl sm:text-2xl font-bold text-accent">Matching Algorithms</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">Find matching components and alternatives for your projects</p>
          </div>

          {/* Search Section */}
          <div className="p-4 sm:p-6">
            <SearchTabs activeTab={activeTab} setActiveTab={setActiveTab} setResults={setResults} />

            {activeTab === 'excel' && (
              <ExcelUpload onSearch={handleExcelSearch} />
            )}

            {activeTab === 'manual' && (
              <ManualInput onSearch={handleManualSearch} />
            )}

            {activeTab === 'camera' && (
              <CameraCapture onSearch={handleCameraSearch} />
            )}
          </div>

          {/* Results Section */}
          <ResultsSection
            results={results}
            loading={searchMutation.isPending}
            onExportCSV={handleExportCSV}
            onExportJSON={handleExportJSON}
            onEmailResults={handleEmailResults}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
          />

          {/* Email Modal */}
          <EmailModal
            isOpen={isEmailModalOpen}
            onClose={() => setIsEmailModalOpen(false)}
            selectedComponents={results.filter(item => item.selected)}
            onSendEmail={handleSendEmail}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
