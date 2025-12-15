import React from 'react';
import { Platform, Text, View } from 'react-native';
import { NavigationContainer, RouteProp } from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationOptions,
  StackNavigationProp,
  TransitionPresets
} from '@react-navigation/stack';
import StackScreens from './StackScreens';
import { Hamburger } from '@app/components';
import { navRoutesToTitles, screens } from '@app/utils';
import type { NavigationStack, NavScreens, StackParamsList } from '@app/types';

const Stack: NavigationStack = createStackNavigator<StackParamsList>();

function getStackHeaderOptions(
  route: RouteProp<StackParamsList, string>,
  navigation: StackNavigationProp<StackParamsList, string, string | undefined>
): StackNavigationOptions {
  const routes = navigation.getState().routes;
  const prevRouteName: keyof NavScreens = routes.length > 1 ? routes[routes.length - 2].name : (route.name as any);
  const currentRouteName: keyof NavScreens = route.name as any;
  const routeTitle =
    routes[routes.length - 1].name === screens.modalHamburgerMenu.route
      ? navRoutesToTitles[prevRouteName]
      : navRoutesToTitles[currentRouteName];
  const isHamburgerOpen = route.name === screens.modalHamburgerMenu.route;
  return {
    headerTitleAlign: 'center',
    headerStyle: { backgroundColor: '#003069' },
    headerTitle: () => (
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Hamburger navigation={navigation} isOpen={isHamburgerOpen} />
        <View style={{ flex: 1, paddingLeft: 20 }}>
          <Text
            ellipsizeMode="tail"
            numberOfLines={1}
            style={{
              fontSize: 24,
              fontFamily: Platform.OS === 'android' ? 'Roboto' : 'Arial',
              color: 'hsla(0,0%,100%,.8)',
              fontWeight: 'normal',
              textAlignVertical: 'center',
              textAlign: 'center',
              flex: 1
            }}
          >
            {routeTitle}
          </Text>
        </View>
        <View style={{ minWidth: 60 }}></View>
      </View>
    ),
    ...TransitionPresets.ModalFadeTransition,
    headerLeft: null as any
  };
}

export default function NavigationConductor() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={screens.home.route}
        screenOptions={({ route, navigation }) => getStackHeaderOptions(route, navigation)}
      >
        {StackScreens(Stack)}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
