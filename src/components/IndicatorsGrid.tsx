import Link from 'next/link';
import type { Indicator } from '@/lib/indicators';

type Props = {
  indicators: Indicator[];
};

export default function IndicatorsGrid({ indicators }: Props) {
  if (indicators.length === 0) {
    return (
      <div className="column-4 w-col w-col-9 w-col-stack w-col-small-small-stack">
        <div className="paragraph">
          No hay indicadores que coincidan con los filtros.
        </div>
      </div>
    );
  }

  return (
    <div className="column-4 w-col w-col-9 w-col-stack w-col-small-small-stack">
      <div>
        <div className="collection-list-wrapper w-dyn-list">
          <div role="list" className="collection-list-2 w-clearfix w-dyn-items w-row">
            {indicators.map((indicator) => (
              <div
                key={indicator.id_indicator}
                role="listitem"
                className="collection-item w-dyn-item w-col w-col-4"
              >
                <div className="div-block-4">
                  <div className="div-block-5">
                    <Link
                      href={`/indicators/${indicator.slug}`}
                      className="link-block-2 w-inline-block"
                    >
                      <div className="text-block-4">{indicator.name}</div>
                    </Link>
                    <div className="div-block-9">
                      <div className="text-block-13">Granularity:</div>
                      <div className="text-block-3">{indicator.granularity?.name}</div>
                    </div>
                  </div>
                  <div>
                    <div className="collection-list-wrapper-2 w-dyn-list">
                      <div role="list" className="collection-list-3 w-dyn-items">
                        {indicator.indicator_attribute?.map(
                          (ia) =>
                            ia.attribute && (
                              <div
                                key={ia.attribute.id_attribute}
                                role="listitem"
                                className="w-dyn-item"
                              >
                                <div>
                                  <div>{ia.attribute.name}</div>
                                </div>
                              </div>
                            ),
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
