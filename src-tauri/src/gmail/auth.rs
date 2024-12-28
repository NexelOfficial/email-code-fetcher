use std::{future::Future, pin::Pin};

use yup_oauth2;
use yup_oauth2::authenticator_delegate::InstalledFlowDelegate;

#[derive(Copy, Clone)]
struct InstalledFlowBrowserDelegate;

impl InstalledFlowDelegate for InstalledFlowBrowserDelegate {
    fn present_user_url<'a>(
        &'a self,
        url: &'a str,
        _need_code: bool,
    ) -> Pin<Box<dyn Future<Output = Result<String, String>> + Send + 'a>> {
        open::that(url).unwrap();
        Box::pin(async { Ok(String::new()) })
    }
}

pub async fn get_access_token() -> Result<String, yup_oauth2::Error> {
    let secret = yup_oauth2::read_application_secret("credentials.json")
        .await
        .expect("Invalid credentials.json");

    let auth = yup_oauth2::InstalledFlowAuthenticator::builder(
        secret,
        yup_oauth2::InstalledFlowReturnMethod::HTTPRedirect,
    )
    .persist_tokens_to_disk("token_store.json")
    .flow_delegate(Box::new(InstalledFlowBrowserDelegate))
    .build()
    .await
    .expect("Failed to create authenticator!");

    let access_token = auth
        .token(&[
            "https://www.googleapis.com/auth/gmail.readonly",
            "https://www.googleapis.com/auth/gmail.addons.current.message.readonly",
        ])
        .await?;
    let token = access_token.token().unwrap_or_default();

    Ok(token.to_string())
}
