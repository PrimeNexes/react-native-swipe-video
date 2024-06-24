import React, { useRef } from 'react';
import type { FlatListProps } from 'react-native';
import { Dimensions, FlatList, StyleSheet } from 'react-native';
import VideoPlayer, { type SwipeVideoProps } from './SwipeVideo';

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
   * Additional props to be passed to the VideoPlayer component.
   */
  videoProps?: SwipeVideoProps;

  /**
   * Array of video data objects.
   */
  data: { source: SwipeVideoProps['source']; component: React.ReactNode }[];
}

const SwipePlayer = React.forwardRef<FlatList, SwipePlayerProps>(
  ({ data, preload, videoProps, style, ...props }, ref) => {
    const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 70 });

    return (
      <FlatList
        ref={ref}
        style={[styles.container, style]}
        data={data}
        showsVerticalScrollIndicator={false}
        snapToAlignment="start"
        decelerationRate={'fast'}
        snapToInterval={Dimensions.get('window').height}
        maxToRenderPerBatch={preload}
        viewabilityConfig={viewConfigRef.current}
        initialNumToRender={1}
        renderItem={({ item }) => (
          <>
            <VideoPlayer source={item} {...videoProps} />
            {item.component}
          </>
        )}
        {...props}
      />
    );
  }
);

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
