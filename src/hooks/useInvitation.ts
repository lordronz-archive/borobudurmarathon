import {t} from 'i18next';
import {useState} from 'react';
import {createGlobalState} from 'react-hooks-global-state';
import {EventService} from '../api/event.service';
import {handleErrorMessage} from '../helpers/apiErrors';
import {InvitationProperties, InvitationResponse} from '../types/invitation.type';

type IStateInvitation = {
  resInvitations?: InvitationResponse;
  resFeaturedInvitations?: any;
};

const initialState: IStateInvitation = {
  resInvitations: undefined,
  resFeaturedInvitations: undefined,
};
const {useGlobalState} = createGlobalState(initialState);

export default function useInvitation() {
  const [isLoading, setIsLoading] = useState(false);
  const [resInvitations, setResInvitations] = useGlobalState('resInvitations');

  const fetchList = () => {
    setIsLoading(true);
    EventService.getInvitations()
      .then((res: {data: InvitationResponse}) => {
        console.info('res getInvitations', JSON.stringify(res));
        if (res && res.data) {
          res.data.data = res.data.data.map(item => {
            const iregEvnhId = res.data.linked.iregEvnhId.find(
              el =>
                Number(el.evnhId) === Number(item.linked?.iregEvnhId.evnhId),
            );

            if (iregEvnhId) {
              item.linked = {
                iregEvnhId,
              };
            }

            return item;
          });
          console.info('res getInvitations data', JSON.stringify(res.data));
          setResInvitations(res.data);
          //   FastImage.preload(
          //     res.data
          //       .filter(item => item.evnhThumbnail)
          //       .map(item => ({
          //         uri: item.evnhThumbnail || '',
          //         priority: FastImage.priority.high,
          //       })),
          //   );
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('error getInvitations', JSON.stringify(err));
        handleErrorMessage(err, t('error.failedToGetInvitations'));
        setIsLoading(false);
      });
  };

  return {
    isLoading,
    resInvitations,
    invitations:
      resInvitations && resInvitations.data ? resInvitations.data : [],
    fetchList,
  };
}
