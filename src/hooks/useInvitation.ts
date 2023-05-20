import {t} from 'i18next';
import {useState} from 'react';
import {createGlobalState} from 'react-hooks-global-state';
import {EventService} from '../api/event.service';
import {handleErrorMessage} from '../helpers/apiErrors';
import {InvitationResponse} from '../types/invitation.type';

type IStateInvitation = {
  resInvitations?: InvitationResponse;
  resFeaturedInvitations?: any;
  showNotification: boolean;
};

const initialState: IStateInvitation = {
  resInvitations: undefined,
  resFeaturedInvitations: undefined,
  showNotification: false,
};
const {useGlobalState} = createGlobalState(initialState);

export default function useInvitation() {
  const [isLoading, setIsLoading] = useState(false);
  const [resInvitations, setResInvitations] = useGlobalState('resInvitations');
  const [showNotification, setShowNotification] =
    useGlobalState('showNotification');

  const setInvitationsStorage = () => {
    resInvitations?.data && EventService.setInvitations(resInvitations?.data);
  };

  const fetchList = () => {
    setIsLoading(true);
    return EventService.getInvitations()
      .then((res: {data: InvitationResponse}) => {
        console.info('res getInvitations', JSON.stringify(res));
        if (res && res.data) {
          res.data.data = res.data.data.map(item => {
            const iregEvnhId = res.data.linked.iregEvnhId.find(
              el => Number(el.evnhId) === Number(item.links?.iregEvnhId),
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
          const invitations = res.data && res.data.data ? res.data.data : [];
          EventService.shouldShowNotification(invitations).then(v =>
            setShowNotification(v),
          );
          //   FastImage.preload(
          //     res.data
          //       .filter(item => item.evnhThumbnail)
          //       .map(item => ({
          //         uri: item.evnhThumbnail || '',
          //         priority: FastImage.priority.high,
          //       })),
          //   );
        }
      })
      .catch(err => {
        console.error('error getInvitations', JSON.stringify(err));
        handleErrorMessage(err, t('error.failedToGetInvitations'));
      })
      .finally(() => setIsLoading(false));
  };

  return {
    isLoading,
    resInvitations,
    invitations:
      resInvitations && resInvitations.data ? resInvitations.data : [],
    fetchList,
    showNotification,
    setInvitationsStorage,
  };
}
