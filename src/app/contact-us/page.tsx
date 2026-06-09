import { supabase } from '@/utils/supabase';
import ContactForm from '@/components/ContactForm';
import SuggestionForm from '@/components/SuggestionForm';
import Contributors from '@/components/Contributors';

export default async function ContactUs() {
  // Cargamos dimensiones y granularidades reales para el form de sugerencias.
  const [{ data: dims }, { data: grans }] = await Promise.all([
    supabase.from('dimension').select('id_dimension, name').order('name'),
    supabase.from('granularity').select('id_granularity, name').order('name'),
  ]);

  const dimensions = (dims ?? []).map((d) => ({ id: d.id_dimension, label: d.name }));
  const granularities = (grans ?? []).map((g) => ({ id: g.id_granularity, label: g.name }));

  return (
    <main className="body">
      {/* Hero */}
      <section className="section-connect">
        <div className="main-section_s">
          <div className="main-container_s1">
            <div className="content-wrap_center">
              <div className="content-wrap_center mw-800">
                <div className="subheader cta-color">HAPLAB</div>
                <div className="spacer_xs"></div>
                <h1 className="h1">Connect With Us</h1>
                <p className="text-size-medium">
                  Meet the people behind the repository, get in touch with our team,
                  or propose a new PPI. At Haplab we value your questions and feedback.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="hero-contact_us-copy">
        <div className="padding-global">
          <div className="container-large">
            <div className="padding-section-large">

              {/* 1) Contributors / Our Team (arriba) */}
              <Contributors />

              <div className="spacer_l"></div>

              {/* 2) Dos columnas: Contact us (izq) + Suggest a PPI (der) */}
              <div className="connect-two-col">

                {/* Columna izquierda: Contact us */}
                <div className="connect-col">
                  <div className="margin-bottom">
                    <h2 className="heading-style-h2">Contact us</h2>
                  </div>
                  <p className="text-size-medium">
                    We&rsquo;re here to assist you with your inquiries.
                  </p>
                  <div className="spacer-large"></div>

                  <ContactForm />

                  <div className="spacer-large"></div>

                  <div className="w-layout-grid contact12_contact-list">
                    <div className="contact12_item">
                      <div className="margin-bottom">
                        <h3 className="heading-style-h6">Email</h3>
                      </div>
                      <a href="mailto:info@haplab.org" className="text-style-link">info@haplab.org</a>
                    </div>
                    <div className="contact12_item">
                      <div className="margin-bottom">
                        <h3 className="heading-style-h6">Phone</h3>
                      </div>
                      <a href="tel:+15551234567" className="text-style-link">+1 (555) 123-4567</a>
                    </div>
                    <div className="contact12_item">
                      <div className="margin-bottom">
                        <h3 className="heading-style-h6">Office</h3>
                      </div>
                      <div>
                        Departamento de Ciencias de la Computacion (DCC)<br/><br/>
                        Pontificia Universidad Catolica de Chile (UC)<br/><br/>
                        Av. Vicuna Mackenna 4860<br/>7820 436 Macul, Santiago de Chile (CHILE)
                      </div>
                    </div>
                    <div className="contact12_item">
                      <div className="margin-bottom">
                        <h3 className="heading-style-h6">Instagram</h3>
                      </div>
                      <div>@<a href="https://www.instagram.com/haplaborg/">haplaborg</a><br/><br/>Human &amp; Process Research Lab</div>
                    </div>
                  </div>
                </div>

                {/* Columna derecha: Suggest a PPI */}
                <div className="connect-col">
                  <div className="margin-bottom">
                    <h2 className="heading-style-h2">Suggest a PPI</h2>
                  </div>
                  <p className="text-size-medium">
                    Could you propose additional indicators that we have yet to
                    implement? We will analyze your PPI proposal.
                  </p>
                  <div className="spacer-large"></div>

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
    </main>
  );
}
