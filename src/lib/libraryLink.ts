// Mapeo indicador (DB) -> documentación de la librería de Python
// process-performance-indicators (https://nicoabarca.github.io/process-performance-indicators/).
//
// El JSON `library_permalinks.json` se generó offline matcheando los 307
// indicadores de la base de datos contra las 310 funciones de la librería.
// Se indexa por `slug` (estable entre entornos de Supabase).

import permalinks from './library_permalinks.json';

export type LibraryLink = {
  function: string;
  dimension: 'cost' | 'flexibility' | 'general' | 'quality' | 'time';
  granularity_file: 'activities' | 'cases' | 'groups' | 'instances';
  permalink: string;     // URL deep-link al ancla del indicador
  module_url: string;    // URL al módulo (fallback)
  function_path: string; // ej. "process_performance_indicators.indicators.time.cases.active_time"
};

const map = permalinks as Record<string, LibraryLink>;

/**
 * Devuelve el permalink + path de la función Python para un indicador
 * a partir de su slug. Si no hay match en el mapeo (caso raro), devuelve null.
 */
export function getLibraryLink(slug: string | null | undefined): LibraryLink | null {
  if (!slug) return null;
  return map[slug] ?? null;
}
