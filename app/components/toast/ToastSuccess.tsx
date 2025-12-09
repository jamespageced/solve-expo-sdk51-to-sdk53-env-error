import React from 'react';
import Toast from 'react-native-toast-message';
import { Pressable, Text, View } from 'react-native';
import { AntDesign, Ionicons as Icon } from '@expo/vector-icons';
import ProgressBar from './ProgressBar';
import { toastSuccessDefaultMsg, toastSuccessProps } from '@app/utils';

interface Props {
  text1: string;
}

export default function ToastSuccess({ text1 }: Props): ReactComponent {
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
        backgroundColor: '#87b64f',
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
        onPress={() => Toast.show(toastSuccessProps())}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 }}>
          {text1 === toastSuccessDefaultMsg && <Icon name="checkmark" size={48} color="#ffffff" />}
          <Text
            style={{
              color: '#ffffff',
              fontSize: 20,
              textAlignVertical: 'center'
            }}
          >
            {text1}
          </Text>
        </View>
        <ProgressBar isSuccess={true} />
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
