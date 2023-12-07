import * as React from 'react';

import { SafeAreaView } from 'react-native';
import SwipeVideo from 'react-native-swipe-video';

export default function App() {
  return (
    <SafeAreaView>
      <SwipeVideo
        data={[
          {
            videoUrl:
              'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          },
          {
            videoUrl:
              'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            extraData: { play: true },
          },
        ]}
      />
    </SafeAreaView>
  );
}
