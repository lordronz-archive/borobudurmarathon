import {t} from 'i18next';
import {Badge} from 'native-base';
import React from 'react';
import {EEventStatus, EInvitationStatus} from '../../types/event.type';

type Props = {
  isInvitation?: boolean;
  invitationStatus?: EInvitationStatus;
  eventStatus?: EEventStatus;
};
export default function EventStatusBadge(props: Props) {
  let label;
  let bgColor = '#FFF8E4';
  let textColor = '#A4660A';
  if (props.isInvitation) {
    if (props.invitationStatus === EInvitationStatus.INVITED) {
      label = t('invitation.invited');
      bgColor = '#FFF8E4';
      textColor = '#A4660A';
    } else if (props.invitationStatus === EInvitationStatus.USED) {
      label = t('invitation.registered');
      bgColor = '#FFF8E4';
      textColor = '#A4660A';
    } else if (props.invitationStatus === EInvitationStatus.EXPIRED) {
      label = t('invitation.expired');
      bgColor = 'gray.200';
      textColor = 'gray.500';
    }
  } else {
    if (props.eventStatus === EEventStatus.EXPIRED) {
      label = t('event.expiredEvents');
      bgColor = 'gray.200';
      textColor = 'gray.500';
    } else if (props.eventStatus === EEventStatus.REGISTRATION_CLOSED) {
      label = t('event.registrationClosed');
      bgColor = 'gray.200';
      textColor = 'gray.500';
    } else if (props.eventStatus === EEventStatus.UPCOMING) {
      label = t('event.upcomingEvents');
      bgColor = 'gray.200';
      textColor = 'gray.500';
    }
  }

  if (label) {
    return (
      <Badge
        backgroundColor={bgColor}
        px="3"
        py="0.5"
        borderRadius="4"
        alignSelf="flex-start"
        _text={{
          color: textColor,
          fontWeight: 'bold',
          fontSize: 'xs',
        }}>
        {label}
      </Badge>
    );
  } else {
    return <></>;
  }
}
