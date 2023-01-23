import React, {useRef, useState} from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
// import {EActionType, any} from '../../helpers/api/content/banner';
import Carousel from 'react-native-reanimated-carousel';
import {Image, VStack, Text, Box} from 'native-base';

const defaultImage = require('../../assets/images/FeaturedEventImage.png');
// const imageLoading = require('../../assets/image-loading.png');
// const playIcon = require('../../assets/play-icon.png');

const {width} = Dimensions.get('window');

type IProps = {
  entries: {
    title: string;
    imageUrl?: string;
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
      <Carousel
        loop
        width={width}
        height={width / 1.8}
        autoPlay={true}
        data={props.entries}
        scrollAnimationDuration={3000}
        // onSnapToItem={index => console.log('current index:', index)}
        renderItem={({item, index}) => (
          <Box shadow="2" bg="white" mx={4}>
            <VStack>
              <Image
                key={index}
                source={item.imageUrl ? {uri: item.imageUrl} : defaultImage}
                alt={item.title || 'image'}
                resizeMode="cover"
                width="100%"
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
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    position: 'absolute',
    bottom: -16,
    left: -12,
    marginHorizontal: 0,
  },
  dotStyle: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: 'black',
    marginHorizontal: 0,
  },
  inactiveDotStyle: {
    backgroundColor: 'grey',
  },
  iconPlayContainer: {
    width: '100%',
    height: (2 / 3) * width,
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPlay: {
    width: 100,
  },
});
