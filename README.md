## Email Code Fetcher
Automatically extract verification codes from your emails with ease. When a code arrives, you'll get a notification, allowing you to copy it instantly without needing to open your inbox. Save time and simplify the process by accessing your codes directly from the alert.

## Setup
Creating your own build of Email Code Fetcher is relatively easy. Start by setting up all [the prerequisites for Tauri v2](https://v2.tauri.app/start/prerequisites/).

> [!NOTE]
> For this project I used pnpm as the package manager. Make sure to install that aswell.

After installing all that, you will need a Client Secrets file from the Google Cloud Console. Luckily for us, the Gmail API is free and has very high quotas. We will need just one scope for our OAuth 2.0 client, which is `gmail.addons.current.message.readonly`. After that, download the Client Secrets as JSON and save it as `credentials.json` in the `src-tauri` folder.

Now install all dependencies using `pnpm install`, and run the app using `pnpm tauri dev`. Creating a build can be done using `pnpm tauri build`.
