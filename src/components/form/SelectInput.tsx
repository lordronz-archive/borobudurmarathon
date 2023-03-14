import {Box, FormControl, Input, Select, WarningOutlineIcon} from 'native-base';
import React from 'react';
import {
  type NativeSyntheticEvent,
  type TextInputEndEditingEventData,
} from 'react-native';

type SelectInputProps = {
  isInvalid?: boolean;
  helperText?: React.ReactNode;
  errorMessage?: string;
  placeholder?: string;
  label?: string;
  value?: string;
  items: {
    label: string;
    value: string;
  }[];
  hideSearch?: boolean;
  onValueChange?: (text: string) => void;
  isOpen?: boolean;
  setIsOpen?: () => void;
};

export default function SelectInput(props: SelectInputProps) {
  const [searchValue, setSearchValue] = React.useState<string>('');

  const handleInputSubmit = React.useCallback(
    (ev: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
      const input = ev.nativeEvent.text;
      setSearchValue(String(input));
    },
    [setSearchValue],
  );

  return (
    <FormControl isInvalid={props.isInvalid}>
      <Box borderWidth={1} borderColor="#C5CDDB" borderRadius={5} px={3} pb={0}>
        <FormControl.Label mb={-1.5}>{props.label}</FormControl.Label>
        <Select
          placeholder={props.placeholder}
          variant="unstyled"
          ml={-3}
          selectedValue={props.value}
          onValueChange={props.onValueChange}
          _actionSheet={props.isOpen ? {isOpen: props.isOpen} : undefined}
          _actionSheetBody={
            props.hideSearch
              ? undefined
              : {
                  ListHeaderComponent: (
                    <FormControl px={3} mb={3}>
                      <Input
                        px={15}
                        py={2}
                        fontSize={16}
                        placeholder=""
                        _focus={{bg: 'white', borderColor: 'darkBlue.600'}}
                        type="text"
                        onEndEditing={handleInputSubmit}
                      />
                    </FormControl>
                  ),
                }
          }>
          {props.items
            .filter(
              ({value, label}) =>
                String(value || '')
                  .toLowerCase()
                  .includes(searchValue.toLowerCase()) ||
                label.toLowerCase().includes(searchValue.toLowerCase()),
            )
            .map(({label, value}, i) => (
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
