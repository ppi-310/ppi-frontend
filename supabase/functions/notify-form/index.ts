// Edge Function: notify-form
// Se dispara desde un Database Webhook de Supabase cuando se inserta una fila
// en `suggestion` o en `contact_message`. Construye un email y lo envía vía
// Resend (https://resend.com).
//
// Variables de entorno requeridas (configurar en Supabase Dashboard ->
// Edge Functions -> notify-form -> Secrets):
//   RESEND_API_KEY      → API key de Resend (re_xxx...)
//   NOTIFY_TO           → destinatario (ej: info@haplab.org)
//   NOTIFY_FROM         → remitente verificado en Resend
//                         (mientras pruebas: onboarding@resend.dev)
//
// Variables que Supabase inyecta automáticamente en runtime de Edge Functions
// (no hay que configurarlas a mano):
//   SUPABASE_URL              → URL del proyecto
//   SUPABASE_SERVICE_ROLE_KEY → service role key (necesaria para leer las
//                               tablas dimension/granularity desde el server)
//
// Webhook payload (formato Supabase):
//   {
//     "type": "INSERT",
//     "table": "suggestion" | "contact_message",
//     "schema": "public",
//     "record": { ...la fila insertada... },
//     "old_record": null
//   }

// Tipos de Deno son resueltos por el runtime de Edge Functions
// deno-lint-ignore-file no-explicit-any

interface SupabaseWebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  schema: string;
  record: Record<string, any>;
  old_record: Record<string, any> | null;
}

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? '';
const NOTIFY_TO = Deno.env.get('NOTIFY_TO') ?? '';
const NOTIFY_FROM = Deno.env.get('NOTIFY_FROM') ?? '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Resuelve el `name` de una fila por su id usando la API REST de PostgREST.
 * Devuelve null si no se puede resolver (env faltantes, id null, fetch falla).
 * No lanza: si algo falla, deja al caller mostrar el id como fallback.
 */
async function lookupName(
  table: 'dimension' | 'granularity',
  idColumn: 'id_dimension' | 'id_granularity',
  id: number | null | undefined,
): Promise<string | null> {
  if (id === null || id === undefined) return null;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null;

  try {
    const url = `${SUPABASE_URL}/rest/v1/${table}?${idColumn}=eq.${encodeURIComponent(
      String(id),
    )}&select=name`;
    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        Accept: 'application/json',
      },
    });
    if (!res.ok) {
      console.error(`lookupName(${table}) HTTP ${res.status}`);
      return null;
    }
    const rows = (await res.json()) as { name?: string }[];
    return rows[0]?.name ?? null;
  } catch (err) {
    console.error(`lookupName(${table}) error`, err);
    return null;
  }
}

/** Para mostrar en el email: si tenemos nombre úsalo, si no cae al id, si no `-`. */
function formatLabel(name: string | null, id: unknown): string {
  if (name) return name;
  if (id === null || id === undefined || id === '') return '-';
  return String(id);
}

async function buildEmail(payload: SupabaseWebhookPayload): Promise<{
  subject: string;
  text: string;
  html: string;
}> {
  const r = payload.record;
  if (payload.table === 'suggestion') {
    // Resolver nombres de dimension y granularity en paralelo
    const [dimensionName, granularityName] = await Promise.all([
      lookupName('dimension', 'id_dimension', r.id_dimension),
      lookupName('granularity', 'id_granularity', r.id_granularity),
    ]);
    const dimensionLabel = formatLabel(dimensionName, r.id_dimension);
    const granularityLabel = formatLabel(granularityName, r.id_granularity);

    const subject = `Suggestion PPi - webpage`;
    const lines = [
      `Nombre: ${r.name ?? ''}`,
      `Email: ${r.email ?? ''}`,
      `Phone: ${r.phone ?? '-'}`,
      `Dimension: ${dimensionLabel}`,
      `Granularity: ${granularityLabel}`,
      ``,
      `Mensaje:`,
      `${r.message ?? ''}`,
      ``,
      `Recibido: ${r.created_at ?? ''}`,
    ];
    const text = lines.join('\n');
    const html = `
      <h2>Nueva sugerencia de PPI</h2>
      <p><strong>Nombre:</strong> ${escapeHtml(String(r.name ?? ''))}</p>
      <p><strong>Email:</strong> ${escapeHtml(String(r.email ?? ''))}</p>
      <p><strong>Phone:</strong> ${escapeHtml(String(r.phone ?? '-'))}</p>
      <p><strong>Dimension:</strong> ${escapeHtml(dimensionLabel)}</p>
      <p><strong>Granularity:</strong> ${escapeHtml(granularityLabel)}</p>
      <h3>Mensaje</h3>
      <pre style="white-space:pre-wrap;font-family:inherit;">${escapeHtml(
        String(r.message ?? ''),
      )}</pre>
      <p style="color:#888;font-size:12px;">Recibido: ${escapeHtml(
        String(r.created_at ?? ''),
      )}</p>
    `;
    return { subject, text, html };
  }

  if (payload.table === 'contact_message') {
    const subject = `Contact PPi - webpage`;
    const lines = [
      `Nombre: ${r.name ?? ''}`,
      `Email: ${r.email ?? ''}`,
      `Phone: ${r.phone ?? '-'}`,
      ``,
      `Mensaje:`,
      `${r.message ?? ''}`,
      ``,
      `Recibido: ${r.created_at ?? ''}`,
    ];
    const text = lines.join('\n');
    const html = `
      <h2>Nuevo mensaje de contacto</h2>
      <p><strong>Nombre:</strong> ${escapeHtml(String(r.name ?? ''))}</p>
      <p><strong>Email:</strong> ${escapeHtml(String(r.email ?? ''))}</p>
      <p><strong>Phone:</strong> ${escapeHtml(String(r.phone ?? '-'))}</p>
      <h3>Mensaje</h3>
      <pre style="white-space:pre-wrap;font-family:inherit;">${escapeHtml(
        String(r.message ?? ''),
      )}</pre>
      <p style="color:#888;font-size:12px;">Recibido: ${escapeHtml(
        String(r.created_at ?? ''),
      )}</p>
    `;
    return { subject, text, html };
  }

  throw new Error(`Tabla no soportada: ${payload.table}`);
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  if (!RESEND_API_KEY || !NOTIFY_TO || !NOTIFY_FROM) {
    console.error('Missing env vars', {
      hasResend: !!RESEND_API_KEY,
      hasTo: !!NOTIFY_TO,
      hasFrom: !!NOTIFY_FROM,
    });
    return new Response(
      JSON.stringify({ error: 'Server not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }

  let payload: SupabaseWebhookPayload;
  try {
    payload = await req.json();
  } catch (err) {
    console.error('Bad JSON', err);
    return new Response('Bad request', { status: 400 });
  }

  if (payload.type !== 'INSERT') {
    return new Response(JSON.stringify({ skipped: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let email: { subject: string; text: string; html: string };
  try {
    email = await buildEmail(payload);
  } catch (err) {
    console.error('Build email error', err);
    return new Response('Unknown table', { status: 400 });
  }

  const resendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: NOTIFY_FROM,
      to: [NOTIFY_TO],
      subject: email.subject,
      text: email.text,
      html: email.html,
      reply_to: payload.record?.email || undefined,
    }),
  });

  const resendBody = await resendRes.text();
  if (!resendRes.ok) {
    console.error('Resend error', resendRes.status, resendBody);
    return new Response(
      JSON.stringify({ error: 'Email provider failed', detail: resendBody }),
      { status: 502, headers: { 'Content-Type': 'application/json' } },
    );
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
