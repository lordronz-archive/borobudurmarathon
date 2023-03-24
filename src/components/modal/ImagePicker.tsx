/* eslint-disable prettier/prettier */
import React from 'react';
import {Box, Button, Modal, Text, Toast} from 'native-base';
import ImageCropPicker from 'react-native-image-crop-picker';
import {TouchableOpacity} from 'react-native';
import { getErrorMessage } from '../../helpers/errorHandler';
import { t } from 'i18next';

type Props = {
  title?: string;
  visible: boolean;
  setVisible: (value: boolean) => void;
  onChange: (img: any) => void;
  width?: number;
  height?: number;
};
const ImagePicker = (props: Props) => {
  const {visible, setVisible, onChange} = props;

  const openGalery = () => {
    ImageCropPicker.openPicker({
      width: props.width || 300,
      height: props.height || 300,
      cropping: true,
      freeStyleCropEnabled: true,
    })
      .then(image => {
        onChange(image);
        setVisible(false);
      })
      .catch(err => {
        console.log('ERROR OEPN GALERY =>>> ', err);
        Toast.show({
          description: getErrorMessage(err),
        });
      });
  };

  const openCamera = () => {
    ImageCropPicker.openCamera({
      width: props.width || 300,
      height: props.height || 300,
      cropping: true,
      freeStyleCropEnabled: true,
      mediaType: 'photo',
      useFrontCamera: false,
    })
      .then(image => {
        onChange(image);
        setVisible(false);
      })
      .catch(err => {
        console.log('ERROR OPEN CAMERA =>>> ', err);
        Toast.show({
          description: getErrorMessage(err),
        });
      });
  };

  return (
    <Modal size={'full'} isOpen={visible} onClose={() => setVisible(false)}>
      <Modal.Content
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
          {props.title || 'Choose Profile Picture'}
        </Text>
        <Box alignSelf={'flex-start'}>
          <TouchableOpacity onPress={openCamera} style={{marginVertical: 15}}>
            <Text fontSize={'14px'} fontWeight={400} color={'#1E1E1E'}>
              {t('uploadPhotoOptions.openCamera')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={openGalery} style={{marginVertical: 15}}>
            <Text fontSize={'14px'} fontWeight={400} color={'#1E1E1E'}>
              {t('uploadPhotoOptions.chooseFromGallery')}
            </Text>
          </TouchableOpacity>
        </Box>
      </Modal.Content>
    </Modal>
  );
};

export default ImagePicker;
