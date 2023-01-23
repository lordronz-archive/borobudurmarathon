import React, {useRef, useState} from 'react';
import {
  View,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
// import {EActionType, any} from '../../helpers/api/content/banner';
import Carousel from 'react-native-reanimated-carousel';

const defaultImage = require('../../assets/images/FeaturedEventImage.png');
// const imageLoading = require('../../assets/image-loading.png');
// const playIcon = require('../../assets/play-icon.png');

const {width} = Dimensions.get('window');

type IProps = {
  entries: any[];
};

export default function BannerNew(props: IProps) {
  const navigation = useNavigation();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let _carousel = useRef();

  const [activeSlide, setActiveSlide] = useState(0);

  const [imageLoaded, setImageLoaded] = useState(false);

  const _renderItem = ({item, index}: {item: any; index: number}) => {
    const itemNews: any = {
      newsId: item.bannerId,
      title: item.title as string,
      // status: EStatusNews.PUBLISHED,
      content: item.content || '',
      imageLink: item.imageLink,
      // newsType:
      //   item.actionType === EActionType.EXISTING_NEWS
      //     ? ENewsType.NEWS
      //     : ENewsType.PROMOTION,
      tags: [],
      updatedAt: item.updatedAt,
      createdAt: item.createdAt,
    };

    return (
      <TouchableOpacity
        onPress={() => {
          // if (item.actionType === EActionType.NEW_CONTENT) {
          //   navigation.navigate('ContentDetail', {
          //     ...itemNews,
          //     newsType: 'new-content',
          //   });
          // } else if (
          //   item.actionType === EActionType.EXISTING_NEWS ||
          //   item.actionType === EActionType.EXISTING_PROMOTION
          // ) {
          //   navigation.navigate('ContentDetail', {
          //     ...itemNews,
          //     actionType: item.actionType,
          //     contentId: item.contentId,
          //   });
          // } else if (item.actionType === EActionType.EXISTING_PRODUCT) {
          //   navigation.navigate('ProductDetail', {
          //     productId: item.contentId,
          //   });
          // }
        }}>
        <Image
          key={index}
          source={item.imageLink ? {uri: item.imageLink} : defaultImage}
          style={styles.image}
          resizeMode="cover"
          onLoad={() => {
            setImageLoaded(true);
          }}
        />
        {/* {item.youtubeLink ? (
          <View style={styles.iconPlayContainer}>
            <Image
              key={index}
              source={playIcon}
              style={styles.iconPlay}
              resizeMode="contain"
            />
          </View>
        ) : (
          false
        )} */}
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <Carousel
        loop
        width={width}
        height={width / 2}
        autoPlay={true}
        data={props.entries}
        scrollAnimationDuration={1000}
        // onSnapToItem={index => console.log('current index:', index)}
        renderItem={({item, index}) => (
          // <View
          //   style={{
          //     flex: 1,
          //     borderWidth: 1,
          //     justifyContent: 'center',
          //   }}>
          //   <Text style={{textAlign: 'center', fontSize: 30}}>{index}</Text>
          // </View>
          <Image
            key={index}
            source={item.imageLink ? {uri: item.imageLink} : defaultImage}
            style={styles.image}
            resizeMode="cover"
            onLoad={() => {
              setImageLoaded(true);
            }}
          />
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
  image: {width: '100%', height: (2 / 3) * width},
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
