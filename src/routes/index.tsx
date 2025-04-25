import { createFileRoute } from '@tanstack/react-router';
import { BibleNavigator } from '@/components/bible/BibleNavigator';

export const Route = createFileRoute('/')({
  component: () => <BibleNavigator />,
});
