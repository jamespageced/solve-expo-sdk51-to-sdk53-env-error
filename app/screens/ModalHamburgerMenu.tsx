import React, { useEffect } from 'react';
import Constants from 'expo-constants';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { MainScreenLayout } from '@app/components';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { StackParamsList } from '@app/types';
import { screens } from '@app/utils';

export default function ModalHamburgerMenu(): ReactComponent {
  // variables
  const isFocused = useIsFocused();
  const navigation = useNavigation<StackNavigationProp<StackParamsList>>();
  const routes = navigation.getState().routes;

  // functions
  const handleNavigation = async (route: string) => {
    if (!isFocused) return;
    navigation.replace(route);
  };

  // setup
  useEffect(() => {
    if (!isFocused) return;
    console.log('hamburger menu screen routes-in-stack:', routes);
  }, [isFocused]);

  // render
  return (
    <MainScreenLayout styles={{ flex: 1, backgroundColor: 'transparent' }}>
      <ScrollView contentContainerStyle={styles.selectionScrollContainer}>
        <Pressable style={styles.selection} onPress={() => handleNavigation(screens.home.route)}>
          <FontAwesome name="home" size={32} color="#2A486F" />
          <Text style={{ ...styles.selectionFont }}>{screens.home.title}</Text>
        </Pressable>
        <Pressable style={styles.selection} onPress={() => handleNavigation(screens.about.route)}>
          <MaterialCommunityIcons name="view-list-outline" size={31} color="#2A486F" />
          <Text style={styles.selectionFont}>{screens.about.title}</Text>
        </Pressable>
        <Pressable style={styles.selection} onPress={() => handleNavigation(screens.contact.route)}>
          <MaterialCommunityIcons name="cellphone-settings" size={31} color="#2A486F" />
          <Text style={styles.selectionFont}>{screens.contact.title}</Text>
        </Pressable>
        <View style={styles.versionContainerOuter}>
          <View style={styles.versionContainerInner}>
            <Text style={{ marginLeft: 5, color: '#3F51B5', fontSize: 22 }}>
              {Constants.expoConfig?.name} version {Constants.expoConfig?.version ?? 'unknown'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </MainScreenLayout>
  );
}

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 5,
    paddingTop: 20,
    paddingBottom: 100,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(22, 27, 34, 0.6)'
  },
  selection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    padding: 10,
    borderBottomColor: '#dbd6d6',
    borderBottomWidth: 2
  },
  selectionContainer: {
    flex: 1,
    position: 'relative',
    zIndex: 10,
    width: '100%'
  },
  selectionScrollContainer: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#ffffff'
  },
  selectionFont: {
    marginLeft: 20,
    fontSize: 18,
    color: '#212121'
  },
  versionContainerOuter: {
    display: 'flex',
    width: '100%',
    marginTop: 'auto'
  },

  versionContainerInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: '100%',
    marginTop: 'auto',
    padding: 20,
    backgroundColor: '#f2f4f8'
  }
});
