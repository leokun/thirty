import { createRoute, Navigate } from '@tanstack/react-router';
import { Route as rootRoute } from './__root.js';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <Navigate to="/journal" />,
});
