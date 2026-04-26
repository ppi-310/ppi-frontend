'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { Tag, Granularity } from '@/lib/indicators';

type Props = {
  granularities: Granularity[];
  tags: Tag[];
};

export default function IndicatorsSidebar({ granularities, tags }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentGran = searchParams.get('granularity') ?? '';
  const currentQ = searchParams.get('q') ?? '';
  const currentTags = (searchParams.get('tag')?.split(',') ?? []).filter(Boolean);

  // Search local con debounce
  const [qInput, setQInput] = useState(currentQ);
  useEffect(() => {
    setQInput(currentQ);
  }, [currentQ]);

  function buildUrl(updates: Record<string, string | string[] | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
        params.delete(key);
      } else if (Array.isArray(value)) {
        params.set(key, value.join(','));
      } else {
        params.set(key, value);
      }
    }
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  function navigate(updates: Record<string, string | string[] | null>) {
    router.push(buildUrl(updates), { scroll: false });
  }

  function onSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate({ q: qInput || null });
  }

  function onGranularityChange(name: string) {
    // Si ya estaba seleccionada, des-selecciona (toggle)
    navigate({ granularity: currentGran === name ? null : name });
  }

  function onTagToggle(name: string) {
    const next = currentTags.includes(name)
      ? currentTags.filter((t) => t !== name)
      : [...currentTags, name];
    navigate({ tag: next });
  }

  function clearGranularity() {
    navigate({ granularity: null });
  }

  function clearAll() {
    router.push(pathname, { scroll: false });
  }

  const hasAnyFilter = currentQ || currentGran || currentTags.length > 0;

  return (
    <div className="column-3 w-col w-col-3 w-col-stack w-col-small-small-stack">
      {/* Search */}
      <form onSubmit={onSearchSubmit}>
        <div className="input-wrapper">
          <div className="input-label">Search</div>
          <input
            className="input w-input"
            maxLength={256}
            name="q"
            placeholder="Name"
            type="text"
            value={qInput}
            onChange={(e) => setQInput(e.target.value)}
          />
        </div>
      </form>

      {/* Granularity */}
      <div className="filter-ui-section">
        <div className="text-block-8">Filter by Granularity</div>
        <button
          type="button"
          className="link-2 bg-transparent cursor-pointer border-none"
          onClick={clearGranularity}
        >
          Clear
        </button>
        <div className="w-dyn-list">
          <div role="list" className="w-dyn-items">
            {granularities.map((g) => (
              <div key={g.id_granularity} role="listitem" className="w-dyn-item">
                <label className="radio-field w-radio">
                  <input
                    type="radio"
                    name="granularity"
                    className="w-form-formradioinput input_radio w-radio-input"
                    value={g.name}
                    checked={currentGran === g.name}
                    onChange={() => onGranularityChange(g.name)}
                  />
                  <span className="radio-button-label w-form-label">{g.name}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="filter-ui-section">
        <div className="text-block-9">Filter by Tags</div>
        <div className="w-dyn-list">
          <div role="list" className="w-dyn-items">
            {tags.map((t) => (
              <div key={t.id_attribute} role="listitem" className="w-dyn-item">
                <label className="w-checkbox check-field">
                  <input
                    type="checkbox"
                    className="w-checkbox-input checkbox"
                    checked={currentTags.includes(t.name)}
                    onChange={() => onTagToggle(t.name)}
                  />
                  <span className="checkbox-label w-form-label">{t.name}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {hasAnyFilter && (
        <button
          type="button"
          className="link-2 bg-transparent cursor-pointer border-none"
          onClick={clearAll}
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
