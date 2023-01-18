import {Box, FormControl, Input, WarningOutlineIcon} from 'native-base';
import {IInputProps} from 'native-base/lib/typescript/components/primitives/Input/types';
import React from 'react';

type TextInputProps = {
  isInvalid?: boolean;
  helperText?: string;
  errorMessage?: string;
  placeholder?: string;
  label?: string;
  value?: string;
  _inputProps?: IInputProps;
  onChangeText?: (text: string) => void;
};

export default function TextInput(props: TextInputProps) {
  return (
    <FormControl isInvalid={props.isInvalid}>
      <Box borderWidth={1} borderColor="#C5CDDB" borderRadius={5} px={3} pb={2}>
        <FormControl.Label>{props.label}</FormControl.Label>
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
