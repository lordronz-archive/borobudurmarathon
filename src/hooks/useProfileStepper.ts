import {createGlobalState} from 'react-hooks-global-state';

type IAuthData = {
  citizen?: 'WNI' | 'WNA';
  step: 'choose-citizen' | 'upload-id' | 'profile';
};

const initialState: IAuthData = {
  citizen: undefined,
  step: 'choose-citizen',
};
const {useGlobalState} = createGlobalState(initialState);

export default function useProfileStepper() {
  const [citizen, setCitizen] = useGlobalState('citizen');
  const [step, setStep] = useGlobalState('step');

  const nextStep = () => {
    if (step === 'choose-citizen') {
      setStep('upload-id');
    } else if (step === 'upload-id') {
      setStep('profile');
    }
  };

  const prevStep = () => {
    if (step === 'upload-id') {
      setStep('choose-citizen');
    } else if (step === 'profile') {
      setStep('upload-id');
    }
  };

  return {
    citizen,
    setCitizen,
    step,
    setStep,
    nextStep,
    prevStep,
  };
}
