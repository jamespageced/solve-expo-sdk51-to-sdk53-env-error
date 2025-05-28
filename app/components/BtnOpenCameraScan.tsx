import React, { useState } from 'react';
import { Dimensions, GestureResponderEvent, Image, Pressable, StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
  btnContainer: { alignItems: 'center', marginBottom: 20, borderColor: 'gray', borderWidth: 1 },
  img: { height: 128, width: 128, padding: 5 },
  text: {
    marginTop: -20,
    padding: 10,
    marginBottom: 0,
    color: 'black',
    fontSize: 12
  }
});

interface Props {
  handleOnPress?: ((event: GestureResponderEvent) => void) | null | undefined;
}

export default function BtnOpenCameraScan({ handleOnPress }: Props): ReactComponent {
  const [windowWidth] = useState(Dimensions.get('window').width);

  return (
    <Pressable style={styles.btnContainer} onPress={handleOnPress}>
      <Image
        source={require('@/assets/scan.png')}
        style={{ width: windowWidth * 0.25, height: undefined, aspectRatio: 1, marginBottom: 10 }}
        resizeMode="contain"
      />
      <Text style={styles.text}>Tap here to scan next item</Text>
    </Pressable>
  );
}
