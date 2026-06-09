import NavLink from './NavLink';
import TagButton from './TagButton';
import { cleanIndicatorName, type Indicator } from '@/lib/indicators';

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
                    <NavLink
                      href={`/indicators/${indicator.slug}`}
                      className="link-block-2 w-inline-block"
                    >
                      <div className="text-block-4">{cleanIndicatorName(indicator.name)}</div>
                    </NavLink>
                    <div className="div-block-9">
                      <div className="text-block-13">Granularity:</div>
                      <div className="text-block-3">{indicator.granularity?.name}</div>
                    </div>
                  </div>
                  <div>
                    <div className="collection-list-wrapper-2 w-dyn-list">
                      <div className="tag-button-group tag-button-group--card">
                        {indicator.indicator_attribute?.map(
                          (ia) =>
                            ia.attribute && (
                              <TagButton
                                key={ia.attribute.id_attribute}
                                name={ia.attribute.name}
                              />
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
