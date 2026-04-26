# notify-form — Edge Function

Recibe un Database Webhook de Supabase cuando se inserta una fila en
`suggestion` o `contact_message` y envía un email a `info@haplab.org`
vía [Resend](https://resend.com).

## 1. Crear cuenta en Resend

1. Crear cuenta en https://resend.com (gratis, 3 000 emails/mes).
2. Ir a **API Keys** → crear key con permiso "Sending access" → copiar
   (formato `re_xxx...`).
3. **Para producción:** ir a **Domains** y verificar `haplab.org`
   (agregar registros DNS). Con dominio verificado el `from` puede ser,
   por ejemplo, `noreply@haplab.org`.
4. **Para pruebas rápidas:** sin verificar dominio, el `from` debe ser
   `onboarding@resend.dev` (Resend lo acepta para tests).

## 2. Desplegar la function

Necesitas la [Supabase CLI](https://supabase.com/docs/guides/cli):

```bash
# Una vez, login + link al proyecto
supabase login
supabase link --project-ref TU_PROJECT_REF   # lo encuentras en Settings -> General

# Configurar secrets
supabase secrets set RESEND_API_KEY=re_xxxxxxxx
supabase secrets set NOTIFY_TO=info@haplab.org
supabase secrets set NOTIFY_FROM=onboarding@resend.dev   # cambiar por tu dominio cuando esté verificado

# Desplegar
supabase functions deploy notify-form
```

Verifica en Supabase Dashboard → Edge Functions que `notify-form` aparece
y que en su sección **Secrets** están las 3 variables.

## 3. Crear los Database Webhooks

En Supabase Dashboard → **Database** → **Webhooks** → **Create a new hook**.

### Webhook 1 — Suggestions

- **Name:** `notify-on-suggestion-insert`
- **Table:** `suggestion`
- **Events:** ☑ Insert
- **Type:** `Supabase Edge Functions`
- **Edge Function:** `notify-form`
- **HTTP Method:** `POST`
- (deja headers y params vacíos, Supabase añade el bearer interno
  automáticamente)

### Webhook 2 — Contact

- **Name:** `notify-on-contact-insert`
- **Table:** `contact_message`
- **Events:** ☑ Insert
- **Type:** `Supabase Edge Functions`
- **Edge Function:** `notify-form`
- **HTTP Method:** `POST`

## 4. Probar

1. Desde la app, envía un mensaje en `/suggestions` o `/contact-us`.
2. En Supabase Dashboard → **Edge Functions** → `notify-form` → **Logs**
   verás la invocación.
3. Si ves `200 ok:true` y aparece el correo en la bandeja, todo OK.
4. Si ves `500 / 502` mira el log: probablemente sea
   `Server not configured` (faltan secrets) o un error de Resend
   (típicamente `from` no verificado).

## 5. Estructura del payload que recibe la function

Supabase envía algo así:

```json
{
  "type": "INSERT",
  "table": "suggestion",
  "schema": "public",
  "record": {
    "id_suggestion": 1,
    "created_at": "2026-04-26T15:00:00.000Z",
    "name": "Diego",
    "email": "diego@example.com",
    "phone": null,
    "id_dimension": 5,
    "id_granularity": 2,
    "message": "Propongo un nuevo PPI...",
    "handled": false
  },
  "old_record": null
}
```

La function arma el email con un template distinto por tabla.

## 6. Cambiar a SMTP (si más adelante quieres dejar Resend)

Reemplaza el `fetch` a `https://api.resend.com/emails` por una conexión
SMTP usando `https://deno.land/x/smtp` y un App Password (Gmail/Outlook).
Cambian solo las env vars y el bloque que envía el email.
