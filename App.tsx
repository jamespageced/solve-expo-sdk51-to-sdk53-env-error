import React from 'react';
import { Dimensions } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationConductor } from '@app/navigation';
import { ToastInit } from '@app/components';

const windowDimensions = Dimensions.get('window');

export default function App(): ReactComponent {
  return (
    <SafeAreaProvider style={{ maxWidth: windowDimensions.width, maxHeight: windowDimensions.height }}>
      <NavigationConductor />
      <ToastInit />
    </SafeAreaProvider>
  );
}
