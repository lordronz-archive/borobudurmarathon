import {View} from 'native-base';
import React from 'react';
import Section from '../../../components/section/Section';
import {Dimensions} from 'react-native';
import {BarChart} from 'react-native-chart-kit';

const chartConfig = {
  backgroundGradientFromOpacity: 0,
  backgroundGradientToOpacity: 0,
  color: (opacity = 1) => `rgba(118, 132, 153, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional
};

export default function Statistic() {
  const screenWidth = Dimensions.get('window').width;
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(118, 132, 153, ${opacity})`,
        strokeWidth: 2, // optional
      },
    ],
    legend: ['Rainy Days'], // optional
  };
  return (
    <View px="4">
      <Section title="Statistic" subtitle="My running progress">
        <BarChart
          data={data}
          width={screenWidth}
          height={220}
          yAxisLabel="$"
          yAxisSuffix="$"
          chartConfig={chartConfig}
        />
      </Section>
    </View>
  );
}
