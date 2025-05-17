import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Footer: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const isSectionExpanded = (section: string) => expandedSection === section;

  const footerSections = [
    {
      id: 'products',
      title: 'Products',
      links: [
        { text: 'Passive Components', href: '#' },
        { text: 'Electromechanical Components', href: '#' },
        { text: 'Optoelectronic Components', href: '#' },
        { text: 'Capacitors', href: '#' }
      ]
    },
    {
      id: 'solutions',
      title: 'Solutions',
      links: [
        { text: 'Automotive', href: '#' },
        { text: 'Industrial', href: '#' },
        { text: 'Consumer Electronics', href: '#' },
        { text: 'Medical', href: '#' }
      ]
    },
    {
      id: 'support',
      title: 'Support',
      links: [
        { text: 'Technical Support', href: '#' },
        { text: 'Documentation', href: '#' },
        { text: 'Sample Requests', href: '#' },
        { text: 'Contact Us', href: '#' }
      ]
    },
    {
      id: 'company',
      title: 'Company',
      links: [
        { text: 'About Us', href: '#' },
        { text: 'Careers', href: '#' },
        { text: 'News', href: '#' },
        { text: 'Legal', href: '#' }
      ]
    }
  ];

  return (
    <footer className="bg-accent text-white py-6 sm:py-8 mt-8 sm:mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Footer with Accordion */}
        <div className="md:hidden">
          {footerSections.map(section => (
            <div key={section.id} className="border-b border-gray-700">
              <button 
                className="w-full flex justify-between items-center py-3"
                onClick={() => toggleSection(section.id)}
              >
                <h3 className="text-base font-semibold">{section.title}</h3>
                {isSectionExpanded(section.id) ? 
                  <ChevronUp className="h-4 w-4" /> : 
                  <ChevronDown className="h-4 w-4" />
                }
              </button>
              {isSectionExpanded(section.id) && (
                <ul className="space-y-2 pb-3">
                  {section.links.map((link, idx) => (
                    <li key={idx}>
                      <a href={link.href} className="text-sm hover:text-gray-300">
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Desktop Footer */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {footerSections.map(section => (
            <div key={section.id}>
              <h3 className="text-base lg:text-lg font-semibold mb-3 lg:mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, idx) => (
                  <li key={idx}>
                    <a href={link.href} className="text-sm hover:text-gray-300">
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 sm:mt-8 sm:pt-8 border-t border-gray-700">
          <p className="text-xs sm:text-sm text-gray-400 text-center md:text-left">
            © {new Date().getFullYear()} Würth Elektronik. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
