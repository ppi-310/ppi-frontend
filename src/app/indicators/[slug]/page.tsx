import { supabase } from '@/utils/supabase';
import { notFound } from 'next/navigation';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { getLibraryLink } from '@/lib/libraryLink';

const renderLatex = (text: string | null) => {
  if (!text) return "-";
  return <Latex strict={false}>{text}</Latex>;
};


export default async function IndicatorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data: indicator, error } = await supabase
    .from('indicator')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !indicator) {
    return notFound();
  }

  const libraryLink = getLibraryLink(slug);

  return (
    <main className="page-wrapper">
      <div className="main-section-copy ppis">
        <div className="main-container_s1">
          <div className="div-block-6">

            <div className="up-part">
              <div className="ppi-title-row">
                <h2>{indicator.name}</h2>
                {libraryLink && (
                  <a
                    href={libraryLink.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="library-link-btn"
                    title={`Open ${libraryLink.function_path} in the Python library docs`}
                  >
                    <span>View in library docs</span>
                    <svg
                      aria-hidden="true"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                )}
              </div>
              {/* Usamos el renderLatex aquí */}
              <div><div className="text-block-5">{renderLatex(indicator.function_name)}</div></div>
              <div className="block-classes">
                <div className="class"><div>Dimension ID:</div><div>{indicator.id_dimension}</div></div>
                <div className="class"><div>Granularity ID:</div><div>{indicator.id_granularity}</div></div>
              </div>
            </div>

            <div className="columns-3 w-row">
              <div className="column-flexdown w-col w-col-6">
                <div className="box-attribites">
                  <h3>Description</h3>
                  <div><p className="paragraph">{indicator.explanation}</p></div>
                </div>
                
                <div className="box-attribites">
                  <h3>Potential use</h3>
                  <div><p className="paragraph">{indicator.potential_use || "-"}</p></div>
                </div>
                
                <div className="box-attribites">
                  <h3>Assumptions</h3>
                  <div><p className="paragraph">{indicator.assumptions || "-"}</p></div>
                  <div className="div-block-7">
                    <h4>Desired Value:</h4>
                    <div className="text-block-6">{indicator.desired_value?.toUpperCase() || "-"}</div>
                  </div>
                </div>
              </div>

              <div className="column-flexdown w-col w-col-6">
                <div className="box-attribites">
                  <h3>Required attributes</h3>
                  <div><p className="paragraph">act – Event attribute: activity<br/>case – Event attribute: case id</p></div>
                </div>
                
                <div className="box-attribites">
                  <h3>Equations</h3>
                  
                  <div>
                    <h4>Formula for practitioners</h4>
                    <p className="paragraph">{renderLatex(indicator.formalization_fp)}</p>
                    <div className="spacer_xs"></div>
                    <p className="paragraph whitespace-pre-wrap">{renderLatex(indicator.description_fp)}</p>
                  </div>
                  
                  <div className="mt-4">
                    <h4>Formal Definition</h4>
                    <p className="paragraph">{renderLatex(indicator.formalization_latex)}</p>
                  </div>
                </div>
              </div>

            </div>
            
            <div className="spacer_l"></div>
            
            <div className="div-block-8">
              <div className="w-layout-grid grid">
                <h4 className="h4">Tags</h4>
                <div className="collection-list-wrapper-3 w-dyn-list">
                  <div role="list" className="collection-list-4 w-dyn-items">
                    <div role="listitem" className="w-dyn-item"><div className="tag-chip">act</div></div>
                    <div role="listitem" className="w-dyn-item"><div className="tag-chip">case</div></div>
                  </div>
                </div>
              </div>
            </div>

            {libraryLink && (
              <>
                <div className="spacer_l"></div>
                <div className="box-attribites library-section">
                  <h3>Python implementation</h3>
                  <p className="paragraph">
                    This indicator is implemented in the{' '}
                    <a
                      href="https://nicoabarca.github.io/process-performance-indicators/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <code>process_performance_indicators</code>
                    </a>{' '}
                    Python library.
                  </p>
                  <div className="library-function-path">
                    <code>{libraryLink.function_path}</code>
                  </div>
                  <div className="library-section-actions">
                    <a
                      href={libraryLink.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="library-link-btn"
                    >
                      <span>Open function reference</span>
                      <svg
                        aria-hidden="true"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                    <a
                      href={libraryLink.module_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="library-link-btn library-link-btn--ghost"
                    >
                      <span>Browse {libraryLink.dimension} indicators</span>
                    </a>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}