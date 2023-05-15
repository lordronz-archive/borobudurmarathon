import {AlertDialog, Center, Text} from 'native-base';
import React from 'react';
import BMButton from '../buttons/Button';

type OtpWhatsappProps = {
  cancelRef?: React.RefObject<any>;
  isOpen: boolean;
  title?: React.ReactNode;
  content?: React.ReactNode;
  buttonContent?: React.ReactNode;
  onClose: (a?: any) => any;
  onPress: (a?: any) => any;
};

const OtpWhatsapp = ({
  cancelRef,
  isOpen,
  onClose,
  onPress,
  title,
  buttonContent,
  content,
}: OtpWhatsappProps) => {
  return (
    <AlertDialog
      leastDestructiveRef={cancelRef as React.RefObject<any>}
      isOpen={isOpen}
      onClose={onClose}>
      <AlertDialog.Content>
        <AlertDialog.Body p="4">
          <Center>
            <Center px="2" mb="4" mt="4">
              <Text fontWeight={600} fontSize={16} mb="4">
                {title ? title : 'Congratulation'}
              </Text>
              <Text fontWeight={400} color="#768499" fontSize={11}>
                {content}
              </Text>
            </Center>
            <BMButton h="12" width="full" onPress={onPress}>
              {buttonContent}
            </BMButton>
          </Center>
        </AlertDialog.Body>
      </AlertDialog.Content>
    </AlertDialog>
  );
};

export default OtpWhatsapp;
