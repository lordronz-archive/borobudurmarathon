import React, {useEffect, useState} from 'react';
import SelectInput from '../../../components/form/SelectInput';
import {EventFieldsEntity} from '../../../types/event.type';
import TextInput from '../../../components/form/TextInput';
import ApiService from '../../../api/api.service';
import countries from '../../../helpers/countries';
import DateInput from '../../../components/form/DateInput';

type Option = {value: string; label: string};
export default function RegistrationForm(
  props: EventFieldsEntity & {
    onValueChange: (val: string) => void;
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
    if (props.evhfExternalData && props.evhfExternalData.includes('/api/')) {
      ApiService.getExternal(props.evhfExternalData.replace('/api/v1/', ''))
        .then(({data: {data}}: any) => {
          const kys = Object.keys(data[0]);
          const labelkey = kys.find(v => v.toLowerCase().includes('label'));
          setOptions(
            data.map((v: {[key: string]: string | number}) => ({
              value: v.id,
              label: v[labelkey!],
            })),
          );
        })
        .catch(err => {
          console.info(err);
        });
    } else if (
      props.evhfType === 'Option' &&
      (props.evhfLabel.toLowerCase().includes('country') ||
        props.evhfName.toLowerCase().includes('country'))
    ) {
      setOptions(
        countries.map(({en_short_name}) => ({
          label: en_short_name || '',
          value: en_short_name || '',
        })),
      );
    } else if (
      props.evhfType === 'Option' &&
      (props.evhfLabel.toLowerCase().includes('nationality') ||
        props.evhfName.toLowerCase().includes('nationality'))
    ) {
      setOptions(
        countries.map(({nationality}) => ({
          label: nationality || '',
          value: nationality || '',
        })),
      );
    }
  }, [props.evhfExternalData, props.evhfLabel, props.evhfName, props.evhfType]);

  if (props.evhfType === 'Option') {
    return (
      <SelectInput
        items={options}
        placeholder={'Choose one'}
        label={props.evhfLabel}
        onValueChange={props.onValueChange}
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
      />
    );
  } else {
    return (
      <TextInput
        label={props.evhfLabel}
        onChangeText={props.onValueChange}
        placeholder={`Enter ${props.evhfLabel}`}
      />
    );
  }
}
