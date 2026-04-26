import { createClient } from '@supabase/supabase-js';

// Estas variables las lee automáticamente del archivo .env.local que creaste antes
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Creamos y exportamos el cliente para usarlo en cualquier parte de la página
export const supabase = createClient(supabaseUrl, supabaseKey);