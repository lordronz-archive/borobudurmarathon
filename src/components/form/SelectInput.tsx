import {Box, FormControl, Select, WarningOutlineIcon} from 'native-base';
import React from 'react';

type SelectInputProps = {
  isInvalid?: boolean;
  helperText?: string;
  errorMessage?: string;
  placeholder?: string;
  label?: string;
  value?: string;
  items: {
    label: string;
    value: string;
  }[];
  onValueChange?: (text: string) => void;
};

export default function SelectInput(props: SelectInputProps) {
  return (
    <FormControl isInvalid={props.isInvalid}>
      <Box borderWidth={1} borderColor="#C5CDDB" borderRadius={5} px={3} pb={0}>
        <FormControl.Label mb={-1.5}>{props.label}</FormControl.Label>
        <Select
          placeholder={props.placeholder}
          variant="unstyled"
          ml={-3}
          selectedValue={props.value}
          onValueChange={props.onValueChange}>
          {props.items.map(({label, value}, i) => (
            <Select.Item label={label} value={value} key={`${value}-${i}`} />
          ))}
        </Select>
      </Box>
      <FormControl.HelperText>{props.helperText}</FormControl.HelperText>
      <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
        {props.errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  );
}
