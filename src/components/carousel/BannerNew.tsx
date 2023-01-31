import React, {useRef, useState} from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Carousel from 'react-native-reanimated-carousel';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Image, VStack, Text, Box, HStack} from 'native-base';

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
          height={width / 1.45}
          autoPlay={true}
          data={props.entries}
          modeConfig={{
            parallaxScrollingScale: 0.94,
            parallaxScrollingOffset: 46,
            parallaxAdjacentItemScale: 0.86,
          }}
          mode="parallax"
          scrollAnimationDuration={3000}
          // onSnapToItem={index => console.log('current index:', index)}
          renderItem={({item, index}) => (
            <Box
              shadow="2"
              bg="white"
              mx={4}
              borderRadius="lg"
              style={{marginRight: 25, marginLeft: 4}}>
              <VStack>
                <Image
                  key={index}
                  source={item.imageUrl ? {uri: item.imageUrl} : defaultImage}
                  alt={item.title || 'image'}
                  resizeMode="contain"
                  width="100%"
                  height="200"
                  borderTopRadius="lg"
                  onLoad={() => {
                    setImageLoaded(true);
                  }}
                />
                <VStack padding={'12px'}>
                  <Text fontWeight="500" fontSize="14px" marginBottom={'8px'}>
                    {item.title}
                  </Text>
                  {/* <Text color="gray.500">Offline · Oct 10 - Oct 21 2023</Text> */}
                  <HStack alignItems={'center'}>
                    <Text fontWeight="500" fontSize="12px" color="gray.500">
                      {item.eventType}
                    </Text>
                    <Text
                      fontWeight="500"
                      fontSize="12px"
                      color="gray.500"
                      marginX={'8px'}>
                      •
                    </Text>
                    <Text fontWeight="500" fontSize="12px" color="gray.500">
                      {item.date}
                    </Text>
                  </HStack>
                </VStack>
              </VStack>
            </Box>
          )}
        />
      </GestureHandlerRootView>
    </View>
  );
}
