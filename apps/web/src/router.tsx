import { createRouter } from '@tanstack/react-router';
import { Route as rootRoute } from './routes/__root.js';
import { Route as favoritesRoute } from './routes/favorites.js';
import { Route as indexRoute } from './routes/index.js';
import { Route as journalIndexRoute } from './routes/journal/index.js';
import { Route as journalRoute } from './routes/journal/route.js';
import { Route as logRoute } from './routes/log.js';

const routeTree = rootRoute.addChildren([
  indexRoute,
  journalRoute.addChildren([journalIndexRoute]),
  logRoute,
  favoritesRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
