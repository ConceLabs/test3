
import React, { useState, useCallback } from 'react';
import type { AppView, LegalDocument } from './types';
import { LEGAL_DOCUMENTS_SECTIONS } from './constants';
import HomeScreen from './components/HomeScreen';
import ContentViewScreen from './components/ContentViewScreen';
import CalculatorScreen from './components/CalculatorScreen';
import Header from './components/Header';
import { AppLogoIcon, SearchIcon } from './components/Icons';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedDocument, setSelectedDocument] = useState<LegalDocument | null>(null);
  const [fontSize, setFontSize] = useState<number>(16); // Default font size in px

  const navigateToHome = useCallback(() => {
    setCurrentView('home');
    setSelectedDocument(null);
  }, []);

  const navigateToContent = useCallback((docId: string) => {
    const doc = LEGAL_DOCUMENTS_SECTIONS.find(d => d.id === docId);
    if (doc && (doc.type === 'document' || doc.type === 'jurisprudence')) {
      setSelectedDocument(doc);
      setCurrentView('content');
    } else {
      console.error("Document not found or not a viewable type:", docId);
      navigateToHome();
    }
  }, [navigateToHome]);

  const navigateToCalculator = useCallback(() => {
    const calcDoc = LEGAL_DOCUMENTS_SECTIONS.find(d => d.type === 'calculator');
    if (calcDoc) {
      setSelectedDocument(calcDoc); 
      setCurrentView('calculator');
    }
  }, []);

  const handleFontSizeChange = useCallback((newSize: number) => {
    const minSize = 10;
    const maxSize = 32;
    setFontSize(Math.max(minSize, Math.min(maxSize, newSize)));
  }, []);
  
  const homeScreenHeaderControls = (
    <button 
      onClick={() => {/* Placeholder for search functionality */ alert("Función de búsqueda no implementada aún.");}} 
      aria-label="Buscar"
      className="p-2 text-brand-primary hover:text-brand-secondary"
    >
      <SearchIcon className="w-6 h-6" />
    </button>
  );

  const renderView = () => {
    switch (currentView) {
      case 'content':
        return selectedDocument ? (
          <ContentViewScreen
            document={selectedDocument}
            onBack={navigateToHome}
            fontSize={fontSize}
            onFontSizeChange={handleFontSizeChange}
          />
        ) : <ErrorView message="Documento no seleccionado o no encontrado." onBack={navigateToHome} />;
      case 'calculator':
        return selectedDocument ? (
            <CalculatorScreen 
              calculatorInfo={selectedDocument} 
              onBack={navigateToHome} 
            />
        ) : <ErrorView message="Calculadora no disponible." onBack={navigateToHome} />;
      case 'home':
      default:
        return (
          <HomeScreen
            documents={LEGAL_DOCUMENTS_SECTIONS}
            onNavigateToContent={navigateToContent}
            onNavigateToCalculator={navigateToCalculator}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg-light">
      {currentView === 'home' && (
         <Header 
            title="Biblioteca Jurídica" 
            showBackButton={false}
            leftIcon={<AppLogoIcon className="h-8 w-auto text-brand-primary" />}
            rightControls={homeScreenHeaderControls}
          />
      )}
      {/* Modified main to be a flex container for its child view */}
      <main className="flex-grow container mx-auto p-4 flex flex-col"> 
        {renderView()}
      </main>
      <footer className="text-center p-4 text-sm text-gray-600 border-t border-gray-300 mt-auto">
        Biblioteca Jurídica © {new Date().getFullYear()}
      </footer>
    </div>
  );
};

interface ErrorViewProps {
  message: string;
  onBack: () => void;
}

const ErrorView: React.FC<ErrorViewProps> = ({ message, onBack }) => (
  <div className="text-center p-10">
    <p className="text-red-500 text-xl mb-4">{message}</p>
    <button
      onClick={onBack}
      className="px-4 py-2 bg-brand-primary text-white rounded hover:bg-brand-secondary transition-colors"
    >
      Volver al Inicio
    </button>
  </div>
);


export default App;
