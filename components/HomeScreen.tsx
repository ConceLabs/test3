
import React from 'react';
import type { LegalDocument } from '../types';

interface HomeScreenProps {
  documents: LegalDocument[];
  onNavigateToContent: (docId: string) => void;
  onNavigateToCalculator: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ documents, onNavigateToContent, onNavigateToCalculator }) => {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-4">
      {documents.map((doc) => {
        const IconComponent = doc.icon;
        return (
          <button
            key={doc.id}
            onClick={() => {
              if (doc.type === 'calculator') {
                onNavigateToCalculator();
              } else {
                onNavigateToContent(doc.id);
              }
            }}
            className="flex flex-col items-center justify-center text-center bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 aspect-square focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-opacity-50"
            aria-label={doc.fullName}
          >
            {IconComponent && <IconComponent className="w-10 h-10 sm:w-12 sm:h-12 text-brand-primary mb-2" />}
            <span className="text-xs sm:text-sm font-medium text-brand-text leading-tight">
              {doc.shortName}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default HomeScreen;
