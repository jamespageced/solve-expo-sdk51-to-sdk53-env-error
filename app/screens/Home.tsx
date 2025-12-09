import React, { useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { BtnOpenCameraScan } from '@app/components';
import { useScanditStore } from '@app/stores';
import { screens, toastFailedProps, toastSuccessProps } from '@app/utils';
import type { ScanditStore, StackParamsList } from '@app/types';

const data = new Set(['one', 'two', 'three']);

export default function Home(): ReactComponent {
  // variables
  const navigation: any = useNavigation<StackNavigationProp<StackParamsList>>();
  const isFocused = useIsFocused();
  const { simpleScanditResults, clearSimpleScanditResults } = useScanditStore((store: ScanditStore) => store);

  // functions
  const handleBtnScan = async () => {
    if (!!simpleScanditResults) return;
    navigation.navigate(screens.simpleScandit.route);
  };

  const handleScanResults = () => {
    try {
      const results = simpleScanditResults;
      clearSimpleScanditResults();
      if (!data.has(results)) throw new Error(`"${results}" not in data`);
      Toast.show(toastSuccessProps(results));
    } catch (error: any) {
      Toast.show(toastFailedProps(error.message));
    }
  };

  // setup
  useEffect(() => {
    if (!isFocused) return;
    if (!!simpleScanditResults) {
      // came from any scandit screen
      handleScanResults();
    }
  }, [isFocused, simpleScanditResults]);

  // render
  return (
    <View style={styles.container}>
      <BtnOpenCameraScan handleOnPress={handleBtnScan} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
