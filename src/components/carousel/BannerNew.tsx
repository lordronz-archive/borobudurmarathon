import React, {useRef, useState} from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Carousel from 'react-native-reanimated-carousel';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Image, VStack, Text, Box} from 'native-base';

const defaultImage = require('../../assets/images/FeaturedEventImage.png');

const {width} = Dimensions.get('window');

type IProps = {
  entries: {
    title: string;
    imageUrl?: string | null;
    eventType: string;
    date: string;
  }[];
};

export default function BannerNew(props: IProps) {
  const navigation = useNavigation();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let _carousel = useRef();

  const [activeSlide, setActiveSlide] = useState(0);

  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <View>
      <GestureHandlerRootView>
        <Carousel
          loop
          width={width}
          height={width / 1.5}
          autoPlay={true}
          data={props.entries}
          modeConfig={{
            parallaxScrollingScale: 0.96,
            parallaxScrollingOffset: 38,
          }}
          mode="parallax"
          scrollAnimationDuration={3000}
          // onSnapToItem={index => console.log('current index:', index)}
          renderItem={({item, index}) => (
            <Box shadow="2" bg="white" mx={4} borderRadius="lg">
              <VStack>
                <Image
                  key={index}
                  source={item.imageUrl ? {uri: item.imageUrl} : defaultImage}
                  alt={item.title || 'image'}
                  resizeMode="cover"
                  width="100%"
                  height="180"
                  borderTopRadius="lg"
                  onLoad={() => {
                    setImageLoaded(true);
                  }}
                />
                <VStack py="3" px="3">
                  <Text
                    fontFamily="Poppins-Medium"
                    fontWeight="600"
                    fontSize="md">
                    {item.title}
                  </Text>
                  {/* <Text color="gray.500">Offline · Oct 10 - Oct 21 2023</Text> */}
                  <Text color="gray.500">
                    {item.eventType} · {item.date}
                  </Text>
                </VStack>
              </VStack>
            </Box>
          )}
        />
      </GestureHandlerRootView>
    </View>
  );
}
