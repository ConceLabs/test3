
import React from 'react';
import type { LegalDocument } from '../types';
import Header from './Header';

interface CalculatorScreenProps {
  calculatorInfo: LegalDocument;
  onBack: () => void;
}

const CalculatorScreen: React.FC<CalculatorScreenProps> = ({ calculatorInfo, onBack }) => {
  if (!calculatorInfo.htmlPath) {
    return (
      <div className="flex flex-col flex-grow"> {/* Use flex-grow for error state too */}
        <Header title="Error" showBackButton={true} onBack={onBack} />
        <div className="flex-grow p-4 bg-white rounded-lg shadow mt-4 text-center flex items-center justify-center">
          <p className="text-red-500">Error: No se encontró la ruta HTML para esta calculadora.</p>
        </div>
      </div>
    );
  }

  return (
    // Changed h-full to flex-grow to correctly fill space provided by parent flex container
    <div className="flex flex-col flex-grow"> 
      <Header title={calculatorInfo.shortName} showBackButton={true} onBack={onBack} />
      {/* This div will grow to fill the remaining space in its parent flex container */}
      <div className="flex-grow mt-1 rounded-lg shadow overflow-hidden"> 
        <iframe
          src={calculatorInfo.htmlPath}
          title={calculatorInfo.fullName}
          // h-full now correctly refers to the height of its parent, which is a flex-grow item
          className="w-full h-full border-none" 
          // Removed minHeight style, as height should be determined by flex layout
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      </div>
    </div>
  );
};

export default CalculatorScreen;
