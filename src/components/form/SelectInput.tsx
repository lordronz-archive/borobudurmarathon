import {
  Box,
  FormControl,
  HStack,
  Spinner,
  Text,
  WarningOutlineIcon,
} from 'native-base';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {SelectList} from 'react-native-dropdown-select-list';

type SelectInputProps = {
  isLoading?: boolean;
  isInvalid?: boolean;
  helperText?: React.ReactNode;
  errorMessage?: string;
  placeholder?: string;
  label?: string;
  value?: string;
  items: {
    label: string;
    value: string | number;
  }[];
  hideSearch?: boolean;
  onValueChange?: (text: string) => void;
  isOpen?: boolean;
  setIsOpen?: () => void;
  required?: boolean;
  width?: number | string;
  height?: number | string;
};

export default function SelectInput(props: SelectInputProps) {
  // const [searchValue, setSearchValue] = React.useState<string>('');

  // const handleInputSubmit = React.useCallback(
  //   (ev: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
  //     const input = ev.nativeEvent.text;
  //     setSearchValue(String(input));
  //   },
  //   [setSearchValue],
  // );

  const {t} = useTranslation();

  return (
    <FormControl isInvalid={props.isInvalid} width={props.width}>
      <Box borderWidth={1} borderColor="#C5CDDB" borderRadius={5} pb={0}>
        <FormControl.Label flexWrap={'wrap'} px={3}>
          <HStack>
            {props.required && <Text color="primary.900">* </Text>}
            <Text style={{fontSize: 12, color: '#768499'}}>
              {props.label}{' '}
              {props.required && (
                <Text
                  style={{fontSize: 12, color: '#EB1C23'}}
                  italic
                  ml="2"
                  fontSize="xs">
                  {t('required')}
                </Text>
              )}
            </Text>

            {props.isLoading && <Spinner size="sm" />}
          </HStack>
        </FormControl.Label>
        <SelectList
          setSelected={(val: string) => props.onValueChange?.(val)}
          data={props.items.map(({label, value}) => ({
            key: value,
            value: label,
          }))}
          save="key"
          search={
            props.hideSearch != null
              ? !props.hideSearch
              : props.items.length > 4
          }
          placeholder={props.placeholder}
          boxStyles={{
            borderRadius: 0,
            borderWidth: 0,
            padding: 0,
            margin: 0,
            marginTop: -8,
            marginBottom: -5,
            height: props.height,
          }} //override default styles
          inputStyles={{
            margin: 0,
            padding: 0,
            color: props.value ? undefined : 'gray',
          }}
          dropdownStyles={{
            borderRadius: 0,
            borderWidth: 0,
            padding: 0,
            marginTop: -8,
          }}
          defaultOption={
            props.value != null
              ? {
                  key: props.value,
                  value: props.items.find(v => v.value === props.value)?.label,
                }
              : undefined
          }
        />
      </Box>
      <FormControl.HelperText>{props.helperText}</FormControl.HelperText>
      <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
        {props.errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  );
}
