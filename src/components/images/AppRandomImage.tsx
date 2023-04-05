import React, {useState} from 'react';
import FastImage, {FastImageProps} from 'react-native-fast-image';

type Props = FastImageProps & {images: string[]};

export default function AppRandomImage(props: Props) {
  const [uri, setUri] = useState<string>();

  return (
    <FastImage
      {...props}
      source={
        uri
          ? {
              uri: uri,
              priority: FastImage.priority.normal,
            }
          : props.source
          ? props.source
          : require('../../assets/images/no-image.png')
      }
      onError={() => {
        setUri(props.images[Math.floor(Math.random() * props.images.length)]);
      }}
    />
  );
}
