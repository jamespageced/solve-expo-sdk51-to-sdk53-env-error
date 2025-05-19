import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { MOBILE_ENV } from '@env';

export default function Home(): ReactComponent {
  return (
    <View style={styles.container}>
      <Text>Running Environment: {MOBILE_ENV}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
