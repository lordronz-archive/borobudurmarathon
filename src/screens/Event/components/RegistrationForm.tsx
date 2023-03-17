import React, {useEffect, useState} from 'react';
import SelectInput from '../../../components/form/SelectInput';
import {EventFieldsEntity} from '../../../types/event.type';
import TextInput from '../../../components/form/TextInput';
import ApiService from '../../../api/api.service';
import countries from '../../../helpers/countries';
import DateInput from '../../../components/form/DateInput';
import {Box, Row, Text} from 'native-base';
import {convertOption} from '../../../helpers/convertOption';
import FileInput from '../../../components/form/FileInput';
import { DocumentPickerResponse } from 'react-native-document-picker';

type Option = {value: string; label: string};
export default function RegistrationForm(
  props: EventFieldsEntity & {
    onValueChange: (val: string) => void;
    value: string;
    helperText?: React.ReactNode;
    required?: boolean;
    static?: boolean;
    data?: (EventFieldsEntity & {value: string})[];
    setFileResponse?: (a: DocumentPickerResponse) => void;
    file?: DocumentPickerResponse;
  },
) {
  const opts = (
    props.evhfExternalData && !props.evhfExternalData.includes('/api/')
      ? JSON.parse(props.evhfExternalData)
      : []
  ).map((item: {id: number; label: string}) => ({
    label: item.label || '',
    value: item.id || '',
  }));

  const [options, setOptions] = useState<Option[]>(opts);

  const [dateField, setDateField] = useState<Date>();

  useEffect(() => {
    getListOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getListOptions = async () => {
    setOptions((await getOptions(props)) ?? opts);
  };

  if (props.static) {
    return props.data && props.data.length > 0 ? (
      <Row flex={1}>
        {props.data.map(dprops => (
          <Box key={dprops.evhfLabel} flex={1}>
            <Text color="gray.500" fontSize="sm">
              {dprops.evhfLabel}
            </Text>
            {dprops.value ? (
              <Text>{dprops.value}</Text>
            ) : (
              <Text color="gray.500" italic>
                ~ Not Set
              </Text>
            )}
          </Box>
        ))}
      </Row>
    ) : (
      <Row>
        <Box>
          <Text color="gray.500" fontSize="sm">
            {props.evhfLabel}
          </Text>
          {props.value ? (
            <Text>{convertOption(props.value, props.evhfName)}</Text>
          ) : (
            <Text color="gray.500" italic>
              ~ Not Set
            </Text>
          )}
        </Box>
      </Row>
    );
    // <Box key={props.evhfLabel} flex={1}>
    //   <Text color="gray.500" fontSize="sm">
    //     {props.evhfLabel}
    //   </Text>
    //   {props.value ? (
    //     <Text>{props.value}</Text>
    //   ) : (
    //     <Text color="gray.500" italic>
    //       ~ Not Set
    //     </Text>
    //   )}
    // </Box>
  }

  if (props.evhfType === 'Option') {
    return (
      <SelectInput
        items={options}
        placeholder={'Choose one'}
        label={props.evhfLabel}
        onValueChange={props.onValueChange}
        value={props.value}
        helperText={props.helperText}
        hideSearch={options.length <= 10}
        required={props.required}
      />
    );
  } else if (['number', 'phone'].includes(props.evhfType.toLowerCase())) {
    return (
      <TextInput
        placeholder={`Enter ${props.evhfLabel}`}
        label={props.evhfLabel}
        onChangeText={props.onValueChange}
        _inputProps={{
          keyboardType: 'numeric',
        }}
        value={props.value}
        helperText={props.helperText}
        required={props.required}
      />
    );
  } else if (props.evhfType === 'Email') {
    return (
      <TextInput
        placeholder={`Enter ${props.evhfLabel}`}
        label={props.evhfLabel}
        onChangeText={props.onValueChange}
        _inputProps={{
          keyboardType: 'email-address',
        }}
        value={props.value}
        helperText={props.helperText}
        required={props.required}
      />
    );
  } else if (props.evhfType === 'Date') {
    return (
      <DateInput
        placeholder="DD MMM YYYY"
        label={props.evhfLabel}
        date={dateField as Date}
        setDate={date => {
          setDateField(date);
          props.onValueChange(
            date.toJSON().slice(0, 10).split('-').reverse().join('-'),
          );
        }}
        helperText={props.helperText}
      />
    );
  } else if (props.evhfType === 'File' && props.setFileResponse) {
    return (
      <FileInput
        placeholder={`Enter ${props.evhfLabel}`}
        label={props.evhfLabel}
        onChangeText={props.onValueChange}
        value={props.value}
        helperText={props.helperText}
        required={props.required}
        setFileResponse={props.setFileResponse}
        file={props.file}
      />
    );
  } else {
    return (
      <TextInput
        label={props.evhfLabel}
        onChangeText={props.onValueChange}
        placeholder={`Enter ${props.evhfLabel}`}
        value={props.value}
        helperText={props.helperText}
        required={props.required}
      />
    );
  }
}

export async function getOptions(props: EventFieldsEntity) {
  if (props.evhfType.toLowerCase() !== 'option') {
    return;
  }

  if (props.evhfExternalData && props.evhfExternalData.includes('/api/')) {
    try {
      const res: any = await ApiService.getExternal(
        props.evhfExternalData.replace('/api/v1/', ''),
      );
      if (res && res.data) {
        const kys = Object.keys(res.data.data[0]);
        const labelkey = kys.find(v => v.toLowerCase().includes('label'));
        return res.data.data.map((v: {[key: string]: string | number}) => ({
          value: v.id,
          label: v[labelkey!],
        }));
      } else {
        return [];
      }
    } catch (err) {
      return [];
    }
  } else if (
    props.evhfType === 'Option' &&
    (props.evhfLabel.toLowerCase().includes('country') ||
      props.evhfName.toLowerCase().includes('country'))
  ) {
    return countries.map(({en_short_name}) => ({
      label: en_short_name || '',
      value: en_short_name || '',
    }));
  } else if (
    props.evhfType === 'Option' &&
    (props.evhfLabel.toLowerCase().includes('nationality') ||
      props.evhfName.toLowerCase().includes('nationality'))
  ) {
    return countries.map(({nationality}) => ({
      label: nationality || '',
      value: nationality || '',
    }));
  } else {
    const opts = (
      props.evhfExternalData && !props.evhfExternalData.includes('/api/')
        ? JSON.parse(props.evhfExternalData)
        : []
    ).map((item: {id: number; label: string}) => ({
      label: item.label || '',
      value: item.id || '',
    }));
    return opts;
  }
}
