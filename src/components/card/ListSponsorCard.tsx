import {Box, Row} from 'native-base';
import React from 'react';
import LineTitle from '../text/LineTitle';
import SponsorCard from './SponsorCard';
import SponsorCard2 from './SponsorCard2';
import SponsorCard3 from './SponsorCard3';

export type ISponsorItem = {
  title?: string;
  description?: string;
  logo: any;
  url?: string;
  urlText?: string;
};

type Props = {
  priority: 'high' | 'medium' | 'low';
  title: string;
  items: ISponsorItem[];
};

export default function ListSponsorCard(props: Props) {
  return (
    <Box>
      <LineTitle title={props.title} />

      {props.priority === 'high' && (
        <Box>
          {props.items.map((item, index) => (
            <SponsorCard
              key={index}
              title={item.title || ''}
              items={[
                {
                  logo: item.logo,
                  description: item.description,
                  url: item.url,
                },
              ]}
            />
          ))}
        </Box>
      )}

      {props.priority === 'medium' && (
        <Row flexWrap="wrap" justifyContent="center">
          {props.items.map((item, index) => (
            <SponsorCard2
              key={index}
              title={item.title || ''}
              logo={item.logo}
            />
          ))}
        </Row>
      )}

      {props.priority === 'low' && (
        <Row flexWrap="wrap" justifyContent="center">
          {props.items.map((item, index) => (
            <SponsorCard3 key={index} logo={item.logo} />
          ))}
        </Row>
      )}
    </Box>
  );
}
