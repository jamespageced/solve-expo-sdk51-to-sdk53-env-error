import type {
  NavigatorTypeBagBase,
  StackNavigationState,
  StaticConfig,
  TypedNavigator
} from '@react-navigation/native';
import type { StackNavigationEventMap, StackNavigationOptions, StackNavigationProp, StackNavigatorProps } from '@react-navigation/stack';

export type StackParamsList = { [key: string]: undefined };

export type NavigationStack = TypedNavigator<{
    ParamList: StackParamsList;
    NavigatorID: string | undefined;
    State: StackNavigationState<StackParamsList>;
    ScreenOptions: StackNavigationOptions;
    EventMap: StackNavigationEventMap;
    NavigationList: {
        [x: string]: StackNavigationProp<StackParamsList, string, string | undefined>;
    };
    Navigator: ({ id, initialRouteName, UNSTABLE_routeNamesChangeBehavior, children, layout, screenListeners, screenOptions, screenLayout, UNSTABLE_router, ...rest }: StackNavigatorProps) => ReactComponent;
}, StaticConfig<NavigatorTypeBagBase>>
