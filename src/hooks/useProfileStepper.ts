import {createGlobalState} from 'react-hooks-global-state';

type IAuthData = {
  citizen?: 'WNI' | 'WNA';
  step: 'choose-citizen' | 'upload-id' | 'profile';
  identityImage: {
    fileId: string;
    data: any;
  };
  accountInformation: {
    name: string;
    phoneNumber: string;
    birthdate?: Date;
  };
  profile: {
    mbsdIDNumber: string;
    mbsdBirthDate: string;
    mbsdBirthPlace: string;
    mbsdGender: string;
    mbsdBloodType: number;
    mbsdNationality: string;
    mbsdCountry: string;
    mbsdCity: string;
    mbsdProvinces: string;
    mbsdAddress: string;
    mbsdRawAddress: string;
    mbsdIDNumberType: number;
    mbsdFile: number;
    mmedEducation: string;
    mmedOccupation: string;
    mmedIncome: string;
  };
};

const initialState: IAuthData = {
  citizen: undefined,
  step: 'choose-citizen',
  identityImage: {
    fileId: '',
    data: undefined,
  },
  accountInformation: {
    name: '',
    phoneNumber: '',
    birthdate: undefined,
  },
  profile: {
    mbsdIDNumber: '',
    mbsdBirthDate: '',
    mbsdBirthPlace: '',
    mbsdGender: '',
    mbsdBloodType: 0,
    mbsdNationality: '',
    mbsdCountry: '',
    mbsdCity: '',
    mbsdProvinces: '',
    mbsdAddress: '',
    mbsdRawAddress: '-',
    mbsdIDNumberType: 0,
    mbsdFile: 0,
    mmedEducation: '-',
    mmedOccupation: '-',
    mmedIncome: '-',
  },
};
const {useGlobalState} = createGlobalState(initialState);

export default function useProfileStepper() {
  const [citizen, setCitizen] = useGlobalState('citizen');
  const [step, setStep] = useGlobalState('step');
  const [identityImage, setIdentityImage] = useGlobalState('identityImage');
  const [profile, setProfile] = useGlobalState('profile');
  const [accountInformation, setAccountInformation] =
    useGlobalState('accountInformation');

  const resetStepper = () => {
    setCitizen(initialState.citizen);
    setStep(initialState.step);
    setIdentityImage(initialState.identityImage);
    setProfile(initialState.profile);
    setAccountInformation(initialState.accountInformation);
  };

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
    identityImage,
    setIdentityImage,
    profile,
    setProfile,
    accountInformation,
    setAccountInformation,
    step,
    setStep,
    nextStep,
    prevStep,
    resetStepper,
  };
}
