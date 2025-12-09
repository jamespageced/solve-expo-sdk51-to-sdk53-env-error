import React from 'react';
import { Home, SimpleScandit } from '@app/screens';
import { screens } from '@app/utils';
import type { NavigationStack } from '@app/types';

export default function StackScreens(Stack: NavigationStack): ReactComponent {
  return (
    <Stack.Group>
      <Stack.Screen name={screens.home.route} component={Home} />
      <Stack.Screen name={screens.simpleScandit.route} component={SimpleScandit} options={{ headerShown: false }} />
    </Stack.Group>
  );
}
