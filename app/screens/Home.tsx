import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { MainScreenLayout } from '@app/components';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { StackParamsList } from '@app/types';

export default function Home(): ReactComponent {
  // variables
  const isFocused = useIsFocused();
  const navigation = useNavigation<StackNavigationProp<StackParamsList>>();
  const routes = navigation.getState().routes;

  // setup
  useEffect(() => {
    if (!isFocused) return;
    console.log('home screen routes-in-stack:', routes);
  }, [isFocused]);

  // render
  return (
    <MainScreenLayout styles={styles.container}>
      <Text>check the stack of screens logged in your console/debugger</Text>
    </MainScreenLayout>
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
