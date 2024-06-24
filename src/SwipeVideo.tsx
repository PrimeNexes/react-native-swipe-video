import React from 'react';
import type { PressableProps } from 'react-native';
import { Dimensions, Pressable, StyleSheet } from 'react-native';
import Video, { type ReactVideoProps } from 'react-native-video';

export interface SwipeVideoProps extends ReactVideoProps {
  pressableProps?: PressableProps;
}

const SwipeVideo: React.FC<SwipeVideoProps> = ({
  pressableProps,
  ...props
}) => {
  const { style, ...rest } = { ...props };

  return (
    <>
      <Pressable {...pressableProps}>
        <Video
          playInBackground={false}
          playWhenInactive={false}
          progressUpdateInterval={1000}
          style={[styles.video, style]}
          resizeMode={'cover'}
          {...rest}
        />
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  video: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
});

export default SwipeVideo;
