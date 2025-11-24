import { createFileRoute } from '@tanstack/react-router';
import { RedesignedNavigator } from '@/components/bible/RedesignedNavigator';

export const Route = createFileRoute('/')({
  component: () => <RedesignedNavigator />,
});
