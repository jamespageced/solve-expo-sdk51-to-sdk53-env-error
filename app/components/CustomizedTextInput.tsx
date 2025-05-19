import React, { Dispatch, RefObject, SetStateAction } from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInput,
  TextInputFocusEventData,
  TouchableOpacity,
  View
} from 'react-native';

interface Props {
  inputRef?: RefObject<TextInput | null> | null | undefined;
  isRequired?: boolean;
  placeholderText: string;
  isInputActive: boolean;
  inputText: string;
  maxInputHeight?: number;
  isDisabled: boolean;
  onInputFocus?: ((e: NativeSyntheticEvent<TextInputFocusEventData>) => void) | undefined;
  onInputBlur?: ((e: NativeSyntheticEvent<TextInputFocusEventData>) => void) | undefined;
  updateText: Dispatch<SetStateAction<string>>;
}

export default function CustomizedTextInput({
  inputRef,
  isRequired = false,
  placeholderText,
  isInputActive,
  inputText,
  maxInputHeight = 57,
  isDisabled,
  onInputFocus = undefined,
  onInputBlur = undefined,
  updateText
}: Props): ReactComponent {
  return (
    <View style={styles.container}>
      <View style={isInputActive ? styles.inputSecondBoarder : {}} />
      <View style={{ ...styles.inputContainerOuter, height: maxInputHeight - 7 }}>
        <View
          style={isInputActive || inputText ? styles.activePlaceholderContainer : styles.inactivePlaceholderContainer}
          pointerEvents="none"
        >
          <Text>
            {placeholderText} {isRequired ? <Text style={{ color: 'red' }}>*</Text> : null}
          </Text>
        </View>
        {isDisabled ? (
          <View style={styles.inputDisabled}>
            <Text>{inputText}</Text>
          </View>
        ) : (
          <>
            <TouchableOpacity style={styles.inputContainerInner} activeOpacity={1}>
              <TextInput
                ref={inputRef}
                onChangeText={(text: string) => updateText(text)}
                onFocus={onInputFocus}
                onBlur={onInputBlur}
                style={{ ...styles.input, height: maxInputHeight - 9 }}
                placeholder=""
                value={inputText}
                autoCorrect={false}
                spellCheck={false}
              />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', position: 'relative' },
  inputSecondBoarder: {
    position: 'absolute',
    top: -4,
    right: -4,
    bottom: -4,
    left: -4,
    zIndex: 1,
    borderWidth: 1,
    borderColor: '#03A9F4'
  },
  inputContainerOuter: {
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#03A9F4'
  },
  activePlaceholderContainer: {
    position: 'absolute',
    top: -12,
    left: 16,
    zIndex: 10,
    paddingHorizontal: 5,
    backgroundColor: '#ffffff'
  },
  inactivePlaceholderContainer: {
    position: 'absolute',
    top: 14,
    left: 16,
    zIndex: 10,
    paddingHorizontal: 5,
    backgroundColor: '#ffffff'
  },
  inputContainerInner: {
    flex: 1,
    justifyContent: 'center'
  },
  input: { paddingHorizontal: 10, backgroundColor: '#ffffff' },
  inputDisabled: { flex: 1, height: '100%', justifyContent: 'center', paddingHorizontal: 10, backgroundColor: '#999' }
});
