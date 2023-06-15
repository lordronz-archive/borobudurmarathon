## Notes:
- mbsdStatus = 0 sama dengan authProfile =0
- 

## Notes Penting
- Pastikan sharedCookiesEnabled=true ketika menggunakan Webview, agar bisa dapet cookies nya.

# APPCENTER CODEPUSH
## How to Push New Version
### ANDROID
- appcenter codepush release-react -a bormar/My-Borobudur-Marathon -d Staging -t 3.4.5
- appcenter codepush release-react -a bormar/My-Borobudur-Marathon -d Production -t 3.4.5


### IOS
- appcenter codepush release-react -a bormar/My-Borobudur-Marathon-IOS -d Staging -t 3.4.5
- appcenter codepush release-react -a bormar/My-Borobudur-Marathon-IOS -d Production -t 3.4.5

## Get List Deployment Key
- appcenter codepush deployment list -a bormar/My-Borobudur-Marathon -k
- appcenter codepush deployment list -a bormar/My-Borobudur-Marathon-IOS -k


## Range Expression	Who gets the update
- 1.2.3	Only devices running the specific binary version 1.2.3 of your app
- *	Any device configured to consume updates from your CodePush app
- 1.2.x	Devices running major version 1, minor version 2, and any patch version of your app
- 1.2.3 - 1.2.7	Devices running any binary version between 1.2.3 (inclusive) and 1.2.7 (inclusive)
- >=1.2.3 <1.2.7	Devices running any binary version between 1.2.3 (inclusive) and 1.2.7 (exclusive)
- 1.2	Equivalent to >=1.2.0 <1.3.0
- ~1.2.3	Equivalent to >=1.2.3 <1.3.0
- ^1.2.3	Equivalent to >=1.2.3 <2.0.0