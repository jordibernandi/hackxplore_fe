import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center">
        <div className="flex items-center">
          {/* Logo */}
          <div className="w-16 h-16 bg-primary flex items-center justify-center">
            <img src="/we-logo.jpeg" alt="Würth Elektronik Logo" className="h-full" />
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-4 lg:space-x-8">
          <a href="#" className="text-accent hover:text-primary font-semibold text-sm lg:text-base">Products</a>
          <a href="#" className="text-accent hover:text-primary font-semibold text-sm lg:text-base">Solutions</a>
          <a href="#" className="text-accent hover:text-primary font-semibold text-sm lg:text-base">Services</a>
          <a href="#" className="text-accent hover:text-primary font-semibold text-sm lg:text-base">Support</a>
        </nav>

        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <Button className="hidden md:block bg-primary hover:bg-red-700 text-white text-sm lg:text-base">
            Contact Us
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute w-full bg-white border-t border-gray-200 shadow-lg z-10">
          <nav className="flex flex-col px-4 py-2">
            <a href="#" className="py-3 border-b border-gray-100 text-accent hover:text-primary font-semibold">Products</a>
            <a href="#" className="py-3 border-b border-gray-100 text-accent hover:text-primary font-semibold">Solutions</a>
            <a href="#" className="py-3 border-b border-gray-100 text-accent hover:text-primary font-semibold">Services</a>
            <a href="#" className="py-3 border-b border-gray-100 text-accent hover:text-primary font-semibold">Support</a>
            <div className="py-3">
              <Button className="w-full bg-primary hover:bg-red-700 text-white">
                Contact Us
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
