
export interface Article {
  id: string;
  number: string;
  text: string;
  subsections?: Article[]; // For nested articles or paragraphs
}

export interface DocumentSection {
  id: string;
  title: string;
  articles: Article[];
  subsections?: DocumentSection[]; // For nested titles/chapters
}

export interface LegalDocument {
  id: string;
  icon?: React.ElementType;
  shortName: string;
  fullName: string;
  description?: string;
  content?: DocumentSection[]; // For laws with structured content
  htmlPath?: string; // Path to HTML file for document content
  type: 'document' | 'calculator' | 'jurisprudence';
}

export type AppView = 'home' | 'content' | 'calculator';