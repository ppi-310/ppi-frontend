// Queries reutilizables para indicadores y sus filtros.
// Todas son async server-side (corren en el servidor de Next.js).

import { supabase } from '@/utils/supabase';

// ─── Tipos compartidos ────────────────────────────────────────────────────

export type Tag = { id_attribute: number; name: string };

export type Indicator = {
  id_indicator: number;
  slug: string;
  name: string;
  id_dimension: number;
  id_granularity: number;
  granularity?: { name: string } | null;
  // Supabase no auto-detecta el M:N indicator <-> attribute, así que vamos
  // explícitos pasando por la pivote indicator_attribute.
  indicator_attribute?: { attribute: Tag | null }[] | null;
};

export type Granularity = { id_granularity: number; name: string };

export type IndicatorFilters = {
  q?: string;          // texto a buscar en el nombre
  granularity?: string; // nombre de granularidad ("Case", "Activity", ...)
  tags?: string[];      // nombres de tags ("act", "case", ...)
};

// ─── Helpers ──────────────────────────────────────────────────────────────

/** Convierte searchParams (de Next.js) a IndicatorFilters tipado. */
export function parseFilters(
  sp: Record<string, string | string[] | undefined>,
): IndicatorFilters {
  const tagsRaw = sp.tag;
  const tags = Array.isArray(tagsRaw)
    ? tagsRaw
    : typeof tagsRaw === 'string' && tagsRaw.length > 0
      ? tagsRaw.split(',')
      : [];
  return {
    q: typeof sp.q === 'string' && sp.q.trim() ? sp.q.trim() : undefined,
    granularity:
      typeof sp.granularity === 'string' && sp.granularity ? sp.granularity : undefined,
    tags,
  };
}

// ─── Queries ──────────────────────────────────────────────────────────────

/**
 * Indicadores filtrados.
 * Si dimensionId es null/undefined => devuelve todos (page general).
 */
export async function getFilteredIndicators(
  dimensionId: number | null,
  filters: IndicatorFilters,
): Promise<Indicator[]> {
  // Si vienen tags, primero buscamos los id_indicator que matchean
  let restrictToIds: number[] | null = null;
  if (filters.tags && filters.tags.length > 0) {
    // Resolver nombres de tag -> ids
    const { data: attrRows } = await supabase
      .from('attribute')
      .select('id_attribute, name')
      .in('name', filters.tags);
    const tagIds = (attrRows ?? []).map((r) => r.id_attribute);
    if (tagIds.length === 0) {
      return [];
    }
    // Indicadores que tienen AL MENOS UNO de esos tags (OR)
    const { data: linkRows } = await supabase
      .from('indicator_attribute')
      .select('id_indicator')
      .in('id_attribute', tagIds);
    const ids = [...new Set((linkRows ?? []).map((r) => r.id_indicator))];
    if (ids.length === 0) return [];
    restrictToIds = ids;
  }

  let query = supabase
    .from('indicator')
    .select(
      '*, granularity:id_granularity(name), indicator_attribute(attribute(id_attribute, name))',
    )
    .order('name');

  if (dimensionId !== null && dimensionId !== undefined) {
    query = query.eq('id_dimension', dimensionId);
  }

  if (filters.q) {
    query = query.ilike('name', `%${filters.q}%`);
  }

  if (filters.granularity) {
    // resolver nombre -> id
    const { data: granRow } = await supabase
      .from('granularity')
      .select('id_granularity')
      .eq('name', filters.granularity)
      .maybeSingle();
    if (granRow) {
      query = query.eq('id_granularity', granRow.id_granularity);
    } else {
      return [];
    }
  }

  if (restrictToIds !== null) {
    query = query.in('id_indicator', restrictToIds);
  }

  const { data, error } = await query;
  if (error) {
    console.error('getFilteredIndicators error:', error);
    return [];
  }
  return (data ?? []) as Indicator[];
}

/**
 * Granularidades que efectivamente tienen al menos un indicador en esta dimensión.
 * Si dimensionId es null => todas.
 */
export async function getAvailableGranularities(
  dimensionId: number | null,
): Promise<Granularity[]> {
  let q = supabase.from('indicator').select('id_granularity, granularity:id_granularity(name)');
  if (dimensionId !== null && dimensionId !== undefined) {
    q = q.eq('id_dimension', dimensionId);
  }
  const { data, error } = await q;
  if (error) {
    console.error('getAvailableGranularities error:', error);
    return [];
  }
  // Dedup por id_granularity
  const seen = new Map<number, Granularity>();
  for (const row of data ?? []) {
    const r = row as unknown as {
      id_granularity: number;
      granularity: { name: string } | null;
    };
    if (r.id_granularity && r.granularity?.name && !seen.has(r.id_granularity)) {
      seen.set(r.id_granularity, {
        id_granularity: r.id_granularity,
        name: r.granularity.name,
      });
    }
  }
  return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Tags que efectivamente aparecen en al menos un indicador en esta dimensión.
 * Si dimensionId es null => todos los tags usados.
 */
export async function getAvailableTags(dimensionId: number | null): Promise<Tag[]> {
  // Traemos todos los indicadores de la dimensión con sus tags vía pivote
  let q = supabase
    .from('indicator')
    .select('id_indicator, indicator_attribute(attribute(id_attribute, name))');
  if (dimensionId !== null && dimensionId !== undefined) {
    q = q.eq('id_dimension', dimensionId);
  }
  const { data, error } = await q;
  if (error) {
    console.error('getAvailableTags error:', error);
    return [];
  }
  const seen = new Map<number, Tag>();
  for (const row of data ?? []) {
    const r = row as unknown as {
      indicator_attribute: { attribute: Tag | null }[] | null;
    };
    for (const ia of r.indicator_attribute ?? []) {
      const tag = ia.attribute;
      if (tag && !seen.has(tag.id_attribute)) {
        seen.set(tag.id_attribute, tag);
      }
    }
  }
  return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name));
}
