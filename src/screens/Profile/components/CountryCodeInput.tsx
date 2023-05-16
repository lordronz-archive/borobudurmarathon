import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Text} from 'native-base';
import TextInput from '../../../components/form/TextInput';
import BottomSheet, {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {StyleSheet, ViewStyle} from 'react-native';
import {countryPhoneCodes} from '../../../helpers/phoneNumber';
import {TouchableOpacity} from 'react-native-gesture-handler';

export type CountryCodeProps = {
  onClose?: () => any;
  onChange?: (v: any) => any;
  items: {
    label: string;
    value: string;
  }[];
  selectedValue?: any;
  open?: boolean;
  setCountryCode: (i: number | string) => void;
  setOpen?: (v: any) => any;
  style?: ViewStyle;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    // flex: 1,
    backgroundColor: '#000000',
    bottom: 0,
    width: '100%',
    // paddingTop: 500,
  },
  contentContainer: {
    backgroundColor: 'white',
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default function CountryCodeInput(props: CountryCodeProps) {
  // hooks
  const sheetRef = useRef<BottomSheet>(null);
  const [search, setSearch] = useState('');

  // variables
  const data = useMemo(
    () =>
      countryPhoneCodes
        .filter(c => {
          if (!search) {
            return true;
          }
          const country = c.country.toLowerCase();
          const s = search.toLowerCase();
          console.log(s, country);
          return (
            s.search(country) > -1 ||
            country.search(s) > -1 ||
            c.code.search(s) > -1
          );
        })
        .map((c, i) => ({
          label: c.code + ' ~ ' + c.country,
          value: c.code,
          raw: c,
          key: `${c.code}-${c.country}-${c.iso}-${i}`,
        })),
    [search],
  );
  const snapPoints = useMemo(() => ['25%', '50%', '100%'], []);

  // callbacks
  const handleSheetChange = useCallback(
    (index: number) => {
      console.log('handleSheetChange', index);
      if (index === -1) {
        props.setOpen?.(false);
      }
    },
    [props],
  );

  const handleSnapPress = useCallback((index: number) => {
    sheetRef.current?.snapToIndex(index);
  }, []);

  // render
  const renderItem = useCallback(
    ({item}: {item: {label: string; value: string}}) => (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => {
          props.setCountryCode(item.value);
          sheetRef.current?.close();
        }}>
        <Text style={{width: '25%'}}>{(item as any).raw.code}</Text>
        <Text style={{width: '75%'}}>{(item as any).raw.country}</Text>
        {/* <Text>{item.label}</Text> */}
      </TouchableOpacity>
    ),
    [props],
  );

  useEffect(() => {
    if (props.open) {
      sheetRef.current?.expand();
    } else {
      sheetRef.current?.close();
    }
  }, [handleSnapPress, props.open]);

  return (
    // <View style={{...styles.container, ...(props.style && props.style)}}>
      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        onChange={handleSheetChange}
        enablePanDownToClose
        style={{padding: 20}}
        index={1}>
        <TextInput value={search} onChangeText={c => setSearch(c)} />
        <BottomSheetFlatList
          data={data}
          keyExtractor={i => i.key}
          renderItem={renderItem}
          contentContainerStyle={styles.contentContainer}
        />
      </BottomSheet>
    // </View>
  );
}
