import React from 'react';
import { About, Contact, Home, ModalHamburgerMenu } from '@app/screens';
import { screens } from '@app/utils';
import type { NavigationStack } from '@app/types';

export default function StackScreens(Stack: NavigationStack): ReactComponent {
  return (
    <Stack.Group>
      <Stack.Screen name={screens.about.route} component={About} />
      <Stack.Screen name={screens.contact.route} component={Contact} />
      <Stack.Screen name={screens.home.route} component={Home} />
      <Stack.Screen
        name={screens.modalHamburgerMenu.route}
        component={ModalHamburgerMenu}
        options={{ presentation: 'modal' }}
      />
    </Stack.Group>
  );
}
