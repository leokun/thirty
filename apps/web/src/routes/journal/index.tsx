import { createRoute } from '@tanstack/react-router';
import { DayView } from '../../components/journal/day-view.js';
import { today } from '../../lib/date.js';
import { Route as journalRoute } from './route.js';

export const Route = createRoute({
  getParentRoute: () => journalRoute,
  path: '/',
  component: JournalPage,
});

function JournalPage() {
  const date = today();
  return <DayView date={date} />;
}
