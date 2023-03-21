import React, {useRef, useState} from 'react';
import {View, Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import {Image} from 'native-base';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const defaultImage = require('../../assets/images/FeaturedEventImage.png');

const {width} = Dimensions.get('window');

type IProps = {
  entries: {
    title: string;
    imageUrl?: string | null;
  }[];
};

export default function BannerFull(props: IProps) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let _carousel = useRef();

  const [activeSlide, setActiveSlide] = useState(0);

  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <View>
      <Carousel
        loop
        sliderWidth={width}
        itemWidth={width}
        sliderHeight={width / 1.3}
        itemHeight={width / 1.3}
        // autoPlay={props.entries.length > 1}
        // autoPlayInterval={5000}
        data={[...props.entries, ...props.entries]}
        // modeConfig={{
        //   parallaxScrollingScale: 0.94,
        //   parallaxScrollingOffset: 54,
        //   parallaxAdjacentItemScale: 0.86,
        // }}
        // mode=""
        // scrollAnimationDuration={3000}
        onSnapToItem={index => setActiveSlide(index)}
        renderItem={({item, index}) => (
          <Image
            key={index}
            source={item.imageUrl ? {uri: item.imageUrl} : defaultImage}
            alt={item.title || 'image'}
            resizeMode="cover"
            width="100%"
            height={width / 1.3}
            onLoad={() => {
              setImageLoaded(true);
            }}
          />
        )}
      />
      <Pagination
        dotsLength={props.entries.length}
        activeDotIndex={activeSlide}
        containerStyle={{backgroundColor: 'rgba(0, 0, 0, 0.75)'}}
        dotStyle={{
          zIndex: 100,
          width: 100,
          height: 100,
          borderRadius: 5,
          marginHorizontal: 8,
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
        }}
        inactiveDotStyle={
          {
            // Define styles for inactive dots here
          }
        }
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    </View>
  );
}
