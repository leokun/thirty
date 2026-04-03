import { createRoute, Outlet } from '@tanstack/react-router';
import { Route as rootRoute } from '../__root.js';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: 'journal',
  component: () => <Outlet />,
});
