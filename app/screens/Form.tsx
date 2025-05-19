import React, { useState } from 'react';
import { Keyboard, Platform, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CustomizedTextInput, MainScreenLayout } from '@app/components';
import type { StackParamsList } from '@app/types';

type SelectedInput = '' | 'input-1' | 'input-2';
const defaultSelectInput = '';

export default function Form(): ReactComponent {
  //================================ variables ================================
  const navigation = useNavigation<StackNavigationProp<StackParamsList>>();
  const [selectedInput, setSelectedInput] = useState<SelectedInput>(defaultSelectInput);
  const [inputOneText, setInputOneText] = useState('');
  const [inputTwoText, setInputTwoText] = useState('');

  //================================ functions ================================
  const handleGoBack = () => {
    navigation.goBack();
  };
  const handleSelectFormFields = (formFieldType: SelectedInput | null) => {
    if (formFieldType === null) {
      Keyboard.dismiss();
      setSelectedInput(defaultSelectInput);
    } else {
      setSelectedInput(formFieldType);
    }
  };

  //================================== render =================================
  return (
    <GestureDetector gesture={Gesture.Tap().onEnd(() => handleSelectFormFields(null))}>
      <MainScreenLayout style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContainer} keyboardShouldPersistTaps="handled">
          <CustomizedTextInput
            isRequired={true}
            placeholderText="Input 1"
            isInputActive={selectedInput === 'input-1'}
            inputText={inputOneText}
            isDisabled={false}
            onInputFocus={() => handleSelectFormFields('input-1')}
            updateText={setInputOneText}
          />
          <CustomizedTextInput
            isRequired={true}
            placeholderText="Input 2"
            isInputActive={selectedInput === 'input-2'}
            inputText={inputTwoText}
            isDisabled={false}
            onInputFocus={() => handleSelectFormFields('input-2')}
            updateText={setInputTwoText}
          />
          <Pressable style={styles.btn} onPress={handleGoBack}>
            <Text style={styles.btnText}>GO&nbsp;BACK</Text>
          </Pressable>
        </ScrollView>
      </MainScreenLayout>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: '100%',
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#2370B3'
  },
  btnText: {
    fontSize: 18,
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'Arial',
    color: '#2370B3'
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  scrollViewContainer: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    gap: 20,
    alignItems: 'center'
  }
});
