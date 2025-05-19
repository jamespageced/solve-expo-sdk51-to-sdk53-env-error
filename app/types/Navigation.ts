import type {
  DefaultNavigatorOptions,
  NavigationHelpers,
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
  string | undefined,
  StackNavigationState<ParamListBase>,
  StackNavigationOptions,
  StackNavigationEventMap,
  NavigationHelpers<StackParamsList>
> &
  StackRouterOptions &
  StackNavigationConfig;

export type NavigationStack = TypedNavigator<NavigationStackProps, unknown>;
