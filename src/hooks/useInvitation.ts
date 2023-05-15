import {t} from 'i18next';
import {useState} from 'react';
import {createGlobalState} from 'react-hooks-global-state';
import {EventService} from '../api/event.service';
import {handleErrorMessage} from '../helpers/apiErrors';

type IStateInvitation = {
  resInvitations?: any;
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
      .then(res => {
        console.info('res getInvitations', JSON.stringify(res));
        if (res && res.data) {
        //   // featured invitations
        //   res.data = (res.data || []).map(item => ({
        //     ...item,
        //     eimgEvnhId: res.linked.eimgEvnhId?.filter(
        //       img => img.eimgEvnhId === item.evnhId,
        //     ),
        //   }));
          setResInvitations(res);
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
    isLoadingFeatured: isLoading,
    fetchList,
  };
}
