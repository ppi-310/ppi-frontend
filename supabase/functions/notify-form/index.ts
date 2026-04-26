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

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildEmail(payload: SupabaseWebhookPayload): {
  subject: string;
  text: string;
  html: string;
} {
  const r = payload.record;
  if (payload.table === 'suggestion') {
    const subject = `Nueva sugerencia de PPI — ${r.name ?? 'Anónimo'}`;
    const lines = [
      `Nombre: ${r.name ?? ''}`,
      `Email: ${r.email ?? ''}`,
      `Phone: ${r.phone ?? '-'}`,
      `Dimension ID: ${r.id_dimension ?? '-'}`,
      `Granularity ID: ${r.id_granularity ?? '-'}`,
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
      <p><strong>Dimension ID:</strong> ${escapeHtml(String(r.id_dimension ?? '-'))}</p>
      <p><strong>Granularity ID:</strong> ${escapeHtml(String(r.id_granularity ?? '-'))}</p>
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
    const subject = `Nuevo mensaje de contacto — ${r.name ?? 'Anónimo'}`;
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
    email = buildEmail(payload);
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
