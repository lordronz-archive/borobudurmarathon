import React, {useEffect, useState} from 'react';
import {useTheme, ScrollView, Box, Center, Spinner} from 'native-base';
import Header from '../../components/header/Header';
import ListSponsorCard, {
  ISponsorItem,
} from '../../components/card/ListSponsorCard';
import {EventService} from '../../api/event.service';
import {ISponsorData} from '../../types/sponsor.type';
import i18next from 'i18next';
import EmptyMessage from '../../components/EmptyMessage';
import useEvent from '../../hooks/useEvent';
import moment from 'moment';
import AppContainer from '../../layout/AppContainer';

// function getPriority(val: number | string): 'high' | 'medium' | 'low' {
//   val = Number(val);
//   if (val === 1) {
//     return 'high';
//   } else if (val === 2) {
//     return 'medium';
//   } else {
//     return 'low';
//   }
// }

const PRIORITIES = ['high', 'medium', 'low'];
const PRIORITY: any = {
  Komite: 'high',
  Official: 'medium',
  'Co-Sponsor': 'low',
};

function getTitleOrGroup(val: string) {
  console.info('------val', val);
  // console.info('JSON.parse(val)', JSON.parse(val));
  try {
    const res = JSON.parse(val);
    return res;
  } catch {
    return {
      en: val,
      id: val,
    };
  }
}

type IGroupSponsor = {
  title: string;
  priority: 'high' | 'medium' | 'low' | string;
  items: ISponsorItem[];
};
export default function PartnerScreen() {
  const {colors} = useTheme();
  const {events} = useEvent();
  const [sponsors, setSponsors] = useState<IGroupSponsor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>();
  console.info('sponsors', JSON.stringify(sponsors));
  console.info('i18next.language', i18next.language);

  const fetchList = () => {
    setIsLoading(true);
    const eventIds = events
      .filter(
        item =>
          item.evnhStatus &&
          !moment(item.evnhRegistrationEnd, 'YYYY-MM-DD HH:mm:ss').isBefore(
            moment(),
          ),
      )
      .map(item => item.evnhId);
    console.info('eventIds', eventIds);
    EventService.getSponsors(eventIds)
      .then(res => {
        if (res && res.data && res.data.data) {
          console.info('res.data.data', res.data.data);
          res.data.data.sort(
            (a, b) => Number(a.ehspOrder) - Number(b.ehspOrder),
          );
          const list = res.data.data.reduce(
            (acc: IGroupSponsor[], curr: ISponsorData) => {
              console.info('------');
              const group = getTitleOrGroup(curr.ehspGroup)[i18next.language];
              const title = getTitleOrGroup(curr.ehspTitle)[i18next.language];
              console.info('group', group);
              console.info('title', title);

              const findIndex = acc.findIndex(item => item.title === group);
              console.info('findIndex', findIndex);
              if (findIndex > -1) {
                acc[findIndex].items.push({
                  title,
                  description: curr.ehspDescription,
                  logo: curr.ehspBanner,
                  url: curr.ehspUrl,
                });
              } else {
                acc.push({
                  title: group,
                  priority: PRIORITIES[acc.length],
                  items: [
                    {
                      title,
                      description: curr.ehspDescription,
                      logo: curr.ehspBanner,
                      url: curr.ehspUrl,
                    },
                  ],
                });
              }
              return acc;
            },
            [],
          );
          setSponsors([...list]);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.info('fetchList Sponsors err', err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <AppContainer>
      <ScrollView backgroundColor={colors.white}>
        <Header title="" left="back" />

        {isLoading && (
          <Center>
            <Spinner />
          </Center>
        )}

        {!isLoading && sponsors.length === 0 ? <EmptyMessage /> : false}

        {sponsors.map(sponsor => (
          <ListSponsorCard
            key={sponsor.title}
            title={sponsor.title}
            priority={sponsor.priority as any}
            items={sponsor.items}
          />
        ))}

        <Box height="50" />
      </ScrollView>
    </AppContainer>
  );
}
