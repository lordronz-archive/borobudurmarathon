import apiUrl from './api';

export default {
  isPhoneVerificationRequired: false,
  bypassPhoneVerification: false,
  bypassEmailVerification: false,
  inAppBrowser: true,
  isDev: true,
  debug: true,
  // isProduction: process.env.NODE_ENV === 'production',
  jobApiUrl: {
    // href : 'https://jobs.race.id/api/',
    // href : 'http://localhost:9922/api/',
    href: apiUrl.jobApiUrl.href,
    apis: {
      idValidation: {
        path: 'doValidateID',
        method: 'POST',
      },
      checkValidation: {
        path: 'checkValidation',
        method: 'POST',
      },
    },
  },
  couponApiUrl: {
    // href : 'https://jobs.race.id/api/',
    // href : 'http://localhost:9922/api/',
    href: apiUrl.couponUrl.href,
    apis: {
      apply: {
        path: 'apply',
        method: 'POST',
      },
    },
  },
  files: {
    href: 'https://my.borobudurmarathon.com/dev.titudev.com/api/',
    // href : process.env.VUE_APP_ROOT_API + '../',
    apis: {
      bib: {
        path: '/e-bib',
        method: 'GET',
      },
      certificate: {
        path: '/e-certificate',
        method: 'GET',
      },
    },
  },
  apiUrl: {
    href: apiUrl.apiUrl,
    apis: {
      kompas: {
        authorize_code: {
          path: '/kompasid/login/auth',
          method: 'GET',
        },
      },
      vr: {
        authGarmin: {
          path: '/garmin/login',
          method: 'GET',
        },
        garminActivities: {
          path: '/resources/members_activity',
          method: 'GET',
        },
      },
      member: {
        /*
					{
						"data": {
							"ptmmFullName": "Thomas Hendri Hananto",
							"ptmmEmail": "foxdove02@gmail.com",
							"ptmmPhone": "085329688884",
							"ptmmGender": 1,
							"ptmmPassword": "sa"
						}
					}
				*/
        uaLink: {
          path: 'au/url',
          method: 'GET',
        },
        setJersey: {
          path: 'member_zone/jersey/',
          method: 'GET',
        },
        patch: {
          path: 'participant/patch',
          method: 'POST',
        },
        signup: {
          path: 'member/signup/1/',
          method: 'POST',
        },
        cancel: {
          path: 'member/cancel/',
          method: 'GET',
        },
        verification: {
          path: 'member/verification/',
          method: 'GET',
        },
        inputVerificationEmail: {
          path: 'member_zone/input_verification_email/',
          method: 'GET',
        },
        verificationEmail: {
          path: 'member_zone/verification_email',
          method: 'GET',
        },
        // {"data":{"email":"thomas.rubhez@gmail.com","password":"sa"}}
        login: {
          path: 'member/login/',
          method: 'POST',
        },
        checkSession: {
          path: 'member/check/',
          method: 'GET',
        },
        logout: {
          path: 'member/logout/',
          method: 'GET',
        },
        checkEmail: {
          path: 'member/email/1/',
          method: 'POST',
        },
        setupPassword: {
          path: 'member/setup_password/',
          method: 'POST',
        },
        rejectInvitation: {
          path: 'global/delete_member/',
          method: 'GET',
        },
        /*
					{
						"data": {
							"email": "foxdove02@gmail.com"
						}
					}
				*/
        resendCode: {
          path: 'member/resentcode/1/',
          method: 'POST',
        },
        //{"data":{"email":"thomas.rubhez@gmail.com"}}
        setProfile: {
          path: 'member_zone/detail/',
          method: 'POST',
        },
        setProfileAutoApprove: {
          path: 'member_zone/detail_skip',
          method: 'POST',
        },
        deleteProfile: {
          path: 'member_zone/delete/detail',
          method: 'POST',
        },
        agreeNews: {
          path: 'member_zone/newsletter/',
          method: 'GET',
        },
        changeProfile: {
          path: 'member_zone/data_unverified/',
          method: 'GET',
        },
        setLanguage: {
          path: 'member_zone/language/',
          method: 'GET',
        },
        // {"data":{"email":"thomas.rubhez@gmail.com"}}
        resetPassword: {
          path: 'member/forgot_password',
          method: 'POST',
        },
        /*
					{
						"data": {
							"mbsdIDNumberType": 1,
							"mbsdIDNumber": "000111",
							"mbsdBirthDate": "1991-02-25",
							"mbsdBirthPlace": "Kebumen",
							"mbsdNationality": "Indonesia",
							"mbsdCountry": "Indonesia",
							"mbsdProvinces": "Jawa Tengah",
							"mbsdCity": "Gombong",
							"mbsdAddress": "Jln Yos Sudarso no 284",
							"mbsdRawAddress": "dasdsadasdasdasdasdasdsadsadsadasdsa",
							"mbsdFile": "thomas.jpg"
						}
					}
				*/
        addPhone: {
          path: 'member_zone/phone/',
          method: 'POST',
        },
        updatePhoto: {
          path: 'member_zone/foto/',
          method: 'POST',
        },
        /*
					{
						"data": {
							"mbspCountryCode": "+62",
							"mbspNumber": "85329688884"
						}
					}
				*/
        getProfile: {
          path: 'member_resource/member/',
          method: 'GET',
        },
        verifyPhone: {
          path: 'member_zone/phone_verification/',
          method: 'GET',
        },
        // event type 7 & type 1
        registerEvent: {
          path: 'member_zone/registernoballot/',
          method: 'POST',
        },
        registerBallot: {
          path: 'member_zone/registration/',
          method: 'POST',
        },
        registerFastRunner: {
          path: 'member_zone/registration_fr/',
          // path : 'member_zone/fastrunner/',
          method: 'POST',
        },
        registerSaveDuit: {
          path: 'member_zone/registrationsaveduit/',
          // path : 'member_zone/fastrunner/',
          method: 'POST',
        },
        registerVR: {
          path: 'member_zone/registration_vr/',
          // path : 'member_zone/fastrunner/',
          method: 'POST',
        },
        getTransaction: {
          path: 'member_resource/transaction/',
          method: 'GET',
        },
        getTransactionDetail: {
          path: 'member_zone/transaction/',
          method: 'GET',
        },
        checkout: {
          path: 'checkout/',
          method: 'GET',
        },
        // data validation
        updateProfile: {
          path: 'member_zone/data_unverified/',
          method: 'GET',
        },
        // Ballot approval
        approveBallot: {
          path: 'member_zone/approved_ballot/', //#refId
          method: 'GET',
        },
        // data {"data":{"password":"aa","confirmPassword":"aa"}}
        newPassword: {
          // path : 'member/password_verification/{mfpaCode}/{mfpaUniqueKey}',
          path: 'member/password_verification/',
          method: 'POST',
        },

        addEndomondo: {
          path: 'member_zone/app/endomondo',
          method: 'POST',
        },
        addVRRecord: {
          path: 'member_zone/record/',
          method: 'POST',
        },
        getVRRecords: {
          path: 'resources/vr_data/',
        },
        confirmVRRecord: {
          path: 'member_zone/record_confirm/',
        },
      },
      event: {
        detail: {
          path: 'event/',
        },
      },
    },
    resources: {
      // https://steelytoe.com/dev.titudev.com/api/v1/virtual/record_live/222/769
      uaSync: {
        path: 'au/fitsync/',
        method: 'GET',
      },
      uaRevoke: {
        path: 'au/revoke',
      },
      liveRecord: {
        path: 'virtual/record_live/',
      },
      masterKabupaten: {
        path: 'resources/master_kabupaten',
      },
      masterLocation: {
        path: 'resources/master_location',
      },
      ongkir: {
        path: 'resources/ongkir',
      },
      lokerTransaction: {
        path: 'resources/loker_transaction',
      },
      eventParticipant: {
        path: 'resources/member_bormar_data',
      },
      vrRecords: {
        path: 'resources/vr_data',
      },
      sponsor: {
        path: 'resources/event_header_sponsor',
        method: 'GET',
      },
    },
  },
  ssoKompasUrl: {
    // href : 'https://validator.race.id/',
    href: apiUrl.ssoKompasUrl.href,
    apis: {
      // upload : {
      // 	path :  'upload/'
      // },
      member: {
        path: 'member/urlkompasid',
      },
      existingBorobudurMember: {
        path: 'kompasid/login/url',
      },
      newBorobudurMember: {
        path: 'kompasid/newmember/url',
      },
    },
  },
  validatorUrl: {
    // href : 'https://validator.race.id/',
    href: apiUrl.validatorUrl.href,
    apis: {
      upload: {
        path: 'upload/',
      },
      extract: {
        path: 'extract/image/',
      },
    },
  },
  fitSyncApiUrl: {
    // href : 'https://validator.race.id/',
    href: apiUrl.fitSyncUrl.href,
    apis: {
      endomondo: {
        auth: {
          path: 'endomondo/auth/',
        },
      },
      garmin: {
        auth: {
          path: 'garmin/auth/',
        },
      },
      storeProfile: {
        confirm: {
          path: 'auth/confirm/',
        },
      },
      getProfileByMemberId: {
        path: 'by',
      },
      setTrackerStatus: {
        path: 'set',
      },
      getActivitiesByMemberId: {
        path: 'google/getData',
      },
      getGarminActivitiesByMemberId: {
        path: 'garmin/getData',
      },
      getAggregatedActivitiesByMemberId: {
        path: 'agregateDataByMemberId',
      },
      getActivityByToken: {
        path: 'garmin/getActivityByToken/',
      },
      getActivityById: {
        path: 'garmin/getActivityById/',
      },
    },
  },
  utilityUrl: {
    href: apiUrl.utilityUrl.href,
    // href : 'https://utilities.race.id/file/',
    // href : 'http://localhost:8082/',
    apis: {
      upload: {
        path: 'upload/',
      },
    },
  },
  steelytoeUrl: {
    href: apiUrl.steelytoeUrl.href,
    // href : 'https://utilities.race.id/file/',
    // href : 'http://localhost:8082/',
    apis: {
      upload: {
        path: 'upload/',
      },
      masterLocation: {
        path: 'resources/master_location',
      },
    },
  },
};
