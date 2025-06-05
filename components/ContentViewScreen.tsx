
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { LegalDocument, DocumentSection, Article } from '../types';
import Header from './Header';
import { PlusIcon, MinusIcon, ChevronLeftIcon, ChevronRightIcon, XCircleIcon } from './Icons';

interface ContentViewScreenProps {
  document: LegalDocument;
  onBack: () => void;
  fontSize: number;
  onFontSizeChange: (newSize: number) => void;
}

// Helper to create highlighted HTML string
const getHighlightedHtml = (html: string, searchTerm: string): string => {
  if (!searchTerm.trim()) return html;
  // This regex is basic. For complex HTML, a DOM-based approach would be more robust
  // but also much more complex to implement here.
  // This approach might break HTML structure if searchTerm matches parts of tags.
  // A safer way would be to parse to DOM, walk text nodes, and then serialize back.
  // However, for simplicity as requested:
  try {
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    // Apply to text nodes only (very simplified attempt)
    // This is still not perfectly safe, but better than a blind replace on raw HTML string.
    // A full solution would involve a proper HTML parser.
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const walk = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent) {
          const newTextContent = node.textContent.replace(regex, '<mark class="bg-yellow-200 rounded px-0.5">$1</mark>');
          if (newTextContent !== node.textContent) {
            const span = document.createElement('span');
            span.innerHTML = newTextContent;
            node.parentNode?.replaceChild(span, node);
          }
        }
      } else if (node.nodeType === Node.ELEMENT_NODE && node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE') {
        // Don't traverse into <script> or <style> tags
        Array.from(node.childNodes).forEach(walk);
      }
    };

    walk(tempDiv);
    return tempDiv.innerHTML;

  } catch (e) {
    console.error("Error highlighting HTML:", e);
    return html; // return original HTML on error
  }
};


// Component for structured content (existing logic)
const HighlightedText: React.FC<{
  text: string;
  searchTerm: string;
  articleId: string;
  currentHighlightedMatchId: string | null;
}> = ({ text, searchTerm, articleId, currentHighlightedMatchId }) => {
  if (!searchTerm.trim()) {
    return <>{text}</>;
  }
  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  let localMatchCount = 0;

  return (
    <>
      {parts.map((part, index) => {
        if (part.toLowerCase() === searchTerm.toLowerCase()) {
          const matchId = `match-${articleId}-${localMatchCount++}`;
          return (
            <mark
              key={`${articleId}-match-${index}`}
              id={matchId}
              className={`${
                matchId === currentHighlightedMatchId ? 'bg-yellow-400 ring-1 ring-orange-500' : 'bg-yellow-200'
              } rounded px-0.5`}
            >
              {part}
            </mark>
          );
        }
        return <React.Fragment key={`${articleId}-text-${index}`}>{part}</React.Fragment>;
      })}
    </>
  );
};

const RenderArticle: React.FC<{
  article: Article;
  fontSize: number;
  searchTerm: string;
  currentHighlightedMatchId: string | null;
}> = ({ article, fontSize, searchTerm, currentHighlightedMatchId }) => {
  return (
    <div className="mb-3 pl-4 border-l-2 border-brand-accent" id={`article-container-${article.id}`}>
      <h4 className="font-semibold text-brand-text" style={{ fontSize: `${fontSize * 1.1}px` }}>
        {article.number}
      </h4>
      <p className="text-gray-700 leading-relaxed" style={{ fontSize: `${fontSize}px` }}>
        <HighlightedText
          text={article.text}
          searchTerm={searchTerm}
          articleId={article.id}
          currentHighlightedMatchId={currentHighlightedMatchId}
        />
      </p>
      {article.subsections && article.subsections.map(sub => (
        <RenderArticle
          key={sub.id}
          article={sub}
          fontSize={fontSize}
          searchTerm={searchTerm}
          currentHighlightedMatchId={currentHighlightedMatchId}
        />
      ))}
    </div>
  );
};

