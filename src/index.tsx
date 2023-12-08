import React, { useRef, useState } from 'react';
import type {
  FlatListProps,
  ListRenderItem,
  PressableProps,
} from 'react-native';
import { Dimensions, FlatList, StyleSheet, View } from 'react-native';
import VideoPlayer, { type SwipeVideoProps } from './VideoPlayer';

/**
 * Props for the SwipePlayer component.
 */
export interface SwipePlayerProps
  extends Omit<FlatListProps<any>, 'data' | 'renderItem'> {
  /**
   * The number of videos to preload ahead of the current video. Default is 10.
   */
  preload?: number;

  /**
   * Additional props to be passed to the VideoPlayer component, excluding 'source' and 'src' props.
   */
  videoProps?: Omit<
    SwipeVideoProps,
    'videoUrl' | 'index' | 'currentIndex' | 'setMuted' | 'pressableProps'
  >;

  /**
   * Props for the Pressable component.
   */
  pressableProps?: PressableProps;

  /**
   * Determines whether the video should be muted. Default is false.
   */
  muted?: boolean;

  /**
   * Function to set the muted state of the video player.
   * @param flag - Flag indicating whether the video should be muted.
   */
  setMuted?: (flag: boolean) => void;

  autoPlay?: boolean;

  /**
   * Determines whether the player should automatically scroll to the next video when the current video ends. Default is the video repeats.
   */
  goToNext?: boolean;

  /**
   * Array of video data objects.
   */
  data: { videoUrl: string; extraData?: any }[];

  /**
   * Function to render each item in the list.
   */
  renderItem?: ListRenderItem<any>;
}

const SwipePlayer: React.FC<SwipePlayerProps> = ({
  data,
  preload,
  muted,
  setMuted,
  goToNext = false,
  videoProps,
  pressableProps,
  autoPlay,
  style,
  renderItem,
  ...props
}) => {
  const flatListRef = React.useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(muted || false);
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 70 });

  const { onEnd, ...restVideoPlayerProps } = { ...videoProps };

  // Viewable configuration
  const onViewRef = useRef(
    (viewableItems: { viewableItems: string | any[] }) => {
      if (viewableItems?.viewableItems?.length > 0)
        setCurrentIndex(
          parseInt(viewableItems.viewableItems[0].index, 10) || 0
        );
    }
  );

  const handleOnVideoEnd = () => {
    if (goToNext)
      flatListRef.current?.scrollToIndex({ animated: true, index: 1 });
    onEnd && onEnd();
  };

  return (
    <FlatList
      ref={flatListRef}
      style={[styles.container, style]}
      data={data}
      extraData={isMuted}
      showsVerticalScrollIndicator={false}
      snapToAlignment="start"
      decelerationRate={'fast'}
      snapToInterval={Dimensions.get('window').height}
      maxToRenderPerBatch={preload}
      viewabilityConfig={viewConfigRef.current}
      onViewableItemsChanged={onViewRef.current}
      initialNumToRender={1}
      renderItem={({ item, index, separators }) => (
        <>
          <VideoPlayer
            videoUrl={item.videoUrl}
            currentIndex={currentIndex}
            index={index}
            repeat={!goToNext}
            autoPlay={autoPlay}
            muted={muted ?? isMuted}
            setMuted={setMuted ?? setIsMuted}
            onEnd={handleOnVideoEnd}
            pressableProps={pressableProps}
            {...restVideoPlayerProps}
          />
          <View pointerEvents="box-none" style={styles.extraItem}>
            {renderItem && renderItem({ item: item, index, separators })}
          </View>
        </>
      )}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  },
  extraItem: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
});

export default SwipePlayer;
