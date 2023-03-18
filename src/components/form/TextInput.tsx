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
import React, {useState} from 'react';
import {
  TextInput as BaseTextInput,
  TextInputAndroidProps,
  TextInputIOSProps,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

type TextInputProps = {
  isInvalid?: boolean;
  helperText?: React.ReactNode;
  errorMessage?: string;
  placeholder?: string;
  label?: string;
  value?: string;
  required?: boolean;
  loading?: boolean;
  rightIcon?: any;
  _inputProps?: TextInputAndroidProps | TextInputIOSProps;
  type?: 'text' | 'password';
  onChangeText?: (text: string) => void;
};

export default function TextInput(props: TextInputProps) {
  const [show, setShow] = useState(false);
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
              style={{fontSize: 12, color: '#EB1C23'}}
              italic
              ml="2"
              fontSize="xs">
              Required
            </Text>
          )}
        </FormControl.Label>
        <HStack alignItems={'center'}>
          <BaseTextInput
            style={{
              flex: 1,
              paddingVertical: 2,
              paddingHorizontal: 0,
              fontSize: 14,
              color: '#1E1E1E',
            }}
            placeholderTextColor={'#9FACBF'}
            placeholder={props.placeholder}
            // variant="unstyled"
            // _input={{paddingX: 0, paddingY: 0}}
            value={props.value}
            onChangeText={props.onChangeText}
            autoCapitalize="none"
            // InputRightElement={
            //   props.loading ? (
            //     <Spinner size="sm" />
            //   ) : props.rightIcon ? (
            //     props.rightIcon
            //   ) : props.type === 'password' ? (
            //     <Icon
            //       name={!show ? 'eye' : 'eye-off'}
            //       onPress={() => setShow(s => !s)}
            //       size={20}
            //     />
            //   ) : undefined
            // }
            secureTextEntry={props.type === 'password' && !show}
            textContentType={
              show || props.type !== 'password' ? undefined : 'password'
            }
            // type={show || props.type !== 'password' ? 'text' : 'password'}
            {...(props._inputProps || {})}
          />
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
