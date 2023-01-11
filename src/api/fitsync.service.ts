import ApiService from "./api.service";
// import qs from "qs";
// function qs(obj, prefix){
//     const str: string[] = [];
//     for (const p in obj) {
//         const k = prefix ? prefix + "[" + p + "]" : p, 
//         v = obj[p];
//         // str.push(typeof(v) == 'object' ? qs(v, k) : (k) + "=" + encodeURIComponent(v));
//         str.push(typeof(v) == 'object' ? qs(v, k) : (k) + "=" + v);
//     }
//     return str.join("&");
// }

console.log('CONFIG: ', ApiService.config);

class ResponseError extends Error {
    errorCode: any;
    errorMessage: any;
    constructor(errorCode: any, message: string | undefined) {
        super(message);
        this.name = this.constructor.name;
        if (message != null) {
            this.message = message;
        }
        this.errorCode = errorCode;
    }
}

const FitsyncService = {
    getFitnessProfile: async function(memberId) {
        // console.log('D : ', data);
        try {
            const fitnessProfile = await ApiService.getExternal(ApiService.config.fitSyncApiUrl.href + ApiService.config.fitSyncApiUrl.apis.getProfileByMemberId.path + '/' + memberId);
            console.log('FP : ', fitnessProfile);
            return fitnessProfile;
        } catch (error) {
            console.log('E : ', error);
            const msg = (error as any);
            throw new ResponseError(
                msg.status,
                msg.error.message
            );
        }
    },
    getFitnessActivity: async function(memberId) {
        // console.log('D : ', data);
        try {
            const fitnessActivities = await ApiService.getExternal(ApiService.config.fitSyncApiUrl.href + ApiService.config.fitSyncApiUrl.apis.getAggregatedActivitiesByMemberId.path + '/' + memberId);
            console.log('FA : ', fitnessActivities);
            return fitnessActivities;
        } catch (error) {
            console.log('E : ', error);
            const msg = (error as any);
            throw new ResponseError(
                msg.status,
                msg.error.message
            );
        }
    },
    revokeTrackerConnection: async function(trackerId) {
        // console.log('D : ', data);
        try {
            const fitnessActivities = await ApiService.postExternal(ApiService.config.fitSyncApiUrl.href + ApiService.config.fitSyncApiUrl.apis.setTrackerStatus.path + '/' + trackerId, {trackerAccountId : null, status:0});
            console.log('RT : ', fitnessActivities);
            return fitnessActivities;
        } catch (error) {
            console.log('E : ', error);
            const msg = (error as any);
            throw new ResponseError(
                msg.status,
                msg.error.message
            );
        }
    },
    // submitVRActivity: async function(transactionId, data) {
    //     console.log('Do submit VR data : ', data)
    //     try {
    //         return ApiService.post(ApiService.config.apiUrl.apis.member.addVRRecord.path + transactionId, {data: data});
    //     } catch (error) {
    //         console.log('Error kah ? sepertinya tidak thrwing kemari', error);
    //         throw new ResponseError(
    //             error.status,
    //             error.error.message
    //         );
    //     }
    // },
}

export { FitsyncService, ResponseError };