'use client';

// Wrapper de next/link que dispara el loading overlay durante la navegacion.
// Para clicks normales (boton izquierdo, sin modificadores) intercepta el evento
// y usa router.push dentro de un startTransition. Para cmd/ctrl/shift/middle-click
// deja pasar el comportamiento por defecto del browser (abrir en nueva pestania, etc).

import Link, { type LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';
import { type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { useNavigationLoading } from './NavigationLoading';

type Props = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    children: ReactNode;
  };

export default function NavLink({ children, onClick, href, ...rest }: Props) {
  const router = useRouter();
  const { startNavigation } = useNavigationLoading();

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    if (onClick) onClick(e);
    if (e.defaultPrevented) return;
    // Dejar al browser manejar nueva pestania / nueva ventana / descarga.
    if (
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    ) {
      return;
    }
    e.preventDefault();
    const target = typeof href === 'string' ? href : href.toString();
    startNavigation(() => {
      router.push(target);
    });
  }

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
