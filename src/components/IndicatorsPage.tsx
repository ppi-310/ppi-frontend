// Layout compartido por todas las paginas de listado de indicadores.
// Recibe la dimension y los searchParams; resuelve queries y arma la UI.

import {
  getFilteredIndicators,
  getAvailableGranularities,
  getAvailableTags,
  parseFilters,
} from '@/lib/indicators';
import DimensionsNavbar, { type DimensionKey } from '@/components/DimensionsNavbar';
import IndicatorsSidebar from '@/components/IndicatorsSidebar';
import IndicatorsGrid from '@/components/IndicatorsGrid';

type Props = {
  current: DimensionKey;
  dimensionId: number | null;
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function IndicatorsPage({
  current,
  dimensionId,
  searchParams,
}: Props) {
  const filters = parseFilters(searchParams);

  const [indicators, granularities, tags] = await Promise.all([
    getFilteredIndicators(dimensionId, filters),
    getAvailableGranularities(dimensionId),
    getAvailableTags(dimensionId),
  ]);

  return (
    <main className="page-wrapper page-indicators">
      <div>
        <DimensionsNavbar current={current} />

        <div className="main-container_s1 indicators">
          <div className="w-form">
            <div className="form-2">
              <div className="columns-2 w-row">
                <IndicatorsSidebar granularities={granularities} tags={tags} />
                <IndicatorsGrid indicators={indicators} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
