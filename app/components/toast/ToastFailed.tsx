import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { AntDesign } from '@expo/vector-icons';
import ProgressBar from './ProgressBar';
import { toastFailedProps } from '@app/utils';

interface Props {
  text1: string;
}

export default function ToastFailed({ text1 }: Props): ReactComponent {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        width: '90%',
        padding: 0,
        backgroundColor: '#f27474',
        borderRadius: 40,
        overflow: 'hidden'
      }}
    >
      <Pressable
        style={{
          flex: 1,
          height: '100%',
          justifyContent: 'center',
          position: 'relative'
        }}
        onPress={() => Toast.show(toastFailedProps(text1))}
      >
        <Text
          style={{
            paddingHorizontal: 20,
            color: '#ffffff',
            fontSize: 20
          }}
          numberOfLines={2}
        >
          {text1}
        </Text>
        <ProgressBar isSuccess={false} />
      </Pressable>
      <Pressable
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: 60,
          height: '100%',
          marginLeft: 'auto',
          borderLeftWidth: 1,
          borderColor: '#ffffff'
        }}
        onPress={() => Toast.hide()}
      >
        <AntDesign name="close" size={24} color="#ffffff" />
      </Pressable>
    </View>
  );
}
