import React, { useRef, useState } from 'react';
import type {
  FlatListProps,
  ListRenderItem,
  PressableProps,
} from 'react-native';
import { Dimensions, FlatList, StyleSheet, View } from 'react-native';
import VideoPlayer, { type VideoPlayerProps } from './VideoPlayer';

/**
 * PlayerProps interface for the Player component.
 */
interface PlayerProps extends Omit<FlatListProps<any>, 'data' | 'renderItem'> {
  /**
   * The number of videos to preload ahead of the current video. Default is 10.
   */
  preload?: number;

  /**
   * Additional props to be passed to the VideoPlayer component, excluding 'source' and 'src' props.
   */
  videoPlayerProps?: Omit<
    VideoPlayerProps,
    'videoUrl' | 'index' | 'currentIndex' | 'setMuted' | 'pressableProps'
  >;

  pressableProps?: PressableProps;

  /**
   * Determines whether the video should be muted. Default is false.
   */
  muted?: boolean;

  /**
   * Determines whether the player should automatically scroll to the next video when the current video ends. Default is the video repeats.
   */
  goToNext?: boolean;

  data: { videoUrl: string; extraData?: any }[];

  renderItem?: ListRenderItem<any>;
}

const Player: React.FC<PlayerProps> = ({
  data,
  preload,
  muted,
  goToNext = false,
  videoPlayerProps,
  pressableProps,
  style,
  renderItem,
  ...props
}) => {
  const flatListRef = React.useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isMuted, setMuted] = useState<boolean>(muted || false);
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 70 });

  const { onEnd, ...restVideoPlayerProps } = { ...videoPlayerProps };

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
            muted={isMuted}
            setMuted={setMuted}
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
  contentContainerStyle: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
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

export default Player;
