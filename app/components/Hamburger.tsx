import React from 'react';
import { Pressable, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { screens } from '@app/utils';

interface Props {
  navigation: any;
  isOpen: boolean;
}

export default function Hamburger({ navigation, isOpen }: Props): ReactComponent {
  // variables
  const isFocused = useIsFocused(); // this compenent renders multiple times on header per screen in stack

  // functions
  const toggleHamburger = async () => {
    if (!isFocused) return;
    if (isOpen) {
      navigation.goBack();
    } else {
      navigation.navigate(screens.modalHamburgerMenu.route);
    }
  };
  return (
    <View style={{ flex: 0 }}>
      <Pressable
        onPress={toggleHamburger}
        style={({ pressed }) => [{ padding: 8, backgroundColor: pressed ? 'red' : 'transparent' }]}
      >
        {isOpen ? <Icon name="close" size={24} color="#ffffff" /> : <Icon name="menu" size={24} color="#ffffff" />}
      </Pressable>
    </View>
  );
}
