import React, {useState} from 'react';
import FastImage, {FastImageProps} from 'react-native-fast-image';
import {createImageProgress} from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
const Image = createImageProgress(FastImage);

type Props = FastImageProps & {images: string[]};

export default function AppRandomImage(props: Props) {
  const [uri, setUri] = useState<string>();

  return (
    <Image
      {...props}
      source={
        uri
          ? {
              uri: uri,
              priority: FastImage.priority.normal,
            }
          : props.source
          ? props.source
          : require('../../assets/images/blur-image.jpg')
      }
      indicator={Progress.Pie}
      indicatorProps={{
        size: 50,
        borderWidth: 0,
        color: 'rgba(150, 150, 150, 1)',
        unfilledColor: 'rgba(200, 200, 200, 0.2)',
      }}
      imageStyle={{borderRadius: 10}}
      renderError={() => {
        setUri(props.images[Math.floor(Math.random() * props.images.length)]);
        return (
          <AppRandomImage
            {...props}
            source={{
              uri: props.images[
                Math.floor(Math.random() * props.images.length)
              ],
            }}
            images={props.images}
          />
        );
      }}
    />
    // <FastImage
    //   {...props}
    //   source={
    //     uri
    //       ? {
    //           uri: uri,
    //           priority: FastImage.priority.normal,
    //         }
    //       : props.source
    //       ? props.source
    //       : require('../../assets/images/blur-image.jpg')
    //   }
    //   onError={() => {
    //     setUri(props.images[Math.floor(Math.random() * props.images.length)]);
    //   }}
    // />
  );
}
