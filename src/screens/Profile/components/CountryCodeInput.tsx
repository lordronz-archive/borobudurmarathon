import React, {useState} from 'react';
import i18next, {t} from 'i18next';
import {
  Actionsheet,
  Box,
  HStack,
  CheckCircleIcon,
  View,
  Button,
  useDisclose,
  ScrollView,
} from 'native-base';
import {Text} from 'native-base';
import TextInput from '../../../components/form/TextInput';

export type CountryCodeProps = {
  onClose?: () => any;
  onChange?: (v: any) => any;
  items: {
    label: string;
    value: string;
  }[];
  selectedValue?: any;
};

export default function CountryCodeInput(props: CountryCodeProps) {
  const {isOpen, onOpen, onClose} = useDisclose();
  const [filteredData, setFilteredData] = useState(props.items);
  const [search, setSearch] = useState('');

  return (
    <View>
      <Button onPress={onOpen} />
      <Actionsheet isOpen={isOpen} onClose={onClose} hideDragIndicator>
        <Actionsheet.Content borderTopRadius="0">
          <Box
            w="100%"
            h={60}
            px={4}
            justifyContent="center"
            alignItems="center"
            fontWeight="bold">
            <Text
              fontSize="20"
              color="gray.900"
              _dark={{
                color: 'gray.300',
              }}>
              {t('label.countryCode')}
            </Text>
          </Box>
          <Box>
            <TextInput
              onChangeText={v => {
                let result = filteredData.filter(
                  (item: {value: string; label: string}) => {
                    let row = item.value.toLowerCase();
                    let r = item.label.toLowerCase();
                    return (
                      row.search(v.toLowerCase()) > -1 ||
                      r.search(v.toLowerCase())
                    );
                  },
                );
                setFilteredData(result);
                setSearch(v);
              }}
              width={'100%'}
              value={search}
            />
          </Box>
          <ScrollView>
            {filteredData.map(v => (
              <Actionsheet.Item onPress={() => props.onChange?.(v.value)}>
                <HStack
                  w={i18next.language === 'en' ? '85%' : '100%'}
                  alignItems="center"
                  justifyContent="space-between">
                  <HStack alignItems="center" space={2}>
                    <Text>{v.label}</Text>
                  </HStack>
                  {props.selectedValue === v.value && (
                    <CheckCircleIcon color="primary.900" />
                  )}
                </HStack>
              </Actionsheet.Item>
            ))}
          </ScrollView>
        </Actionsheet.Content>
      </Actionsheet>
    </View>
  );
}
