import React from 'react';
import type { PressableProps, StyleProp, ViewStyle } from 'react-native';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import type { VideoProperties } from 'react-native-video';
import Video from 'react-native-video';

export interface SwipeVideoProps
  extends Omit<VideoProperties, 'source' | 'src'> {
  videoUrl: string;
  index: number;
  currentIndex?: number;
  preload?: number;
  overlay?: React.ReactNode;
  overlayStyle?: StyleProp<ViewStyle>;
  pressableProps?: PressableProps;
  setMuted: (flag: boolean) => void;
}

const SwipeVideo: React.FC<SwipeVideoProps> = ({
  videoUrl,
  index,
  currentIndex,
  overlay,
  overlayStyle,
  setMuted,
  pressableProps,
  ...props
}) => {
  const { paused, muted, style, ...rest } = { ...props };

  const [isPaused, setPaused] = React.useState<boolean>(paused || true);
  const [showOverlay, setShowOverlay] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (currentIndex === index) setPaused(false);
    else setPaused(true);
  }, [currentIndex, index]);

  React.useEffect(() => {
    setShowOverlay(true);
    const timer = setTimeout(() => {
      setShowOverlay(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [muted]);

  return (
    <Pressable
      onPress={() => setMuted(!muted)}
      onLongPress={() => {
        setPaused(true);
      }}
      onPressOut={() => setPaused(false)}
      {...pressableProps}
    >
      <Video
        playInBackground={false}
        playWhenInactive={false}
        progressUpdateInterval={1000}
        paused={isPaused}
        onVideoLoad={() => console.log('onVideoLoad')}
        muted={muted}
        source={{ uri: videoUrl }}
        style={[styles.video, style]}
        resizeMode="cover"
        {...rest}
      />
      <Overlay style={overlayStyle} visible={showOverlay}>
        {overlay}
      </Overlay>
    </Pressable>
  );
};

const Overlay: React.FC<{ visible: boolean; style: StyleProp<ViewStyle> }> = ({
  visible,
  style,
  children,
}) => {
  if (visible) return <View style={[styles.overlay, style]}>{children}</View>;
  return null;
};

const styles = StyleSheet.create({
  video: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default SwipeVideo;
