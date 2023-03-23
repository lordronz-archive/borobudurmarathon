import {Box, FormControl, HStack, Text, WarningOutlineIcon} from 'native-base';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {SelectList} from 'react-native-dropdown-select-list';

type TimeInputProps = {
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
  required?: boolean;
};

export default function TimeInput(props: TimeInputProps) {
  // const [searchValue, setSearchValue] = React.useState<string>('');

  // const handleInputSubmit = React.useCallback(
  //   (ev: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
  //     const input = ev.nativeEvent.text;
  //     setSearchValue(String(input));
  //   },
  //   [setSearchValue],
  // );

  const {t} = useTranslation();

  const [hours, setHours] = useState('00');
  const [mins, setMins] = useState('00');

  return (
    <FormControl isInvalid={props.isInvalid}>
      <Box borderWidth={1} borderColor="#C5CDDB" borderRadius={5} pb={0}>
        <FormControl.Label flexWrap={'wrap'} px={3}>
          <HStack>
            {props.required && <Text color="primary.900">* </Text>}
            <Text style={{fontSize: 12, color: '#768499'}}>
              {props.label} (hh:mm)
            </Text>
          </HStack>
          {props.required && (
            <Text
              style={{fontSize: 12, color: '#EB1C23'}}
              italic
              ml="2"
              fontSize="xs">
              {t('required')}
            </Text>
          )}
        </FormControl.Label>
        <HStack
          justifyContent={'center'}
          alignItems="center"
          mt="-8px"
          mb="-5px">
          <SelectList
            setSelected={(val: string) => {
              setHours(val);
              props.onValueChange?.(val + ':' + mins);
            }}
            data={[...Array(24)]
              .map((_, i) => i)
              .map(n => ({
                key: n.toString().padStart(2, '0'),
                value: n.toString().padStart(2, '0'),
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
              marginTop: 0,
            }} //override default styles
            inputStyles={{
              margin: 0,
              paddingVertical: 0,
              paddingLeft: '20%',
              paddingRight: '20%',
            }}
            dropdownStyles={{
              borderRadius: 0,
              borderWidth: 0,
              padding: 0,
              margin: 0,
              marginTop: -12,
              paddingLeft: '32%',
            }}
            defaultOption={{
              key: '00',
              value: '00',
            }}
          />
          <Text>:</Text>
          <SelectList
            setSelected={(val: string) => {
              setMins(val);
              props.onValueChange?.(hours + ':' + val);
            }}
            data={[...Array(60)]
              .map((_, i) => i)
              .map(n => ({
                key: n.toString().padStart(2, '0'),
                value: n.toString().padStart(2, '0'),
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
              marginTop: 0,
            }} //override default styles
            inputStyles={{
              margin: 0,
              padding: 0,
              paddingLeft: '15%',
              paddingRight: '15%',
            }}
            dropdownStyles={{
              borderRadius: 0,
              borderWidth: 0,
              padding: 0,
              margin: 0,
              marginTop: -12,
              paddingLeft: '28%',
            }}
            defaultOption={{
              key: '00',
              value: '00',
            }}
          />
        </HStack>
      </Box>
      <FormControl.HelperText>{props.helperText}</FormControl.HelperText>
      <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
        {props.errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  );
}