const RenderSection: React.FC<{
  section: DocumentSection;
  fontSize: number;
  level: number;
  searchTerm: string;
  currentHighlightedMatchId: string | null;
}> = ({ section, fontSize, level, searchTerm, currentHighlightedMatchId }) => {
  const HeadingTag = `h${Math.min(level + 1, 6)}` as keyof React.JSX.IntrinsicElements;
  
  return (
    <div className={`mb-6 ${level > 1 ? 'ml-4' : ''}`}>
      <HeadingTag 
        className="font-bold text-brand-primary mb-2 border-b border-brand-secondary pb-1"
        style={{ fontSize: `${fontSize * (1.5 - level * 0.1)}px` }}
      >
        {section.title}
      </HeadingTag>
      {section.articles.map((article) => (
        <RenderArticle
          key={article.id}
          article={article}
          fontSize={fontSize}
          searchTerm={searchTerm}
          currentHighlightedMatchId={currentHighlightedMatchId}
        />
      ))}
      {section.subsections && section.subsections.map(subSection => (
         <RenderSection
            key={subSection.id}
            section={subSection}
            fontSize={fontSize}
            level={level + 1}
            searchTerm={searchTerm}
            currentHighlightedMatchId={currentHighlightedMatchId}
          />
      ))}
    </div>
  );
};


