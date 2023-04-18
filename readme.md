## Notes:
- mbsdStatus = 0 sama dengan authProfile =0
- 

## Notes Penting
- Pastikan sharedCookiesEnabled=true ketika menggunakan Webview, agar bisa dapet cookies nya.

# APPCENTER CODEPUSH
## How to Push New Version
### ANDROID
- appcenter codepush release-react -a bormar/My-Borobudur-Marathon -d Staging
- appcenter codepush release-react -a bormar/My-Borobudur-Marathon -d Production


### IOS
- appcenter codepush release-react -a bormar/My-Borobudur-Marathon-IOS -d Staging
- appcenter codepush release-react -a bormar/My-Borobudur-Marathon-IOS -d Production

## Get List Deployment Key
- appcenter codepush deployment list -a bormar/My-Borobudur-Marathon -k
- appcenter codepush deployment list -a bormar/My-Borobudur-Marathon-IOS -k
