use std::{future::Future, pin::Pin};

use tauri::{AppHandle, Emitter, Manager};
use tauri_plugin_opener::open_url;
use yup_oauth2;
use yup_oauth2::authenticator_delegate::InstalledFlowDelegate;

#[derive(Clone)]
struct InstalledFlowBrowserDelegate {
    app_handle: AppHandle,
}

impl InstalledFlowBrowserDelegate {
    pub fn new(app_handle: AppHandle) -> Self {
        Self { app_handle }
    }
}

const CREDENTIALS: &str = include_str!("../../credentials.json");

impl InstalledFlowDelegate for InstalledFlowBrowserDelegate {
    fn present_user_url<'a>(
        &'a self,
        url: &'a str,
        _need_code: bool,
    ) -> Pin<Box<dyn Future<Output = Result<String, String>> + Send + 'a>> {
        let app_handle = self.app_handle.clone();
        Box::pin(async move {
            // Show the auth modal and bring the app to front
            let window = app_handle.get_webview_window("main");
            if window.is_none() {
                open_url(url, None::<&str>).expect("Could not open URL.");
                return Ok(String::new());
            }

            window.unwrap().show().expect("Could not show main.");
            app_handle.emit("show-auth-modal", url).unwrap_or_default();
            Ok(String::new())
        })
    }
}

pub async fn get_access_token(app_handle: &AppHandle) -> Result<String, yup_oauth2::Error> {
    let secret = yup_oauth2::parse_application_secret(CREDENTIALS).unwrap();
    let auth = yup_oauth2::InstalledFlowAuthenticator::builder(
        secret,
        yup_oauth2::InstalledFlowReturnMethod::HTTPRedirect,
    )
    .persist_tokens_to_disk("token_store.json")
    .flow_delegate(Box::new(InstalledFlowBrowserDelegate::new(
        app_handle.clone(),
    )))
    .build()
    .await?;

    let access_token = auth
        .token(&[
            "https://www.googleapis.com/auth/gmail.readonly",
            "https://www.googleapis.com/auth/gmail.addons.current.message.readonly",
        ])
        .await?;
    let token = access_token.token().unwrap_or_default();

    // Hide the modal
    app_handle.emit("hide-auth-modal", 0).unwrap_or_default();
    Ok(token.to_string())
}
