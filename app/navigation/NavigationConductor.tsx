import React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import StackScreens from './StackScreens';
import { navScreens } from '@app/utils';
import type { StackParamsList } from '@app/types';

const Stack = createStackNavigator<StackParamsList>();

function getStackHeaderOptions(): any {
  return {
    headerTitleAlign: 'center',
    headerStyle: { backgroundColor: '#003069' },
    headerRightContainerStyle: { paddingRight: 20 },
    headerLeftContainerStyle: { paddingLeft: 20 },
    headerTitleStyle: {
      fontSize: 24,
      fontFamily: Platform.OS === 'android' ? 'Roboto' : 'Arial',
      color: 'hsla(0,0%,100%,.8)'
    },
    headerTintColor: 'hsla(0,0%,100%,.8)'
  };
}

export default function NavigationConductor() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={navScreens.home.route} screenOptions={() => getStackHeaderOptions()}>
        {StackScreens(Stack)}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
