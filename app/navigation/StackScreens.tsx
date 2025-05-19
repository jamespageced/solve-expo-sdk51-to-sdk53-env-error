import React from 'react';
import { Form, Home } from '@app/screens';
import { navScreens } from '@app/utils';
import type { NavigationStack } from '@app/types';

export default function StackScreens(Stack: NavigationStack): ReactComponent {
  return (
    <Stack.Group>
      <Stack.Screen name={navScreens.home.route} component={Home} />
      <Stack.Screen name={navScreens.form.route} component={Form} />
    </Stack.Group>
  );
}
