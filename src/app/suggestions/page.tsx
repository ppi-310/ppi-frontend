import { supabase } from '@/utils/supabase';
import SuggestionForm from '@/components/SuggestionForm';

export default async function Suggestions() {
  // Cargamos las dimensiones y granularidades reales para el form.
  const [{ data: dims }, { data: grans }] = await Promise.all([
    supabase
      .from('dimension')
      .select('id_dimension, name')
      .order('name'),
    supabase
      .from('granularity')
      .select('id_granularity, name')
      .order('name'),
  ]);

  const dimensions =
    (dims ?? []).map((d) => ({ id: d.id_dimension, label: d.name })) ?? [];
  const granularities =
    (grans ?? []).map((g) => ({ id: g.id_granularity, label: g.name })) ?? [];

  return (
    <main>
      <section className="section-2">
        <div className="main-section_s">
          <div className="main-container_s1">
            <div className="content-wrap_center">
              <div
                id="w-node-e405b3e8-df46-19d2-b9ea-0e6418b74b7f-e6575ef9"
                className="content-wrap_center mw-800"
              >
                <div className="subheader cta-color">HAPLAB</div>
                <div className="spacer_xs"></div>
                <h1 className="h1">
                  Could you propose additional indicators that we have yet to implement?
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="hero-subscribe-left">
        <section className="section_contact12">
          <div className="padding-global">
            <div className="container-large">
              <div className="padding-section-l_suggest">
                <div className="margin-bottom">
                  <h2 className="heading-style-h2">Suggestion</h2>
                  <p className="text-size-medium">We will analyze your PPI proposal.</p>
                </div>
                <div className="contact12_component">
                  <div className="max-width-large">
                    <SuggestionForm
                      dimensions={dimensions}
                      granularities={granularities}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
