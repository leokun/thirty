import { createRoute } from '@tanstack/react-router';
import type { MealMoment } from '@thirty/shared';
import { LogPage } from '../components/log/log-page.js';
import { Route as rootRoute } from './__root.js';

export interface LogSearchParams {
  date?: string | undefined;
  moment?: MealMoment | undefined;
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: 'log',
  validateSearch: (search: Record<string, unknown>): LogSearchParams => ({
    date: typeof search.date === 'string' ? search.date : undefined,
    moment: typeof search.moment === 'string' ? (search.moment as MealMoment) : undefined,
  }),
  component: LogRoute,
});

function LogRoute() {
  const { date, moment } = Route.useSearch();
  return <LogPage initialDate={date} initialMoment={moment} />;
}
