import {t} from 'i18next';
import React from 'react';
import BannerNew from '../../../components/carousel/BannerNew';
import Section from '../../../components/section/Section';
import datetime from '../../../helpers/datetime';
import {getEventTypeName} from '../../../helpers/event';
import useEvent from '../../../hooks/useEvent';

export default function SectionFeaturedEvents() {
  const {featuredEvents} = useEvent();

  if (featuredEvents.length === 0) {
    return <></>;
  }

  return (
    <Section title={t('event.featuredEvents')} _title={{py: 2, px: 4}}>
      <BannerNew
        entries={featuredEvents.map(item => ({
          title: item.evnhName || '',
          eventType: getEventTypeName({
            evnhType: item.evnhType,
            evnhBallot: item.evnhBallot,
          }),
          date: datetime.getDateRangeString(
            item.evnhStartDate,
            item.evnhEndDate,
            'short',
            'short',
          ),
          imageUrl:
            item.eimgEvnhId && item.eimgEvnhId.length > 0
              ? item.eimgEvnhId[0].eimgUrlImage
              : undefined,
          id: item.evnhId,
        }))}
      />
    </Section>
  );
}
