/* eslint-disable prettier/prettier */
import React, { useCallback } from 'react';
import {Box, Modal, Text} from 'native-base';
import ImageCropPicker from 'react-native-image-crop-picker';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import {TouchableOpacity} from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';

type Props = {
  visible: boolean;
  setVisible: (value: boolean) => void;
  onChange: (img: any) => void;
  width?: number;
  height?: number;
  setFileResponse: (a: DocumentPickerResponse) => void;
  file?: DocumentPickerResponse;
};
const FilePicker = (props: Props) => {
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
        crashlytics().recordError(err);
      });
  };

  const handleDocumentSelection = useCallback(async () => {
    try {
      const response = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
      });
      props.setFileResponse(response);
    } catch (err) {
      console.warn(err);
    }
  }, [props]);

  const openCamera = () => {
    ImageCropPicker.openCamera({
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
        console.log('ERROR OPEN CAMERA =>>> ', err);
        crashlytics().recordError(err);
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

export default FilePicker;
