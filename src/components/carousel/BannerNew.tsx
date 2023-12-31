import React, {useRef, useState} from 'react';
import {View, Dimensions, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Carousel from 'react-native-reanimated-carousel';
import {
  GestureHandlerRootView,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import {Image, VStack, Text, Box, HStack} from 'native-base';
import {RootStackParamList} from '../../navigation/RootNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import FastImage from 'react-native-fast-image';

const defaultImage = require('../../assets/images/no-image.png');

const {width} = Dimensions.get('window');

type IProps = {
  entries: {
    title: string;
    imageUrl?: string | null;
    eventType: string;
    date: string;
    id: number | string;
  }[];
};

export default function BannerNew(props: IProps) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
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
          autoPlay={props.entries.length > 1}
          autoPlayInterval={5000}
          data={props.entries}
          modeConfig={{
            parallaxScrollingScale: 0.94,
            parallaxScrollingOffset: 54,
            parallaxAdjacentItemScale: 0.86,
          }}
          mode="parallax"
          scrollAnimationDuration={3000}
          // onSnapToItem={index => console.log('current index:', index)}
          panGestureHandlerProps={{
            activeOffsetX: [-5, 5],
          }}
          renderItem={({item, index}) => (
            <Box
              key={index}
              shadow="2"
              bg="white"
              mx={4}
              borderRadius="lg"
              style={{marginRight: 32, marginLeft: 4}}>
              <TouchableWithoutFeedback
                onPress={() =>
                  navigation.navigate('EventDetail', {id: Number(item.id)})
                }>
                <VStack>
                  {/* <Image
                    key={index}
                    source={item.imageUrl ? {uri: item.imageUrl} : defaultImage}
                    alt={item.title || 'image'}
                    resizeMode="cover"
                    width="100%"
                    height="200"
                    borderTopRadius="lg"
                    onLoad={() => {
                      setImageLoaded(true);
                    }}
                  /> */}
                  <FastImage
                    key={index}
                    style={{
                      width: '100%',
                      height: 200,
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                    }}
                    source={
                      item.imageUrl
                        ? {
                            uri: item.imageUrl,
                            priority: FastImage.priority.high,
                          }
                        : defaultImage
                    }
                    resizeMode={FastImage.resizeMode.cover}
                    // onError={() => {
                    //   setUri(
                    //     props.images[Math.floor(Math.random() * props.images.length)],
                    //   );
                    // }}
                  />
                  <VStack padding={'12px'}>
                    <Text
                      fontWeight="500"
                      fontSize="14px"
                      marginBottom={'8px'}
                      numberOfLines={1}>
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
              </TouchableWithoutFeedback>
            </Box>
          )}
        />
      </GestureHandlerRootView>
    </View>
  );
}
