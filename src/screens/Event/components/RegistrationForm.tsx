import React, {useEffect, useState} from 'react';
import SelectInput from '../../../components/form/SelectInput';
import {EventFieldsEntity} from '../../../types/event.type';
import TextInput from '../../../components/form/TextInput';
import ApiService from '../../../api/api.service';
import countries from '../../../helpers/countries';
import DateInput from '../../../components/form/DateInput';
import {Box, HStack, Row, Text} from 'native-base';
import {convertOption} from '../../../helpers/convertOption';
import FileInput from '../../../components/form/FileInput';
import {DocumentPickerResponse} from 'react-native-document-picker';
import TimeInput from '../../../components/form/TimeInput';
import {getTextBasedOnLanguage} from '../../../helpers/text';
import {t} from 'i18next';

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

  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<Option[]>(opts);

  const [dateField, setDateField] = useState<Date>();

  useEffect(() => {
    getListOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getListOptions = async () => {
    setIsLoading(true);
    setOptions((await getOptions(props)) ?? opts);
    setIsLoading(false);
  };

  if (props.static) {
    return props.data && props.data.length > 0 ? (
      <Row flex={1}>
        {props.data.map(dprops => (
          <Box key={dprops.evhfLabel} flex={1}>
            <Text color="gray.500" fontSize="sm">
              {getTextBasedOnLanguage(dprops.evhfLabel)}
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
            {getTextBasedOnLanguage(props.evhfLabel)}
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
  }

  if (props.evhfType === 'Option') {
    return (
      <SelectInput
        items={options}
        placeholder={t('chooseOne') || ''}
        label={getTextBasedOnLanguage(props.evhfLabel)}
        onValueChange={props.onValueChange}
        value={props.value}
        helperText={props.helperText}
        hideSearch={options.length <= 10}
        required={props.required}
        isLoading={isLoading}
      />
    );
  } else if (['number', 'phone'].includes(props.evhfType.toLowerCase())) {
    return (
      <TextInput
        placeholder={`${t('formEnter')} ${getTextBasedOnLanguage(
          props.evhfLabel,
        )}`}
        label={getTextBasedOnLanguage(props.evhfLabel)}
        onChangeText={props.onValueChange}
        keyboardType="numeric"
        value={props.value}
        helperText={props.helperText}
        required={props.required}
      />
    );
  } else if (props.evhfType === 'Email') {
    return (
      <TextInput
        placeholder={`${t('formEnter')} ${getTextBasedOnLanguage(
          props.evhfLabel,
        )}`}
        label={getTextBasedOnLanguage(props.evhfLabel)}
        onChangeText={props.onValueChange}
        keyboardType="numeric"
        value={props.value}
        helperText={props.helperText}
        required={props.required}
      />
    );
  } else if (props.evhfType === 'Date') {
    return (
      <DateInput
        placeholder="DD MMM YYYY"
        label={getTextBasedOnLanguage(props.evhfLabel)}
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
        placeholder={`${t('formEnter')} ${getTextBasedOnLanguage(
          props.evhfLabel,
        )}`}
        label={getTextBasedOnLanguage(props.evhfLabel)}
        onChangeText={props.onValueChange}
        value={props.value}
        helperText={props.helperText}
        required={props.required}
        setFileResponse={props.setFileResponse}
        file={props.file}
      />
    );
  } else if (props.evhfType === 'Time') {
    return (
      <HStack>
        <TimeInput
          items={options}
          placeholder={'--'}
          label={getTextBasedOnLanguage(props.evhfLabel)}
          onValueChange={props.onValueChange}
          value={props.value}
          helperText={props.helperText}
          hideSearch={options.length <= 10}
          required={props.required}
        />
      </HStack>
    );
  } else {
    return (
      <TextInput
        label={getTextBasedOnLanguage(props.evhfLabel)}
        onChangeText={props.onValueChange}
        placeholder={`${t('formEnter')} ${getTextBasedOnLanguage(
          props.evhfLabel,
        )}`}
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
          label: getTextBasedOnLanguage(v[labelkey!]),
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
      label: getTextBasedOnLanguage(item.label || ''),
      value: item.id || '',
    }));
    return opts;
  }
}
