import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { ComponentResult, SearchQuery, EmailData, ExcelRowData } from '@/lib/types';
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
const mockResults: ComponentResult[] = [
  {
    id: '1',
    productNumber: '744771147',
    competitor: 'Murata',
    category: 'Inductors',
    alternative: 'WE-LQS 744032'
  },
  {
    id: '2',
    productNumber: '744773356',
    competitor: 'TDK',
    category: 'Capacitors',
    alternative: 'WE-XHMI 74438356'
  },
  {
    id: '3',
    productNumber: '744727825',
    competitor: 'Vishay',
    category: 'Resistors',
    alternative: 'WE-MAPI 74437368'
  },
  {
    id: '4',
    productNumber: '744725168',
    competitor: 'Kemet',
    category: 'Capacitors',
    alternative: 'WE-CBAT 74437283'
  },
  {
    id: '5',
    productNumber: '744779243',
    competitor: 'TDK',
    category: 'Inductors',
    alternative: 'WE-PD 744778012'
  }
];

const Home: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('excel');
  const [results, setResults] = useState<ComponentResult[]>([]);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  // Search mutation
  const searchMutation = useMutation({
    mutationFn: (searchData: SearchQuery) => {
      // For demo purposes, we'll just wait and return mock data
      // In a real app, this would call the API
      console.log('Searching with:', searchData);
      return new Promise<ComponentResult[]>(resolve => {
        // Generate more results for Excel search
        if (searchData.method === 'excel' && searchData.selectedItems) {
          const moreResults = [...mockResults];
          // Add more mock results based on the selected items
          searchData.selectedItems.forEach((item, index) => {
            if (index < 3) return; // Skip first few to avoid duplicates with mockResults
            moreResults.push({
              id: `generated-${item.id}`,
              productNumber: item.partNumber,
              competitor: item.manufacturer,
              category: ['Inductors', 'Capacitors', 'Resistors', 'Connectors', 'Diodes'][Math.floor(Math.random() * 5)],
              alternative: `WE-${Math.floor(Math.random() * 1000000)}`
            });
          });
          setTimeout(() => resolve(moreResults), 1500);
        } else {
          setTimeout(() => resolve(mockResults), 1500);
        }
      });
    },
    onSuccess: (data) => {
      setResults(data.map(item => ({ ...item, selected: false })));
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
  const handleExcelSearch = (selectedItems: ExcelRowData[]) => {
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
            <h1 className="text-xl sm:text-2xl font-bold text-accent">Component Finder</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">Find matching components and alternatives for your projects</p>
          </div>

          {/* Search Section */}
          <div className="p-4 sm:p-6">
            <SearchTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            
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
