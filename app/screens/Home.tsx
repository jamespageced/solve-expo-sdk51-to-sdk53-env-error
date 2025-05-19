import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainScreenLayout } from '@app/components';
import { navScreens } from '@app/utils';
import type { StackParamsList } from '@app/types';

export default function Home(): ReactComponent {
  //================================ variables ================================
  const navigation = useNavigation<StackNavigationProp<StackParamsList>>();

  //================================ functions ================================
  const handleNext = () => {
    navigation.navigate(navScreens.form.route);
  };

  //================================== render =================================
  return (
    <MainScreenLayout style={styles.container}>
      <Pressable style={styles.btn} onPress={handleNext}>
        <Text style={styles.btnText}>NEXT</Text>
      </Pressable>
    </MainScreenLayout>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#2370b3',
    borderWidth: 1,
    borderColor: '#2370b3'
  },
  btnContainer: {
    width: '100%'
  },
  btnText: {
    fontSize: 18,
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'Arial',
    color: '#ffffff'
  },
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'flex-end'
  }
});
