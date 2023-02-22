import {Box, FormControl, Input, WarningOutlineIcon} from 'native-base';
import React, {useState} from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CalendarIcon from '../icons/CalendarIcon';

type DateInputProps = {
  isInvalid?: boolean;
  helperText?: React.ReactNode;
  errorMessage?: string;
  placeholder?: string;
  label?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  date?: Date;
  setDate: (date: Date) => void;
};

export default function DateInput(props: DateInputProps) {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    props.setDate(date);
    hideDatePicker();
  };

  return (
    <FormControl isInvalid={props.isInvalid}>
      <Box
        borderWidth={1}
        borderColor="#C5CDDB"
        borderRadius={5}
        px={3}
        pb={2}
        onTouchEnd={() => setDatePickerVisibility(true)}>
        <FormControl.Label>{props.label}</FormControl.Label>
        <Input
          placeholder={props.placeholder}
          variant="unstyled"
          _input={{paddingX: 0, paddingY: 0}}
          value={
            props.date
              ? props.date.toJSON().slice(0, 10).split('-').reverse().join('/')
              : undefined
          }
          onChangeText={props.onChangeText}
          InputRightElement={<CalendarIcon size="lg" />}
          isReadOnly
        />
      </Box>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        display={'spinner'}
      />
      <FormControl.HelperText>{props.helperText}</FormControl.HelperText>
      <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
        {props.errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  );
}
