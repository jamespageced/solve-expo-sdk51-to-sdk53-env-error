import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { StatusBar } from 'expo-status-bar';

interface Props {
  collapsable?: boolean | undefined;
  style: StyleProp<ViewStyle>;
  children?: ReactComponent;
}

export default function MainScreenLayout({
  collapsable = undefined,
  style = null,
  children = null
}: Props): ReactComponent {
  return (
    <View style={style} collapsable={collapsable}>
      {children}
      <StatusBar style="auto" />
    </View>
  );
}
