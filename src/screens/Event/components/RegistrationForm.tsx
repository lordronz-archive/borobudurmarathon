import React, {useEffect, useState} from 'react';
import SelectInput from '../../../components/form/SelectInput';
import {EventFieldsEntity} from '../../../types/event.type';
import TextInput from '../../../components/form/TextInput';
import ApiService from '../../../api/api.service';
import countries from '../../../helpers/countries';

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

  useEffect(() => {
    if (props.evhfExternalData && props.evhfExternalData.includes('/api/')) {
      ApiService.getExternal(props.evhfExternalData)
        .then(res => {})
        .catch(err => {
          //
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
    }
  }, []);

  if (props.evhfType === 'Option') {
    return (
      <SelectInput
        items={options}
        placeholder={'Choose one'}
        label={props.evhfLabel}
        onValueChange={props.onValueChange}
      />
    );
  } else if (props.evhfType === 'Number') {
    return (
      <TextInput label={props.evhfLabel} onChangeText={props.onValueChange} />
    );
  } else if (props.evhfType === 'Email') {
    return (
      <TextInput label={props.evhfLabel} onChangeText={props.onValueChange} />
    );
  } else {
    return (
      <TextInput label={props.evhfLabel} onChangeText={props.onValueChange} />
    );
  }
}
