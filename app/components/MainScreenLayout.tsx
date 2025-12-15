import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

interface Props {
  collapsable?: boolean | undefined;
  styles?: StyleProp<ViewStyle>;
  children?: ReactComponent;
}

export default function MainScreenLayout({
  collapsable = undefined,
  styles = null,
  children = null
}: Props): ReactComponent {
  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={styles} collapsable={collapsable}>
      {children}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
