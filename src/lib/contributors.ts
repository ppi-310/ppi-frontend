// ─────────────────────────────────────────────────────────────────────────
//  CONTRIBUTORS — editá esta lista para mostrar al equipo en /contact-us
// ─────────────────────────────────────────────────────────────────────────
//
//  Para AGREGAR una persona:  copiá una línea del array y cambiá los datos.
//  Para EDITAR a alguien:     cambiá los valores de su línea.
//  Para QUITAR a alguien:     borrá su línea (o comentála poniendo // al inicio).
//
//  Campos (name es lo único obligatorio):
//    name   -> nombre a mostrar
//    role   -> rol/cargo (ej: "Researcher")
//    email  -> correo (se muestra como link)
//    photo  -> foto. Dos formas:
//                1) Poné la imagen en  public/contributors/  y usá la ruta
//                   "/contributors/nombre.jpg"  (ver el ejemplo de abajo)
//                2) O pegá una URL completa "https://..."
//              Si lo dejás vacío, se muestran las iniciales del nombre.
//    link   -> link a perfil (LinkedIn, GitHub, web personal) [opcional]
//
//  El orden en que aparecen es el orden de esta lista.

export type Contributor = {
  name: string;
  role?: string;
  email?: string;
  photo?: string;
  link?: string;
};

export const contributors: Contributor[] = [
  // Ejemplo CON foto: la imagen está en public/contributors/foto-prueba.png
  { name: 'Persona Ejemplo', role: 'Researcher', email: 'ejemplo@uc.cl', photo: '/contributors/foto-prueba.png' },
  // Ejemplos SIN foto (muestran iniciales):
  { name: 'Contributor 1', role: 'Researcher', email: 'persona1@uc.cl' },
  { name: 'Contributor 2', role: 'Developer', email: 'persona2@uc.cl' },
  { name: 'Contributor 3', role: 'Researcher', email: 'persona3@uc.cl' },
];
