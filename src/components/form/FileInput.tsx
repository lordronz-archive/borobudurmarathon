import {
  Box,
  FormControl,
  HStack,
  // Input,
  Spinner,
  Text,
  WarningOutlineIcon,
} from 'native-base';
// import {IInputProps} from 'native-base/lib/typescript/components/primitives/Input/types';
import React, {useCallback, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/Feather';
import IconUpload from '../../assets/icons/IconUpload';

type FileInputProps = {
  isInvalid?: boolean;
  helperText?: React.ReactNode;
  errorMessage?: string;
  placeholder?: string;
  label?: string;
  value?: string;
  required?: boolean;
  loading?: boolean;
  rightIcon?: any;
  type?: 'text' | 'password';
  onChangeText?: (text: string) => void;
  setFileResponse: (a: DocumentPickerResponse) => void;
  file?: DocumentPickerResponse;
};

export default function FileInput(props: FileInputProps) {
  const [show, setShow] = useState(false);

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

  return (
    <FormControl isInvalid={props.isInvalid}>
      <Box
        borderWidth={1}
        borderColor="#C5CDDB"
        borderRadius={'4px'}
        px={'12px'}
        py={'6px'}>
        <FormControl.Label flexWrap={'wrap'}>
          <HStack>
            {props.required && <Text color="primary.900">* </Text>}
            <Text style={{fontSize: 12, color: '#768499'}}>{props.label}</Text>
          </HStack>
          {props.required && (
            <Text
              style={{fontSize: 12, color: 'primary.900'}}
              italic
              ml="2"
              fontSize="xs">
              Required
            </Text>
          )}
        </FormControl.Label>
        <HStack alignItems={'center'}>
          <TouchableOpacity
            style={{width: '100%'}}
            onPress={handleDocumentSelection}>
            <HStack alignItems="center" space="2">
              <IconUpload size="2xl" />
              <Text fontSize="sm">
                {props.file ? props.file.name : 'Upload File'}
              </Text>
            </HStack>
          </TouchableOpacity>
          {props.loading ? (
            <Spinner size="sm" style={{paddingLeft: 10}} />
          ) : props.rightIcon ? (
            props.rightIcon
          ) : props.type === 'password' ? (
            <Icon
              name={!show ? 'eye' : 'eye-off'}
              onPress={() => setShow(s => !s)}
              size={20}
              style={{paddingLeft: 10}}
            />
          ) : undefined}
        </HStack>
      </Box>
      <FormControl.HelperText pl="1" mt="1" mb="1.5">
        {props.helperText}
      </FormControl.HelperText>
      <FormControl.ErrorMessage
        pl="1"
        mt="0"
        mb="1.5"
        leftIcon={<WarningOutlineIcon size="xs" />}>
        {props.errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  );
}
