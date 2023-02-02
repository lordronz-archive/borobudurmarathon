/* eslint-disable prettier/prettier */
import React from 'react';
import {Box, Button, Modal, Text} from 'native-base';
import ImageCropPicker from 'react-native-image-crop-picker';
import {TouchableOpacity} from 'react-native';

type Props = {
  visible: boolean;
  setVisible: (value: boolean) => void;
  onChange: (img: any) => void;
};
const ImagePicker = (props: Props) => {
  const {visible, setVisible, onChange} = props;

  const openGalery = () => {
    ImageCropPicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
    })
      .then(image => {
        onChange(image);
        setVisible(false);
      })
      .catch(err => {
        console.log('ERROR OEPN GALERY =>>> ', err);
      });
  };

  const openCamera = () => {
    ImageCropPicker.openCamera({
      width: 300,
      height: 300,
      cropping: true,
    })
      .then(image => {
        onChange(image);
        setVisible(false);
      })
      .catch(err => {
        console.log('ERROR OPEN CAMERA =>>> ', err);
      });
  };

  return (
    <Modal isOpen={visible} onClose={() => setVisible(false)}>
      <Modal.Content
        width={'100%'}
        alignItems={'center'}
        paddingY={'30px'}
        paddingX={'15px'}
        style={{marginBottom: 0, marginTop: 'auto'}}>
        <Modal.CloseButton />
        <Text
          fontSize={'20px'}
          fontWeight={600}
          color={'#1E1E1E'}
          marginBottom={'12px'}>
          Choose Profile Picture
        </Text>
        <Box alignSelf={'flex-start'}>
          <TouchableOpacity onPress={openCamera} style={{marginVertical: 15}}>
            <Text fontSize={'14px'} fontWeight={400} color={'#1E1E1E'}>
              Open Camera
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={openGalery} style={{marginVertical: 15}}>
            <Text fontSize={'14px'} fontWeight={400} color={'#1E1E1E'}>
              Choose from gallery
            </Text>
          </TouchableOpacity>
        </Box>
      </Modal.Content>
    </Modal>
  );
};

export default ImagePicker;
