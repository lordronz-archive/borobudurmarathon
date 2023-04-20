import {HStack, WarningOutlineIcon, Text, Actionsheet} from 'native-base';
import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';

type Props = {
  message: string;
};
export default function AlertMessage(props: Props) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  return (
    <>
      <TouchableOpacity onPress={() => setIsOpenModal(true)}>
        <HStack
          paddingTop="3"
          paddingBottom="3"
          width="100%"
          px="3"
          bg="warning.300"
          alignItems="center">
          <WarningOutlineIcon />
          <Text pl="2" pr="4" textAlign="center" numberOfLines={1}>
            {props.message}
          </Text>
        </HStack>
      </TouchableOpacity>

      <Actionsheet isOpen={isOpenModal} onClose={() => setIsOpenModal(false)}>
        <Actionsheet.Content px="3" py="5">
          {props.message}
        </Actionsheet.Content>
      </Actionsheet>
    </>
  );
}
