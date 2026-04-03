import { createRoute } from '@tanstack/react-router';
import { FavoriteList } from '../components/favorites/favorite-list.js';
import { Route as rootRoute } from './__root.js';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: 'favorites',
  component: FavoritesPage,
});

function FavoritesPage() {
  return (
    <div className="p-4">
      <h1 className="mb-4 text-lg font-bold">Favoris</h1>
      <FavoriteList />
    </div>
  );
}