const ContentViewScreen: React.FC<ContentViewScreenProps> = ({ document, onBack, fontSize, onFontSizeChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allFoundMatches, setAllFoundMatches] = useState<{ elementId: string, articleId: string }[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);

  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [isLoadingHtml, setIsLoadingHtml] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const isHtmlView = useMemo(() => !!document.htmlPath, [document.htmlPath]);

  useEffect(() => {
    if (document.htmlPath) {
      setIsLoadingHtml(true);
      setHtmlContent(null);
      setFetchError(null);
      fetch(document.htmlPath)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Error ${response.status}: No se pudo cargar el documento.`);
          }
          return response.text();
        })
        .then(data => {
          setHtmlContent(data);
          setIsLoadingHtml(false);
        })
        .catch(error => {
          console.error("Failed to fetch HTML content:", error);
          setFetchError(error.message || "Error al cargar contenido.");
          setIsLoadingHtml(false);
        });
    } else {
      // Reset HTML states if not an HTML document
      setHtmlContent(null);
      setIsLoadingHtml(false);
      setFetchError(null);
    }
  }, [document.htmlPath, document.id]); // document.id to refetch if doc changes

  // Effect for structured content search (original logic)
  useEffect(() => {
    if (isHtmlView || !document.content || !searchTerm.trim()) {
      setAllFoundMatches([]);
      setCurrentMatchIndex(-1);
      return;
    }

    const matches: { elementId: string, articleId: string }[] = [];
    const processArticle = (article: Article, _articleIndex: number) => {
      const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      let localIndexInArticle = 0;
      while (regex.exec(article.text) !== null) {
        matches.push({
          elementId: `match-${article.id}-${localIndexInArticle}`,
          articleId: article.id,
        });
        localIndexInArticle++;
      }
      if (article.subsections) {
        article.subsections.forEach((sub, subIndex) => processArticle(sub, subIndex));
      }
    };

    const processSection = (section: DocumentSection) => {
      section.articles.forEach((art, artIdx) => processArticle(art, artIdx));
      if (section.subsections) {
        section.subsections.forEach(processSection);
      }
    };

    document.content.forEach(processSection);
    setAllFoundMatches(matches);
    setCurrentMatchIndex(matches.length > 0 ? 0 : -1);

  }, [searchTerm, document.content, isHtmlView, document.id]);

  // Effect for scrolling to match (for structured content)
  useEffect(() => {
    if (!isHtmlView && currentMatchIndex !== -1 && allFoundMatches[currentMatchIndex]) {
      // FIX: Use window.document to avoid conflict with the 'document' prop
      const element = window.document.getElementById(allFoundMatches[currentMatchIndex].elementId);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentMatchIndex, allFoundMatches, isHtmlView]);

  const handleNextMatch = useCallback(() => {
    if (isHtmlView || allFoundMatches.length === 0) return;
    setCurrentMatchIndex(prev => (prev + 1) % allFoundMatches.length);
  }, [allFoundMatches.length, isHtmlView]);

  const handlePrevMatch = useCallback(() => {
    if (isHtmlView || allFoundMatches.length === 0) return;
    setCurrentMatchIndex(prev => (prev - 1 + allFoundMatches.length) % allFoundMatches.length);
  }, [allFoundMatches.length, isHtmlView]);
  
  const currentHighlightedMatchId = useMemo(() => {
    if (isHtmlView) return null;
    return allFoundMatches[currentMatchIndex]?.elementId || null;
  }, [allFoundMatches, currentMatchIndex, isHtmlView]);

  const processedHtmlForDisplay = useMemo(() => {
    if (isHtmlView && htmlContent) {
      return getHighlightedHtml(htmlContent, searchTerm);
    }
    return null;
  }, [isHtmlView, htmlContent, searchTerm]);


  const searchControls = (
    <div className="flex items-center space-x-1 bg-gray-50 p-1 rounded-md border border-gray-300">
      <input
        type="search"
        placeholder="Buscar..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-brand-accent focus:border-brand-accent w-32 sm:w-auto"
        aria-label="Buscar en documento"
      />
      {searchTerm && (
        <button 
          onClick={() => setSearchTerm('')} 
          className="p-1 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-200"
          aria-label="Limpiar búsqueda"
        >
          <XCircleIcon className="w-5 h-5" />
        </button>
      )}
      {searchTerm && !isHtmlView && allFoundMatches.length > 0 && (
        <>
          <button onClick={handlePrevMatch} className="p-1 text-brand-primary hover:bg-gray-200 rounded-full" aria-label="Resultado anterior">
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <span className="text-xs px-1 text-brand-text tabular-nums" aria-live="polite">
            {currentMatchIndex + 1}/{allFoundMatches.length}
          </span>
          <button onClick={handleNextMatch} className="p-1 text-brand-primary hover:bg-gray-200 rounded-full" aria-label="Siguiente resultado">
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </>
      )}
      {searchTerm && !isHtmlView && allFoundMatches.length === 0 && (
          <span className="text-xs px-2 text-gray-500">No hay resultados</span>
      )}
       {searchTerm && isHtmlView && (
          <span className="text-xs px-2 text-gray-500 italic">Resaltando en HTML</span>
      )}
    </div>
  );

  const zoomControls = (
    <div className="flex items-center">
      <button
        onClick={() => onFontSizeChange(fontSize - 2)}
        aria-label="Disminuir tamaño de texto"
        disabled={fontSize <= 10}
        className="p-2 text-brand-primary hover:text-brand-secondary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <MinusIcon className="w-6 h-6" />
      </button>
      <span className="w-10 text-center text-sm text-brand-text tabular-nums" aria-live="polite">{fontSize}px</span>
      <button
        onClick={() => onFontSizeChange(fontSize + 2)}
        aria-label="Aumentar tamaño de texto"
        disabled={fontSize >= 32}
        className="p-2 text-brand-primary hover:text-brand-secondary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <PlusIcon className="w-6 h-6" />
      </button>
    </div>
  );

  const headerRightControls = (
    <div className="flex flex-wrap items-center space-x-2">
      {searchControls}
      {zoomControls}
    </div>
  );

  const mainContentStyle = { fontSize: `${fontSize}px` };

  return (
    // Changed h-full to flex-grow for consistent height management
    <div className="flex flex-col flex-grow max-h-screen"> {/* Use max-h-screen if overall screen should not scroll, otherwise remove it if content within should scroll */}
      <Header 
        title={document.shortName} 
        showBackButton={true} 
        onBack={onBack}
        rightControls={headerRightControls} 
      />
      {/* This div will grow and allow its content to scroll */}
      <div className="flex-grow overflow-y-auto p-4 bg-white rounded-lg shadow mt-4" id="content-view-main" style={mainContentStyle}>
        <h1 className="text-2xl font-bold text-brand-primary mb-2" style={{ fontSize: `${fontSize * 1.6}px` }}>
          {document.fullName}
        </h1>
        {document.description && (
            <p className="text-sm text-gray-600 mb-4 italic" style={{ fontSize: `${fontSize * 0.9}px` }}>
                {document.description}
            </p>
        )}

        {isLoadingHtml && <p className="text-center text-gray-500 py-10">Cargando contenido...</p>}
        {fetchError && <p className="text-center text-red-500 py-10">{fetchError}</p>}

        {isHtmlView && processedHtmlForDisplay && !isLoadingHtml && !fetchError && (
          <div dangerouslySetInnerHTML={{ __html: processedHtmlForDisplay }} />
        )}

        {!isHtmlView && document.content && !isLoadingHtml && !fetchError && (
          document.content.map((section, idx) => (
            <RenderSection
              key={section.id || `section-${idx}`}
              section={section}
              fontSize={fontSize}
              level={1}
              searchTerm={searchTerm}
              currentHighlightedMatchId={currentHighlightedMatchId}
            />
          ))
        )}
        
        {!isHtmlView && !document.content && !isLoadingHtml && !fetchError && (
            <p>Contenido no disponible para este documento.</p>
        )}
         {isHtmlView && !htmlContent && !isLoadingHtml && !fetchError && (
             <p>Contenido HTML no pudo ser mostrado.</p>
         )}

      </div>
    </div>
  );
};

export default ContentViewScreen;
