import { Link, useMatchRoute } from '@tanstack/react-router';
import { cn } from '../../lib/cn.js';

export function BottomNav() {
  const matchRoute = useMatchRoute();
  const isJournal = matchRoute({ to: '/journal' });
  const isFavorites = matchRoute({ to: '/favorites' });

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 flex items-center justify-around border-t border-border bg-background pb-[env(safe-area-inset-bottom)]">
      <NavLink to="/journal" active={!!isJournal}>
        Journal
      </NavLink>
      <Link
        to="/log"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold -translate-y-2 shadow-md active:scale-95 transition-transform"
      >
        +
      </Link>
      <NavLink to="/favorites" active={!!isFavorites}>
        Favoris
      </NavLink>
    </nav>
  );
}

function NavLink({
  to,
  active,
  children,
}: {
  to: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className={cn(
        'flex min-h-11 min-w-11 items-center justify-center px-4 py-3 text-sm font-medium transition-colors',
        active ? 'text-primary' : 'text-muted-foreground',
      )}
    >
      {children}
    </Link>
  );
}
