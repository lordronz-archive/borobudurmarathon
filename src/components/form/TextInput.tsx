import {
  Box,
  FormControl,
  HStack,
  Input,
  Text,
  WarningOutlineIcon,
} from 'native-base';
import {IInputProps} from 'native-base/lib/typescript/components/primitives/Input/types';
import React from 'react';

type TextInputProps = {
  isInvalid?: boolean;
  helperText?: React.ReactNode;
  errorMessage?: string;
  placeholder?: string;
  label?: string;
  value?: string;
  required?: boolean;
  _inputProps?: IInputProps;
  onChangeText?: (text: string) => void;
};

export default function TextInput(props: TextInputProps) {
  return (
    <FormControl isInvalid={props.isInvalid}>
      <Box borderWidth={1} borderColor="#C5CDDB" borderRadius={5} px={3} pb={2}>
        <FormControl.Label flexWrap={'wrap'}>
          <HStack>
            {props.required && <Text color="primary.900">* </Text>}
            <Text>{props.label}</Text>
          </HStack>
          {props.required && (
            <Text color="primary.900" italic ml="2">
              Required
            </Text>
          )}
        </FormControl.Label>
        <Input
          placeholder={props.placeholder}
          variant="unstyled"
          _input={{paddingX: 0, paddingY: 0}}
          value={props.value}
          onChangeText={props.onChangeText}
          {...(props._inputProps || {})}
        />
      </Box>
      <FormControl.HelperText>{props.helperText}</FormControl.HelperText>
      <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
        {props.errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  );
}
