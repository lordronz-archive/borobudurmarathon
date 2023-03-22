import {useNavigation} from '@react-navigation/native';
import {
  VStack,
  Divider,
  HStack,
  Text,
  Box,
  ScrollView,
  Spinner,
  SearchIcon,
} from 'native-base';
import React, {useEffect, useState} from 'react';
import TextInput from '../../components/form/TextInput';
import {ProfileService} from '../../api/profile.service';
import {useDebounce} from 'use-debounce';
import Header from '../../components/header/Header';
import IconLocation from '../../assets/icons/IconLocation';
import useProfileStepper from '../../hooks/useProfileStepper';
import {TouchableOpacity} from 'react-native';
import AppContainer from '../../layout/AppContainer';

export default function SearchLocationScreen() {
  const {setProfile} = useProfileStepper();
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [listLocation, setListLocation] = useState<any[]>([]);
  const [search, setSearch] = useState<string>('');

  const [searchValue] = useDebounce(search, 500);

  const getLocation = async () => {
    setIsLoading(true);
    console.log('getlocation');
    const parameter = {
      filter: {
        mlocName: searchValue?.trim(),
      },
    };

    await ProfileService.getLocation(parameter)
      .then(res => {
        console.log('getLocation', res.data);
        if (res && res.data && res.data.data) {
          setListLocation(res.data.data);
        }
      })
      .catch(err => {
        setListLocation([]);
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    console.log(searchValue);
    if (!searchValue) {
      return;
    }
    getLocation();
  }, [searchValue]);

  return (
    <AppContainer>
      <VStack px="4" flex="1">
        <Header title="Search Location" left={'back'} />
        <TextInput
          placeholder={`Location Name`}
          label={`Search Location`}
          onChangeText={val => setSearch(val)}
          value={search}
          _inputProps={{InputLeftElement: <SearchIcon />}}
        />
        <Divider />
        {isLoading ? (
          <Spinner flex={1} color="primary.900" />
        ) : (
          <ScrollView>
            {listLocation?.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  padding: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                onPress={() => {
                  setProfile(oldVal => ({
                    ...oldVal,
                    mbsdCity: item.mlocRegency,
                    mbsdProvinces: item.mlocProvince,
                    mbsdAddress: item.mlocName,
                  }));
                  navigation.goBack();
                }}>
                <IconLocation />
                <VStack marginLeft={'16px'}>
                  <Text fontSize={'14px'} fontWeight={600} color={'#1E1E1E'}>
                    {item.mlocVillage}
                  </Text>
                  <Text fontSize={'10px'} fontWeight={400} color={'#768499'}>
                    {item.mlocName}
                  </Text>
                </VStack>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </VStack>
    </AppContainer>
  );
}
