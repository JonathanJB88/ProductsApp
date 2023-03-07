import React from 'react';
import { Platform, View } from 'react-native';

export const Background = () => {
  return (
    <View
      style={{
        position: 'absolute',
        backgroundColor: '#5856D6',
        width: 1000,
        height: 1200,
        top: Platform.OS === 'ios' ? -270 : -400,
        transform: [{ rotate: '-50deg' }],
      }}
    />
  );
};
