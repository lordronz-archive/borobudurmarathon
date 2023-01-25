import React from 'react';
import {Box, FlatList, Text} from 'native-base';
import {TouchableOpacity} from 'react-native';

type CategoryOption = {
  id: number | null;
  value: string;
};
type CategoryButtonType = {
  categories: CategoryOption[];
  selected?: number | null;
  style?: any;
  onSelect: (cat: CategoryOption) => void;
};

export default function CategoryButton({
  categories,
  selected,
  style,
  onSelect,
}: CategoryButtonType) {
  return (
    <FlatList
      horizontal
      data={categories}
      showsHorizontalScrollIndicator={false}
      _contentContainerStyle={{pr: '8', ...style}}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({item}) => {
        return (
          <TouchableOpacity onPress={() => onSelect(item)}>
            <Box
              bg="white"
              shadow="0.5"
              mr={2}
              borderRadius={12}
              overflow="hidden">
              <Box
                {...(selected === item.id
                  ? {bg: '#FDEBEB', borderColor: 'red.400', borderWidth: 1}
                  : {borderColor: 'gray.300', borderWidth: 1})}
                px={4}
                py={1}
                borderRadius={12}>
                <Text color="black">{item.value}</Text>
              </Box>
            </Box>
          </TouchableOpacity>
        );
      }}
    />
  );
}
