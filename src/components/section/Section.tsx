import {VStack, Text} from 'native-base';
import React from 'react';

type SectionProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  rest?: any;
};

export default function Section({
  title,
  subtitle = '',
  children,
  ...rest
}: SectionProps) {
  return (
    <VStack {...rest}>
      <Text fontSize="lg" fontWeight={700}>
        {title}
      </Text>
      {subtitle && (
        <Text fontSize="sm" color={'#768499'} mb="2">
          {subtitle}
        </Text>
      )}
      {children}
    </VStack>
  );
}
