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
      <Box borderWidth={1} borderColor="#C5CDDB" borderRadius={5} px={3} pb={2}>
        <FormControl.Label flexWrap={'wrap'}>
          <HStack>
            {props.required && <Text color="primary.900">* </Text>}
            <Text>{props.label}</Text>
          </HStack>
          {props.required && (
            <Text color="primary.900" italic ml="2" fontSize="xs">
              Required
            </Text>
          )}
        </FormControl.Label>
        <BaseTextInput
          placeholder={props.placeholder}
          // variant="unstyled"
          // _input={{paddingX: 0, paddingY: 0}}
          value={props.value}
          onChangeText={props.onChangeText}
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
        <View style={{position: 'absolute', right: 0, padding: 16}}>
          {props.loading ? (
            <Spinner size="sm" />
          ) : props.rightIcon ? (
            props.rightIcon
          ) : props.type === 'password' ? (
            <Icon
              name={!show ? 'eye' : 'eye-off'}
              onPress={() => setShow(s => !s)}
              size={20}
            />
          ) : undefined}
        </View>
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
