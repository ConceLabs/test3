import type { LegalDocument } from './types';
import { CalculatorIcon, BookOpenIcon, DocumentTextIcon } from './components/Icons';

export const LEGAL_DOCUMENTS_SECTIONS: LegalDocument[] = [
  {
    id: 'ley-rpa',
    shortName: 'LEY RPA',
    fullName: 'Ley de Responsabilidad Penal Adolescente',
    type: 'document',
    icon: DocumentTextIcon,
    htmlPath: '/leyes/ley-rpa.html',
    description: 'Regula la responsabilidad penal de los adolescentes y el procedimiento aplicable.',
  },
  {
    id: 'ley-rpa-diferida',
    shortName: 'LEY RPA (Diferida)',
    fullName: 'Ley de Responsabilidad Penal Adolescente (Aplicación Diferida)',
    type: 'document',
    icon: DocumentTextIcon,
    htmlPath: '/leyes/ley-rpa-diferida.html',
    description: 'Disposiciones sobre la aplicación diferida de la Ley RPA.',
  },
  {
    id: 'ley-violencia-estadios',
    shortName: 'LEY DE VIOLENCIA EN LOS ESTADIOS',
    fullName: 'Ley sobre Derechos y Deberes en los Espectáculos de Fútbol Profesional y su Reglamento',
    type: 'document',
    icon: DocumentTextIcon,
    htmlPath: '/leyes/ley-violencia-estadios.html',
    description: 'Previene y sanciona la violencia en espectáculos de fútbol.',
  },
  {
    id: 'ley-transito',
    shortName: 'LEY DE TRANSITO',
    fullName: 'Ley de Tránsito N° 18.290',
    type: 'document',
    icon: DocumentTextIcon,
    htmlPath: '/leyes/ley-transito.html',
    description: 'Normativa que rige el tránsito vehicular y peatonal.',
  },
  {
    id: 'ley-organica-mp',
    shortName: 'LEY ORGANICA DEL MINISTERIO PUBLICO',
    fullName: 'Ley Orgánica Constitucional del Ministerio Público',
    type: 'document',
    icon: DocumentTextIcon,
    htmlPath: '/leyes/ley-organica-mp.html',
    description: 'Estructura y funciones del Ministerio Público.',
  },
  {
    id: 'codigo-penal',
    shortName: 'CÓDIGO PENAL',
    fullName: 'Código Penal de la República de Chile',
    type: 'document',
    icon: DocumentTextIcon,
    htmlPath: '/leyes/codigo-penal.html',
    description: 'Define los delitos y sus respectivas penas.',
  },
  {
    id: 'calculadora-abonos',
    shortName: 'Calculadora Abono Arresto Nocturno',
    fullName: 'Calculadora de Abono por Arresto Nocturno',
    description: 'Calcula los días de abono por períodos de arresto nocturno.',
    type: 'calculator',
    icon: CalculatorIcon,
    htmlPath: '/calculators/abono-arresto-nocturno.html', // Path to the new HTML calculator
  },
  {
    id: 'minutas-jurisprudencia',
    shortName: 'Minutas Jurisprudencia',
    fullName: 'Acceso a Minutas y Extractos de Jurisprudencia',
    description: 'Consulta resúmenes de decisiones judiciales relevantes.',
    type: 'jurisprudence',
    icon: BookOpenIcon,
    content: [ 
        {
          id: 'juris-intro',
          title: 'Introducción a la Jurisprudencia',
          articles: [
            { id: 'juris-art-1', number: 'Concepto', text: 'La jurisprudencia se refiere al conjunto de sentencias y demás resoluciones judiciales emitidas en un mismo sentido por los órganos judiciales de un ordenamiento jurídico determinado.' },
          ],
        },
      ],
  },
];