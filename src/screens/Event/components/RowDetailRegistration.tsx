import {
  Box,
  HStack,
  VStack,
  ChevronRightIcon,
  Text,
  Spinner,
} from 'native-base';
import React, {useState} from 'react';
import {EventService} from '../../../api/event.service';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../navigation/RootNavigator';

type Props = {
  evnhId: number;
  data: any;
};
export default function RowDetailRegistration(props: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Box
      marginTop={'15px'}
      paddingY={'16px'}
      borderTopColor={'#E8ECF3'}
      borderTopWidth={1}
      borderTopStyle={'solid'}>
      <TouchableOpacity
        disabled={isLoading}
        onPress={async () => {
          if (props.evnhId) {
            setIsLoading(true);
            const resEvent = await EventService.getEvent(props.evnhId);
            console.info('res get detail event', JSON.stringify(resEvent));
            navigation.navigate('ViewDetailRegistrationData', {
              data: props.data || {},
              fields: resEvent.fields || [],
            });
            setIsLoading(false);
          }
        }}>
        <HStack justifyContent={'space-between'} alignItems={'center'}>
          <VStack width="90%">
            <Text color="#768499" fontSize={12}>
              Data Pendaftaran
            </Text>
          </VStack>

          {isLoading ? <Spinner size="sm" /> : <ChevronRightIcon />}
        </HStack>
      </TouchableOpacity>
    </Box>
  );
}
