import { redirect } from 'next/navigation';

// La sugerencia de PPIs se fusionó en la vista combinada /contact-us.
// Mantenemos esta ruta como redirect para no romper links antiguos.
export default function SuggestionsRedirect() {
  redirect('/contact-us');
}
