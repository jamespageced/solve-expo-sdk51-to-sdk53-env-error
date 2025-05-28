import type {
  DefaultNavigatorOptions,
  ParamListBase,
  StackNavigationState,
  StackRouterOptions,
  TypedNavigator
} from '@react-navigation/native';
import type { StackNavigationEventMap, StackNavigationOptions } from '@react-navigation/stack';
import type { StackNavigationConfig } from '@react-navigation/stack/lib/typescript/src/types';

export type StackParamsList = { [key: string]: undefined };

type NavigationStackProps = DefaultNavigatorOptions<
  ParamListBase,
  StackNavigationState<ParamListBase>,
  StackNavigationOptions,
  StackNavigationEventMap
> &
  StackRouterOptions &
  StackNavigationConfig;

export type NavigationStack = TypedNavigator<
  StackParamsList,
  StackNavigationState<ParamListBase>,
  StackNavigationOptions,
  StackNavigationEventMap,
  ({ id, initialRouteName, children, screenListeners, screenOptions, ...rest }: NavigationStackProps) => ReactComponent
>;
